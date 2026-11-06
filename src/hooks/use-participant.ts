
import { useCallback, useSyncExternalStore } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ParticipantRole = "student" | "teacher" | "guest";

export type Participant = {
  id: string;
  display_name: string;
  role: ParticipantRole;
  answered: string[];
};

const STORAGE_KEY = "ujjwal-participant";

let cachedParticipant: Participant | null | undefined;

const listeners = new Set<() => void>();

function readStorage(): Participant | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return null;

    const parsed = JSON.parse(raw) as Participant;

    if (!parsed?.id || !parsed?.display_name) return null;

    return {
      ...parsed,
      answered: Array.isArray(parsed.answered)
        ? parsed.answered
        : [],
    };
  } catch {
    return null;
  }
}

function writeParticipant(participant: Participant | null) {
  cachedParticipant = participant;

  try {
    if (participant) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(participant)
      );
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Keep participant in memory if storage is unavailable.
  }

  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => listeners.delete(listener);
}

export function useParticipant() {
  const queryClient = useQueryClient();

  const participant = useSyncExternalStore(
    subscribe,
    () => {
      if (cachedParticipant === undefined) {
        cachedParticipant = readStorage();
      }

      return cachedParticipant;
    },
    () => null
  );

  const join = useCallback(
    async (displayName: string, role: ParticipantRole) => {
      const cleanName = displayName
        .trim()
        .replace(/[<>]/g, "")
        .slice(0, 40);

      if (!cleanName) {
        throw new Error("Please enter your name");
      }

      const id = crypto.randomUUID();

      const { error } = await supabase
        .from("participants")
        .insert({
          id,
          display_name: cleanName,
          role,
        });

      if (error) {
        throw new Error(error.message);
      }

      const newParticipant: Participant = {
        id,
        display_name: cleanName,
        role,
        answered: [],
      };

      writeParticipant(newParticipant);

      // Refresh dashboard and leaderboard after registration.
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["campus-stats"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["leaderboard"],
        }),
      ]);

      return {
        id,
        display_name: cleanName,
        role,
      };
    },
    [queryClient]
  );

  const markAnswered = useCallback((questionId: string) => {
    if (cachedParticipant === undefined) {
      cachedParticipant = readStorage();
    }

    if (!cachedParticipant) return;

    if (cachedParticipant.answered.includes(questionId)) {
      return;
    }

    writeParticipant({
      ...cachedParticipant,
      answered: [
        ...cachedParticipant.answered,
        questionId,
      ],
    });
  }, []);

  const reset = useCallback(() => {
    writeParticipant(null);
  }, []);

  return {
    participant,
    join,
    markAnswered,
    reset,
  };
}
