import { Plus } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { NotesBoard } from "@/components/notes/notes-board";
import { Button } from "@/components/ui/button";

export default function NotesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Notes app"
        title="Private study notes"
        description="Create, edit, search, tag, pin, and link notes to vocabulary, grammar, characters, lessons, sentences, or AI tutor answers."
        actions={
          <Button>
            <Plus className="size-4" />
            New note
          </Button>
        }
      />
      <NotesBoard />
    </>
  );
}
