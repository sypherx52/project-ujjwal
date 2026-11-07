
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { JoinCard } from "@/components/join-card";
import { useParticipant } from "@/hooks/use-participant";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Flame,
  Lightbulb,
  ArrowRight,
  PartyPopper,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Quiz Arena — SDC Ujjwal" },
      {
        name: "description",
        content:
          "Answer Diwali questions about SD College, India and the festival of lights. Every correct answer lights one diya on the shared campus.",
      },
      { property: "og:title", content: "Quiz Arena — SDC Ujjwal" },
      {
        property: "og:description",
        content: "Every correct answer lights one diya on our shared campus.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: QuizPage,
});

type Question = {
  id: string;
  question_text: string;
  options: string[];
  category: string;
  difficulty: string;
  hint: string;
};

type AnswerResult = {
  status: "lit" | "already_lit" | "incorrect" | "error";
  message?: string;
  hint?: string;
  correct_index: number;
  explanation: string;
  total_diyas?: number;
  milestone?: number;
};

function QuizPage() {
  const { participant, markAnswered, reset } = useParticipant();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const questionQuery = useQuery<Question | null>({
    queryKey: [
      "quiz-question",
      participant?.id,
      participant?.answered.length ?? 0,
    ],
    enabled: !!participant,
    staleTime: Infinity,
    queryFn: async () => {
      if (!participant) return null;

      const { data, error } = await supabase.rpc("get_next_question", {
        p_exclude: participant.answered,
      });

      if (error) throw error;
      return (data as Question | null) ?? null;
    },
  });

  const question = questionQuery.data ?? null;

  useEffect(() => {
    setSelected(null);
    setResult(null);
    setShowHint(false);
  }, [question?.id]);

  const answer = async (index: number) => {
    if (!participant || !question || result || busy) return;

    setBusy(true);
    setSelected(index);

    try {
      const { data, error } = await supabase.rpc("submit_quiz_answer", {
        p_participant_id: participant.id,
        p_question_id: question.id,
        p_selected_index: index,
      });

      if (error) throw new Error(error.message);

      const r = data as AnswerResult;

      if (r.status === "error") {
        toast.error(r.message ?? "Something went wrong");
        setSelected(null);
        return;
      }

      setResult(r);
      markAnswered(question.id);

      queryClient.invalidateQueries({ queryKey: ["campus-stats"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });

      if (r.status === "lit") {
        toast.success("Happy Diwali! You've lit a diya on your campus! 🪔");
      } else if (r.status === "already_lit") {
        toast("You already lit this diya — pick the next one!");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not submit answer"
      );
      setSelected(null);
    } finally {
      setBusy(false);
    }
  };

  const nextQuestion = () => {
    setResult(null);
    setSelected(null);
    setShowHint(false);
    // Refetch fires automatically because answered.length changed.
  };

  if (!participant) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Quiz Arena
          </h1>
          <p className="mt-2 text-muted-foreground">
            One question at a time. One diya per correct answer. All for one
            campus.
          </p>
        </div>
        <JoinCard />
      </main>
    );
  }

  const totalAnswered = participant.answered.length;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Namaste, {participant.display_name} 🪔
          </h1>
          <p className="text-sm text-muted-foreground capitalize">
            Playing as {participant.role} · {totalAnswered} questions attempted
          </p>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/campus">See campus</Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={reset}>
            Switch player
          </Button>
        </div>
      </div>

      {questionQuery.isLoading ? (
        <div className="card-glow rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
          Fetching your next question…
        </div>
      ) : questionQuery.isError ? (
        <div className="card-glow rounded-2xl border border-destructive/40 bg-card p-8 text-center">
          <p className="text-destructive">
            Could not load a question. Please retry.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => questionQuery.refetch()}
          >
            Retry
          </Button>
        </div>
      ) : !question ? (
        <div className="card-glow rounded-2xl border border-primary/40 bg-card p-10 text-center">
          <PartyPopper className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-4 font-display text-2xl font-bold text-foreground">
            You've lit up the whole question bank!
          </h2>
          <p className="mt-2 text-muted-foreground">
            You attempted all {totalAnswered} questions. Every diya you earned
            is glowing on the shared campus right now.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild className="gap-2">
              <Link to="/campus">
                <Sparkles className="h-4 w-4" /> Watch the campus glow
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link to="/leaderboard">Check the leaderboard</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="card-glow rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="mb-4 flex items-center justify-between gap-2">
            <Badge variant="secondary" className="capitalize">
              {question.category}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {question.difficulty}
            </Badge>
          </div>

          <h2 className="font-display text-xl font-semibold leading-snug text-foreground sm:text-2xl">
            {question.question_text}
          </h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {question.options.map((option, index) => {
              const isSelected = selected === index;
              const isCorrect = result && result.correct_index === index;
              const isWrongPick = result && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => answer(index)}
                  disabled={busy || !!result}
                  className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all sm:text-base ${
                    isCorrect
                      ? "border-primary bg-primary/20 text-foreground"
                      : isWrongPick
                        ? "border-destructive bg-destructive/15 text-foreground"
                        : result
                          ? "border-border bg-background/40 text-muted-foreground"
                          : isSelected
                            ? "border-primary bg-primary/10"
                            : "border-border bg-background/40 hover:border-primary/50 hover:bg-primary/5"
                  }`}
                >
                  <span className="mr-2 font-display text-primary">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </button>
              );
            })}
          </div>

          {!result ? (
            <div className="mt-5 flex items-center justify-between">
              {showHint ? (
                <p className="flex items-center gap-2 text-sm text-champagne">
                  <Lightbulb className="h-4 w-4 shrink-0" />
                  {question.hint}
                </p>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-muted-foreground"
                  onClick={() => setShowHint(true)}
                >
                  <Lightbulb className="h-4 w-4" /> Show hint
                </Button>
              )}
            </div>
          ) : (
            <div
              className={`mt-6 animate-rise rounded-xl border p-4 ${
                result.status === "incorrect"
                  ? "border-destructive/40 bg-destructive/10"
                  : "border-primary/40 bg-primary/10"
              }`}
            >
              <p className="font-semibold text-foreground">
                {result.status === "lit"
                  ? "🎉 Happy Diwali! You've lit a diya on your campus! 🪔"
                  : result.status === "already_lit"
                    ? "Correct — you'd already lit this diya earlier."
                    : "Almost! The right answer is highlighted above."}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {result.explanation}
              </p>

              {result.status === "lit" && (
                <p className="mt-2 text-sm leading-relaxed text-amber-200">
                  Your diya is now part of our shared campus celebration.
                  Watch the campus photos as the lights grow — every
                  contribution adds to the glow of SD College!
                </p>
              )}

              {typeof result.total_diyas === "number" ? (
                <p className="mt-2 text-sm text-champagne">
                  Campus total: {result.total_diyas} / {result.milestone} diyas
                </p>
              ) : null}

              <Button className="mt-4 gap-2" onClick={nextQuestion}>
                Next question <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="mt-6">
            <div className="mb-1 flex justify-between text-xs text-muted-foreground">
              <span>Your journey through the question bank</span>
              <span>{totalAnswered} done</span>
            </div>
            <Progress value={Math.min(100, totalAnswered * 3)} />
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Flame className="h-3 w-3 text-ember" />
              Each correct answer lights one unique diya — no repeats,
              no double-counting.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
