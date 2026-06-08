import { PageHeader } from "@/components/layout/page-header";
import { DailyChallengePanel } from "@/components/gamification/daily-challenge-panel";

export default function DailyChallengePage() {
  return (
    <>
      <PageHeader
        eyebrow="Daily challenge"
        title="Today’s XP plan"
        description="Complete one lesson, review, or daily challenge each calendar day to maintain the streak. Streak repair is never paid."
      />
      <DailyChallengePanel />
    </>
  );
}
