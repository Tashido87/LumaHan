import { PageHeader } from "@/components/layout/page-header";
import { ExerciseShowcase } from "@/components/practice/exercise-showcase";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles } from "lucide-react";

export default function PracticePage() {
  return (
    <>
      <PageHeader
        eyebrow="Practice mode"
        title="Mixed HSK practice"
        description="Work through multiple choice, matching, fill-in-the-blank, ordering, typing, listening, speaking, and grammar correction exercise families."
        actions={
          <>
            <Button variant="outline">
              <Sparkles className="size-4" />
              Generate set
            </Button>
            <Button>
              <Brain className="size-4" />
              Start session
            </Button>
          </>
        }
      />
      <ExerciseShowcase />
    </>
  );
}
