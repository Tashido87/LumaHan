"use client";

import React, { useEffect, useState } from "react";
import { Search, Loader2, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { getFirebaseDb } from "@/lib/firebase/client";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

import { PageHeader } from "@/components/layout/page-header";
import { DualScriptCard } from "@/components/learning/dual-script-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { VocabularyItem } from "@/types/learning";
import { useAuth } from "@/components/providers/auth-provider";

export default function VocabularyPage() {
  const { user, loading: authLoading } = useAuth();
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // HSK internationally defined vocabulary reference
  const hskVocabGuide = [
    { level: 1, words: 150, cumulative: 150, description: "Beginner" },
    { level: 2, words: 150, cumulative: 300, description: "Elementary" },
    { level: 3, words: 300, cumulative: 600, description: "Intermediate" },
    { level: 4, words: 600, cumulative: 1200, description: "Upper-Intermediate" },
    { level: 5, words: 1300, cumulative: 2500, description: "Advanced" },
  ];

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

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedLevel]);

  const filteredVocabulary = vocabulary.filter((item) => {
    const matchesSearch =
      item.simplified.includes(searchQuery) ||
      item.traditional.includes(searchQuery) ||
      item.pinyin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.englishMeaning.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel = selectedLevel === null || item.hskLevel === selectedLevel;

    return matchesSearch && matchesLevel;
  });

  // Pagination calculations
  const totalItems = filteredVocabulary.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVocabulary = filteredVocabulary.slice(startIndex, startIndex + itemsPerPage);

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push("...");
      }
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <>
      <PageHeader
        eyebrow="Vocabulary library"
        title="HSK vocabulary"
        description="Searchable vocabulary with simplified, traditional, pinyin, English meaning, tags, difficulty, and advanced vocabulary labels."
        actions={
          <Button variant="outline" className="rounded-full" onClick={() => { setSearchQuery(""); setSelectedLevel(null); }}>
            Reset Filters
          </Button>
        }
      />

      {/* Recommended Vocabulary Guide */}
      <Card className="glass-subtle">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-primary/12 text-primary mt-0.5">
              <BookOpen className="size-4" />
            </span>
            <div className="flex-1">
              <h3 className="font-semibold">Recommended HSK Vocabulary Count</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-5">
                The international standard curriculum specifies the following cumulative vocabulary counts for Classic HSK Levels 1 to 5.
              </p>
              <div className="mt-4 grid gap-3 grid-cols-2 md:grid-cols-5">
                {hskVocabGuide.map((g) => (
                  <div
                    key={g.level}
                    onClick={() => setSelectedLevel(g.level)}
                    className={`rounded-xl p-3 text-center border transition-all cursor-pointer ${
                      selectedLevel === g.level
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-background/50 border-border/60 text-foreground hover:bg-background hover:border-primary/40"
                    }`}
                  >
                    <p className="text-xs font-semibold">HSK {g.level}</p>
                    <p className="text-lg font-bold mt-1">{g.cumulative}</p>
                    <p className={`text-[10px] ${selectedLevel === g.level ? "text-primary-foreground/80" : "text-muted-foreground"} mt-0.5`}>
                      (+{g.words} words)
                    </p>
                    <p className={`text-[10px] font-medium mt-1 uppercase ${selectedLevel === g.level ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                      {g.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
            className="rounded-full cursor-pointer select-none text-xs px-3 py-1"
            onClick={() => setSelectedLevel(null)}
          >
            All HSK
          </Badge>
          {[1, 2, 3, 4, 5].map((level) => (
            <Badge
              key={level}
              variant={selectedLevel === level ? "default" : "secondary"}
              className="rounded-full cursor-pointer select-none text-xs px-3 py-1"
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
      ) : totalItems === 0 ? (
        <Card className="glass-subtle p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No vocabulary items found. Adjust your filters or search query.
          </p>
        </Card>
      ) : (
        <>
          {/* Active filter count banner */}
          <div className="flex items-center justify-between text-xs text-muted-foreground/90 font-medium px-1">
            <span>
              Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} items
            </span>
            {selectedLevel !== null && (
              <span>Filtered to HSK {selectedLevel}</span>
            )}
          </div>

          {/* Vocabulary Cards Grid */}
          <div className="grid gap-4 xl:grid-cols-2">
            {paginatedVocabulary.map((item) => (
              <DualScriptCard key={item.id} item={item} />
            ))}
          </div>

          {/* Pagination Navigation */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6 py-4">
              <Button
                variant="outline"
                size="icon"
                className="glass-subtle size-9 rounded-xl"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="size-4" />
                <span className="sr-only">Previous page</span>
              </Button>

              <div className="flex items-center gap-1">
                {getPageNumbers().map((page, idx) => {
                  if (page === "...") {
                    return (
                      <span key={`dots-${idx}`} className="px-2 text-sm text-muted-foreground select-none">
                        ...
                      </span>
                    );
                  }
                  return (
                    <Button
                      key={`page-${page}`}
                      variant={currentPage === page ? "default" : "outline"}
                      className={`size-9 p-0 rounded-xl text-sm font-medium transition-all ${
                        currentPage === page
                          ? "shadow-sm"
                          : "glass-subtle hover:text-primary"
                      }`}
                      onClick={() => setCurrentPage(Number(page))}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="icon"
                className="glass-subtle size-9 rounded-xl"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="size-4" />
                <span className="sr-only">Next page</span>
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
}
