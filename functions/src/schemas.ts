import { z } from "zod";

export const hskLevelInput = z.number().int().min(1).max(5);

export const exerciseTypeSchema = z.enum([
  "multiple_choice",
  "match_simplified_traditional",
  "match_pinyin_character",
  "match_meaning_word",
  "fill_blank",
  "sentence_ordering",
  "type_pinyin",
  "type_chinese",
  "listening_choice",
  "speaking",
  "grammar_correction",
]);

export const aiExerciseSchema = z.object({
  type: exerciseTypeSchema,
  prompt: z.string(),
  simplified: z.string().optional(),
  traditional: z.string().optional(),
  pinyin: z.string().optional(),
  english: z.string().optional(),
  choices: z.array(z.string()).optional(),
  correctAnswer: z.string(),
  explanation: z.string(),
  difficulty: z.enum(["easy", "standard", "challenge"]),
  relatedItemIds: z.array(z.string()),
  beyondCurrentLevelWords: z
    .array(
      z.object({
        simplified: z.string(),
        traditional: z.string(),
        pinyin: z.string(),
        english: z.string(),
        label: z.literal("Beyond current level"),
      })
    )
    .optional()
    .default([]),
});

export const generateDynamicExercisesInputSchema = z.object({
  lessonId: z.string(),
  targetHskLevel: hskLevelInput,
  weakAreas: z.array(z.string()),
  recentMistakes: z.array(z.string()),
  desiredExerciseTypes: z.array(exerciseTypeSchema),
});

export const generateDynamicExercisesResponseSchema = z.object({
  exercises: z.array(aiExerciseSchema).min(1),
});

export const generateExampleSentencesInputSchema = z.object({
  item: z.object({
    id: z.string().optional(),
    simplified: z.string().optional(),
    traditional: z.string().optional(),
    pinyin: z.string().optional(),
    englishMeaning: z.string().optional(),
    grammarPattern: z.string().optional(),
  }),
  targetLevel: hskLevelInput,
  learnerLevel: hskLevelInput,
  allowBeyondLevel: z.boolean(),
});

export const generatedSentenceSchema = z.object({
  simplified: z.string(),
  traditional: z.string(),
  pinyin: z.string(),
  englishTranslation: z.string(),
  vocabularyNotes: z.array(z.string()),
  grammarNotes: z.array(z.string()),
  beyondCurrentLevelWords: z.array(
    z.object({
      simplified: z.string(),
      traditional: z.string(),
      pinyin: z.string(),
      english: z.string(),
      label: z.literal("Beyond current level"),
    })
  ),
  needsReview: z.boolean(),
});

export const analyzeSessionInputSchema = z.object({
  recentExerciseResults: z.array(z.unknown()),
  currentMasteryScores: z.array(z.unknown()),
  timeSpentMinutes: z.number().nonnegative(),
  mistakes: z.array(z.string()),
});

export const analyzeSessionResponseSchema = z.object({
  summary: z.string(),
  weakVocabulary: z.array(z.string()),
  weakGrammar: z.array(z.string()),
  weakCharacters: z.array(z.string()),
  simplifiedTraditionalConfusion: z.array(z.string()),
  pinyinProblems: z.array(z.string()),
  recommendedNextSessionDifficulty: z.enum(["easy", "standard", "challenge"]),
  recommendedReviewItems: z.array(z.string()),
  personalizedTip: z.string(),
  streakRecommendation: z.string(),
});

export const generateHintInputSchema = z.object({
  exercise: aiExerciseSchema,
  userAnswer: z.string(),
  hintLevel: z.number().int().min(1).max(3),
});

export const hintResponseSchema = z.object({
  hint: z.string(),
  explanation: z.string(),
  revealsAnswer: z.boolean(),
});

export const evaluateWritingInputSchema = z.object({
  userTypedAnswer: z.string(),
  expectedAnswer: z.string(),
  context: z.string(),
  targetHskLevel: hskLevelInput,
});

export const writingEvaluationResponseSchema = z.object({
  score: z.number().min(0).max(100),
  correctedAnswer: z.string(),
  grammarFeedback: z.string(),
  vocabularyFeedback: z.string(),
  pinyinFeedback: z.string().optional(),
  explanation: z.string(),
});

export const evaluateSpeakingInputSchema = z.object({
  transcript: z.string(),
  expectedPinyin: z.string(),
  expectedChinese: z.string(),
  audioAnalysisMetadata: z.record(z.string(), z.unknown()).optional(),
});

export const speakingEvaluationResponseSchema = z.object({
  pronunciationScore: z.number().min(0).max(100),
  toneMistakeNotes: z.array(z.string()),
  pinyinComparison: z.string(),
  suggestedCorrection: z.string(),
  encouragement: z.string(),
  retryRecommendation: z.string(),
});

export const generatePersonalizedNoteInputSchema = z.object({
  userQuestion: z.string(),
  aiAnswer: z.string(),
  linkedItem: z
    .object({
      linkedType: z.enum([
        "vocabulary",
        "grammar",
        "character",
        "lesson",
        "sentence",
        "general",
      ]),
      linkedId: z.string().optional(),
      hskLevel: hskLevelInput.optional(),
    })
    .optional(),
});

export const personalizedNoteResponseSchema = z.object({
  title: z.string(),
  content: z.string(),
  tags: z.array(z.string()),
  hskLevel: hskLevelInput,
  linkedItemSuggestion: z
    .object({
      linkedType: z.enum([
        "vocabulary",
        "grammar",
        "character",
        "lesson",
        "sentence",
        "general",
      ]),
      linkedId: z.string().optional(),
    })
    .optional(),
});

export const synthesizeChineseAudioInputSchema = z.object({
  text: z.string().min(1),
  pinyin: z.string().optional(),
  voicePreference: z
    .object({
      languageCode: z.enum(["cmn-CN", "cmn-TW"]).default("cmn-CN"),
      voiceName: z.string().optional(),
    })
    .optional(),
  speed: z.number().min(0.25).max(2).default(0.92),
});

export const synthesizeChineseAudioResponseSchema = z.object({
  audioUrl: z.string().url(),
  storagePath: z.string(),
  cached: z.boolean(),
  voiceName: z.string(),
});
