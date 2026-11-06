import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Flame, LogOut, Menu, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthState } from "@/lib/auth-store";


export const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/quiz", label: "Quiz" },
  { to: "/campus", label: "Campus" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/gallery", label: "Gallery" },
  { to: "/wish", label: "Wishes" },
  { to: "/traditions", label: "Traditions" },
  { to: "/countdown", label: "Countdown" },
  { to: "/about", label: "About" },
] as const;

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/40">
        <Flame className="h-5 w-5 text-primary" />
      </span>
      <span className="font-display text-xl font-bold tracking-[0.18em] text-foreground uppercase">
        Ujjwal
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const { session, isAdmin } = useAuthState();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const email = session?.user?.email ?? "";

  const handleSignOut = async () => {
  navigate({ to: "/", replace: true });
};

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground"
              activeProps={{ className: "text-foreground bg-secondary/40" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="hidden max-w-[140px] truncate sm:inline">
                    {email || "Account"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="truncate">
                  {email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin ? (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" /> Admin dashboard
                    </Link>
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="gap-2">
              <Link to="/auth">
                <Sparkles className="h-4 w-4" /> Sign in
              </Link>
            </Button>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle asChild>
                  <div>
                    <Logo />
                  </div>
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-4 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2 text-base font-medium text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
                {isAdmin ? (
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                  >
                    Admin dashboard
                  </Link>
                ) : null}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/60 bg-night/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-8 text-center">
        <div className="divider-gold w-40" />
        <p className="font-display text-lg font-semibold text-foreground">
          Project Ujjwal
        </p>
        <p className="max-w-md text-sm text-muted-foreground">
          One campus, one lamp at a time. A Diwali celebration by the SD
          CodeCraft Club for SD College, Ambala Cantt.
        </p>
        <p className="text-xs text-muted-foreground/70">
          Shubh Deepavali — may every answer add a little more light.
        </p>
      </div>
    </footer>
  );
}

export function PageShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <main className={`mx-auto w-full max-w-6xl px-4 ${className}`}>{children}</main>;
}

/** Renders children only after the auth store has hydrated on the client. */
export function useMountedAuthReady() {
  const { ready } = useAuthState();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && ready;
}
