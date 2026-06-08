"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import {
  ArrowRight,
  BookOpenText,
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
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <Image
        src="/images/lumahan-hero.png"
        alt="Illustration of a private Chinese learning workspace"
        fill
        unoptimized
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/88 via-slate-900/36 to-slate-950/8" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/92 via-transparent to-slate-950/18" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-10">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-white/12 text-white ring-1 ring-white/18 backdrop-blur">
              <Sparkles className="size-5" />
            </span>
            <span className="text-lg font-semibold">LumaHan</span>
          </Link>
          <Badge className="rounded-md bg-white/12 text-white ring-1 ring-white/18 hover:bg-white/12">
            Private study app
          </Badge>
        </nav>

        <section className="grid flex-1 content-center gap-8 py-12 lg:grid-cols-[minmax(0,0.92fr)_26rem] lg:items-center">
          <div className="max-w-3xl">
            <Badge className="rounded-md bg-emerald-400/18 text-emerald-100 ring-1 ring-emerald-300/25 hover:bg-emerald-400/18">
              HSK 1-5 · Simplified and traditional side by side
            </Badge>
            <h1 className="mt-5 text-5xl font-semibold tracking-normal text-balance sm:text-6xl lg:text-7xl">
              LumaHan
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/78">
              A private Chinese learning workspace for vocabulary, grammar,
              characters, listening, speaking, typing, review, AI notes, and
              progress analytics.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={handleLogin}
                disabled={loggingIn}
                size="lg"
                className="h-11 bg-white text-slate-950 hover:bg-white/90"
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
                variant="outline"
                className="h-11 border-white/25 bg-white/8 text-white hover:bg-white/14 hover:text-white"
              >
                <Link href="/learn">
                  View HSK path
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
            {error ? (
              <div className="mt-4 max-w-2xl rounded-xl border border-rose-300/40 bg-rose-500/18 px-4 py-3 text-sm leading-6 text-rose-50">
                {error}
              </div>
            ) : null}
            <div className="mt-8 grid gap-3 text-sm text-white/82 sm:grid-cols-3">
              {[
                "Curated dataset first",
                "Gemini-enhanced practice",
                "Private Firebase backend",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-300" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="han-surface rounded-2xl border-white/24 bg-slate-950/34 p-5 text-white shadow-2xl shadow-slate-950/25">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-white/62">Next session</p>
                <h2 className="mt-1 text-2xl font-semibold">Weakness repair</h2>
              </div>
              <BookOpenText className="size-7 text-emerald-200" />
            </div>
            <div className="mt-5 grid gap-3">
              <div className="rounded-xl bg-white/18 p-4 ring-1 ring-white/16">
                <p className="text-xs uppercase text-white/55">Simplified</p>
                <p className="mt-2 text-5xl font-semibold">学习了</p>
              </div>
              <div className="rounded-xl bg-white/18 p-4 ring-1 ring-white/16">
                <p className="text-xs uppercase text-white/55">Traditional</p>
                <p className="mt-2 text-5xl font-semibold">學習了</p>
              </div>
              <div className="rounded-xl bg-emerald-300/16 p-4 ring-1 ring-emerald-200/18">
                <p className="text-lg font-medium text-emerald-100">xuéxí le</p>
                <p className="mt-1 text-sm text-white/70">completed studying</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
