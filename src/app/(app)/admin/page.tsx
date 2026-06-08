import { ShieldCheck } from "lucide-react";

import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admin dashboard"
        title="Curriculum management"
        description="Manage HSK levels, units, lessons, vocabulary, characters, grammar, sentences, stroke-order references, exercises, prompt templates, and content validation."
        actions={
          <Button>
            <ShieldCheck className="size-4" />
            Admin mode
          </Button>
        }
      />
      <AdminDashboard />
    </>
  );
}
