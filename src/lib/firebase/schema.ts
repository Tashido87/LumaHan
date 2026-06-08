import { z } from "zod";

export const hskLevelSchema = z.object({
  levelNumber: z.number().int().min(1).max(5),
  title: z.string().min(1),
  description: z.string(),
  order: z.number().int().nonnegative(),
});

export const unitSchema = z.object({
  hskLevel: z.number().int().min(1).max(5),
  title: z.string().min(1),
  description: z.string(),
  order: z.number().int().nonnegative(),
  isLockedByDefault: z.boolean(),
});

export const lessonSchema = z.object({
  hskLevel: z.number().int().min(1).max(5),
  unitId: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  order: z.number().int().nonnegative(),
  estimatedMinutes: z.number().int().positive(),
  vocabularyIds: z.array(z.string()),
  grammarIds: z.array(z.string()),
  characterIds: z.array(z.string()),
  prerequisiteLessonIds: z.array(z.string()),
});

export const vocabularySchema = z.object({
  hskLevel: z.number().int().min(1).max(5),
  simplified: z.string().min(1),
  traditional: z.string().min(1),
  pinyin: z.string().min(1),
  englishMeaning: z.string().min(1),
  partOfSpeech: z.string(),
  tags: z.array(z.string()),
  exampleSentenceIds: z.array(z.string()),
  relatedCharacterIds: z.array(z.string()),
  difficultyScore: z.number().min(0).max(100),
});

export const characterSchema = z.object({
  hskLevel: z.number().int().min(1).max(5),
  simplified: z.string().min(1),
  traditional: z.string().min(1),
  pinyin: z.string().min(1),
  meaning: z.string().min(1),
  radical: z.string().optional().default(""),
  components: z.array(z.string()),
  strokeCount: z.number().int().nonnegative().optional(),
  strokeOrderAssetUrl: z.string().url().or(z.literal("")).optional(),
  strokeOrderReferenceUrl: z.string().url().or(z.literal("")).optional(),
  exampleWordIds: z.array(z.string()),
  exampleSentenceIds: z.array(z.string()),
  notes: z.string().optional().default(""),
});

export const grammarPointSchema = z.object({
  hskLevel: z.number().int().min(1).max(5),
  title: z.string().min(1),
  pattern: z.string().min(1),
  explanation: z.string().min(1),
  examples: z.array(
    z.object({
      simplified: z.string().min(1),
      traditional: z.string().min(1),
      pinyin: z.string().min(1),
      englishTranslation: z.string().min(1),
    })
  ),
  commonMistakes: z.array(z.string()),
  relatedVocabularyIds: z.array(z.string()),
  relatedLessonIds: z.array(z.string()),
});

export const exampleSentenceSchema = z.object({
  hskLevel: z.number().int().min(1).max(5),
  simplified: z.string().min(1),
  traditional: z.string().min(1),
  pinyin: z.string().min(1),
  englishTranslation: z.string().min(1),
  vocabularyIds: z.array(z.string()),
  grammarIds: z.array(z.string()),
  audioUrl: z.string().url().or(z.literal("")).optional(),
  createdBy: z.enum(["admin", "ai"]),
  reviewed: z.boolean(),
});

export const userSchema = z.object({
  displayName: z.string(),
  email: z.string().email(),
  photoURL: z.string().url().or(z.literal("")).optional(),
  currentHskLevel: z.number().int().min(1).max(5),
  currentUnitId: z.string(),
  currentLessonId: z.string(),
  xp: z.number().int().nonnegative(),
  streakCount: z.number().int().nonnegative(),
  lastActiveDate: z.string(),
  role: z.enum(["admin", "learner"]),
});

export const noteSchema = z.object({
  userId: z.string().min(1),
  title: z.string().min(1),
  content: z.string(),
  tags: z.array(z.string()),
  hskLevel: z.number().int().min(1).max(5),
  linkedType: z.enum([
    "vocabulary",
    "grammar",
    "character",
    "lesson",
    "sentence",
    "general",
  ]),
  linkedId: z.string().optional(),
  source: z.enum(["manual", "ai"]),
  pinned: z.boolean(),
});

export const exerciseResultSchema = z.object({
  userId: z.string().min(1),
  lessonId: z.string().min(1),
  exerciseType: z.string().min(1),
  prompt: z.string(),
  expectedAnswer: z.string(),
  userAnswer: z.string(),
  isCorrect: z.boolean(),
  responseTimeMs: z.number().int().nonnegative(),
  hintsUsed: z.number().int().nonnegative(),
  aiFeedback: z.string().optional(),
});

export const contentCollectionNames = [
  "hskLevels",
  "units",
  "lessons",
  "vocabulary",
  "characters",
  "grammarPoints",
  "exampleSentences",
] as const;
