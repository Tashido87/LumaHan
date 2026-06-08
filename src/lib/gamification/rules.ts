export const xpRules = {
  normalExercise: 5,
  correctAnswerBonus: 2,
  perfectLessonBonus: 20,
  dailyChallengeCompleted: 30,
  bossReviewCompleted: 50,
  speakingPracticeCompleted: 10,
  aiNoteCreated: 3,
  aiNoteDailyCap: 9,
} as const;

export const sessionTypes = [
  "normal_lesson",
  "easy_review",
  "weakness_repair",
  "listening_focus",
  "speaking_focus",
  "grammar_focus",
  "character_focus",
  "mixed_challenge",
  "boss_review",
] as const;

export type SessionType = (typeof sessionTypes)[number];

export function calculateExerciseXp({
  isCorrect,
  isSpeaking,
}: {
  isCorrect: boolean;
  isSpeaking?: boolean;
}) {
  return (
    xpRules.normalExercise +
    (isCorrect ? xpRules.correctAnswerBonus : 0) +
    (isSpeaking ? xpRules.speakingPracticeCompleted : 0)
  );
}

export function chooseRecommendedSession({
  reviewDue,
  listeningScore,
  speakingScore,
  grammarScore,
  characterScore,
}: {
  reviewDue: number;
  listeningScore: number;
  speakingScore: number;
  grammarScore: number;
  characterScore: number;
}): SessionType {
  if (reviewDue >= 20) return "weakness_repair";
  if (speakingScore < 55) return "speaking_focus";
  if (listeningScore < 65) return "listening_focus";
  if (grammarScore < 65) return "grammar_focus";
  if (characterScore < 65) return "character_focus";
  return "normal_lesson";
}

export function shouldMaintainStreak(activityCountForDate: number) {
  return activityCountForDate > 0;
}
