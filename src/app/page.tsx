"use client";

import { useState, useEffect } from "react";
import { Sun, Moon, Home as HomeIcon, BookOpen, Bot, BarChart3 } from "lucide-react";

import { TriangularBackground } from "@/components/triangular-background";
import { HomeScreen } from "@/components/screens/home-screen";
import { BookScreen } from "@/components/screens/book-screen";
import { AiScreen } from "@/components/screens/ai-screen";
import { ProgressScreen } from "@/components/screens/progress-screen";
import { Button } from "@/components/ui/button";

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
};

function NavItem({ icon, label, isActive, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center space-y-1 w-1/4 py-2 transition-all duration-300 transform outline-none group focus:outline-none ${
        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className={`h-6 w-6 transform transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{icon}</div>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setIsDarkMode(storedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      document.documentElement.classList.toggle("dark", isDarkMode);
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode, isMounted]);

  const renderScreen = () => {
    switch (activeTab) {
      case "home": return <HomeScreen />;
      case "book": return <BookScreen />;
      case "ai": return <AiScreen />;
      case "progress": return <ProgressScreen />;
      default: return <HomeScreen />;
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-background text-foreground transition-colors duration-500">
      <TriangularBackground />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="flex justify-between items-center p-4 sm:p-6 flex-shrink-0">
          <h1 className="text-3xl font-bold text-primary tracking-tighter">TriNav</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="rounded-full text-foreground/80 hover:text-foreground hover:bg-foreground/10"
            aria-label={isDarkMode ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </header>

        <main className="px-4 sm:px-6 pb-24 flex-grow">
          <div className="animate-fade-in">
            {renderScreen()}
          </div>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 h-16 backdrop-blur-lg bg-background/50 border-t z-20">
          <div className="flex justify-around max-w-lg mx-auto h-full">
            <NavItem icon={<HomeIcon />} label="الرئيسية" isActive={activeTab === "home"} onClick={() => setActiveTab("home")} />
            <NavItem icon={<BookOpen />} label="كتبي" isActive={activeTab === "book"} onClick={() => setActiveTab("book")} />
            <NavItem icon={<Bot />} label="الذكاء الاصطناعي" isActive={activeTab === "ai"} onClick={() => setActiveTab("ai")} />
            <NavItem icon={<BarChart3 />} label="التقدم" isActive={activeTab === "progress"} onClick={() => setActiveTab("progress")} />
          </div>
        </nav>
      </div>
    </div>
  );
}
