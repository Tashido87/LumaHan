import { NotebookPen } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { NoteEditor } from "@/components/notes/notes-board";
import { Button } from "@/components/ui/button";
import { getNoteById, notes } from "@/data/mock-learning";

export function generateStaticParams() {
  return notes.map((note) => ({ noteId: note.id }));
}

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const { noteId } = await params;
  const note = getNoteById(noteId);

  return (
    <>
      <PageHeader
        eyebrow="Note editor"
        title={note.title}
        description="Markdown-like content, tags, HSK level, linked content, pinned state, source, and last-updated metadata."
        actions={
          <Button variant="outline">
            <NotebookPen className="size-4" />
            Save as template
          </Button>
        }
      />
      <NoteEditor note={note} />
    </>
  );
}
