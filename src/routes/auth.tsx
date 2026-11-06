import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Flame, Mail } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Project Ujjwal" },
      {
        name: "description",
        content:
          "Sign in to Project Ujjwal to help light the virtual campus of Sanatan Dharma College, Ambala Cantt.",
      },
      { property: "og:title", content: "Sign in — Project Ujjwal" },
      {
        property: "og:description",
        content: "Sign in and keep the campus glowing.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error: err } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (err) throw new Error(err.message);
        toast.success("Welcome back — the campus missed you 🪔");
        navigate({ to: "/" });
      } else {
        const { error: err } = await supabase.auth.signUp({ email, password });
        if (err) throw new Error(err.message);
        setNotice(
          "Account created! Check your inbox for a confirmation link, then sign in.",
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const oauth = async (provider: "google" | "lovable") => {
    setError(null);
    try {
      const result = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in was cancelled");
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-14">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/40">
        <Flame className="h-7 w-7 text-primary" />
      </span>
      <h1 className="font-display text-3xl font-bold text-foreground">
        {mode === "signin" ? "Welcome back" : "Join the club"}
      </h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        An account is only needed for club members and admin tools — the quiz
        itself is open to everyone.
      </p>

      <form
        onSubmit={submit}
        className="card-glow mt-8 w-full rounded-2xl border border-border bg-card p-6"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="auth-email">Email</Label>
            <Input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="auth-password">Password</Label>
            <Input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              minLength={6}
              required
            />
          </div>
          {notice ? (
            <p className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-champagne">
              {notice}
            </p>
          ) : null}
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" className="w-full gap-2" disabled={busy}>
            <Mail className="h-4 w-4" />
            {busy ? "One moment…" : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </div>
      </form>

      <div className="mt-4 flex w-full items-center gap-3">
        <span className="divider-gold flex-1" />
        <span className="text-xs text-muted-foreground">or continue with</span>
        <span className="divider-gold flex-1" />
      </div>

      <div className="mt-4 grid w-full grid-cols-2 gap-3">
        <Button variant="outline" onClick={() => oauth("google")} className="gap-2">
          Google
        </Button>
        <Button variant="outline" onClick={() => oauth("lovable")} className="gap-2">
          Lovable
        </Button>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        {mode === "signin" ? "New to the club?" : "Already a member?"}{" "}
        <button
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError(null);
            setNotice(null);
          }}
          className="text-primary underline"
        >
          {mode === "signin" ? "Create an account" : "Sign in"}
        </button>
      </p>
    </main>
  );
}
