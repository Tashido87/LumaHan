import { createHash } from "node:crypto";

import * as admin from "firebase-admin";
import { defineSecret, defineString } from "firebase-functions/params";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { z } from "zod";

import {
  analyzeSessionInputSchema,
  analyzeSessionResponseSchema,
  evaluateSpeakingInputSchema,
  evaluateWritingInputSchema,
  generateDynamicExercisesInputSchema,
  generateDynamicExercisesResponseSchema,
  generateExampleSentencesInputSchema,
  generateHintInputSchema,
  generatedSentenceSchema,
  generatePersonalizedNoteInputSchema,
  hintResponseSchema,
  personalizedNoteResponseSchema,
  speakingEvaluationResponseSchema,
  synthesizeChineseAudioInputSchema,
  synthesizeChineseAudioResponseSchema,
  writingEvaluationResponseSchema,
} from "./schemas";

admin.initializeApp();

const geminiApiKey = defineSecret("GEMINI_API_KEY");
const googleCloudTtsKey = defineSecret("GOOGLE_CLOUD_TTS_KEY");
const geminiModel = defineString("GEMINI_MODEL", {
  default: "gemini-3.5-flash",
});
const adminEmail = defineString("ADMIN_EMAIL", { default: "" });

const region = "us-central1";

type CallableRequest = {
  auth?: { uid: string; token?: Record<string, unknown> };
  data: unknown;
};

function requireUid(request: CallableRequest) {
  if (!request.auth?.uid) {
    throw new HttpsError("unauthenticated", "Sign in with Google first.");
  }

  return request.auth.uid;
}

function getRequiredSecret(secretValue: string, name: string) {
  if (!secretValue) {
    throw new HttpsError(
      "failed-precondition",
      `${name} is not configured for this Cloud Function.`
    );
  }

  return secretValue;
}

function extractJson(text: string) {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1] ?? trimmed;

  try {
    return JSON.parse(candidate);
  } catch {
    const first = candidate.indexOf("{");
    const last = candidate.lastIndexOf("}");
    if (first >= 0 && last > first) {
      return JSON.parse(candidate.slice(first, last + 1));
    }

    throw new HttpsError("internal", "Gemini did not return parseable JSON.");
  }
}

