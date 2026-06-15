import { CalendarCheck, Flame, Gem, Trophy } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function DailyChallengePanel() {
  const tasks = [
    { label: "Complete one HSK 1 review set", xp: 30, done: true },
    { label: "Speak 你好吗？ three times", xp: 10, done: false },
    { label: "Save one useful AI note", xp: 3, done: false },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
      <Card>
        <CardHeader>
          <CardTitle>Daily challenge</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="glass-subtle rounded-2xl p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Badge className="rounded-full bg-primary/12 text-primary hover:bg-primary/12">
                  +43 XP available
                </Badge>
                <h2 className="mt-3 text-xl font-semibold tracking-tight">
                  Repair weak tones
                </h2>
                <p className="mt-1.5 max-w-2xl text-[13px] leading-6 text-muted-foreground">
                  Today focuses on third-tone pairs, traditional form
                  recognition, and one short AI-backed note.
                </p>
              </div>
              <Button className="rounded-full">
                <CalendarCheck className="size-4" />
                Start
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.label}
                className="glass-subtle flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium">{task.label}</p>
                  <p className="text-[13px] text-muted-foreground">
                    +{task.xp} XP
                  </p>
                </div>
                <Badge
                  variant={task.done ? "secondary" : "outline"}
                  className="w-fit rounded-full text-[11px]"
                >
                  {task.done ? "Done" : "Open"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-orange-500/12 text-orange-600">
                <Flame className="size-5" />
              </span>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Current streak
                </p>
                <p className="text-xl font-semibold tracking-tight">12 days</p>
              </div>
            </div>
            <Progress value={86} className="mt-3.5 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/12 text-primary">
                <Gem className="size-5" />
              </span>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Today&apos;s XP
                </p>
                <p className="text-xl font-semibold tracking-tight">185 XP</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/12 text-primary">
                <Trophy className="size-5" />
              </span>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Next badge
                </p>
                <p className="text-xl font-semibold tracking-tight">
                  Tone Builder
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
