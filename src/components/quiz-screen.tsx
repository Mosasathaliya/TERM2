
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { generateQuiz } from '@/ai/flows/generate-quiz-flow';
import type { QuizQuestion } from '@/types/quiz';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Loader2, CheckCircle, XCircle, Award, RefreshCw } from 'lucide-react';
import { Progress } from './ui/progress';
import { useProgressStore } from '@/hooks/use-progress-store';
import { useToast } from '@/hooks/use-toast';

type QuizState = 'loading' | 'active' | 'finished';

const QUIZ_LENGTH = 20;
const MAX_RETRIES = 2;

export function QuizScreen() {
  const [quizState, setQuizState] = useState<QuizState>('loading');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const { setFinalExamPassed } = useProgressStore();
  const { toast } = useToast();

  const fetchQuiz = useCallback(async (retries = MAX_RETRIES) => {
    setQuizState('loading');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedOption(null);

    try {
      const quizData = await generateQuiz();
      if (quizData && quizData.questions.length > 0) {
        setQuestions(quizData.questions);
        setQuizState('active');
      } else {
        if (retries > 0) {
          console.warn(`Quiz generation failed, retrying... (${retries} retries left)`);
          setTimeout(() => fetchQuiz(retries - 1), 1000); // Wait 1 sec before retrying
        } else {
            toast({
                variant: "destructive",
                title: "Quiz Generation Failed",
                description: "The AI could not create questions after multiple attempts. Please try again later.",
            });
            setQuizState('finished'); // Go to finished state to show error/retry
        }
      }
    } catch (error) {
       if (retries > 0) {
          console.warn(`Quiz generation failed with error, retrying... (${retries} retries left)`, error);
          setTimeout(() => fetchQuiz(retries - 1), 1000);
       } else {
            console.error('Failed to generate quiz after multiple retries:', error);
            toast({
                variant: "destructive",
                title: "Quiz Generation Failed",
                description: "There was a problem creating your quiz. Please try again later.",
            });
            setQuizState('finished'); // Go to finished state to show error/retry
       }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  const handleNextQuestion = () => {
    if (selectedOption) {
      const newAnswers = [...userAnswers, selectedOption];
      setUserAnswers(newAnswers);
      setSelectedOption(null);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // This is the last question, so we calculate score and finish
        const finalAnswers = [...newAnswers];
        const finalScore = finalAnswers.reduce((acc, answer, index) => {
            if (questions[index] && answer === questions[index].correct_answer) {
                return acc + 1;
            }
            return acc;
        }, 0);
        
        const passed = finalScore / QUIZ_LENGTH >= 0.7;
        setFinalExamPassed(passed);
        
        if (passed) {
            toast({
                title: "Quiz Passed!",
                description: `You scored ${finalScore}/${QUIZ_LENGTH}. You can now generate your certificate!`,
                className: "bg-green-100 dark:bg-green-900",
            });
        } else {
             toast({
                variant: "destructive",
                title: "Quiz Failed",
                description: `You scored ${finalScore}/${QUIZ_LENGTH}. You need at least 70% to pass.`,
            });
        }
        
        setQuizState('finished');
      }
    }
  };
  
  const score = useMemo(() => {
    // Only calculate score when the quiz is finished
    if (quizState !== 'finished') return 0;
    return userAnswers.reduce((acc, answer, index) => {
      if (questions[index] && answer === questions[index].correct_answer) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }, [quizState, userAnswers, questions]);

  const getResultMessage = () => {
      const percentage = (score / (questions.length || QUIZ_LENGTH)) * 100;
      if (percentage >= 70) return { message: `Congratulations! You Passed!`, icon: <Award className="h-16 w-16 text-amber-500" />, color: 'text-amber-500' };
      return { message: "Good effort! Keep studying and try again.", icon: <XCircle className="h-16 w-16 text-destructive" />, color: 'text-destructive' };
  };

  if (quizState === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-2xl font-bold">Generating Your Quiz...</h2>
        <p className="text-muted-foreground">Our AI is preparing your questions. This may take a moment.</p>
      </div>
    );
  }

  if (quizState === 'finished') {
    // Check if there were any questions to score, otherwise show a generation failed message
    if (questions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <XCircle className="h-16 w-16 text-destructive" />
                <h2 className="text-3xl font-bold mt-4 text-destructive">Quiz Generation Failed</h2>
                <p className="text-muted-foreground mt-2">
                    We couldn't create the quiz at this moment. Please try again.
                </p>
                <Button onClick={() => fetchQuiz()} className="mt-8">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                </Button>
            </div>
        );
    }
    const result = getResultMessage();
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className={result.color}>{result.icon}</div>
            <h2 className={`text-3xl font-bold mt-4 ${result.color}`}>{result.message}</h2>
            <p className="text-2xl font-semibold mt-2">
                Your Score: {score} / {questions.length}
            </p>
            <p className="text-muted-foreground">({((score / questions.length) * 100).toFixed(0)}%)</p>
            <Button onClick={() => fetchQuiz()} className="mt-8">
                <RefreshCw className="mr-2 h-4 w-4" />
                Take Another Quiz
            </Button>
        </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return null; // Don't render anything if the question isn't loaded yet
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-6">
      <CardHeader>
        <CardTitle>Final Exam</CardTitle>
        <CardDescription>Question {currentQuestionIndex + 1} of {questions.length}</CardDescription>
        <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="w-full mt-2" />
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-center">
        <h3 className="text-xl md:text-2xl font-semibold text-center mb-8">{currentQuestion.question}</h3>
        <RadioGroup value={selectedOption ?? ''} onValueChange={setSelectedOption} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, index) => (
            <div key={index}>
              <RadioGroupItem value={option} id={`option-${index}`} className="sr-only" />
              <Label 
                htmlFor={`option-${index}`}
                className={`flex items-center justify-center text-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedOption === option
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="justify-end">
        <Button onClick={handleNextQuestion} disabled={!selectedOption}>
          {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
        </Button>
      </CardFooter>
    </div>
  );
}
