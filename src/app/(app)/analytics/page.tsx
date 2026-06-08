import { ArrowRight, BrainCircuit } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import {
  ConfusionPanel,
  MasteryBars,
  WeeklyActivityChart,
} from "@/components/learning/progress-visuals";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { masteryMetrics, weakAreas } from "@/data/mock-learning";

export default function AnalyticsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Progress analytics"
        title="Learning analytics"
        description="Track vocabulary, grammar, characters, listening, speaking, simplified/traditional confusion, pinyin accuracy, weak areas, and next-session recommendations."
        actions={
          <Button>
            <BrainCircuit className="size-4" />
            Analyze session
          </Button>
        }
      />
      <ConfusionPanel />
      <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <MasteryBars metrics={masteryMetrics} />
        <WeeklyActivityChart />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="han-card rounded-xl">
          <CardHeader>
            <CardTitle>Weak areas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {weakAreas.map((area) => (
              <div key={area} className="rounded-xl border border-border/70 bg-white/70 p-4">
                <p className="font-medium">{area}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Recommended for the next adaptive session.
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="han-card rounded-xl">
          <CardHeader>
            <CardTitle>Recommended next session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="text-sm text-emerald-900/70">Session type</p>
              <p className="mt-2 text-2xl font-semibold text-emerald-950">
                Weakness repair
              </p>
              <p className="mt-2 text-sm leading-6 text-emerald-900/75">
                Easy review for tone pairs, followed by one grammar correction set.
              </p>
            </div>
            <Button className="w-full">
              Start recommendation
              <ArrowRight className="size-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
