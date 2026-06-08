export type HskLevel = 1 | 2 | 3 | 4 | 5;

export type LinkedContentType =
  | "vocabulary"
  | "grammar"
  | "character"
  | "lesson"
  | "sentence"
  | "general";

export type LessonStatus =
  | "locked"
  | "available"
  | "in_progress"
  | "completed"
  | "checkpoint"
  | "boss";

export type ExerciseType =
  | "multiple_choice"
  | "match_simplified_traditional"
  | "match_pinyin_character"
  | "match_meaning_word"
  | "fill_blank"
  | "sentence_ordering"
  | "type_pinyin"
  | "type_chinese"
  | "listening_choice"
  | "speaking"
  | "grammar_correction";

export type HskLevelConfig = {
  level: HskLevel;
  title: string;
  description: string;
  accent: string;
  progress: number;
  unitsCompleted: number;
  totalUnits: number;
};

export type Unit = {
  id: string;
  hskLevel: HskLevel;
  title: string;
  description: string;
  order: number;
  isLockedByDefault: boolean;
};

export type Lesson = {
  id: string;
  hskLevel: HskLevel;
  unitId: string;
  title: string;
  description: string;
  order: number;
  estimatedMinutes: number;
  vocabularyIds: string[];
  grammarIds: string[];
  characterIds: string[];
  prerequisiteLessonIds: string[];
  status: LessonStatus;
  completion: number;
  xp: number;
};

export type ExampleSentence = {
  id: string;
  hskLevel: HskLevel;
  simplified: string;
  traditional: string;
  pinyin: string;
  englishTranslation: string;
  vocabularyIds: string[];
  grammarIds: string[];
  createdBy: "admin" | "ai";
  reviewed: boolean;
  beyondCurrentLevel?: boolean;
};

export type VocabularyItem = {
  id: string;
  hskLevel: HskLevel;
  simplified: string;
  traditional: string;
  pinyin: string;
  englishMeaning: string;
  partOfSpeech: string;
  tags: string[];
  exampleSentenceIds: string[];
  relatedCharacterIds: string[];
  difficultyScore: number;
  beyondCurrentLevel?: boolean;
};

export type CharacterItem = {
  id: string;
  hskLevel: HskLevel;
  simplified: string;
  traditional: string;
  pinyin: string;
  meaning: string;
  radical: string;
  components: string[];
  strokeCount: number;
  strokeOrderAssetUrl?: string;
  strokeOrderReferenceUrl?: string;
  exampleWordIds: string[];
  exampleSentenceIds: string[];
  notes: string;
};

export type GrammarPoint = {
  id: string;
  hskLevel: HskLevel;
  title: string;
  pattern: string;
  explanation: string;
  examples: ExampleSentence[];
  commonMistakes: string[];
  relatedVocabularyIds: string[];
  relatedLessonIds: string[];
};

export type StudyNote = {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  hskLevel: HskLevel;
  linkedType: LinkedContentType;
  linkedId?: string;
  source: "manual" | "ai";
  pinned: boolean;
  updatedAt: string;
};

export type PracticeExercise = {
  id: string;
  type: ExerciseType;
  hskLevel: HskLevel;
  prompt: string;
  simplified?: string;
  traditional?: string;
  pinyin?: string;
  english?: string;
  choices?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: "easy" | "standard" | "challenge";
  relatedItemIds: string[];
};

export type MasteryMetric = {
  label: string;
  score: number;
  delta: string;
  tone: "green" | "blue" | "violet" | "amber" | "rose";
};

export type AdminHealthCheck = {
  label: string;
  count: number;
  severity: "ok" | "warning" | "error";
};
