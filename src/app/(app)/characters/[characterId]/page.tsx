import Link from "next/link";
import { ExternalLink, FileImage, NotebookPen, PenTool } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { characters, getCharacterById, notes, vocabulary } from "@/data/mock-learning";

export function generateStaticParams() {
  return characters.map((character) => ({ characterId: character.id }));
}

export default async function CharacterDetailPage({
  params,
}: {
  params: Promise<{ characterId: string }>;
}) {
  const { characterId } = await params;
  const character = getCharacterById(characterId);
  const words = vocabulary.filter((item) =>
    character.exampleWordIds.includes(item.id)
  );
  const relatedNotes = notes.filter((note) => note.linkedId === character.id);

  return (
    <>
      <PageHeader
        eyebrow={`HSK ${character.hskLevel} character`}
        title={`${character.simplified} / ${character.traditional}`}
        description={character.notes}
        actions={
          <Button variant="outline" className="rounded-full">
            <NotebookPen className="size-4" />
            Save character note
          </Button>
        }
      />

      <section className="grid gap-4 lg:grid-cols-[1fr_22rem]">
        <Card>
          <CardContent className="space-y-4 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="glass-subtle rounded-2xl p-6 text-center">
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Simplified
                </p>
                <p className="mt-4 text-8xl font-semibold leading-none tracking-tight">
                  {character.simplified}
                </p>
              </div>
              <div className="glass-subtle rounded-2xl p-6 text-center">
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Traditional
                </p>
                <p className="mt-4 text-8xl font-semibold leading-none tracking-tight">
                  {character.traditional}
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              {[
                ["Pinyin", character.pinyin],
                ["Meaning", character.meaning],
                ["Radical", character.radical],
                ["Strokes", `${character.strokeCount}`],
              ].map(([label, value]) => (
                <div key={label} className="glass-subtle rounded-xl p-4">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-1.5 text-lg font-semibold tracking-tight">{value}</p>
                </div>
              ))}
            </div>
            <div className="glass-subtle rounded-2xl p-5">
              <p className="text-sm font-medium">Components</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {character.components.map((component) => (
                  <Badge key={component} variant="secondary" className="rounded-full text-base">
                    {component}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stroke order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="glass-subtle grid aspect-square place-items-center rounded-2xl border border-dashed border-border/60">
                <div className="text-center">
                  <FileImage className="mx-auto size-10 text-muted-foreground" />
                  <p className="mt-3 text-sm font-medium">Asset placeholder</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Admin-managed image, GIF, SVG, or URL
                  </p>
                </div>
              </div>
              <Button className="w-full rounded-full" variant="outline">
                <PenTool className="size-4" />
                View handwriting guide
              </Button>
              {character.strokeOrderReferenceUrl ? (
                <Button asChild className="w-full rounded-full" variant="outline">
                  <Link href={character.strokeOrderReferenceUrl}>
                    <ExternalLink className="size-4" />
                    Reference URL
                  </Link>
                </Button>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Example words</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {words.map((word) => (
              <div key={word.id} className="glass-subtle rounded-2xl p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <p className="text-3xl font-semibold tracking-tight">{word.simplified}</p>
                  <p className="text-3xl font-semibold tracking-tight">{word.traditional}</p>
                </div>
                <p className="mt-3 font-medium text-primary">{word.pinyin}</p>
                <p className="text-[13px] text-muted-foreground">{word.englishMeaning}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Related notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {relatedNotes.length > 0 ? (
              relatedNotes.map((note) => (
                <Link
                  key={note.id}
                  href={`/notes/${note.id}`}
                  className="glass-subtle block rounded-2xl p-4 transition hover:border-primary/40"
                >
                  <p className="font-medium">{note.title}</p>
                  <p className="mt-1 line-clamp-2 text-[13px] text-muted-foreground">
                    {note.content}
                  </p>
                </Link>
              ))
            ) : (
              <p className="text-[13px] text-muted-foreground">
                No notes are linked to this character yet.
              </p>
            )}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
