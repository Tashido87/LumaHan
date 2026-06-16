import Link from "next/link";
import { Edit3, Filter, Pin, Plus, Search, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { notes } from "@/data/mock-learning";
import type { StudyNote } from "@/types/learning";

function NoteCard({ note }: { note: StudyNote }) {
  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="truncate text-base">{note.title}</CardTitle>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Updated {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(note.updatedAt))}
            </p>
          </div>
          {note.pinned ? (
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-orange-500/12 text-orange-600">
              <Pin className="size-4" />
            </span>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-1">
          <Badge variant="secondary" className="rounded-full text-[11px]">
            HSK {note.hskLevel}
          </Badge>
          <Badge className="rounded-full bg-primary/12 text-primary hover:bg-primary/12 text-[11px]">
            {note.linkedType}
          </Badge>
          <Badge variant="outline" className="rounded-full text-[11px]">
            {note.source}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="line-clamp-5 whitespace-pre-line text-[13px] leading-6 text-muted-foreground">
          {note.content}
        </p>
        <div className="flex flex-wrap gap-1">
          {note.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="rounded-full text-[11px]">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" className="rounded-full">
            <Link href={`/notes/${note.id}`}>
              <Edit3 className="size-4" />
              Edit
            </Link>
          </Button>
          <Button size="sm" variant="outline" className="rounded-full">
            <Trash2 className="size-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function NotesBoard() {
  return (
    <div className="grid gap-4 xl:grid-cols-[20rem_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="note-search">Search notes</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="note-search" className="pl-9" placeholder="了, HSK2, tone..." />
            </div>
          </div>
          <div className="space-y-2">
            <Label>HSK level</Label>
            <Select defaultValue="all">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All levels</SelectItem>
                <SelectItem value="1">HSK 1</SelectItem>
                <SelectItem value="2">HSK 2</SelectItem>
                <SelectItem value="3">HSK 3</SelectItem>
                <SelectItem value="4">HSK 4</SelectItem>
                <SelectItem value="5">HSK 5</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Content type</Label>
            <Select defaultValue="all">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="vocabulary">Vocabulary</SelectItem>
                <SelectItem value="grammar">Grammar</SelectItem>
                <SelectItem value="character">Character</SelectItem>
                <SelectItem value="sentence">Sentence</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full rounded-full">
            <Plus className="size-4" />
            New note
          </Button>
          <Button className="w-full rounded-full" variant="outline">
            <Filter className="size-4" />
            Pinned first
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
}

export function NoteEditor({ note }: { note: StudyNote }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_20rem]">
      <Card>
        <CardHeader>
          <CardTitle>Edit note</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="note-title">Title</Label>
            <Input id="note-title" defaultValue={note.title} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>HSK level</Label>
              <Select defaultValue={`${note.hskLevel}`}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((level) => (
                    <SelectItem key={level} value={`${level}`}>
                      HSK {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Linked type</Label>
              <Select defaultValue={note.linkedType}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vocabulary">Vocabulary</SelectItem>
                  <SelectItem value="grammar">Grammar</SelectItem>
                  <SelectItem value="character">Character</SelectItem>
                  <SelectItem value="lesson">Lesson</SelectItem>
                  <SelectItem value="sentence">Sentence</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="note-content">Content</Label>
            <Textarea
              id="note-content"
              className="min-h-80 leading-6"
              defaultValue={note.content}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note-tags">Tags</Label>
            <Input id="note-tags" defaultValue={note.tags.join(", ")} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button className="rounded-full">
              <Edit3 className="size-4" />
              Save changes
            </Button>
            <Button variant="outline" className="rounded-full">Preview</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Linked learning item</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="glass-subtle rounded-2xl p-4">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Link
            </p>
            <p className="mt-1.5 text-sm font-medium">{note.linkedType}</p>
            <p className="text-[13px] text-muted-foreground">{note.linkedId ?? "none"}</p>
          </div>
          <div className="glass-subtle rounded-2xl p-4">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Source
            </p>
            <p className="mt-1.5 text-sm font-medium">{note.source}</p>
          </div>
          <Button variant="outline" className="w-full rounded-full">
            Save AI answer as note
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
