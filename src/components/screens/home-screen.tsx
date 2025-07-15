import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function HomeScreen() {
  return (
    <section>
      <div className="text-center py-12">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">مرحباً بك في TriNav</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">لوحة التحكم المخصصة لك، مدعومة بالذكاء الاصطناعي وتتبع التقدم الذكي.</p>
        <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                ابدأ الآن
                <ArrowLeft className="mr-2 h-4 w-4" />
            </Button>
             <Button size="lg" variant="outline">
                اعرف المزيد
            </Button>
        </div>
      </div>
    </section>
  );
}
