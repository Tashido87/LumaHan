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
          <Button variant="outline">
            <NotebookPen className="size-4" />
            Save character note
          </Button>
        }
      />

      <section className="grid gap-5 lg:grid-cols-[1fr_22rem]">
        <Card className="han-card rounded-xl">
          <CardContent className="space-y-5 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/70 bg-white/70 p-6 text-center">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Simplified
                </p>
                <p className="mt-4 text-8xl font-semibold leading-none">
                  {character.simplified}
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-white/70 p-6 text-center">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Traditional
                </p>
                <p className="mt-4 text-8xl font-semibold leading-none">
                  {character.traditional}
                </p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              {[
                ["Pinyin", character.pinyin],
                ["Meaning", character.meaning],
                ["Radical", character.radical],
                ["Strokes", `${character.strokeCount}`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-border/70 bg-white/70 p-4">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-2 text-lg font-semibold">{value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-border/70 bg-white/70 p-5">
              <p className="text-sm font-medium">Components</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {character.components.map((component) => (
                  <Badge key={component} variant="secondary" className="rounded-md text-base">
                    {component}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="han-card rounded-xl">
            <CardHeader>
              <CardTitle>Stroke order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid aspect-square place-items-center rounded-2xl border border-dashed border-border bg-white/70">
                <div className="text-center">
                  <FileImage className="mx-auto size-10 text-muted-foreground" />
                  <p className="mt-3 text-sm font-medium">Asset placeholder</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Admin-managed image, GIF, SVG, or URL
                  </p>
                </div>
              </div>
              <Button className="w-full" variant="outline">
                <PenTool className="size-4" />
                View handwriting guide
              </Button>
              {character.strokeOrderReferenceUrl ? (
                <Button asChild className="w-full" variant="outline">
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

      <section className="grid gap-5 lg:grid-cols-2">
        <Card className="han-card rounded-xl">
          <CardHeader>
            <CardTitle>Example words</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {words.map((word) => (
              <div key={word.id} className="rounded-xl border border-border/70 bg-white/70 p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <p className="text-3xl font-semibold">{word.simplified}</p>
                  <p className="text-3xl font-semibold">{word.traditional}</p>
                </div>
                <p className="mt-3 font-medium text-sky-800">{word.pinyin}</p>
                <p className="text-sm text-muted-foreground">{word.englishMeaning}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="han-card rounded-xl">
          <CardHeader>
            <CardTitle>Related notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {relatedNotes.length > 0 ? (
              relatedNotes.map((note) => (
                <Link
                  key={note.id}
                  href={`/notes/${note.id}`}
                  className="block rounded-xl border border-border/70 bg-white/70 p-4 transition hover:bg-white"
                >
                  <p className="font-medium">{note.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {note.content}
                  </p>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No notes are linked to this character yet.
              </p>
            )}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
