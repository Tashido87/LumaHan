"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Download,
  Eye,
  FileJson,
  GripVertical,
  Plus,
  Upload,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  adminHealthChecks,
  grammarPoints,
  lessons,
  vocabulary,
} from "@/data/mock-learning";

import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { getFirebaseDb } from "@/lib/firebase/client";
import { doc, writeBatch } from "firebase/firestore";
import seedData from "@/../data/seed/hsk-real-old-1-5.json";
import { Loader2 } from "lucide-react";

export function AdminDashboard() {
  const { profile } = useAuth();
  const [seeding, setSeeding] = useState(false);
  const [seedStatus, setSeedStatus] = useState<string | null>(null);

  const handleImportSeed = async () => {
    if (!profile || profile.role !== "admin") {
      alert("You must be signed in as an admin to seed the database.");
      return;
    }

    if (
      !confirm(
        "Are you sure you want to seed the database? This will overwrite existing HSK items with identical IDs."
      )
    ) {
      return;
    }

    setSeeding(true);
    setSeedStatus("Starting import...");

    try {
      const db = getFirebaseDb();
      const seedCollections = [
        ["hskLevels", seedData.hskLevels],
        ["units", seedData.units],
        ["lessons", seedData.lessons],
        ["vocabulary", seedData.vocabulary],
        ["characters", seedData.characters],
        ["grammarPoints", seedData.grammarPoints],
        ["exampleSentences", seedData.exampleSentences],
      ] as const;

      for (const [collectionName, items] of seedCollections) {
        for (let start = 0; start < items.length; start += 400) {
          const chunk = items.slice(start, start + 400);
          const batch = writeBatch(db);

          chunk.forEach((item) => {
            const ref = doc(db, collectionName, item.id);
            batch.set(ref, item);
          });

          setSeedStatus(
            `Importing ${collectionName}: ${Math.min(
              start + chunk.length,
              items.length
            )}/${items.length}`
          );
          await batch.commit();
        }
      }

      setSeedStatus("Successfully seeded!");
      alert(
        `Real HSK seed imported: ${seedData.vocabulary.length} vocabulary entries, ${seedData.lessons.length} lessons.`
      );
    } catch (e) {
      console.error("Seeding error:", e);
      const message = e instanceof Error ? e.message : "Unknown seed import error";
      setSeedStatus(`Error: ${message}`);
      alert(`Failed to seed: ${message}`);
    } finally {
      setSeeding(false);
    }
  };
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {adminHealthChecks.map((check) => (
          <Card key={check.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="grid size-9 place-items-center rounded-lg glass-subtle">
                  {check.severity === "ok" ? (
                    <CheckCircle2 className="size-4 text-primary" />
                  ) : (
                    <AlertTriangle className="size-4 text-orange-600" />
                  )}
                </span>
                <Badge
                  variant={check.severity === "ok" ? "secondary" : "outline"}
                  className="rounded-full text-[11px]"
                >
                  {check.count}
                </Badge>
              </div>
              <p className="mt-3 text-[13px] font-medium">{check.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_22rem]">
        <Card>
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Lesson order</CardTitle>
              <p className="mt-1 text-[13px] text-muted-foreground">
                HSK levels, units, lessons, checkpoints, and boss reviews.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" className="rounded-full">
                <Plus className="size-4" />
                New lesson
              </Button>
              <Button size="sm" variant="outline" className="rounded-full">
                <Eye className="size-4" />
                Preview
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10" />
                  <TableHead>Lesson</TableHead>
                  <TableHead>HSK</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Minutes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lessons.map((lesson) => (
                  <TableRow key={lesson.id}>
                    <TableCell>
                      <GripVertical className="size-4 text-muted-foreground" />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{lesson.title}</div>
                      <div className="text-xs text-muted-foreground">{lesson.id}</div>
                    </TableCell>
                    <TableCell>HSK {lesson.hskLevel}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="rounded-full text-[11px]">
                        {lesson.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {lesson.vocabularyIds.length} vocab · {lesson.grammarIds.length} grammar
                    </TableCell>
                    <TableCell className="text-right">{lesson.estimatedMinutes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Import / export JSON</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="glass-subtle rounded-2xl p-3 text-[13px]">
                <p className="font-medium">Real HSK 1-5 seed</p>
                <p className="mt-1 text-muted-foreground">
                  {seedData.vocabulary.length} vocabulary · {seedData.characters.length} characters ·{" "}
                  {seedData.lessons.length} lessons
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Source: Complete HSK Vocabulary, MIT license
                </p>
              </div>
              <Button
                className="w-full rounded-full"
                variant="outline"
                onClick={handleImportSeed}
                disabled={seeding}
              >
                {seeding ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Upload className="size-4" />
                )}
                {seeding ? seedStatus : "Import seed"}
              </Button>
              <Button className="w-full rounded-full" variant="outline">
                <Download className="size-4" />
                Export content
              </Button>
              <Button className="w-full rounded-full" variant="outline">
                <FileJson className="size-4" />
                Validate schema
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prompt template</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Label htmlFor="prompt-name">Name</Label>
              <Input id="prompt-name" defaultValue="generateDynamicExercises" />
              <Label htmlFor="prompt-body">Template</Label>
              <Textarea
                id="prompt-body"
                className="min-h-36"
                defaultValue="Return structured JSON. Include simplified, traditional, pinyin, English, difficulty, and related item IDs."
              />
              <Button className="w-full rounded-full">Save template</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vocabulary manager</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {vocabulary.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {item.simplified} / {item.traditional}
                  </p>
                  <p className="text-[13px] text-muted-foreground">
                    {item.pinyin} · {item.englishMeaning}
                  </p>
                </div>
                <Badge variant="secondary" className="rounded-full text-[11px]">
                  HSK {item.hskLevel}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Grammar manager</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {grammarPoints.map((point) => (
              <div key={point.id}>
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{point.title}</p>
                    <p className="text-[13px] text-muted-foreground">{point.pattern}</p>
                  </div>
                  <Badge variant="secondary" className="rounded-full text-[11px]">
                    HSK {point.hskLevel}
                  </Badge>
                </div>
                <Separator className="mt-4" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
