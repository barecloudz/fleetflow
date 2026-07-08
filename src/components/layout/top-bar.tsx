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
    <header className="flex h-14 items-center gap-3 border-b border-border px-4 bg-background/80 backdrop-blur-md sticky top-0 z-20">
      <SidebarTrigger className="text-foreground/50 hover:text-foreground" />
      <Separator orientation="vertical" className="h-5" />

      <div className="flex-1 min-w-0">
        <h1 className="font-semibold text-foreground text-sm leading-tight">{title}</h1>
        {subtitle && <p className="text-[11px] text-muted-foreground leading-tight">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        {actions}
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
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
        )}
      </div>
    </header>
  );
}
