
"use client";

import { MainApp } from "@/components/main-app";
import { Suspense } from 'react';

export const runtime = 'edge';

function PageContent() {
  return <MainApp />;
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}
