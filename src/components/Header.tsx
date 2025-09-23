"use client";

import React from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Hamburger,
  LayoutTemplate,
  PanelLeft,
  PanelRight,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type NavItem = {
  label: string;
  href: string;
  ariaLabel: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", ariaLabel: "Go to Home" },
  { label: "Components", href: "/components", ariaLabel: "Browse Components" },
  { label: "Projects", href: "/projects", ariaLabel: "View Projects" },
  { label: "About", href: "/about", ariaLabel: "About Atal Idea Generator" },
];

type HeaderProps = {
  className?: string;
  style?: React.CSSProperties;
  isAuthenticated?: boolean;
  userName?: string;
  userEmail?: string;
  userAvatarUrl?: string;
  onSignIn?: () => void;
  onSignOut?: () => void;
};

function useDarkMode() {
  const [isDark, setIsDark] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    // Initialize from localStorage or system preference
    const stored = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const shouldDark = stored ? stored === "dark" : prefersDark;
    setIsDark(shouldDark);
    document.documentElement.classList.toggle("dark", shouldDark);
  }, []);

  const toggle = React.useCallback(() => {
    if (typeof window === "undefined") return;
    setIsDark((prev) => {
      const next = !(prev ?? false);
      document.documentElement.classList.toggle("dark", next);
      window.localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  }, []);

  return { isDark, toggle };
}

function BrandMark() {
  return (
    <div className="relative inline-flex items-center gap-2" aria-label="Atal Idea Generator">
      <div className="relative h-8 w-8 rounded-md bg-accent ring-1 ring-inset ring-border flex items-center justify-center">
        {/* Circuit-inspired emblem */}
        <div className="absolute inset-0">
          <span className="absolute left-1 top-1 h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="absolute right-1 bottom-1 h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="absolute left-1/2 top-0 h-1.5 w-0.5 -translate-x-1/2 bg-primary/60 rounded-sm" />
          <span className="absolute left-0 top-1/2 h-0.5 w-1.5 -translate-y-1/2 bg-primary/60 rounded-sm" />
          <span className="absolute right-0 top-1/2 h-0.5 w-1.5 -translate-y-1/2 bg-primary/60 rounded-sm" />
          <span className="absolute left-1/2 bottom-0 h-1.5 w-0.5 -translate-x-1/2 bg-primary/60 rounded-sm" />
        </div>
        <LayoutTemplate className="h-4 w-4 text-accent-foreground" aria-hidden="true" />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold tracking-tight text-foreground">Atal Idea Generator</span>
        <span className="text-[10px] text-muted-foreground">STEM Projects with AI</span>
      </div>
    </div>
  );
}

function ThemeToggle({
  isDark,
  onToggle,
}: {
  isDark: boolean | null;
  onToggle: () => void;
}) {
  const pressed = !!isDark;
  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      aria-pressed={pressed}
      onClick={onToggle}
      className={cn(
        "group relative inline-flex h-9 w-16 items-center rounded-full",
        "bg-secondary transition-colors duration-300",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "ring-offset-background"
      )}
    >
      <span
        className={cn(
          "absolute inset-0 rounded-full",
          "after:absolute after:inset-0 after:rounded-full after:transition-opacity after:duration-300",
          "after:opacity-0 group-hover:after:opacity-100",
          "after:bg-muted/60"
        )}
        aria-hidden="true"
      />
      <span
        className={cn(
          "relative z-10 ml-1 flex h-7 w-7 items-center justify-center rounded-full bg-card shadow-sm ring-1 ring-border transition-all duration-300",
          pressed ? "translate-x-7" : "translate-x-0"
        )}
      >
        {pressed ? (
          <PanelRight className="h-4 w-4 text-foreground transition-transform duration-300" />
        ) : (
          <PanelLeft className="h-4 w-4 text-foreground transition-transform duration-300" />
        )}
      </span>
    </button>
  );
}

export default function Header({
  className,
  style,
  isAuthenticated = false,
  userName,
  userEmail,
  userAvatarUrl,
  onSignIn,
  onSignOut,
}: HeaderProps) {
  const { isDark, toggle } = useDarkMode();

  const handleSignIn = React.useCallback(() => {
    onSignIn?.();
    toast.success("Welcome to Atal Idea Generator");
  }, [onSignIn]);

  const handleSignOut = React.useCallback(() => {
    onSignOut?.();
    toast.message("Signed out");
  }, [onSignOut]);

  const initials =
    userName
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "AI";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80",
        "border-b border-border shadow-sm",
        className
      )}
      style={style}
      role="banner"
    >
      <div className="mx-auto w-full max-w-full">
        <div className="flex h-16 items-center justify-between px-4">
          {/* Left: Brand and mobile menu */}
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open navigation menu"
                >
                  <Hamburger className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-card">
                <SheetHeader>
                  <SheetTitle>
                    <div className="flex items-center gap-2">
                      <BrandMark />
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <nav aria-label="Mobile Main" className="mt-6 flex flex-col gap-1">
                  {NAV_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-label={item.ariaLabel}
                      className={cn(
                        "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium",
                        "text-foreground hover:bg-muted transition-colors"
                      )}
                    >
                      <span className="min-w-0 truncate">{item.label}</span>
                      <span className="text-muted-foreground text-xs">↗</span>
                    </Link>
                  ))}
                </nav>
                <div className="mt-6 border-t border-border pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Appearance</span>
                    <ThemeToggle isDark={isDark} onToggle={toggle} />
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/" aria-label="Atal Idea Generator Home" className="inline-flex items-center gap-2">
              <BrandMark />
            </Link>
          </div>

          {/* Center: Desktop navigation */}
          <nav aria-label="Main" className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.ariaLabel}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium",
                  "text-foreground/80 hover:text-foreground hover:bg-muted",
                  "transition-colors"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right: Controls */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <ThemeToggle isDark={isDark} onToggle={toggle} />
            </div>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-2"
                    aria-label="Open user menu"
                  >
                    <Avatar className="h-8 w-8">
                      {userAvatarUrl ? (
                        <AvatarImage src={userAvatarUrl} alt={userName ?? "User avatar"} />
                      ) : (
                        <AvatarFallback className="bg-accent text-accent-foreground">
                          {initials}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="hidden sm:flex min-w-0 flex-col items-start">
                      <span className="max-w-[10rem] truncate text-sm font-medium">{userName ?? "User"}</span>
                      {userEmail && (
                        <span className="max-w-[10rem] truncate text-xs text-muted-foreground">
                          {userEmail}
                        </span>
                      )}
                    </div>
                    <ChevronsUpDown className="ml-1 hidden h-4 w-4 text-muted-foreground sm:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-destructive focus:text-destructive"
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={handleSignIn}>Sign in</Button>
                <Button onClick={handleSignIn} className="bg-primary text-primary-foreground hover:opacity-90">
                  Get started
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}