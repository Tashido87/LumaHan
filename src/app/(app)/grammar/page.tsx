"use client";

import React, { useEffect, useState } from "react";
import { BookMarked, Search, Loader2 } from "lucide-react";
import { getFirebaseDb } from "@/lib/firebase/client";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { GrammarPoint } from "@/types/learning";
import { useAuth } from "@/components/providers/auth-provider";

export default function GrammarPage() {
  const { user, loading: authLoading } = useAuth();
  const [grammarPoints, setGrammarPoints] = useState<GrammarPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (authLoading || !user) return;

    async function fetchGrammar() {
      try {
        const db = getFirebaseDb();
        const snap = await getDocs(query(collection(db, "grammarPoints"), orderBy("hskLevel", "asc")));
        const items = snap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        } as GrammarPoint));
        setGrammarPoints(items);
      } catch (e) {
        console.error("Error loading grammar points:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchGrammar();
  }, [user, authLoading]);

  const filteredGrammar = grammarPoints.filter((point) => {
    const queryLower = searchQuery.toLowerCase();
    return (
      point.title.toLowerCase().includes(queryLower) ||
      point.pattern.toLowerCase().includes(queryLower) ||
      point.explanation.toLowerCase().includes(queryLower)
    );
  });

  return (
    <>
      <PageHeader
        eyebrow="Grammar library"
        title="Grammar points"
        description="Curated patterns, beginner-friendly explanations, common mistakes, and example sentences for HSK 1 through HSK 5."
      />
      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search grammar patterns"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : filteredGrammar.length === 0 ? (
        <Card className="p-8 text-center border-dashed rounded-xl">
          <p className="text-sm text-muted-foreground">
            No grammar points found matching your search.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredGrammar.map((point) => (
            <Card key={point.id} className="han-card rounded-xl">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle className="flex items-center gap-2">
                      <BookMarked className="size-4 text-primary" />
                      {point.title}
                    </CardTitle>
                    <p className="mt-2 text-sm text-muted-foreground">{point.pattern}</p>
                  </div>
                  <Badge variant="secondary" className="rounded-md">
                    HSK {point.hskLevel}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-6 text-muted-foreground">
                  {point.explanation}
                </p>
                {point.examples.map((sentence, index) => (
                  <div key={index} className="rounded-xl border border-border/70 bg-white/70 p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <p className="text-2xl font-semibold">{sentence.simplified}</p>
                      <p className="text-2xl font-semibold">{sentence.traditional}</p>
                    </div>
                    <p className="mt-3 font-medium text-sky-800">{sentence.pinyin}</p>
                    <p className="text-sm text-muted-foreground">
                      {sentence.englishTranslation}
                    </p>
                  </div>
                ))}
                <div className="flex flex-wrap gap-2">
                  {point.commonMistakes.map((mistake) => (
                    <Badge key={mistake} variant="outline" className="rounded-md">
                      {mistake}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
