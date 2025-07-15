"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function ProgressScreen() {
  const [progress, setProgress] = useState(20);
  const totalItems = 20;

  useEffect(() => {
    if (progress >= 70) return; // Stop at 70% as an example
    const timer = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.floor(Math.random() * 5) + 1, 70));
    }, 2000);

    return () => clearInterval(timer);
  }, [progress]);

  const completedItems = Math.round((progress / 100) * totalItems);

  return (
    <section className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold tracking-tighter mb-6 text-center">Learning Progress</h2>
      <Card className="bg-card/80 backdrop-blur-sm shadow-lg">
        <CardContent className="p-6">
          <div className="mb-4">
            <div className="flex justify-between mb-2 font-medium">
              <span>Overall Progress</span>
              <span className="text-primary">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3 [&>*]:bg-primary" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <Card className="bg-secondary/50">
                <CardHeader>
                    <CardTitle className="text-sm uppercase font-semibold text-muted-foreground">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold">{completedItems} <span className="text-lg text-muted-foreground">/ {totalItems}</span></p>
                </CardContent>
            </Card>
            <Card className="bg-secondary/50">
                <CardHeader>
                    <CardTitle className="text-sm uppercase font-semibold text-muted-foreground">Pending</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold">{totalItems - completedItems}</p>
                </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
