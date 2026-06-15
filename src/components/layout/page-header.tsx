import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="max-w-2xl">
        {eyebrow ? (
          <Badge className="mb-2 rounded-full bg-primary/12 px-2.5 py-0.5 text-[11px] font-medium text-primary hover:bg-primary/12">
            {eyebrow}
          </Badge>
        ) : null}
        <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-[1.75rem]">
          {title}
        </h1>
        <p className="mt-1.5 max-w-xl text-[13px] leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>
      ) : null}
    </header>
  );
}
