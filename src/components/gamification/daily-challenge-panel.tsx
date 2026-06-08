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
    <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
      <Card className="han-card rounded-xl">
        <CardHeader>
          <CardTitle>Daily challenge</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <Badge className="rounded-md bg-emerald-600 text-white hover:bg-emerald-600">
                  +43 XP available
                </Badge>
                <h2 className="mt-3 text-2xl font-semibold">Repair weak tones</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-900/75">
                  Today focuses on third-tone pairs, traditional form recognition, and
                  one short AI-backed note.
                </p>
              </div>
              <Button>
                <CalendarCheck className="size-4" />
                Start
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.label}
                className="flex flex-col gap-3 rounded-xl border border-border/70 bg-white/70 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{task.label}</p>
                  <p className="text-sm text-muted-foreground">+{task.xp} XP</p>
                </div>
                <Badge
                  variant={task.done ? "secondary" : "outline"}
                  className="w-fit rounded-md"
                >
                  {task.done ? "Done" : "Open"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-5">
        <Card className="han-card rounded-xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-amber-100 text-amber-700">
                <Flame className="size-5" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">Current streak</p>
                <p className="text-2xl font-semibold">12 days</p>
              </div>
            </div>
            <Progress value={86} className="mt-4 h-2" />
          </CardContent>
        </Card>
        <Card className="han-card rounded-xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-sky-100 text-sky-700">
                <Gem className="size-5" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">Today’s XP</p>
                <p className="text-2xl font-semibold">185 XP</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="han-card rounded-xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-violet-100 text-violet-700">
                <Trophy className="size-5" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">Next badge</p>
                <p className="text-2xl font-semibold">Tone Builder</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
