import Link from "next/link";
import { ArrowRight, Brain, CalendarClock, Repeat2 } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function ReviewPage() {
  const queues = [
    { label: "Vocabulary", due: 12, score: 78 },
    { label: "Grammar", due: 5, score: 64 },
    { label: "Characters", due: 7, score: 58 },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Review mode"
        title="Spaced review queue"
        description="Review items are scheduled from mastery scores, recent mistakes, pinyin misses, and simplified/traditional confusion."
        actions={
          <Button asChild>
            <Link href="/practice">
              Start review
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      />
      <div className="grid gap-5 lg:grid-cols-3">
        {queues.map((queue) => (
          <Card key={queue.label} className="han-card rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Repeat2 className="size-4 text-primary" />
                {queue.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-3xl font-semibold">{queue.due}</p>
              <p className="text-sm text-muted-foreground">items due today</p>
              <Progress value={queue.score} className="h-2" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="han-card rounded-xl">
          <CardHeader>
            <CardTitle>Weakness repair session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {["了 completion", "学 / 學 recognition", "Third-tone pairs"].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-xl bg-white/70 p-4">
                <Brain className="size-4 text-violet-600" />
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="han-card rounded-xl">
          <CardHeader>
            <CardTitle>Next review timing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {["2026-06-08 · 24 items", "2026-06-09 · 16 items", "2026-06-11 · 9 items"].map(
              (item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl bg-white/70 p-4">
                  <CalendarClock className="size-4 text-sky-600" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
