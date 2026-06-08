import { Headphones, NotebookPen, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { VocabularyItem } from "@/types/learning";

export function DualScriptCard({ item }: { item: VocabularyItem }) {
  return (
    <Card className="han-card rounded-xl">
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">{item.englishMeaning}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{item.partOfSpeech}</p>
          </div>
          <div className="flex flex-wrap justify-end gap-1">
            <Badge variant="secondary" className="rounded-md">
              HSK {item.hskLevel}
            </Badge>
            {item.beyondCurrentLevel ? (
              <Badge className="rounded-md bg-amber-100 text-amber-700 hover:bg-amber-100">
                Extra vocabulary
              </Badge>
            ) : null}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border/70 bg-white/70 p-4">
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Simplified
            </p>
            <p className="mt-2 break-words text-5xl font-semibold leading-none">
              {item.simplified}
            </p>
          </div>
          <div className="rounded-xl border border-border/70 bg-white/70 p-4">
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Traditional
            </p>
            <p className="mt-2 break-words text-5xl font-semibold leading-none">
              {item.traditional}
            </p>
          </div>
        </div>
        <div>
          <p className="text-lg font-medium text-sky-800">{item.pinyin}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {item.tags.join(" · ")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline">
            <Headphones className="size-4" />
            Play
          </Button>
          <Button size="sm" variant="outline">
            <Sparkles className="size-4" />
            Ask AI
          </Button>
          <Button size="sm" variant="outline">
            <NotebookPen className="size-4" />
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
