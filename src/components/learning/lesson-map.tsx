"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getFirebaseDb } from "@/lib/firebase/client";
import { useAuth } from "@/components/providers/auth-provider";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import {
  Check,
  Crown,
  Flag,
  Lock,
  Play,
  Shield,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type {
  HskLevel,
  HskLevelConfig,
  Lesson,
  LessonStatus,
  Unit,
} from "@/types/learning";

type LessonProgress = {
  status?: LessonStatus;
  completion?: number;
  xp?: number;
};

const statusIcon = {
  completed: Check,
  in_progress: Play,
  available: Sparkles,
  checkpoint: Flag,
  boss: Crown,
  locked: Lock,
};

function LessonNode({ lesson, index }: { lesson: Lesson; index: number }) {
  const Icon = statusIcon[lesson.status];
  const isLocked = lesson.status === "locked";
  const isCheckpoint = lesson.status === "checkpoint" || lesson.status === "boss";

  return (
    <div
      className={cn(
        "relative flex items-center gap-4",
        index % 2 === 1 && "md:translate-x-12"
      )}
    >
      <div
        className={cn(
          "grid size-14 shrink-0 place-items-center rounded-2xl border shadow-sm",
          lesson.status === "completed" &&
            "border-emerald-200 bg-emerald-500 text-white",
          lesson.status === "in_progress" &&
            "border-sky-200 bg-sky-500 text-white",
          lesson.status === "available" &&
            "border-violet-200 bg-white text-violet-700",
          isCheckpoint && "border-amber-200 bg-amber-400 text-amber-950",
          isLocked && "border-border bg-muted text-muted-foreground"
        )}
      >
        <Icon className="size-5" />
      </div>
      <Card className="han-card flex-1 rounded-xl">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-base font-semibold">{lesson.title}</h3>
                <Badge variant="secondary" className="rounded-md">
                  {lesson.estimatedMinutes} min
                </Badge>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {lesson.description}
              </p>
              <Progress value={lesson.completion} className="mt-3 h-1.5" />
            </div>
            <Button asChild size="sm" variant={isLocked ? "outline" : "default"}>
              <Link href={`/lesson/${lesson.id}`} aria-disabled={isLocked}>
                {isLocked ? <Lock className="size-4" /> : <Play className="size-4" />}
                {isLocked ? "Locked" : "Open"}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function LessonMap() {
  const { user, profile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [hskLevels, setHskLevels] = useState<HskLevelConfig[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    if (authLoading || !user) return;
    const userId = user.uid;

    async function loadCurriculum() {
      try {
        const db = getFirebaseDb();

        // 1. Fetch HSK Levels
        const levelsSnap = await getDocs(query(collection(db, "hskLevels"), orderBy("order", "asc")));
        if (levelsSnap.empty) {
          setLoading(false);
          return; // Database is not seeded yet
        }

        const accents: Record<number, string> = {
          1: "bg-emerald-500",
          2: "bg-sky-500",
          3: "bg-violet-500",
          4: "bg-amber-500",
          5: "bg-rose-500",
        };

        const levelsList: HskLevelConfig[] = levelsSnap.docs.map((docSnap) => {
          const data = docSnap.data();
          const lvlNum = data.levelNumber as HskLevel;
          return {
            level: lvlNum,
            title: data.title || `HSK ${lvlNum}`,
            description: data.description || "",
            accent: accents[lvlNum] || "bg-emerald-500",
            progress: lvlNum === 1 ? (profile?.xp ? Math.min(100, Math.round(profile.xp / 10)) : 0) : 0, // Fallback logic based on user profile XP
            unitsCompleted: 0,
            totalUnits: 0,
          };
        });

        // 2. Fetch Units
        const unitsSnap = await getDocs(query(collection(db, "units"), orderBy("order", "asc")));
        const unitsList: Unit[] = unitsSnap.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            hskLevel: data.hskLevel,
            title: data.title,
            description: data.description,
            order: data.order,
            isLockedByDefault: data.isLockedByDefault ?? false,
          };
        });

        // 3. Fetch Lessons
        const lessonsSnap = await getDocs(query(collection(db, "lessons"), orderBy("order", "asc")));
        const lessonsRaw = lessonsSnap.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            hskLevel: data.hskLevel,
            unitId: data.unitId,
            title: data.title,
            description: data.description,
            order: data.order,
            estimatedMinutes: data.estimatedMinutes || 10,
            vocabularyIds: data.vocabularyIds || [],
            grammarIds: data.grammarIds || [],
            characterIds: data.characterIds || [],
            prerequisiteLessonIds: data.prerequisiteLessonIds || [],
          };
        });

        // 4. Fetch User Lesson Progress if logged in
        const userProgressMap: Record<string, LessonProgress> = {};
        const progressSnap = await getDocs(
          collection(db, "userProgress", userId, "lessonProgress")
        );
        progressSnap.forEach((docSnap) => {
          userProgressMap[docSnap.id] = docSnap.data() as LessonProgress;
        });

        // 5. Merge raw lessons with user progress
        const lessonsList: Lesson[] = lessonsRaw.map((lesson) => {
          const progress = userProgressMap[lesson.id];
          
          let status: LessonStatus =
            lesson.prerequisiteLessonIds.length === 0 ? "available" : "locked";
          let completion = 0;
          let xp = 0;

          if (progress) {
            status = progress.status || "available";
            completion = progress.completion || 0;
            xp = progress.xp || 0;
          } else if (lesson.prerequisiteLessonIds.length > 0) {
            // Check if all prerequisites are completed
            const allPrereqsMet = lesson.prerequisiteLessonIds.every(
              (id: string) => userProgressMap[id]?.status === "completed"
            );
            if (allPrereqsMet) {
              status = "available";
            }
          }

          // Special status formatting for non-standard nodes
          if (status === "available") {
            if (lesson.id.includes("checkpoint")) {
              status = "checkpoint";
            } else if (lesson.id.includes("boss")) {
              status = "boss";
            }
          }

          return {
            ...lesson,
            status,
            completion,
            xp,
          };
        });

        // Update counts on HskLevelConfigs
        const updatedLevels = levelsList.map((lvl) => {
          const lvlUnits = unitsList.filter((u) => u.hskLevel === lvl.level);
          const lvlLessons = lessonsList.filter((l) => l.hskLevel === lvl.level);
          const completedLessons = lvlLessons.filter((l) => l.status === "completed");
          const totalUnits = lvlUnits.length;
          
          let unitsCompleted = 0;
          lvlUnits.forEach((unit) => {
            const unitLessons = lvlLessons.filter((l) => l.unitId === unit.id);
            if (unitLessons.length > 0 && unitLessons.every((l) => l.status === "completed")) {
              unitsCompleted++;
            }
          });

          // Calculate a real percentage based on completed lessons
          const progress = lvlLessons.length > 0 
            ? Math.round((completedLessons.length / lvlLessons.length) * 100) 
            : 0;

          return {
            ...lvl,
            totalUnits,
            unitsCompleted,
            progress,
          };
        });

        setHskLevels(updatedLevels);
        setUnits(unitsList);
        setLessons(lessonsList);
      } catch (e) {
        console.error("Error loading curriculum:", e);
        setError(e instanceof Error ? e.message : "Unknown curriculum load error");
      } finally {
        setLoading(false);
      }
    }

    loadCurriculum();
  }, [user, profile, authLoading]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading curriculum...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5 text-center text-destructive">
        <AlertCircle className="mx-auto size-8" />
        <h3 className="mt-3 font-semibold">Failed to load learning path</h3>
        <p className="mt-1 text-sm">{error}</p>
      </div>
    );
  }

  // Database is empty (no HSK levels loaded)
  if (hskLevels.length === 0) {
    return (
      <Card className="border-amber-200 bg-amber-50/70 p-6 rounded-xl">
        <div className="flex gap-3">
          <AlertCircle className="size-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-900">Database is empty</h3>
            <p className="mt-1 text-sm text-amber-700 leading-6">
              There is currently no curriculum content loaded in your Firestore database.
            </p>
            {profile?.role === "admin" ? (
              <div className="mt-4">
                <p className="text-sm text-amber-800">
                  As an <strong>Admin</strong>, you can seed the database instantly:
                </p>
                <Button asChild size="sm" className="mt-3 bg-amber-600 hover:bg-amber-700 text-white">
                  <Link href="/admin">Go to Admin Dashboard to Import Seed</Link>
                </Button>
              </div>
            ) : (
              <p className="mt-2 text-sm text-amber-800">
                Please contact an administrator to seed the curriculum database.
              </p>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Tabs defaultValue={`${hskLevels[0]?.level || 1}`} className="gap-5">
      <TabsList className="grid h-auto w-full grid-cols-2 gap-2 bg-white/60 p-2 sm:grid-cols-5">
        {hskLevels.map((level) => (
          <TabsTrigger key={level.level} value={`${level.level}`} className="h-10">
            HSK {level.level}
          </TabsTrigger>
        ))}
      </TabsList>

      {hskLevels.map((level) => {
        const levelUnits = units.filter((unit) => unit.hskLevel === level.level);
        const levelLessons = lessons.filter(
          (lesson) => lesson.hskLevel === level.level
        );

        return (
          <TabsContent key={level.level} value={`${level.level}`} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-[1fr_18rem]">
              <div className="space-y-5">
                {levelUnits.length > 0 ? (
                  levelUnits.map((unit) => (
                    <section key={unit.id} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "grid size-10 place-items-center rounded-xl text-white",
                            level.accent
                          )}
                        >
                          <Shield className="size-4" />
                        </span>
                        <div>
                          <h2 className="text-lg font-semibold">{unit.title}</h2>
                          <p className="text-sm text-muted-foreground">
                            {unit.description}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {levelLessons
                          .filter((lesson) => lesson.unitId === unit.id)
                          .map((lesson, index) => (
                            <LessonNode
                              key={lesson.id}
                              lesson={lesson}
                              index={index}
                            />
                          ))}
                      </div>
                    </section>
                  ))
                ) : (
                  <Card className="han-card rounded-xl">
                    <CardContent className="p-6">
                      <p className="text-sm text-muted-foreground">
                        Curriculum slots are ready for curated HSK {level.level} data.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
              <Card className="han-card rounded-xl">
                <CardContent className="space-y-4 p-5">
                  <div>
                    <p className="text-sm text-muted-foreground">Level progress</p>
                    <p className="mt-1 text-3xl font-semibold">{level.progress}%</p>
                  </div>
                  <Progress value={level.progress} className="h-2" />
                  <p className="text-sm leading-6 text-muted-foreground">
                    {level.description}
                  </p>
                  <div className="rounded-xl bg-white/70 p-3 text-sm">
                    {level.unitsCompleted} of {level.totalUnits} units completed
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
