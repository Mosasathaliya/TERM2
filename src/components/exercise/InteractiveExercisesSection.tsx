
import type { FC } from 'react';
import type { InteractiveExercise, Lesson } from '@/types/lesson';
import MultipleChoiceExercise from './MultipleChoiceExercise';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircleQuestion } from 'lucide-react'; // Or other suitable icon

interface InteractiveExercisesSectionProps {
  exercises: InteractiveExercise[];
  lesson: Lesson; // Pass the full lesson context for AI
}

const InteractiveExercisesSection: FC<InteractiveExercisesSectionProps> = ({ exercises, lesson }) => {
  if (!exercises || exercises.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <MessageCircleQuestion className="mr-2 h-6 w-6 text-primary" />
          Interactive Exercises (تمارين تفاعلية)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {exercises.map((exercise, index) => {
          if (exercise.type === 'multiple_choice') {
            return <MultipleChoiceExercise key={index} exercise={exercise} lesson={lesson} />;
          }
          // Add other exercise types here if needed
          return <p key={index}>Unsupported exercise type: {exercise.type}</p>;
        })}
      </CardContent>
    </Card>
  );
};

export default InteractiveExercisesSection;
