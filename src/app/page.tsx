
"use client";

import { MainApp } from "@/components/main-app";
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import LessonPage from './lessons/[lesson_id]/page';

function PageContent() {
  const searchParams = useSearchParams();
  const lessonId = searchParams.get('lesson_id');

  if (lessonId) {
    return <LessonPage params={{ lesson_id: lessonId }} />;
  }
  
  return <MainApp />;
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}
