import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HomeScreen() {
  return (
    <section>
      <div className="text-center py-12">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Welcome to TriNav</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">Your personalized dashboard powered by AI and smart progress tracking.</p>
        <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
             <Button size="lg" variant="outline">
                Learn More
            </Button>
        </div>
      </div>
    </section>
  );
}
