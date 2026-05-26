"use client";

import { Bell, Plus, Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";

interface HeaderProps {
  alertCount: number;
  onNewCheckIn: () => void;
}

export function Header({ alertCount, onNewCheckIn }: HeaderProps) {
  const { user, logout } = useAuth();

  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() ?? "?";

  return (
    <header className="fixed left-0 right-0 top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-border bg-card px-3 py-2 sm:px-6 lg:left-64">
      {/* Search */}
      <div className="relative hidden w-full max-w-96 md:block">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar cães, tutores, serviços..."
          className="pl-10"
        />
      </div>

      {/* Actions */}
      <div className="ml-auto flex min-w-0 items-center gap-2 sm:gap-4">
        <Button onClick={onNewCheckIn} className="gap-2 px-3 sm:px-4">
          <Plus className="size-4" />
          <span className="hidden sm:inline">Novo Check-in</span>
          <span className="sm:hidden">Check-in</span>
        </Button>

        {/* Notifications */}
        <button className="relative rounded-full p-2 hover:bg-muted">
          <Bell className="size-5 text-muted-foreground" />
          {alertCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 flex size-5 items-center justify-center p-0 text-xs"
            >
              {alertCount}
            </Badge>
          )}
        </button>

        {/* User Profile */}
        <div className="flex min-w-0 items-center gap-3 rounded-lg px-1 py-2 sm:px-3">
          <Avatar className="size-9">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden min-w-0 text-left md:block">
            <p className="truncate text-sm font-medium">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        {/* Logout */}
        <Button
          variant="ghost"
          size="icon"
          onClick={logout}
          title="Sair"
          className="text-muted-foreground hover:text-destructive"
        >
          <LogOut className="size-5" />
        </Button>
      </div>
    </header>
  );
}
