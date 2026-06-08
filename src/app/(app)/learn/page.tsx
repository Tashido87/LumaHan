import { PageHeader } from "@/components/layout/page-header";
import { LessonMap } from "@/components/learning/lesson-map";

export default function LearnPage() {
  return (
    <>
      <PageHeader
        eyebrow="HSK learning path"
        title="HSK 1 to HSK 5 path"
        description="Move through curated units, checkpoint lessons, boss reviews, and unlocks while keeping simplified and traditional forms visible throughout the curriculum."
      />
      <LessonMap />
    </>
  );
}
