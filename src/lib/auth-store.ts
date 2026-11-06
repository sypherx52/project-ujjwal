// Single auth store for the whole app. One onAuthStateChange listener total —
// startAuthStore() is called once from the root route; components read state
// with useAuthState() via useSyncExternalStore.
import { useSyncExternalStore } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AuthState = {
  session: Session | null;
  ready: boolean;
  isAdmin: boolean;
};

let state: AuthState = { session: null, ready: false, isAdmin: false };
const listeners = new Set<() => void>();
let started = false;

function set(next: Partial<AuthState>) {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
}

async function refreshAdmin() {
  const user = state.session?.user;
  if (!user) {
    if (state.isAdmin) set({ isAdmin: false });
    return;
  }
  try {
    const { data } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    set({ isAdmin: data === true });
  } catch {
    set({ isAdmin: false });
  }
}

export function startAuthStore(handlers?: {
  onIdentityChange?: (isAdmin: boolean) => void;
}) {
  if (started) return;
  started = true;

  supabase.auth.getSession().then(({ data }) => {
    set({ session: data.session, ready: true });
    void refreshAdmin();
  });

  supabase.auth.onAuthStateChange((event, session) => {
    if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED")
      return;
    const signedOut = event === "SIGNED_OUT";
    set({ session, ready: true, isAdmin: signedOut ? false : state.isAdmin });
    if (signedOut) {
      handlers?.onIdentityChange?.(false);
    } else {
      void refreshAdmin().then(() => handlers?.onIdentityChange?.(state.isAdmin));
    }
  });
}

const SERVER_SNAPSHOT: AuthState = { session: null, ready: false, isAdmin: false };

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useAuthState(): AuthState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => SERVER_SNAPSHOT,
  );
}
