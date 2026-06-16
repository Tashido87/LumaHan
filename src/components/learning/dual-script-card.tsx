import { Headphones, NotebookPen, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { VocabularyItem } from "@/types/learning";

export function DualScriptCard({ item }: { item: VocabularyItem }) {
  return (
    <Card className="group">
      <CardContent className="flex items-center gap-4 p-3">
        {/* Chinese characters - compact side by side */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="glass-subtle rounded-lg px-3 py-2 text-center min-w-[3.5rem]">
            <p className="text-2xl font-semibold leading-tight">{item.simplified}</p>
            <p className="text-[9px] uppercase text-muted-foreground mt-0.5">简</p>
          </div>
          {item.simplified !== item.traditional && (
            <div className="glass-subtle rounded-lg px-3 py-2 text-center min-w-[3.5rem]">
              <p className="text-2xl font-semibold leading-tight">{item.traditional}</p>
              <p className="text-[9px] uppercase text-muted-foreground mt-0.5">繁</p>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <p className="text-sm font-semibold text-primary">{item.pinyin}</p>
            <Badge variant="secondary" className="rounded-full text-[10px] px-1.5 py-0">
              HSK {item.hskLevel}
            </Badge>
            {item.beyondCurrentLevel && (
              <Badge className="rounded-full bg-orange-500/12 text-orange-600 hover:bg-orange-500/12 text-[10px] px-1.5 py-0">
                Extra
              </Badge>
            )}
          </div>
          <p className="text-[13px] mt-0.5 truncate">{item.englishMeaning}</p>
          <p className="text-[11px] text-muted-foreground truncate mt-0.5">{item.partOfSpeech} · {item.tags.slice(0, 3).join(" · ")}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="icon-sm" variant="ghost" className="size-7 rounded-md">
            <Headphones className="size-3.5" />
          </Button>
          <Button size="icon-sm" variant="ghost" className="size-7 rounded-md">
            <Sparkles className="size-3.5" />
          </Button>
          <Button size="icon-sm" variant="ghost" className="size-7 rounded-md">
            <NotebookPen className="size-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
