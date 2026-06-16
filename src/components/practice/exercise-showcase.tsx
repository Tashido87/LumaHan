import {
  CheckCircle2,
  Headphones,
  Keyboard,
  Mic,
  Puzzle,
  Rows3,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { practiceExercises } from "@/data/mock-learning";
import type { ExerciseType } from "@/types/learning";

const exerciseLabels: Record<ExerciseType, string> = {
  multiple_choice: "Multiple choice",
  match_simplified_traditional: "Simplified ⇄ traditional",
  match_pinyin_character: "Pinyin ⇄ character",
  match_meaning_word: "Meaning ⇄ word",
  fill_blank: "Fill in the blank",
  sentence_ordering: "Sentence ordering",
  type_pinyin: "Type pinyin",
  type_chinese: "Type Chinese",
  listening_choice: "Listening choice",
  speaking: "Speaking",
  grammar_correction: "Grammar correction",
};

export function ExerciseShowcase() {
  const exerciseTypes = Object.entries(exerciseLabels);

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_22rem]">
      <div className="space-y-4">
        {practiceExercises.map((exercise) => (
          <Card key={exercise.id}>
            <CardHeader className="gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-lg">{exerciseLabels[exercise.type]}</CardTitle>
                <Badge variant="secondary" className="rounded-full text-[11px]">
                  HSK {exercise.hskLevel} · {exercise.difficulty}
                </Badge>
              </div>
              <p className="text-[13px] text-muted-foreground">{exercise.prompt}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {exercise.simplified || exercise.traditional ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="glass-subtle rounded-2xl p-4">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      Simplified
                    </p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight">{exercise.simplified}</p>
                  </div>
                  <div className="glass-subtle rounded-2xl p-4">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      Traditional
                    </p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight">{exercise.traditional}</p>
                  </div>
                </div>
              ) : null}

              {exercise.pinyin ? (
                <p className="text-lg font-medium text-primary">{exercise.pinyin}</p>
              ) : null}

              {exercise.choices ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  {exercise.choices.map((choice) => (
                    <Button
                      key={choice}
                      variant={choice === exercise.correctAnswer ? "secondary" : "outline"}
                      className="justify-start rounded-xl"
                    >
                      {choice === exercise.correctAnswer ? (
                        <CheckCircle2 className="size-4 text-primary" />
                      ) : (
                        <Puzzle className="size-4" />
                      )}
                      {choice}
                    </Button>
                  ))}
                </div>
              ) : null}

              {exercise.type === "speaking" ? (
                <div className="flex flex-wrap gap-2">
                  <Button className="rounded-full">
                    <Mic className="size-4" />
                    Record
                  </Button>
                  <Button variant="outline" className="rounded-full">
                    <Headphones className="size-4" />
                    Listen
                  </Button>
                </div>
              ) : null}

              {exercise.type.includes("type") ? (
                <Input placeholder="Type your answer" aria-label="Typed answer" />
              ) : null}

              <Separator />
              <p className="text-[13px] leading-6 text-muted-foreground">
                {exercise.explanation}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exercise coverage</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          {exerciseTypes.map(([type, label]) => (
            <div
              key={type}
              className="glass-subtle flex items-center gap-3 rounded-xl p-3 text-[13px]"
            >
              <span className="grid size-8 place-items-center rounded-lg bg-primary/12 text-primary">
                {type.includes("listening") ? (
                  <Headphones className="size-4" />
                ) : type.includes("type") ? (
                  <Keyboard className="size-4" />
                ) : type.includes("sentence") ? (
                  <Rows3 className="size-4" />
                ) : (
                  <Puzzle className="size-4" />
                )}
              </span>
              <span className="min-w-0 flex-1 truncate">{label}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
