"use client";

import React, { useEffect, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { getFirebaseDb } from "@/lib/firebase/client";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

import { PageHeader } from "@/components/layout/page-header";
import { DualScriptCard } from "@/components/learning/dual-script-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { VocabularyItem } from "@/types/learning";
import { useAuth } from "@/components/providers/auth-provider";

export default function VocabularyPage() {
  const { user, loading: authLoading } = useAuth();
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  useEffect(() => {
    if (authLoading || !user) return;

    async function fetchVocab() {
      try {
        const db = getFirebaseDb();
        const snap = await getDocs(query(collection(db, "vocabulary"), orderBy("difficultyScore", "asc")));
        const items = snap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        } as VocabularyItem));
        setVocabulary(items);
      } catch (e) {
        console.error("Error loading vocabulary:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchVocab();
  }, [user, authLoading]);

  const filteredVocabulary = vocabulary.filter((item) => {
    const matchesSearch =
      item.simplified.includes(searchQuery) ||
      item.traditional.includes(searchQuery) ||
      item.pinyin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.englishMeaning.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel = selectedLevel === null || item.hskLevel === selectedLevel;

    return matchesSearch && matchesLevel;
  });

  return (
    <>
      <PageHeader
        eyebrow="Vocabulary library"
        title="HSK vocabulary"
        description="Searchable vocabulary with simplified, traditional, pinyin, English meaning, tags, difficulty, and advanced vocabulary labels."
        actions={
          <Button variant="outline" onClick={() => { setSearchQuery(""); setSelectedLevel(null); }}>
            Reset Filters
          </Button>
        }
      />
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-xl flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search Chinese, pinyin, or English"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedLevel === null ? "default" : "secondary"}
            className="rounded-md cursor-pointer select-none"
            onClick={() => setSelectedLevel(null)}
          >
            All HSK
          </Badge>
          {[1, 2, 3, 4, 5].map((level) => (
            <Badge
              key={level}
              variant={selectedLevel === level ? "default" : "secondary"}
              className="rounded-md cursor-pointer select-none"
              onClick={() => setSelectedLevel(level)}
            >
              HSK {level}
            </Badge>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : filteredVocabulary.length === 0 ? (
        <Card className="p-8 text-center border-dashed rounded-xl">
          <p className="text-sm text-muted-foreground">
            No vocabulary items found. Seed the database or adjust your filters.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredVocabulary.map((item) => (
            <DualScriptCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </>
  );
}
