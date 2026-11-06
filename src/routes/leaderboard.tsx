import { createFileRoute, Link } from "@tanstack/react-router";
import { useLeaderboard } from "@/hooks/use-campus";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, Trophy } from "lucide-react";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard — Project Ujjwal" },
      {
        name: "description",
        content:
          "Who has lit the most diyas for SD College's virtual Diwali campus? Overall, students and teachers rankings.",
      },
      { property: "og:title", content: "Leaderboard — Project Ujjwal" },
      {
        property: "og:description",
        content: "Who has lit the most diyas on our shared campus?",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: LeaderboardPage,
});

const MEDALS = ["🥇", "🥈", "🥉"];

function RankList({
  rows,
}: {
  rows: { id: string; display_name: string; role?: string; diyas: number }[];
}) {
  if (!rows.length) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        No diyas on the board yet —{" "}
        <Link to="/quiz" className="text-primary underline">
          be the first
        </Link>
        .
      </p>
    );
  }
  return (
    <ol className="space-y-2">
      {rows.map((row, index) => (
        <li
          key={row.id}
          className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
            index < 3
              ? "border-primary/40 bg-primary/10"
              : "border-border bg-card/60"
          }`}
        >
          <span className="w-8 text-center font-display text-lg font-bold text-muted-foreground">
            {index < 3 ? MEDALS[index] : index + 1}
          </span>
          <span className="truncate font-medium text-foreground">
            {row.display_name}
          </span>
          {row.role ? (
            <Badge variant="outline" className="ml-1 shrink-0 capitalize">
              {row.role}
            </Badge>
          ) : null}
          <span className="ml-auto flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-primary">
            <Flame className="h-4 w-4 text-ember" /> {row.diyas}
          </span>
        </li>
      ))}
    </ol>
  );
}

function LeaderboardPage() {
  const leaderboard = useLeaderboard();
  const data = leaderboard.data;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="mb-8 text-center">
        <Trophy className="mx-auto mb-3 h-10 w-10 text-primary" />
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
          Festival Leaderboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          The lamps of SD College, ranked by diyas lit.
        </p>
      </div>

      <Tabs defaultValue="overall" className="w-full">
        <TabsList className="mx-auto grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="overall">Overall</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
        </TabsList>
        <TabsContent value="overall" className="mt-4">
          <RankList rows={data?.overall ?? []} />
        </TabsContent>
        <TabsContent value="students" className="mt-4">
          <RankList rows={data?.students ?? []} />
        </TabsContent>
        <TabsContent value="teachers" className="mt-4">
          <RankList rows={data?.teachers ?? []} />
        </TabsContent>
      </Tabs>

      <div className="mt-8 text-center">
        <Button asChild className="gap-2">
          <Link to="/quiz">
            <Flame className="h-4 w-4" /> Climb the board
          </Link>
        </Button>
      </div>
    </main>
  );
}
