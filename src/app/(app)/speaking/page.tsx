import { Mic, RefreshCcw, Volume2 } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function SpeakingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Speaking practice"
        title="Pronunciation and tone feedback"
        description="Use browser speech recognition when available, then send transcript and expected pinyin to Cloud Functions for structured feedback."
        actions={
          <Button className="rounded-full">
            <Mic className="size-4" />
            Record
          </Button>
        }
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <Card>
          <CardHeader>
            <CardTitle>Speaking card</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="glass-subtle rounded-2xl p-5">
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Simplified</p>
                <p className="mt-3 text-5xl font-semibold tracking-tight">你好吗？</p>
              </div>
              <div className="glass-subtle rounded-2xl p-5">
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Traditional</p>
                <p className="mt-3 text-5xl font-semibold tracking-tight">你好嗎？</p>
              </div>
            </div>
            <div className="rounded-2xl bg-primary/12 p-5 ring-1 ring-primary/25">
              <p className="text-2xl font-semibold tracking-tight text-primary">Nǐ hǎo ma?</p>
              <p className="mt-1 text-[13px] text-muted-foreground">How are you?</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button className="rounded-full">
                <Mic className="size-4" />
                Record answer
              </Button>
              <Button variant="outline" className="rounded-full">
                <Volume2 className="size-4" />
                Play model
              </Button>
              <Button variant="outline" className="rounded-full">
                <RefreshCcw className="size-4" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Speaking score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-4xl font-semibold tracking-tight">46%</p>
              <Progress value={46} className="h-2" />
              <Badge className="rounded-full bg-destructive/12 text-destructive hover:bg-destructive/12">
                Tone precision needs review
              </Badge>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Feedback preview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[13px] leading-6 text-muted-foreground">
                Tone 3 on nǐ was too flat. Slow down, dip lower, then connect to hǎo
                naturally.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
