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
      <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <MasteryBars metrics={masteryMetrics} />
        <WeeklyActivityChart />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weak areas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {weakAreas.map((area) => (
              <div key={area} className="glass-subtle rounded-2xl p-4">
                <p className="font-medium">{area}</p>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  Recommended for the next adaptive session.
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recommended next session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="glass-subtle rounded-2xl p-5">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Session type</p>
              <p className="mt-1.5 text-2xl font-semibold tracking-tight">
                Weakness repair
              </p>
              <p className="mt-1.5 text-[13px] leading-6 text-muted-foreground">
                Easy review for tone pairs, followed by one grammar correction set.
              </p>
            </div>
            <Button className="w-full rounded-full">
              Start recommendation
              <ArrowRight className="size-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
