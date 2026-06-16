"use client";

import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  Brain,
  Flame,
  Gem,
  Loader2,
  Sparkles,
  Target,
} from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { ConfusionPanel, WeeklyActivityChart } from "@/components/learning/progress-visuals";
import { StatCard } from "@/components/learning/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export default function DashboardPage() {
  const { profile, loading } = useAuth();
  const [currentLessonTitle, setCurrentLessonTitle] = useState("Say Hello");
  const [fetchingLesson, setFetchingLesson] = useState(false);

  const hskLevel = profile?.currentHskLevel || 1;
  const xp = profile?.xp || 0;
  const streak = profile?.streakCount || 0;
  const currentLessonId = profile?.currentLessonId || "hsk1-hello";

  useEffect(() => {
    if (loading || !profile || !currentLessonId) return;

    async function fetchCurrentLesson() {
      setFetchingLesson(true);
      try {
        const db = getFirebaseDb();
        const lessonRef = doc(db, "lessons", currentLessonId);
        const lessonSnap = await getDoc(lessonRef);
        if (lessonSnap.exists()) {
          setCurrentLessonTitle(lessonSnap.data().title || "Say Hello");
        }
      } catch (err) {
        console.error("Error fetching dashboard lesson title:", err);
      } finally {
        setFetchingLesson(false);
      }
    }

    fetchCurrentLesson();
  }, [profile, currentLessonId, loading]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  // Calculate dynamic level completion and reviews based on XP
  const levelProgress = xp > 0 ? Math.min(100, Math.max(10, (xp % 500) / 5)) : 0;
  const reviewDue = xp > 0 ? Math.max(0, Math.round(xp / 15)) : 0;

  // Real or initial user statistics
  const userWeakAreas = (profile?.weakAreas as string[]) || [];

  const aiTip = profile?.aiTip || (xp > 0 
    ? "Keep up the great work! Study your notes and practice writing characters daily to boost retention."
    : "Welcome to LumaHan! Click 'Continue lesson' to start your first HSK 1 lesson and unlock your learning stats.");

  // If the user has no XP, weekly activity is all zeros
  const weeklyXpData = xp > 0 ? [20, 15, 30, 10, 25, 0, 0] : [0, 0, 0, 0, 0, 0, 0];

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome back, ${profile?.displayName || "Learner"}`}
        description={`Your HSK ${hskLevel} path is active. ${xp > 0 ? "Today’s plan is focused on vocabulary consolidation and character writing practice." : "Start your HSK learning journey today!"}`}
        actions={
          <>
            <Button asChild>
              <Link href={`/lesson/${currentLessonId}`}>
                Continue lesson
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/daily-challenge">
                <Target className="size-4" />
                Daily challenge
              </Link>
            </Button>
          </>
        }
      />

      <section className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Current HSK level"
          value={`HSK ${hskLevel}`}
          detail={`${levelProgress}% through HSK ${hskLevel}`}
          icon={<BookOpenCheck className="size-5" />}
          tone="green"
        />
        <StatCard
          label="Total XP"
          value={`${xp}`}
          detail="Lifetime experience"
          icon={<Gem className="size-5" />}
          tone="blue"
        />
        <StatCard
          label="Streak"
          value={`${streak} days`}
          detail={streak > 0 ? "Active study streak!" : "Start study today!"}
          icon={<Flame className="size-5" />}
          tone="amber"
        />
        <StatCard
          label="Review due"
          value={`${reviewDue}`}
          detail="Items in queue"
          icon={<Brain className="size-5" />}
          tone="violet"
        />
      </section>

      <section className="grid gap-2 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between p-3 pb-0">
            <div>
              <CardTitle className="text-sm">Today&apos;s learning route</CardTitle>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Lesson, review, listening, speaking, and note capture.
              </p>
            </div>
            <Badge className="w-fit rounded-full bg-primary/12 px-2 py-0 text-[10px] font-medium text-primary hover:bg-primary/12">
              Adaptive session
            </Badge>
          </CardHeader>
          <CardContent className="space-y-1.5 p-3 pt-2">
            {[
              ["Continue lesson", fetchingLesson ? "Loading..." : currentLessonTitle, xp > 0 ? 62 : 0],
              ["Weakness repair", userWeakAreas.length > 0 ? `${userWeakAreas.length} items flagged for review` : "No weaknesses detected yet", 0],
              ["Listening focus", "Practice pinyin identification", 0],
              ["AI note", "Review character strokes", 0],
            ].map(([label, value, progress]) => (
              <div key={label as string} className="glass-subtle rounded-lg p-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground">{label}</p>
                    <p className="text-[12.5px] font-medium truncate">{value}</p>
                  </div>
                  <Badge variant="outline" className="shrink-0 rounded-full text-[10px] px-1.5 py-0">
                    {progress}%
                  </Badge>
                </div>
                <Progress value={Number(progress)} className="mt-1.5 h-1" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-3 pb-0">
            <CardTitle className="text-sm">AI tip of the day</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-3">
            <span className="grid size-8 place-items-center rounded-lg bg-primary/12 text-primary">
              <Sparkles className="size-4" />
            </span>
            <p className="text-[12px] leading-5 text-muted-foreground">
              {aiTip}
            </p>
            <Separator />
            <div>
              <p className="text-[12.5px] font-medium">Weak areas</p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {userWeakAreas.length > 0 ? (
                  userWeakAreas.map((area) => (
                    <Badge key={area} variant="secondary" className="rounded-full text-[10px]">
                      {area}
                    </Badge>
                  ))
                ) : (
                  <span className="text-[11px] text-muted-foreground">No weak areas identified yet.</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <ConfusionPanel
        confusionRate={xp > 0 ? 11 : 0}
        pinyinMisses={xp > 0 ? 18 : 0}
        reviewCount={reviewDue}
      />

      <section className="grid gap-2 xl:grid-cols-[1fr_0.8fr]">
        <WeeklyActivityChart xpValues={weeklyXpData} />
        <Card>
          <CardHeader>
            <CardTitle>Progress prediction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between gap-3 text-[13px]">
                <span>{`HSK ${hskLevel} completion`}</span>
                <span className="text-muted-foreground">{xp > 0 ? "Estimated 10 days" : "Awaiting first lesson"}</span>
              </div>
              <Progress value={levelProgress} className="mt-2 h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between gap-3 text-[13px]">
                <span>{`HSK ${hskLevel + 1} readiness`}</span>
                <span className="text-muted-foreground">
                  {hskLevel === 5 ? "Max level" : `${Math.round(levelProgress * 0.85)}%`}
                </span>
              </div>
              <Progress value={hskLevel === 5 ? 100 : Math.round(levelProgress * 0.85)} className="mt-2 h-2" />
            </div>
            <Button asChild className="w-full rounded-full" variant="outline">
              <Link href="/analytics">
                <BarChart3 className="size-4" />
                Open analytics
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
