import { Headphones, Play, Volume2 } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { exampleSentences } from "@/data/mock-learning";

export default function ListeningPage() {
  return (
    <>
      <PageHeader
        eyebrow="Listening practice"
        title="Mandarin audio drills"
        description="Practice recognition with curated sentences first, then cached Google Cloud Text-to-Speech alternatives when configured."
        actions={
          <Button>
            <Play className="size-4" />
            Start listening
          </Button>
        }
      />
      <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-4">
          {exampleSentences.slice(0, 3).map((sentence) => (
            <Card key={sentence.id} className="han-card rounded-xl">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="grid size-11 place-items-center rounded-xl bg-sky-100 text-sky-700">
                    <Headphones className="size-5" />
                  </span>
                  <Button size="sm" variant="outline">
                    <Volume2 className="size-4" />
                    Play
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-white/70 p-4">
                    <p className="text-xs uppercase text-muted-foreground">Simplified</p>
                    <p className="mt-2 text-2xl font-semibold">{sentence.simplified}</p>
                  </div>
                  <div className="rounded-xl bg-white/70 p-4">
                    <p className="text-xs uppercase text-muted-foreground">Traditional</p>
                    <p className="mt-2 text-2xl font-semibold">{sentence.traditional}</p>
                  </div>
                </div>
                <p className="font-medium text-sky-800">{sentence.pinyin}</p>
                <p className="text-sm text-muted-foreground">
                  {sentence.englishTranslation}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="han-card rounded-xl">
          <CardHeader>
            <CardTitle>Listening score</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-4xl font-semibold">71%</p>
            <Progress value={71} className="h-2" />
            <p className="text-sm leading-6 text-muted-foreground">
              Most errors are close distractors where pinyin is known but tones are
              not recognized quickly.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
