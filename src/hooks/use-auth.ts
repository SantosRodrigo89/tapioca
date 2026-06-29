"use client";

import { useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  type User,
} from "firebase/auth";
import { getClientAuth } from "@/lib/firebase/client";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { resetUser } from "@/lib/analytics/posthog-client";
import posthog from "posthog-js";
import type { AuthUser } from "@/types";

async function getClaimsFromToken(user: User): Promise<{
  role?: AuthUser["role"];
  tenantId?: string;
}> {
  const tokenResult = await user.getIdTokenResult();
  return {
    role: tokenResult.claims.role as AuthUser["role"] | undefined,
    tenantId: tokenResult.claims.tenantId as string | undefined,
  };
}

async function firebaseUserToAuthUser(user: User): Promise<AuthUser> {
  const { role, tenantId } = await getClaimsFromToken(user);
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    tenantId,
    role,
  };
}

/** Forces a new ID token so custom claims (tenantId, role) are available for Firestore rules. */
export async function refreshAuthToken(): Promise<void> {
  const user = getClientAuth().currentUser;
  if (user) {
    await user.getIdToken(true);
  }
}

interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthUser>;
  signUp: (email: string, password: string, displayName: string) => Promise<string>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getClientAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      void firebaseUserToAuthUser(firebaseUser).then(setUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string): Promise<AuthUser> => {
    const auth = getClientAuth();
    const credential = await signInWithEmailAndPassword(auth, email, password);
    // Force refresh so custom claims from signup are present in the Firestore client token
    const idToken = await credential.user.getIdToken(true);
    const authUser = await firebaseUserToAuthUser(credential.user);

    const res = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      throw new Error(data.error ?? "Falha ao criar sessão");
    }

    return authUser;
  };

  const signUp = async (
    email: string,
    password: string,
    displayName: string,
  ): Promise<string> => {
    const auth = getClientAuth();
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName });
    return credential.user.uid;
  };

  const signOut = async (): Promise<void> => {
    posthog.capture(ANALYTICS_EVENTS.USER_LOGGED_OUT);
    resetUser();
    await fetch("/api/auth/session", { method: "DELETE" });
    await firebaseSignOut(getClientAuth());
  };

  const resetPassword = async (email: string): Promise<void> => {
    await sendPasswordResetEmail(getClientAuth(), email);
  };

  return { user, loading, signIn, signUp, signOut, resetPassword };
}
