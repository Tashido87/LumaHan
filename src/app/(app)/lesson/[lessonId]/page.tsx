import Link from "next/link";
import {
  Bot,
  Headphones,
  NotebookPen,
  PenLine,
  Play,
  Sparkles,
} from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { DualScriptCard } from "@/components/learning/dual-script-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getLessonById,
  getLessonContent,
  lessons,
} from "@/data/mock-learning";

export function generateStaticParams() {
  return lessons.map((lesson) => ({ lessonId: lesson.id }));
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const lesson = getLessonById(lessonId);
  const content = getLessonContent(lesson);

  return (
    <>
      <PageHeader
        eyebrow={`HSK ${lesson.hskLevel} lesson`}
        title={lesson.title}
        description={lesson.description}
        actions={
          <>
            <Button variant="outline">
              <Bot className="size-4" />
              Ask AI
            </Button>
            <Button variant="outline">
              <NotebookPen className="size-4" />
              Save to Notes
            </Button>
            <Button asChild>
              <Link href="/practice">
                <Play className="size-4" />
                Practice Now
              </Link>
            </Button>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="han-card rounded-xl">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Estimated time</p>
            <p className="mt-2 text-3xl font-semibold">{lesson.estimatedMinutes} min</p>
          </CardContent>
        </Card>
        <Card className="han-card rounded-xl">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Lesson XP</p>
            <p className="mt-2 text-3xl font-semibold">{lesson.xp}</p>
          </CardContent>
        </Card>
        <Card className="han-card rounded-xl">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Completion</p>
            <p className="mt-2 text-3xl font-semibold">{lesson.completion}%</p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Vocabulary</h2>
          <Badge variant="secondary" className="rounded-md">
            {content.vocabulary.length} cards
          </Badge>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {content.vocabulary.map((item) => (
            <DualScriptCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Grammar</h2>
          {content.grammar.map((point) => (
            <Card key={point.id} className="han-card rounded-xl">
              <CardHeader>
                <CardTitle>{point.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Badge variant="outline" className="rounded-md">
                  {point.pattern}
                </Badge>
                <p className="text-sm leading-6 text-muted-foreground">
                  {point.explanation}
                </p>
                {point.commonMistakes.length > 0 ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm font-medium text-amber-900">Common mistake</p>
                    <p className="mt-1 text-sm text-amber-900/75">
                      {point.commonMistakes[0]}
                    </p>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Characters</h2>
          {content.characters.map((character) => (
            <Card key={character.id} className="han-card rounded-xl">
              <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/70 p-4">
                    <p className="text-xs uppercase text-muted-foreground">Simplified</p>
                    <p className="mt-2 text-5xl font-semibold">{character.simplified}</p>
                  </div>
                  <div className="rounded-xl bg-white/70 p-4">
                    <p className="text-xs uppercase text-muted-foreground">Traditional</p>
                    <p className="mt-2 text-5xl font-semibold">{character.traditional}</p>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-medium text-sky-800">{character.pinyin}</p>
                  <p className="text-sm text-muted-foreground">{character.meaning}</p>
                  <Button asChild className="mt-3" size="sm" variant="outline">
                    <Link href={`/characters/${character.id}`}>
                      <PenLine className="size-4" />
                      Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Example sentences</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {content.sentences.map((sentence) => (
            <Card key={sentence.id} className="han-card rounded-xl">
              <CardContent className="space-y-4 p-5">
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
                <div>
                  <p className="font-medium text-sky-800">{sentence.pinyin}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {sentence.englishTranslation}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline">
                    <Headphones className="size-4" />
                    Audio
                  </Button>
                  {sentence.beyondCurrentLevel ? (
                    <Badge className="rounded-md bg-amber-100 text-amber-700 hover:bg-amber-100">
                      Beyond current level
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="rounded-md">
                      Curated
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Card className="han-card rounded-xl">
        <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <h2 className="font-semibold">AI enhancement boundary</h2>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Curated HSK content remains the source of truth. AI additions are
              marked, structured, and reviewable by admin.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/ai-tutor">Open AI tutor</Link>
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
