import { Headphones, NotebookPen, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { VocabularyItem } from "@/types/learning";

export function DualScriptCard({ item }: { item: VocabularyItem }) {
  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">{item.englishMeaning}</CardTitle>
            <p className="mt-1 text-[13px] text-muted-foreground">
              {item.partOfSpeech}
            </p>
          </div>
          <div className="flex flex-wrap justify-end gap-1">
            <Badge variant="secondary" className="rounded-full text-[11px]">
              HSK {item.hskLevel}
            </Badge>
            {item.beyondCurrentLevel ? (
              <Badge className="rounded-full bg-orange-500/12 text-orange-600 hover:bg-orange-500/12 text-[11px]">
                Extra vocabulary
              </Badge>
            ) : null}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="glass-subtle rounded-2xl p-4">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Simplified
            </p>
            <p className="mt-2 break-words text-5xl font-semibold leading-none tracking-tight">
              {item.simplified}
            </p>
          </div>
          <div className="glass-subtle rounded-2xl p-4">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Traditional
            </p>
            <p className="mt-2 break-words text-5xl font-semibold leading-none tracking-tight">
              {item.traditional}
            </p>
          </div>
        </div>
        <div>
          <p className="text-lg font-medium text-primary">{item.pinyin}</p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {item.tags.join(" · ")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" className="rounded-full">
            <Headphones className="size-4" />
            Play
          </Button>
          <Button size="sm" variant="outline" className="rounded-full">
            <Sparkles className="size-4" />
            Ask AI
          </Button>
          <Button size="sm" variant="outline" className="rounded-full">
            <NotebookPen className="size-4" />
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
