"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/providers/auth-provider";
import {
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  Loader2,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AuthLandingPage() {
  const { signIn, error } = useAuth();
  const router = useRouter();
  const [loggingIn, setLoggingIn] = useState(false);

  const handleLogin = async () => {
    setLoggingIn(true);
    try {
      await signIn();
      router.push("/dashboard");
    } catch (e) {
      console.error("Authentication error:", e);
      setLoggingIn(false);
    }
  };

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-background text-foreground">
      {/* Vivid aurora so the glass panels have rich color to refract. Pure CSS,
          no asset weight. */}
      <div className="aurora-layer" aria-hidden>
        <div
          className="aurora-blob size-[44rem] -left-40 -top-40"
          style={{ background: "oklch(0.82 0.14 158 / 0.7)" }}
        />
        <div
          className="aurora-blob size-[40rem] right-[-12rem] top-[6%]"
          style={{
            background: "oklch(0.8 0.12 210 / 0.55)",
            animationDelay: "-6s",
          }}
        />
        <div
          className="aurora-blob size-[42rem] left-1/3 bottom-[-18rem]"
          style={{
            background: "oklch(0.84 0.12 130 / 0.5)",
            animationDelay: "-12s",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-6xl flex-col px-5 py-5 sm:px-8 lg:px-10">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <motion.span
              whileHover={{ scale: 1.06, rotate: -3 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30"
            >
              <Sparkles className="size-4" />
            </motion.span>
            <span className="text-base font-semibold tracking-tight">
              LumaHan
            </span>
          </Link>
          <Badge className="glass-subtle rounded-full border-white/40 px-3 py-1 text-[11px] font-medium text-foreground hover:bg-white/40">
            Private study app
          </Badge>
        </nav>

        <section className="grid flex-1 content-center gap-10 py-10 lg:grid-cols-[minmax(0,1.05fr)_24rem] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <Badge className="rounded-full bg-primary/12 px-3 py-1 text-[11px] font-medium text-primary hover:bg-primary/12">
              HSK 1-5 · Simplified &amp; traditional side by side
            </Badge>
            <h1 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-6xl">
              Learn Chinese with{" "}
              <span className="han-gradient-text">clarity</span>.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
              A private HSK workspace for vocabulary, grammar, characters,
              listening, speaking, and review — with AI notes and progress
              analytics that adapt to you.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={handleLogin}
                disabled={loggingIn}
                size="lg"
                className="h-11 gap-2 rounded-full px-5 shadow-lg shadow-primary/30"
              >
                {loggingIn ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <LockKeyhole className="size-4" />
                )}
                {loggingIn ? "Connecting..." : "Continue with Google"}
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="glass-subtle h-11 gap-2 rounded-full px-5 text-foreground hover:bg-white/50"
              >
                <Link href="/learn">
                  View HSK path
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
            {error ? (
              <div className="glass-subtle mt-4 max-w-xl rounded-2xl px-4 py-3 text-sm leading-6 text-destructive">
                {error}
              </div>
            ) : null}
            <div className="mt-7 grid gap-2.5 text-[13px] text-muted-foreground sm:grid-cols-3">
              {[
                "Curated dataset first",
                "Gemini-enhanced practice",
                "Private Firebase backend",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Glass "next session" preview — the centerpiece that shows the
              material catching the aurora behind it. */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="glass rounded-[1.75rem] p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Next session
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight">
                  Weakness repair
                </h2>
              </div>
              <span className="grid size-10 place-items-center rounded-xl bg-primary/12 text-primary">
                <Sparkles className="size-5" />
              </span>
            </div>
            <div className="mt-5 grid gap-3">
              <div className="glass-subtle rounded-2xl p-4">
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Simplified
                </p>
                <p className="mt-2 text-4xl font-semibold tracking-tight">学习了</p>
              </div>
              <div className="glass-subtle rounded-2xl p-4">
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Traditional
                </p>
                <p className="mt-2 text-4xl font-semibold tracking-tight">學習了</p>
              </div>
              <div className="rounded-2xl bg-primary/12 p-4 ring-1 ring-primary/25">
                <p className="text-lg font-medium text-primary">xuéxí le</p>
                <p className="mt-0.5 text-[13px] text-muted-foreground">
                  completed studying
                </p>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
