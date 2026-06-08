import { chooseRecommendedSession } from "@/lib/gamification/rules";

export function getMockRecommendation() {
  return {
    sessionType: chooseRecommendedSession({
      reviewDue: 24,
      listeningScore: 71,
      speakingScore: 46,
      grammarScore: 64,
      characterScore: 58,
    }),
    target: "Third-tone pairs, 了 completion, and 学 / 學 recognition",
    estimatedMinutes: 18,
    difficulty: "easy_review_then_standard",
  };
}
