
import type { FC } from 'react';
import Link from 'next/link';
import { Computer } from 'lucide-react'; // Import the Computer icon

const AppHeader: FC = () => {
  return (
    <header className="bg-card border-b shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center p-4 max-w-5xl">
        <Link href="/" className="flex items-center hover:no-underline">
          <Computer 
            className="text-primary mr-3 h-8 w-8" // Use the new primary color
            aria-hidden="true"
          />
          <h1 className="text-2xl font-bold text-foreground">Lingo Lessons</h1>
        </Link>
      </div>
    </header>
  );
};

export default AppHeader;
