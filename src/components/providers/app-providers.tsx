"use client";

import { useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./auth-provider";
import { getFirebaseAnalytics, hasFirebaseConfig } from "@/lib/firebase/client";

function AnalyticsBootstrap() {
  useEffect(() => {
    if (!hasFirebaseConfig()) return;
    void getFirebaseAnalytics();
  }, []);

  return null;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AnalyticsBootstrap />
      <TooltipProvider delayDuration={180}>{children}</TooltipProvider>
    </AuthProvider>
  );
}
