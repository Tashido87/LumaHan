"use client";

import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
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

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  const hskLevel = profile?.currentHskLevel || 1;
  const xp = profile?.xp || 0;
  const streak = profile?.streakCount || 0;
  const currentLessonId = profile?.currentLessonId || "hsk1-hello";

  // Calculate dynamic level completion and reviews based on XP
  const levelProgress = profile ? Math.min(100, Math.max(10, (xp % 500) / 5)) : 74;
  const reviewDue = profile ? Math.max(0, Math.round(xp / 15)) : 24;

  const currentLessonTitle = currentLessonId === "hsk1-family" ? "Family Words" : "Say Hello";
  
  const userWeakAreas = (profile?.weakAreas as string[]) || [
    "Tone sandhi in 你好",
    "Overusing 了 with past-time words",
  ];

  const aiTip = profile?.aiTip || "Your recent pinyin errors cluster around third-tone pairs. Practice 你好 slowly before adding longer HSK 1 sentences, then switch to one listening set.";

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome back, ${profile?.displayName || "Learner"}`}
        description={`Your HSK ${hskLevel} path is active. Today’s plan is focused on vocabulary consolidation and character writing practice.`}
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

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="han-card rounded-xl">
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <CardTitle>Today’s learning route</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Lesson, review, listening, speaking, and note capture.
              </p>
            </div>
            <Badge className="w-fit rounded-md bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
              Adaptive session
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              ["Continue lesson", currentLessonTitle, currentLessonId === "hsk1-family" ? 62 : 0],
              ["Weakness repair", "Tone sandhi & grammar review", 40],
              ["Listening focus", "Practice pinyin identification", 0],
              ["AI note", "Review character strokes", 0],
            ].map(([label, value, progress]) => (
              <div key={label as string} className="rounded-xl border border-border/70 bg-white/64 p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="font-medium">{value}</p>
                  </div>
                  <Badge variant="outline" className="w-fit rounded-md">
                    {progress}% complete
                  </Badge>
                </div>
                <Progress value={Number(progress)} className="mt-3 h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="han-card rounded-xl">
          <CardHeader>
            <CardTitle>AI tip of the day</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="size-5" />
            </span>
            <p className="text-sm leading-6 text-muted-foreground">
              {aiTip}
            </p>
            <Separator />
            <div>
              <p className="text-sm font-medium">Weak areas</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {userWeakAreas.map((area) => (
                  <Badge key={area} variant="secondary" className="rounded-md">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <ConfusionPanel />

      <section className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
        <WeeklyActivityChart />
        <Card className="han-card rounded-xl">
          <CardHeader>
            <CardTitle>Progress prediction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span>{`HSK ${hskLevel} completion`}</span>
                <span className="text-muted-foreground">Estimated 10 days</span>
              </div>
              <Progress value={levelProgress} className="mt-2 h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span>{`HSK ${hskLevel + 1} readiness`}</span>
                <span className="text-muted-foreground">
                  {hskLevel === 5 ? "Max level" : `${Math.round(levelProgress * 0.85)}%`}
                </span>
              </div>
              <Progress value={hskLevel === 5 ? 100 : Math.round(levelProgress * 0.85)} className="mt-2 h-2" />
            </div>
            <Button asChild className="w-full" variant="outline">
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
