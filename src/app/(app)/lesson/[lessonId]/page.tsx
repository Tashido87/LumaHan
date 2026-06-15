"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Bot,
  Headphones,
  NotebookPen,
  PenLine,
  Play,
  Sparkles,
  Loader2,
} from "lucide-react";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  documentId,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { useAuth } from "@/components/providers/auth-provider";

import { PageHeader } from "@/components/layout/page-header";
import { DualScriptCard } from "@/components/learning/dual-script-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  Lesson,
  VocabularyItem,
  CharacterItem,
  GrammarPoint,
  ExampleSentence,
} from "@/types/learning";

export default function LessonPage() {
  const params = useParams();
  const lessonId = params?.lessonId as string;
  const { user, loading: authLoading } = useAuth();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [characters, setCharacters] = useState<CharacterItem[]>([]);
  const [grammarPoints, setGrammarPoints] = useState<GrammarPoint[]>([]);
  const [exampleSentences, setExampleSentences] = useState<ExampleSentence[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setError("Please log in to view this lesson.");
      setLoading(false);
      return;
    }
    if (!lessonId) {
      setError("Invalid lesson ID.");
      setLoading(false);
      return;
    }

    async function fetchLessonData() {
      try {
        const db = getFirebaseDb();

        // 1. Fetch Lesson document
        const lessonRef = doc(db, "lessons", lessonId);
        const lessonSnap = await getDoc(lessonRef);

        if (!lessonSnap.exists()) {
          setError(`Lesson "${lessonId}" not found in database.`);
          setLoading(false);
          return;
        }

        const lessonData = {
          id: lessonSnap.id,
          ...lessonSnap.data(),
        } as Lesson;
        setLesson(lessonData);

        // 2. Fetch Vocabulary
        let vocabItems: VocabularyItem[] = [];
        if (lessonData.vocabularyIds && lessonData.vocabularyIds.length > 0) {
          const chunks: string[][] = [];
          for (let i = 0; i < lessonData.vocabularyIds.length; i += 10) {
            chunks.push(lessonData.vocabularyIds.slice(i, i + 10));
          }
          const promises = chunks.map((chunk) =>
            getDocs(
              query(
                collection(db, "vocabulary"),
                where(documentId(), "in", chunk)
              )
            )
          );
          const snaps = await Promise.all(promises);
          snaps.forEach((snap) => {
            snap.forEach((d) => {
              vocabItems.push({ id: d.id, ...d.data() } as VocabularyItem);
            });
          });
          setVocabulary(vocabItems);
        }

        // 3. Fetch Characters
        let charItems: CharacterItem[] = [];
        if (lessonData.characterIds && lessonData.characterIds.length > 0) {
          const chunks: string[][] = [];
          for (let i = 0; i < lessonData.characterIds.length; i += 10) {
            chunks.push(lessonData.characterIds.slice(i, i + 10));
          }
          const promises = chunks.map((chunk) =>
            getDocs(
              query(
                collection(db, "characters"),
                where(documentId(), "in", chunk)
              )
            )
          );
          const snaps = await Promise.all(promises);
          snaps.forEach((snap) => {
            snap.forEach((d) => {
              charItems.push({ id: d.id, ...d.data() } as CharacterItem);
            });
          });
          setCharacters(charItems);
        }

        // 4. Fetch Grammar Points
        let grammarItems: GrammarPoint[] = [];
        if (lessonData.grammarIds && lessonData.grammarIds.length > 0) {
          const chunks: string[][] = [];
          for (let i = 0; i < lessonData.grammarIds.length; i += 10) {
            chunks.push(lessonData.grammarIds.slice(i, i + 10));
          }
          const promises = chunks.map((chunk) =>
            getDocs(
              query(
                collection(db, "grammarPoints"),
                where(documentId(), "in", chunk)
              )
            )
          );
          const snaps = await Promise.all(promises);
          snaps.forEach((snap) => {
            snap.forEach((d) => {
              grammarItems.push({ id: d.id, ...d.data() } as GrammarPoint);
            });
          });
          setGrammarPoints(grammarItems);
        }

        // 5. Fetch Example Sentences (where vocabularyIds contains any lesson vocabulary)
        let sentenceItems: ExampleSentence[] = [];
        if (vocabItems.length > 0) {
          // Firebase supports array-contains-any for up to 10 items
          const vocabIdsForSentences = vocabItems.slice(0, 10).map((v) => v.id);
          const sentenceSnap = await getDocs(
            query(
              collection(db, "exampleSentences"),
              where("vocabularyIds", "array-contains-any", vocabIdsForSentences)
            )
          );
          sentenceSnap.forEach((d) => {
            sentenceItems.push({ id: d.id, ...d.data() } as ExampleSentence);
          });
          setExampleSentences(sentenceItems);
        }
      } catch (err) {
        console.error("Error fetching lesson details:", err);
        setError("Failed to load lesson content. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchLessonData();
  }, [user, authLoading, lessonId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <Card className="glass-subtle mx-auto max-w-xl p-8 text-center">
        <p className="font-semibold text-destructive">Error</p>
        <p className="mt-2 text-sm text-muted-foreground">{error || "Lesson not found."}</p>
        <Button asChild className="mt-4 rounded-full" size="sm">
          <Link href="/learn">Back to curriculum</Link>
        </Button>
      </Card>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow={`HSK ${lesson.hskLevel} lesson`}
        title={lesson.title}
        description={lesson.description}
        actions={
          <>
            <Button variant="outline" className="rounded-full">
              <Bot className="size-4" />
              Ask AI
            </Button>
            <Button variant="outline" className="rounded-full">
              <NotebookPen className="size-4" />
              Save to Notes
            </Button>
            <Button asChild className="rounded-full">
              <Link href="/practice">
                <Play className="size-4" />
                Practice Now
              </Link>
            </Button>
          </>
        }
      />

      <section className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Estimated time</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">{lesson.estimatedMinutes} min</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Lesson XP</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">{lesson.xp || 10}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Completion</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">{lesson.completion || 0}%</p>
          </CardContent>
        </Card>
      </section>

      {vocabulary.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold tracking-tight">Vocabulary</h2>
            <Badge variant="secondary" className="rounded-full text-[11px]">
              {vocabulary.length} cards
            </Badge>
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            {vocabulary.map((item) => (
              <DualScriptCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {(grammarPoints.length > 0 || characters.length > 0) && (
        <section className="grid gap-4 lg:grid-cols-2">
          {grammarPoints.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold tracking-tight">Grammar</h2>
              {grammarPoints.map((point) => (
                <Card key={point.id}>
                  <CardHeader>
                    <CardTitle>{point.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Badge variant="outline" className="rounded-full text-[11px]">
                      {point.pattern}
                    </Badge>
                    <p className="text-[13px] leading-6 text-muted-foreground">
                      {point.explanation}
                    </p>
                    {point.commonMistakes && point.commonMistakes.length > 0 ? (
                      <div className="glass-subtle rounded-2xl p-4">
                        <p className="text-sm font-medium text-orange-700">
                          Common mistake
                        </p>
                        <p className="mt-1 text-[13px] text-muted-foreground">
                          {point.commonMistakes[0]}
                        </p>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {characters.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold tracking-tight">Characters</h2>
              {characters.map((character) => (
                <Card key={character.id}>
                  <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="glass-subtle rounded-2xl p-4">
                        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                          Simplified
                        </p>
                        <p className="mt-2 text-5xl font-semibold tracking-tight">
                          {character.simplified}
                        </p>
                      </div>
                      <div className="glass-subtle rounded-2xl p-4">
                        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                          Traditional
                        </p>
                        <p className="mt-2 text-5xl font-semibold tracking-tight">
                          {character.traditional}
                        </p>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-medium text-primary">
                        {character.pinyin}
                      </p>
                      <p className="text-[13px] text-muted-foreground">
                        {character.meaning}
                      </p>
                      <Button asChild className="mt-3 rounded-full" size="sm" variant="outline">
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
          )}
        </section>
      )}

      {exampleSentences.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Example sentences</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {exampleSentences.map((sentence) => (
              <Card key={sentence.id}>
                <CardContent className="space-y-4 p-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="glass-subtle rounded-2xl p-4">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                        Simplified
                      </p>
                      <p className="mt-2 text-2xl font-semibold tracking-tight">
                        {sentence.simplified}
                      </p>
                    </div>
                    <div className="glass-subtle rounded-2xl p-4">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                        Traditional
                      </p>
                      <p className="mt-2 text-2xl font-semibold tracking-tight">
                        {sentence.traditional}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-primary">{sentence.pinyin}</p>
                    <p className="mt-1 text-[13px] text-muted-foreground">
                      {sentence.englishTranslation}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" className="rounded-full">
                      <Headphones className="size-4" />
                      Audio
                    </Button>
                    {sentence.beyondCurrentLevel ? (
                      <Badge className="rounded-full bg-orange-500/12 text-orange-600 hover:bg-orange-500/12 text-[11px]">
                        Beyond current level
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="rounded-full text-[11px]">
                        Curated
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <Card>
        <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <h2 className="font-semibold">AI enhancement boundary</h2>
            </div>
            <p className="mt-2 text-[13px] leading-6 text-muted-foreground">
              Curated HSK content remains the source of truth. AI additions are
              marked, structured, and reviewable by admin.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/ai-tutor">Open AI tutor</Link>
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
