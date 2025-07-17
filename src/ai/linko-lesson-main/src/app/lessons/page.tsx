
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
          let displayExplanation = "Tap to learn more about this topic.";
          if (typeof lesson.arabic_explanation === 'string' && lesson.arabic_explanation.length > 0 && !lesson.meta?.aiGeneratedContentRequired) {
             // Only use direct arabic_explanation if it's not meant for AI generation and not empty
            displayExplanation = lesson.arabic_explanation.substring(0, 150) + (lesson.arabic_explanation.length > 150 ? "..." : "");
          } else if (typeof lesson.topic === 'string') {
            // Fallback for AI-generated or empty descriptions
            displayExplanation = `An AI-powered lesson on ${lesson.topic}. ${lesson.meta?.englishGrammarTopic || ''}`;
            displayExplanation = displayExplanation.substring(0, 150) + (displayExplanation.length > 150 ? "..." : "");
          }


          return (
            <Link href={`/lessons/${lesson.lesson_id}`} key={lesson.lesson_id} legacyBehavior>
              <a className="block hover:no-underline">
                <Card className="h-full flex flex-col hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer group">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-2xl group-hover:text-primary transition-colors">{lesson.title}</CardTitle>
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
                    <CardDescription className="text-sm text-muted-foreground">{lesson.topic}</CardDescription>
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
              </a>
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
