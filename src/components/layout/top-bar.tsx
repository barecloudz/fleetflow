"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Bell, Search, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface TopBarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function TopBar({ title, subtitle, actions }: TopBarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const isDark = theme === "dark";

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-20">
      {/* Main row */}
      <div className="flex h-14 items-center gap-3 px-4">
        <SidebarTrigger className="text-foreground/50 hover:text-foreground shrink-0" />
        <Separator orientation="vertical" className="h-5 shrink-0" />

        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-foreground text-sm leading-tight truncate">{title}</h1>
          {subtitle && <p className="text-[11px] text-muted-foreground leading-tight hidden sm:block">{subtitle}</p>}
        </div>

        {/* Desktop actions */}
        {actions && <div className="hidden sm:flex items-center">{actions}</div>}

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="size-8 text-foreground/50 hover:text-foreground">
            <Search className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-8 text-foreground/50 hover:text-foreground relative">
            <Bell className="size-4" />
            <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary" />
          </Button>
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-foreground/50 hover:text-foreground"
              onClick={() => setTheme(isDark ? "light" : "dark")}
            >
              {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile actions row */}
      {actions && (
        <div className="flex sm:hidden items-center gap-2 px-4 pb-2">
          {actions}
        </div>
      )}
    </header>
  );
}
