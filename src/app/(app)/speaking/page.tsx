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
          <Button>
            <Mic className="size-4" />
            Record
          </Button>
        }
      />
      <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
        <Card className="han-card rounded-xl">
          <CardHeader>
            <CardTitle>Speaking card</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-white/70 p-5">
                <p className="text-xs uppercase text-muted-foreground">Simplified</p>
                <p className="mt-3 text-5xl font-semibold">你好吗？</p>
              </div>
              <div className="rounded-xl bg-white/70 p-5">
                <p className="text-xs uppercase text-muted-foreground">Traditional</p>
                <p className="mt-3 text-5xl font-semibold">你好嗎？</p>
              </div>
            </div>
            <div className="rounded-xl border border-sky-200 bg-sky-50 p-5">
              <p className="text-2xl font-semibold text-sky-900">Nǐ hǎo ma?</p>
              <p className="mt-1 text-sm text-sky-900/70">How are you?</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button>
                <Mic className="size-4" />
                Record answer
              </Button>
              <Button variant="outline">
                <Volume2 className="size-4" />
                Play model
              </Button>
              <Button variant="outline">
                <RefreshCcw className="size-4" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-5">
          <Card className="han-card rounded-xl">
            <CardHeader>
              <CardTitle>Speaking score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-4xl font-semibold">46%</p>
              <Progress value={46} className="h-2" />
              <Badge className="rounded-md bg-rose-100 text-rose-700 hover:bg-rose-100">
                Tone precision needs review
              </Badge>
            </CardContent>
          </Card>
          <Card className="han-card rounded-xl">
            <CardHeader>
              <CardTitle>Feedback preview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">
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
