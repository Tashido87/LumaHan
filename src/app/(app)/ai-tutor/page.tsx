import { Bot, NotebookPen, Send, Sparkles, Wand2 } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { aiMessages } from "@/data/mock-learning";

export default function AiTutorPage() {
  return (
    <>
      <PageHeader
        eyebrow="AI tutor"
        title="Ask about Chinese"
        description="AI explanations can reference curated HSK content, generate structured hints, and save clean personalized notes for later review."
      />
      <div className="grid gap-5 xl:grid-cols-[1fr_20rem]">
        <Card className="han-card rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="size-5 text-primary" />
              Tutor chat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-4">
              {aiMessages.map((message, index) => {
                const isUser = message.role === "user";
                return (
                  <div
                    key={`${message.role}-${index}`}
                    className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    {!isUser ? (
                      <Avatar className="size-9">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          AI
                        </AvatarFallback>
                      </Avatar>
                    ) : null}
                    <div
                      className={`max-w-[44rem] rounded-2xl px-4 py-3 text-sm leading-6 ${
                        isUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-white/80 text-foreground"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="space-y-3">
              <Textarea
                className="min-h-28"
                placeholder="Ask about grammar, vocabulary, characters, or a sentence."
              />
              <div className="flex flex-wrap gap-2">
                <Button>
                  <Send className="size-4" />
                  Send
                </Button>
                <Button variant="outline">
                  <NotebookPen className="size-4" />
                  Save answer as note
                </Button>
                <Button variant="outline">
                  <Wand2 className="size-4" />
                  Create practice
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="han-card rounded-xl">
          <CardHeader>
            <CardTitle>Structured AI guardrails</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "Use curated HSK data first",
              "Return JSON for app actions",
              "Label beyond-level words",
              "Mark uncertain HSK metadata as needs review",
              "Keep the app interface in English",
            ].map((guardrail) => (
              <div key={guardrail} className="flex items-start gap-3 rounded-xl bg-white/70 p-3">
                <Sparkles className="mt-0.5 size-4 text-primary" />
                <p className="text-sm leading-5 text-muted-foreground">{guardrail}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
