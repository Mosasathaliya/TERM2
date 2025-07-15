"use client";

import { useState } from "react";
import { Bot, Loader2, Send } from "lucide-react";
import { askAI } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AiScreen() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setResponse("");

    try {
      const result = await askAI(input);
      if (result.error) {
        toast({
          variant: "destructive",
          title: "AI Error",
          description: result.error,
        });
      } else {
        setResponse(result.answer || "Sorry, I couldn't find an answer.");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  return (
    <section className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold tracking-tighter mb-6 text-center">Ask the AI</h2>
      <Card className="bg-card/80 backdrop-blur-sm shadow-lg">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="flex items-start gap-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question here..."
              rows={3}
              className="flex-grow bg-background/50 focus:ring-2 focus:ring-primary/50"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              <span className="sr-only">Ask AI</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading && (
         <div className="mt-6 flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Thinking...</span>
        </div>
      )}

      {response && (
        <Card className="mt-6 bg-card/80 backdrop-blur-sm animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarFallback><Bot /></AvatarFallback>
              </Avatar>
              <div className="prose prose-sm dark:prose-invert max-w-none pt-1">
                 <p>{response}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
