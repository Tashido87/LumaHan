import { Bell, Moon, ShieldCheck, UserRound } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Settings"
        title="Private app settings"
        description="Google sign-in, profile defaults, learning preferences, AI features, TTS voice preferences, and admin configuration."
      />
      <div className="grid gap-4 xl:grid-cols-[1fr_22rem]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserRound className="size-5 text-primary" />
              Learner profile
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="display-name">Display name</Label>
              <Input id="display-name" defaultValue="Private learner" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="current-hsk">Current HSK level</Label>
              <Input id="current-hsk" defaultValue="HSK 1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="voice">Mandarin voice</Label>
              <Input id="voice" defaultValue="cmn-CN-Neural2-A" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="speed">Audio speed</Label>
              <Input id="speed" defaultValue="0.92" />
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="size-5 text-primary" />
                Learning controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                ["Daily reminder", true],
                ["AI-generated hints", true],
                ["Cache generated audio", true],
                ["Browser speech recognition", false],
              ].map(([label, enabled]) => (
                <div key={label as string} className="flex items-center justify-between gap-3">
                  <Label>{label}</Label>
                  <Switch defaultChecked={Boolean(enabled)} />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-primary" />
                Admin setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input defaultValue="admin@example.com" aria-label="Admin email" />
              <Button className="w-full rounded-full" variant="outline">
                Save admin email
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="size-5 text-primary" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-3">
              <Label>Dark mode</Label>
              <Switch />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
