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

export function WeeklyActivityChart() {
  const days = [
    { label: "Mon", xp: 70, tone: "green" },
    { label: "Tue", xp: 52, tone: "blue" },
    { label: "Wed", xp: 86, tone: "violet" },
    { label: "Thu", xp: 38, tone: "amber" },
    { label: "Fri", xp: 92, tone: "rose" },
    { label: "Sat", xp: 60, tone: "green" },
    { label: "Sun", xp: 76, tone: "blue" },
  ] as const;

  return (
    <Card className="han-card rounded-xl">
      <CardHeader>
        <CardTitle>Weekly XP</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-44 items-end gap-3">
          {days.map((day) => (
            <div key={day.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <div className="flex h-32 w-full items-end rounded-lg bg-muted/70 p-1">
                <div
                  className={cn("w-full rounded-md", toneClass[day.tone])}
                  style={{ height: `${day.xp}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{day.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function ConfusionPanel() {
  const rows = [
    { label: "Simplified/traditional confusion", value: "11%", detail: "学 / 學" },
    { label: "Pinyin tone misses", value: "18", detail: "Third-tone pairs" },
    { label: "Review due", value: "24", detail: "12 vocab · 7 chars · 5 grammar" },
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
