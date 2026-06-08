import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { MasteryMetric } from "@/types/learning";

const toneClass = {
  green: "bg-emerald-500",
  blue: "bg-sky-500",
  violet: "bg-violet-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
};

export function MasteryBars({ metrics }: { metrics: MasteryMetric[] }) {
  return (
    <Card className="han-card rounded-xl">
      <CardHeader>
        <CardTitle>Mastery snapshot</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="space-y-2">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium">{metric.label}</span>
              <span className="text-muted-foreground">
                {metric.score}% · {metric.delta}
              </span>
            </div>
            <Progress value={metric.score} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function WeeklyActivityChart({ xpValues }: { xpValues?: number[] }) {
  const standardDays = [
    { label: "Mon", xp: xpValues?.[0] ?? 0, tone: "green" },
    { label: "Tue", xp: xpValues?.[1] ?? 0, tone: "blue" },
    { label: "Wed", xp: xpValues?.[2] ?? 0, tone: "violet" },
    { label: "Thu", xp: xpValues?.[3] ?? 0, tone: "amber" },
    { label: "Fri", xp: xpValues?.[4] ?? 0, tone: "rose" },
    { label: "Sat", xp: xpValues?.[5] ?? 0, tone: "green" },
    { label: "Sun", xp: xpValues?.[6] ?? 0, tone: "blue" },
  ] as const;

  const totalXp = standardDays.reduce((acc, d) => acc + d.xp, 0);

  return (
    <Card className="han-card rounded-xl">
      <CardHeader>
        <CardTitle>Weekly XP</CardTitle>
      </CardHeader>
      <CardContent>
        {totalXp === 0 ? (
          <div className="flex h-44 flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-muted-foreground">No XP recorded this week</p>
            <p className="text-xs text-muted-foreground/80 mt-1">Complete HSK lessons or practice exercises to fill your chart!</p>
          </div>
        ) : (
          <div className="flex h-44 items-end gap-3">
            {standardDays.map((day) => {
              const maxXP = Math.max(...standardDays.map((d) => d.xp), 1);
              const heightPct = Math.round((day.xp / maxXP) * 100);
              return (
                <div key={day.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                  <div className="flex h-32 w-full items-end rounded-lg bg-muted/70 p-1">
                    <div
                      className={cn("w-full rounded-md flex items-center justify-center text-[10px] text-white font-semibold transition-all duration-300", toneClass[day.tone])}
                      style={{ height: `${Math.max(day.xp > 0 ? 15 : 0, heightPct)}%` }}
                    >
                      {day.xp > 0 && day.xp}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{day.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ConfusionPanel({
  confusionRate = 0,
  pinyinMisses = 0,
  reviewCount = 0,
}: {
  confusionRate?: number;
  pinyinMisses?: number;
  reviewCount?: number;
}) {
  const rows = [
    {
      label: "Simplified/traditional confusion",
      value: `${confusionRate}%`,
      detail: confusionRate > 0 ? "学 / 學" : "Keep practicing to detect patterns",
    },
    {
      label: "Pinyin tone misses",
      value: String(pinyinMisses),
      detail: pinyinMisses > 0 ? "Third-tone pairs" : "No pinyin misses yet",
    },
    {
      label: "Review due",
      value: String(reviewCount),
      detail: reviewCount > 0 ? `${reviewCount} items in queue` : "All caught up!",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {rows.map((row) => (
        <Card key={row.label} className="han-card rounded-xl">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">{row.label}</p>
            <p className="mt-2 text-3xl font-semibold">{row.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{row.detail}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
