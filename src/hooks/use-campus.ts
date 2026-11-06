
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type RecentContribution = {
  id: string;
  display_name: string;
  role: string;
  created_at: string;
};

export type CampusStats = {
  total_diyas: number;
  milestone: number;
  participants_total: number;
  students: number;
  teachers: number;
  correct_answers: number;
  recent: RecentContribution[];
};

export type LeaderboardRow = {
  id: string;
  display_name: string;
  role?: string;
  diyas: number;
};

export type Leaderboard = {
  overall: LeaderboardRow[];
  students: LeaderboardRow[];
  teachers: LeaderboardRow[];
};

// Fetch live campus statistics from Supabase.
export function useCampusStats() {
  return useQuery<CampusStats>({
    queryKey: ["campus-stats"],

    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_campus_stats");

      if (error) {
        console.error("Failed to fetch campus statistics:", error);
        throw error;
      }

      return data as CampusStats;
    },

    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: 10_000,
  });
}

// Fetch live leaderboard from Supabase.
export function useLeaderboard() {
  return useQuery<Leaderboard>({
    queryKey: ["leaderboard"],

    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_leaderboard");

      if (error) {
        console.error("Failed to fetch leaderboard:", error);
        throw error;
      }

      return data as unknown as Leaderboard;
    },

    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: 10_000,
  });
}
