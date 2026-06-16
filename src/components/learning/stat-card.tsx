import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: ReactNode;
  /**
   * Kept for API compatibility. Most metrics share a calm neutral treatment so
   * color stays calm; only "amber" (streak / heat) gets a warm tint, since it
   * carries genuine meaning.
   */
  tone?: "green" | "blue" | "violet" | "amber" | "rose";
};

const iconTone = {
  green: "bg-primary/12 text-primary",
  blue: "bg-primary/12 text-primary",
  violet: "bg-primary/12 text-primary",
  amber: "bg-orange-500/12 text-orange-600",
  rose: "bg-primary/12 text-primary",
};

export function StatCard({
  label,
  value,
  detail,
  icon,
  tone = "green",
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-2 p-3">
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 text-lg font-semibold tracking-tight">{value}</p>
          <p className="text-[10px] text-muted-foreground">{detail}</p>
        </div>
        <span
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-lg",
            iconTone[tone]
          )}
        >
          {icon}
        </span>
      </CardContent>
    </Card>
  );
}
