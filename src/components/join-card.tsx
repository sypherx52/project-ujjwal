// Join card: anyone can light diyas by answering the quiz — no account needed.
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParticipant, type ParticipantRole } from "@/hooks/use-participant";
import { Flame } from "lucide-react";

const ROLES: { value: ParticipantRole; label: string }[] = [
  { value: "student", label: "Student" },
  { value: "teacher", label: "Teacher" },
  { value: "guest", label: "Guest / Alumni" },
];

export function JoinCard() {
  const { join } = useParticipant();
  const [name, setName] = useState("");
  const [role, setRole] = useState<ParticipantRole>("student");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await join(name, role);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not join, try again");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card-glow mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-6"
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/40">
          <Flame className="h-5 w-5 text-primary" />
        </span>
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Join the celebration
          </h2>
          <p className="text-sm text-muted-foreground">
            Every correct answer lights one diya on the shared campus.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="join-name">Your name</Label>
          <Input
            id="join-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Aarav Sharma"
            maxLength={40}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="join-role">I am a</Label>
          <Select value={role} onValueChange={(v) => setRole(v as ParticipantRole)}>
            <SelectTrigger id="join-role" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button type="submit" className="w-full gap-2" disabled={busy}>
          <Flame className="h-4 w-4" />
          {busy ? "Lighting your lamp…" : "Enter the quiz arena"}
        </Button>
      </div>
    </form>
  );
}
