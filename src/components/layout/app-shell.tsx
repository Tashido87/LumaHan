"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Bot,
  Brain,
  CalendarCheck,
  ChevronRight,
  Headphones,
  Home,
  Library,
  Menu,
  Mic,
  NotebookPen,
  PanelsTopLeft,
  Route,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Type,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";

const primaryNav = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/learn", label: "HSK Path", icon: Route },
  { href: "/lesson/hsk1-hello", label: "Lesson", icon: BookOpen },
  { href: "/practice", label: "Practice", icon: Brain },
  { href: "/review", label: "Review", icon: Star },
  { href: "/listening", label: "Listening", icon: Headphones },
  { href: "/speaking", label: "Speaking", icon: Mic },
  { href: "/characters/char-xue", label: "Characters", icon: Type },
  { href: "/grammar", label: "Grammar", icon: Library },
  { href: "/vocabulary", label: "Vocabulary", icon: PanelsTopLeft },
  { href: "/notes", label: "Notes", icon: NotebookPen },
  { href: "/ai-tutor", label: "AI Tutor", icon: Bot },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/daily-challenge", label: "Daily Challenge", icon: CalendarCheck },
  { href: "/admin", label: "Admin", icon: ShieldCheck },
  { href: "/settings", label: "Settings", icon: Settings },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  if (href.includes("/lesson/")) {
    return pathname.startsWith("/lesson/");
  }

  if (href.includes("/characters/")) {
    return pathname.startsWith("/characters/");
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavContent({ pathname }: { pathname: string }) {
  const { profile } = useAuth();

  const displayName = (profile?.displayName as string) || "Private learner";
  const streak = profile?.streakCount || 0;
  const xp = profile?.xp || 0;
  // Progress value from 0 to 100 based on HSK level completion (fallback calculation)
  const progressValue = profile ? Math.min(100, Math.max(10, (xp % 500) / 5)) : 74;
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "PL";

  return (
    <div className="flex h-full flex-col gap-5">
      <Link href="/dashboard" className="flex items-center gap-3 px-1">
        <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Sparkles className="size-5" />
        </span>
        <span className="min-w-0">
          <span className="block text-lg font-semibold leading-none">LumaHan</span>
          <span className="mt-1 block text-xs text-muted-foreground">
            Private HSK studio
          </span>
        </span>
      </Link>

      <div className="han-surface rounded-xl p-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-10 border border-white/80">
            {profile?.photoURL && (
              <AvatarImage src={profile.photoURL} alt={displayName} />
            )}
            <AvatarFallback className="bg-primary/12 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-medium">{displayName}</p>
              <Badge className="rounded-md bg-amber-100 text-amber-700 hover:bg-amber-100">
                {streak}d
              </Badge>
            </div>
            <Progress value={progressValue} className="mt-2 h-1.5" />
          </div>
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1 pr-2">
        <nav className="grid gap-1">
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);

            return (
              <Button
                key={item.href}
                asChild
                variant={active ? "secondary" : "ghost"}
                className={cn(
                  "h-10 justify-start gap-3 rounded-lg px-3",
                  active &&
                    "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                )}
              >
                <Link href={item.href}>
                  <Icon className="size-4" />
                  <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
                  {active ? <ChevronRight className="size-4 opacity-60" /> : null}
                </Link>
              </Button>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 hidden w-[18rem] border-r border-sidebar-border/80 bg-sidebar/90 p-4 backdrop-blur-xl xl:block">
        <NavContent pathname={pathname} />
      </aside>

      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/82 backdrop-blur-xl xl:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </span>
            LumaHan
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" aria-label="Open navigation">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[19rem] bg-sidebar p-4">
              <SheetHeader className="sr-only">
                <SheetTitle>LumaHan navigation</SheetTitle>
                <SheetDescription>
                  Primary navigation links for the private Chinese learning app.
                </SheetDescription>
              </SheetHeader>
              <NavContent pathname={pathname} />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="px-4 py-6 sm:px-6 lg:px-8 xl:ml-[18rem] xl:px-10 xl:py-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">{children}</div>
      </main>
    </div>
  );
}
