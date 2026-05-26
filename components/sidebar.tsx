"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Dog,
  CalendarCheck,
  DollarSign,
  Scissors,
  Tag,
  Bell,
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "dogs", label: "Cães", icon: Dog },
  { id: "presence", label: "Presença", icon: CalendarCheck },
  { id: "financial", label: "Financeiro", icon: DollarSign },
  { id: "grooming", label: "Banho & Tosa", icon: Scissors },
  { id: "services", label: "Serviços & Preços", icon: Tag },
  { id: "alerts", label: "Alertas", icon: Bell },
];

export function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-white/10">
          <Image
            src="/dogworld.jpg"
            alt="DogWorld"
            width={48}
            height={48}
            className="size-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">DogWorld</h1>
          <p className="text-xs text-white/70">Bem-estar é aqui!</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4">
        <ul className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-all",
                    isActive
                      ? "bg-white text-primary"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className="size-5" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom decoration with dog illustration placeholder */}
      <div className="relative mx-4 mb-4 overflow-hidden rounded-xl bg-white/5 p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-14 items-center justify-center rounded-full bg-amber-100">
            <Dog className="size-8 text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Dica do dia</h3>
            <p className="mt-1 text-xs leading-relaxed text-white/70">
              Hidratação e carinho fazem o dia do seu cão muito melhor!
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
