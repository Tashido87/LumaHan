import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { MasteryMetric } from "@/types/learning";

/* One hue family for the bars. Higher XP = denser, so the chart reads as a
   single coherent shape instead of seven competing colors. */
const barTone = [
  "bg-primary/70",
  "bg-primary/60",
  "bg-primary/90",
  "bg-primary/55",
  "bg-primary/80",
  "bg-primary/50",
  "bg-primary/65",
];

export function MasteryBars({ metrics }: { metrics: MasteryMetric[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mastery snapshot</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3.5">
        {metrics.map((metric) => (
          <div key={metric.label} className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-[13px]">
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
    { label: "Mon", xp: xpValues?.[0] ?? 0 },
    { label: "Tue", xp: xpValues?.[1] ?? 0 },
    { label: "Wed", xp: xpValues?.[2] ?? 0 },
    { label: "Thu", xp: xpValues?.[3] ?? 0 },
    { label: "Fri", xp: xpValues?.[4] ?? 0 },
    { label: "Sat", xp: xpValues?.[5] ?? 0 },
    { label: "Sun", xp: xpValues?.[6] ?? 0 },
  ];

  const totalXp = standardDays.reduce((acc, d) => acc + d.xp, 0);
  const maxXP = Math.max(...standardDays.map((d) => d.xp), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly XP</CardTitle>
      </CardHeader>
      <CardContent>
        {totalXp === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-muted-foreground">
              No XP recorded this week
            </p>
            <p className="mt-1 text-xs text-muted-foreground/80">
              Complete HSK lessons or practice exercises to fill your chart!
            </p>
          </div>
        ) : (
          <div className="flex h-40 items-end gap-2.5">
            {standardDays.map((day, i) => {
              const heightPct = Math.round((day.xp / maxXP) * 100);
              return (
                <div
                  key={day.label}
                  className="flex min-w-0 flex-1 flex-col items-center gap-1.5"
                >
                  <div className="flex h-32 w-full items-end rounded-lg bg-muted/50 p-1">
                    <div
                      className={cn(
                        "w-full rounded-lg flex items-center justify-center text-[10px] font-semibold text-primary-foreground transition-all duration-300",
                        barTone[i % barTone.length]
                      )}
                      style={{
                        height: `${Math.max(day.xp > 0 ? 15 : 0, heightPct)}%`,
                      }}
                    >
                      {day.xp > 0 && day.xp}
                    </div>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {day.label}
                  </span>
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
      detail:
        confusionRate > 0 ? "学 / 學" : "Keep practicing to detect patterns",
    },
    {
      label: "Pinyin tone misses",
      value: String(pinyinMisses),
      detail: pinyinMisses > 0 ? "Third-tone pairs" : "No pinyin misses yet",
    },
    {
      label: "Review due",
      value: String(reviewCount),
      detail:
        reviewCount > 0 ? `${reviewCount} items in queue` : "All caught up!",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {rows.map((row) => (
        <Card key={row.label}>
          <CardContent className="p-4">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {row.label}
            </p>
            <p className="mt-1.5 text-2xl font-semibold tracking-tight">
              {row.value}
            </p>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              {row.detail}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
