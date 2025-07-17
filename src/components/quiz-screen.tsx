
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { generateQuiz } from '@/ai/flows/generate-quiz-flow';
import type { QuizQuestion } from '@/types/quiz';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Loader2, CheckCircle, XCircle, Award, RefreshCw } from 'lucide-react';
import { Progress } from './ui/progress';

type QuizState = 'loading' | 'active' | 'finished';

export function QuizScreen() {
  const [quizState, setQuizState] = useState<QuizState>('loading');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const fetchQuiz = async () => {
    setQuizState('loading');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedOption(null);
    try {
      const quizData = await generateQuiz();
      setQuestions(quizData.questions);
      setQuizState('active');
    } catch (error) {
      console.error('Failed to generate quiz:', error);
      setQuizState('finished'); // Or some error state
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, []);

  const handleNextQuestion = () => {
    if (selectedOption) {
      const newAnswers = [...userAnswers, selectedOption];
      setUserAnswers(newAnswers);
      setSelectedOption(null);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setQuizState('finished');
      }
    }
  };
  
  const score = useMemo(() => {
    if (quizState !== 'finished') return 0;
    return userAnswers.reduce((acc, answer, index) => {
      if (questions[index] && answer === questions[index].correct_answer) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }, [quizState, userAnswers, questions]);

  const getResultMessage = () => {
      const percentage = (score / 50) * 100;
      if (score === 50) return { message: "Extraordinary! Perfect Score!", icon: <Award className="h-16 w-16 text-amber-500" />, color: 'text-amber-500' };
      if (score > 45) return { message: "Excellent Work!", icon: <Award className="h-16 w-16 text-green-500" />, color: 'text-green-500' };
      if (score >= 35) return { message: "Great Job! You've Passed.", icon: <CheckCircle className="h-16 w-16 text-primary" />, color: 'text-primary' };
      return { message: "Good effort! Keep practicing.", icon: <XCircle className="h-16 w-16 text-destructive" />, color: 'text-destructive' };
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
    const result = getResultMessage();
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className={result.color}>{result.icon}</div>
            <h2 className={`text-3xl font-bold mt-4 ${result.color}`}>{result.message}</h2>
            <p className="text-2xl font-semibold mt-2">
                Your Score: {score} / 50
            </p>
            <p className="text-muted-foreground">({((score / 50) * 100).toFixed(0)}%)</p>
            <Button onClick={fetchQuiz} className="mt-8">
                <RefreshCw className="mr-2 h-4 w-4" />
                Take Another Quiz
            </Button>
        </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex flex-col h-full p-4 md:p-6">
      <CardHeader>
        <CardTitle>Quiz Time!</CardTitle>
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
