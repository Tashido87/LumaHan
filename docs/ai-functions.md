# Gemini and Text-to-Speech Functions

All AI calls are callable Cloud Functions. Each function verifies Firebase Auth before doing work. Gemini calls return JSON and are validated with Zod in `functions/src/schemas.ts`.

## Functions

- `ensureUserProfile`: creates the user profile and assigns `admin` for the first user or configured `ADMIN_EMAIL`.
- `generateDynamicExercises`: creates structured exercises from weak areas and recent mistakes.
- `generateExampleSentences`: creates alternate example sentences while labeling beyond-level vocabulary.
- `analyzeSession`: summarizes mistakes, weak areas, confusion, and next-session recommendations.
- `generateHint`: returns a short hint and whether it reveals the answer.
- `evaluateWriting`: scores typed answers and returns grammar, vocab, and pinyin feedback.
- `evaluateSpeaking`: scores transcript-based pronunciation and tone feedback.
- `generatePersonalizedNote`: turns a question and answer into a clean note draft.
- `synthesizeChineseAudio`: calls Google Cloud Text-to-Speech, stores MP3 in Firebase Storage, returns a signed URL.

## Example `generateDynamicExercises` Request

```json
{
  "lessonId": "hsk2-le",
  "targetHskLevel": 2,
  "weakAreas": ["了 completion", "third tone pairs"],
  "recentMistakes": ["Used 吗 with a wh-question"],
  "desiredExerciseTypes": ["multiple_choice", "fill_blank", "type_pinyin"]
}
```

## Example Exercise Response

```json
{
  "exercises": [
    {
      "type": "fill_blank",
      "prompt": "Fill in the completion particle.",
      "simplified": "昨天我学习__两个小时。",
      "traditional": "昨天我學習__兩個小時。",
      "pinyin": "Zuótiān wǒ xuéxí __ liǎng gè xiǎoshí.",
      "choices": ["了", "吗", "的", "你"],
      "correctAnswer": "了",
      "explanation": "了 marks the completed study session.",
      "difficulty": "standard",
      "relatedItemIds": ["le-completion", "le"]
    }
  ]
}
```

## Error Handling

- Missing auth: `unauthenticated`
- Missing secret: `failed-precondition`
- Gemini/TTS network failure: `internal`
- JSON parse or schema validation failure: `internal`

The app should surface short user-facing messages and keep failed AI outputs out of Firestore unless they are explicitly logged for diagnostics.
