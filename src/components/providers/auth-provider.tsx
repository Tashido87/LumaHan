"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { FirebaseError } from "firebase/app";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb, hasFirebaseConfig } from "@/lib/firebase/client";
import { signInWithGoogleAndBootstrapProfile, signOutOfFirebase } from "@/lib/firebase/auth";

type UserProfile = {
  displayName?: string;
  email?: string;
  photoURL?: string;
  currentHskLevel?: number;
  currentUnitId?: string;
  currentLessonId?: string;
  xp?: number;
  streakCount?: number;
  role?: "admin" | "learner";
  weakAreas?: string[];
  aiTip?: string;
};

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  error: null,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(hasFirebaseConfig());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasFirebaseConfig()) {
      return;
    }

    const auth = getFirebaseAuth();
    let unsubscribeProfile: (() => void) | null = null;
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      unsubscribeProfile?.();
      unsubscribeProfile = null;
      setUser(firebaseUser);
      if (firebaseUser) {
        const db = getFirebaseDb();
        const profileRef = doc(db, "users", firebaseUser.uid);
        unsubscribeProfile = onSnapshot(
          profileRef,
          (docSnap) => {
            if (docSnap.exists()) {
              setProfile(docSnap.data() as UserProfile);
            } else {
              setProfile(null);
            }
            setLoading(false);
          },
          (error) => {
            console.error("Error reading profile:", error);
            setLoading(false);
          }
        );
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeProfile?.();
      unsubscribe();
    };
  }, []);

  const signIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogleAndBootstrapProfile();
    } catch (error) {
      console.error("Login failed:", error);
      const message =
        error instanceof FirebaseError &&
        error.code === "auth/unauthorized-domain"
          ? "This domain is not authorized in Firebase Authentication. Add it in Firebase Console > Authentication > Settings > Authorized domains."
          : error instanceof Error
            ? error.message
            : "Login failed.";
      setError(message);
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await signOutOfFirebase();
    } catch (error) {
      console.error("Logout failed:", error);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, error, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