async function callGeminiJson<T>({
  schema,
  task,
  uid,
  input,
}: {
  schema: z.ZodType<T>;
  task: string;
  uid: string;
  input: unknown;
}) {
  const apiKey = getRequiredSecret(geminiApiKey.value(), "GEMINI_API_KEY");
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel.value()}:generateContent?key=${apiKey}`;
  const systemInstruction = [
    "You support a private English-interface Chinese learning app for HSK 1 to HSK 5.",
    "Curated HSK content is the source of truth. Do not invent HSK metadata.",
    "Always include simplified Chinese, traditional Chinese, pinyin, and English when Chinese content is produced.",
    "Label advanced words outside the learner's current level as Beyond current level.",
    "Return only valid JSON that matches the requested schema. Do not wrap JSON in Markdown.",
  ].join("\n");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      contents: [
        {
          role: "user",
          parts: [
            {
              text: JSON.stringify(
                {
                  task,
                  input,
                },
                null,
                2
              ),
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.35,
      },
    }),
  });

  if (!response.ok) {
    throw new HttpsError(
      "internal",
      `Gemini request failed with status ${response.status}.`
    );
  }

  const payload = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("\n");

  if (!text) {
    throw new HttpsError("internal", "Gemini returned an empty response.");
  }

  const parsed = schema.parse(extractJson(text));
  await logAiSession(uid, task, input, parsed);
  return parsed;
}

async function logAiSession(
  uid: string,
  type: string,
  input: unknown,
  output: unknown
) {
  await admin.firestore().collection("aiSessions").add({
    userId: uid,
    type,
    inputSummary: JSON.stringify(input).slice(0, 1200),
    outputSummary: JSON.stringify(output).slice(0, 1200),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

function onAiCall<TInput, TOutput>({
  inputSchema,
  outputSchema,
  task,
}: {
  inputSchema: z.ZodType<TInput>;
  outputSchema: z.ZodType<TOutput>;
  task: string;
}) {
  return onCall({ region, secrets: [geminiApiKey] }, async (request) => {
    const uid = requireUid(request as CallableRequest);
    const input = inputSchema.parse(request.data);
    return callGeminiJson({
      schema: outputSchema,
      task,
      uid,
      input,
    });
  });
}

export const ensureUserProfile = onCall({ region }, async (request) => {
  const uid = requireUid(request as CallableRequest);
  const token = request.auth?.token as
    | {
        name?: string;
        email?: string;
        picture?: string;
      }
    | undefined;
  const email = token?.email ?? "";
  const userRef = admin.firestore().collection("users").doc(uid);
  const setupRef = admin.firestore().collection("admin").doc("bootstrap");

  return admin.firestore().runTransaction(async (transaction) => {
    const userSnap = await transaction.get(userRef);
    if (userSnap.exists) {
      return { role: userSnap.data()?.role ?? "learner", created: false };
    }

    const setupSnap = await transaction.get(setupRef);
    const configuredAdminEmail = adminEmail.value().trim().toLowerCase();
    const isConfiguredAdmin =
      Boolean(configuredAdminEmail) &&
      email.toLowerCase() === configuredAdminEmail;
    const isFirstUser = !setupSnap.exists;
    const role = isConfiguredAdmin || isFirstUser ? "admin" : "learner";

    transaction.set(userRef, {
      displayName: token?.name ?? "Private learner",
      email,
      photoURL: token?.picture ?? "",
      currentHskLevel: 1,
      currentUnitId: "hsk1-u1",
      currentLessonId: "hsk1-hello",
      xp: 0,
      streakCount: 0,
      lastActiveDate: "",
      role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    if (role === "admin" && !setupSnap.exists) {
      transaction.set(setupRef, {
        firstAdminUserId: uid,
        adminEmail: email,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    return { role, created: true };
  });
});

export const generateDynamicExercises = onAiCall({
  inputSchema: generateDynamicExercisesInputSchema,
  outputSchema: generateDynamicExercisesResponseSchema,
  task: "generateDynamicExercises",
});

export const generateExampleSentences = onAiCall({
  inputSchema: generateExampleSentencesInputSchema,
  outputSchema: z.object({ sentences: z.array(generatedSentenceSchema).min(1) }),
  task: "generateExampleSentences",
});

export const analyzeSession = onAiCall({
  inputSchema: analyzeSessionInputSchema,
  outputSchema: analyzeSessionResponseSchema,
  task: "analyzeSession",
});

export const generateHint = onAiCall({
  inputSchema: generateHintInputSchema,
  outputSchema: hintResponseSchema,
  task: "generateHint",
});

export const evaluateWriting = onAiCall({
  inputSchema: evaluateWritingInputSchema,
  outputSchema: writingEvaluationResponseSchema,
  task: "evaluateWriting",
});

export const evaluateSpeaking = onAiCall({
  inputSchema: evaluateSpeakingInputSchema,
  outputSchema: speakingEvaluationResponseSchema,
  task: "evaluateSpeaking",
});

export const generatePersonalizedNote = onAiCall({
  inputSchema: generatePersonalizedNoteInputSchema,
  outputSchema: personalizedNoteResponseSchema,
  task: "generatePersonalizedNote",
});

export const synthesizeChineseAudio = onCall(
  { region, secrets: [googleCloudTtsKey] },
  async (request) => {
    const uid = requireUid(request as CallableRequest);
    const input = synthesizeChineseAudioInputSchema.parse(request.data);
    const voiceName =
      input.voicePreference?.voiceName ??
      (input.voicePreference?.languageCode === "cmn-TW"
        ? "cmn-TW-Wavenet-A"
        : "cmn-CN-Neural2-A");
    const languageCode = input.voicePreference?.languageCode ?? "cmn-CN";
    const hash = createHash("sha256")
      .update(JSON.stringify({ ...input, voiceName, languageCode }))
      .digest("hex")
      .slice(0, 32);
    const storagePath = `audio-cache/${languageCode}/${voiceName}/${hash}.mp3`;
    const bucket = admin.storage().bucket();
    const file = bucket.file(storagePath);
    const [exists] = await file.exists();

    if (!exists) {
      const apiKey = getRequiredSecret(
        googleCloudTtsKey.value(),
        "GOOGLE_CLOUD_TTS_KEY"
      );
      const response = await fetch(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: { text: input.text },
            voice: { languageCode, name: voiceName },
            audioConfig: {
              audioEncoding: "MP3",
              speakingRate: input.speed,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new HttpsError(
          "internal",
          `Text-to-Speech request failed with status ${response.status}.`
        );
      }

      const payload = (await response.json()) as { audioContent?: string };
      if (!payload.audioContent) {
        throw new HttpsError("internal", "Text-to-Speech returned no audio.");
      }

      await file.save(Buffer.from(payload.audioContent, "base64"), {
        resumable: false,
        contentType: "audio/mpeg",
        metadata: {
          metadata: {
            userId: uid,
            pinyin: input.pinyin ?? "",
            voiceName,
          },
        },
      });
    }

    const [audioUrl] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 1000 * 60 * 60,
    });
    const result = synthesizeChineseAudioResponseSchema.parse({
      audioUrl,
      storagePath,
      cached: exists,
      voiceName,
    });

    await admin.firestore().collection("aiSessions").add({
      userId: uid,
      type: "tts",
      inputSummary: JSON.stringify({ text: input.text, voiceName }).slice(0, 1200),
      outputSummary: JSON.stringify({ storagePath, cached: exists }).slice(0, 1200),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return result;
  }
);
