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
import { auth } from "@/lib/firebase/client";
import type { AuthUser } from "@/types";

function firebaseUserToAuthUser(user: User): AuthUser {
  const token = (user as User & { reloadUserInfo?: { customAttributes?: string } })
    .reloadUserInfo?.customAttributes;
  let role: AuthUser["role"];
  let tenantId: string | undefined;

  if (token) {
    try {
      const claims = JSON.parse(token);
      role = claims.role;
      tenantId = claims.tenantId;
    } catch {
      // ignore parse errors
    }
  }

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    tenantId,
    role,
  };
}

interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<string>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ? firebaseUserToAuthUser(firebaseUser) : null);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await credential.user.getIdToken();

    const res = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    if (!res.ok) {
      const data = await res.json() as { error?: string };
      throw new Error(data.error ?? "Falha ao criar sessão");
    }
  };

  const signUp = async (
    email: string,
    password: string,
    displayName: string,
  ): Promise<string> => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName });
    return credential.user.uid;
  };

  const signOut = async (): Promise<void> => {
    await fetch("/api/auth/session", { method: "DELETE" });
    await firebaseSignOut(auth);
  };

  const resetPassword = async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email);
  };

  return { user, loading, signIn, signUp, signOut, resetPassword };
}
