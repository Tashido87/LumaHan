"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Bot,
  Brain,
  CalendarCheck,
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
import { motion } from "framer-motion";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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

type NavItem = {
  href: string;
  label: string;
  icon: typeof Home;
};

const primaryNav: NavItem[] = [
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

function AuroraBackdrop() {
  return (
    <div className="aurora-layer" aria-hidden>
      <div
        className="aurora-blob size-[42rem] -left-40 -top-32"
        style={{ background: "oklch(0.82 0.14 158 / 0.55)" }}
      />
      <div
        className="aurora-blob size-[38rem] right-[-10rem] top-[8%]"
        style={{
          background: "oklch(0.8 0.12 210 / 0.42)",
          animationDelay: "-6s",
        }}
      />
      <div
        className="aurora-blob size-[40rem] left-1/3 bottom-[-16rem]"
        style={{
          background: "oklch(0.84 0.12 130 / 0.4)",
          animationDelay: "-12s",
        }}
      />
    </div>
  );
}

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-2.5"
      aria-label="LumaHan home"
    >
      <motion.span
        whileHover={{ scale: 1.06, rotate: -3 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30"
      >
        <Sparkles className="size-4" />
      </motion.span>
      {!compact && (
        <span className="min-w-0">
          <span className="block text-sm font-semibold leading-none tracking-tight">
            LumaHan
          </span>
          <span className="mt-1 block text-[10px] uppercase tracking-wider text-muted-foreground">
            HSK studio
          </span>
        </span>
      )}
    </Link>
  );
}

function ProfileChip({ className }: { className?: string }) {
  const { profile } = useAuth();

  const displayName = (profile?.displayName as string) || "Private learner";
  const streak = profile?.streakCount || 0;
  const xp = profile?.xp || 0;
  const progressValue = profile
    ? Math.min(100, Math.max(10, (xp % 500) / 5))
    : 74;
  const initials =
    displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "PL";

  return (
    <div className={cn("glass-subtle rounded-2xl p-3", className)}>
      <div className="flex items-center gap-3">
        <Avatar className="size-9 border border-white/70">
          {profile?.photoURL && (
            <AvatarImage src={profile.photoURL} alt={displayName} />
          )}
          <AvatarFallback className="bg-primary/12 text-[11px] font-semibold text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-xs font-medium">{displayName}</p>
            <Badge className="rounded-md bg-primary/12 px-1.5 py-0 text-[10px] font-semibold text-primary hover:bg-primary/12">
              {streak}d
            </Badge>
          </div>
          <Progress value={progressValue} className="mt-2 h-1" />
        </div>
      </div>
    </div>
  );
}

/**
 * Floating glass icon rail for desktop. Collapsed (icon-only) by default with a
 * hover-expanding panel that reveals labels — keeps the chrome compact while
 * staying discoverable. The active item gets a glowing glass pill behind it.
 */
function FloatingRail({ pathname }: { pathname: string }) {
  return (
    <div className="group/rail fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 xl:flex">
      <div className="glass mb-2 flex w-[3.75rem] flex-col items-center gap-1 rounded-3xl p-2 transition-[width] duration-300 ease-out group-hover/rail:w-[14rem]">
        <div className="flex h-[3.75rem] items-center px-1">
          <BrandMark />
        </div>
        <ProfileChip className="hidden group-hover/rail:flex" />
        <ScrollRailItems pathname={pathname} />
      </div>
    </div>
  );
}

function ScrollRailItems({ pathname }: { pathname: string }) {
  return (
    <nav className="mt-1 flex max-h-[60vh] min-h-0 flex-col gap-0.5 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {primaryNav.map((item) => {
        const Icon = item.icon;
        const active = isActive(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex h-11 items-center gap-3 rounded-xl px-2.5 text-sm transition-colors",
              active
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {active && (
              <motion.span
                layoutId="rail-active"
                className="glass-pill absolute inset-0 rounded-xl"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <Icon className="relative z-10 size-[18px] shrink-0" />
            <span className="relative z-10 hidden min-w-0 flex-1 truncate text-left group-hover/rail:inline">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

function MobileTopBar({ pathname }: { pathname: string }) {
  return (
    <header className="glass-subtle sticky top-0 z-40 border-b border-white/30 xl:hidden">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <BrandMark />
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label="Open navigation"
              className="glass-subtle"
            >
              <Menu className="size-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[18rem] border-white/20 bg-transparent p-4 backdrop-blur-2xl">
            <SheetHeader className="sr-only">
              <SheetTitle>LumaHan navigation</SheetTitle>
              <SheetDescription>
                Primary navigation links for the private Chinese learning app.
              </SheetDescription>
            </SheetHeader>
            <div className="flex h-full flex-col gap-4">
              <div className="flex items-center justify-between px-1">
                <BrandMark />
              </div>
              <ProfileChip />
              <nav className="grid gap-1 overflow-y-auto pr-1">
                {primaryNav.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex h-10 items-center gap-3 rounded-xl px-3 text-sm",
                        active
                          ? "glass-pill text-primary-foreground"
                          : "text-muted-foreground hover:bg-white/40 hover:text-foreground"
                      )}
                    >
                      <Icon className="size-4" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-[100dvh]">
      <AuroraBackdrop />
      <FloatingRail pathname={pathname} />
      <MobileTopBar pathname={pathname} />

      <main className="px-4 pb-10 pt-5 sm:px-6 xl:pl-[8.5rem] xl:pr-6">
        {/* Narrower, more focused content column for a compact-aesthetic feel. */}
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex w-full max-w-3xl flex-col gap-5"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}

/* ProfileChip is reused in the rail's expanded state; keep it tolerant of a
   passing className even though the desktop layout hides it until hover. */
