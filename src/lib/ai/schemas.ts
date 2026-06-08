import { z } from "zod";

export const aiExerciseSchema = z.object({
  type: z.enum([
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
  ]),
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
    .optional(),
});

export const generateDynamicExercisesResponseSchema = z.object({
  exercises: z.array(aiExerciseSchema).min(1),
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

export const hintResponseSchema = z.object({
  hint: z.string(),
  explanation: z.string(),
  revealsAnswer: z.boolean(),
});

export const writingEvaluationResponseSchema = z.object({
  score: z.number().min(0).max(100),
  correctedAnswer: z.string(),
  grammarFeedback: z.string(),
  vocabularyFeedback: z.string(),
  pinyinFeedback: z.string().optional(),
  explanation: z.string(),
});

export const speakingEvaluationResponseSchema = z.object({
  pronunciationScore: z.number().min(0).max(100),
  toneMistakeNotes: z.array(z.string()),
  pinyinComparison: z.string(),
  suggestedCorrection: z.string(),
  encouragement: z.string(),
  retryRecommendation: z.string(),
});

export const personalizedNoteResponseSchema = z.object({
  title: z.string(),
  content: z.string(),
  tags: z.array(z.string()),
  hskLevel: z.number().int().min(1).max(5),
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

export type AiExercise = z.infer<typeof aiExerciseSchema>;
export type GeneratedSentence = z.infer<typeof generatedSentenceSchema>;
export type AnalyzeSessionResponse = z.infer<typeof analyzeSessionResponseSchema>;
