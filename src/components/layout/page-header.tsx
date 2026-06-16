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
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="min-w-0 flex-1">
        {eyebrow ? (
          <Badge className="mb-1.5 rounded-full bg-primary/12 px-2 py-0 text-[10px] font-medium text-primary hover:bg-primary/12">
            {eyebrow}
          </Badge>
        ) : null}
        <h1 className="text-xl font-semibold tracking-tight text-balance sm:text-2xl">
          {title}
        </h1>
        <p className="mt-1 max-w-2xl text-[12.5px] leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap gap-1.5">{actions}</div>
      ) : null}
    </header>
  );
}
