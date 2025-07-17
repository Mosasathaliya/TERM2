
import Link from 'next/link';
import { lessons } from '@/data/lessons';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

export default function LessonsPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Explore Our Lessons</h1>
        <p className="text-lg text-muted-foreground">
          Choose a topic below to start learning English grammar, from beginner to advanced levels.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => {
          let displayExplanation: string;
          // lesson.arabic_explanation in lessons.ts is a placeholder for the card.
          // AI generates the full Arabic explanation when the lesson is viewed.
          if (typeof lesson.arabic_explanation === 'string' && lesson.arabic_explanation.length > 0) {
            displayExplanation = lesson.arabic_explanation;
            // Optionally truncate if these placeholders can be long
            if (displayExplanation.length > 150) {
                displayExplanation = displayExplanation.substring(0, 147) + "...";
            }
          } else {
            // Fallback if placeholder is missing or not a string
            displayExplanation = `Tap to learn about ${lesson.topic}. AI will generate the details.`;
          }

          return (
            <Link href={`/lessons/${lesson.lesson_id}`} key={lesson.lesson_id} className="block hover:no-underline">
              <Card className="h-full flex flex-col hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer group">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                        {lesson.title}
                      </CardTitle>
                      {lesson.title_arabic && (
                        <CardTitle
                          className="text-lg text-muted-foreground mt-1 group-hover:text-primary/80 transition-colors"
                          dir="rtl"
                        >
                          {lesson.title_arabic}
                        </CardTitle>
                      )}
                    </div>
                    <Badge
                      variant={lesson.level === 'Beginner' ? 'default' : lesson.level === 'Intermediate' ? 'outline' : 'destructive'}
                      className={`
                        ${lesson.level === 'Beginner' ? 'bg-accent text-accent-foreground' : ''}
                        ${lesson.level === 'Intermediate' ? 'border-accent text-accent-foreground' : ''}
                        ${lesson.level === 'Advanced' ? 'bg-orange-500 text-white' : ''}
                        whitespace-nowrap
                      `}
                    >
                      {lesson.level}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm text-muted-foreground">
                    {lesson.topic}
                    {lesson.topic_arabic && (
                      <span className="block mt-0.5" dir="rtl">{lesson.topic_arabic}</span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-foreground/80 line-clamp-3">
                    {displayExplanation}
                  </p>
                </CardContent>
                <CardFooter className="mt-auto pt-4">
                  <div className="flex items-center text-primary font-semibold group-hover:underline">
                    Start Lesson
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </CardFooter>
              </Card>
            </Link>
          );
        })}
      </div>
       {lessons.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No lessons available yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
