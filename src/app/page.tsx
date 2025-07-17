
"use client";

import { MainApp } from "@/components/main-app";
import { Suspense } from 'react';
import { useAuthStore } from '@/hooks/use-auth-store';
import { LoginScreen } from '@/components/auth/login-screen';

function PageContent() {
  const { user } = useAuthStore();

  if (!user) {
    return <LoginScreen />;
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
