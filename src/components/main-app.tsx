/**
 * @fileoverview Main application component that orchestrates the layout, navigation, and screens.
 */
"use client";

import { useState } from "react";
import { Home, Book, Bot, BarChart } from "lucide-react";

type ActiveTab = "home" | "book" | "ai" | "progress";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function NavItem({ icon, label, isActive, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center space-y-1 px-4 py-1 transition-all transform hover:scale-110 ${
        isActive ? "text-primary scale-110 font-bold" : "text-muted-foreground"
      }`}
    >
      <span className="transform transition-transform">{icon}</span>
      <span className="text-xs">{label}</span>
    </button>
  );
}

export function MainApp() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 relative overflow-hidden">
      <nav className="fixed bottom-0 left-0 right-0 backdrop-blur-lg bg-background/70 border-t border-border/50 z-10">
        <div className="flex justify-around py-3">
          <NavItem icon={<Home />} label="الرئيسية" isActive={activeTab === "home"} onClick={() => setActiveTab("home")} />
          <NavItem icon={<Book />} label="المكتبة" isActive={activeTab === "book"} onClick={() => setActiveTab("book")} />
          <NavItem icon={<Bot />} label="الذكاء الاصطناعي" isActive={activeTab === "ai"} onClick={() => setActiveTab("ai")} />
          <NavItem icon={<BarChart />} label="التقدم" isActive={activeTab === "progress"} onClick={() => setActiveTab("progress")} />
        </div>
      </nav>
    </div>
  );
}
