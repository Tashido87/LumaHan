"use client";

import { httpsCallable, getFunctions } from "firebase/functions";
import { signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

import {
  getFirebaseApp,
  getFirebaseAuth,
  getFirebaseDb,
  getGoogleProvider,
  hasFirebaseConfig,
} from "@/lib/firebase/client";

export async function signInWithGoogleAndBootstrapProfile() {
  if (!hasFirebaseConfig()) {
    throw new Error("Firebase env vars are missing.");
  }

  const auth = getFirebaseAuth();
  const credential = await signInWithPopup(auth, getGoogleProvider());
  const user = credential.user;

  // Try the Cloud Function first (handles admin role assignment)
  try {
    const functions = getFunctions(getFirebaseApp(), "us-central1");
    const ensureUserProfile = httpsCallable(functions, "ensureUserProfile");
    const profile = await ensureUserProfile({});
    return { user, profile: profile.data };
  } catch (cfError) {
    console.warn(
      "ensureUserProfile Cloud Function failed (may not be deployed yet). Falling back to client-side profile creation.",
      cfError
    );
  }

  // Fallback: create/read the profile directly via client Firestore SDK
  const db = getFirebaseDb();
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return { user, profile: userSnap.data() };
  }

  // Create a new learner profile (admin assignment requires the Cloud Function)
  const newProfile = {
    displayName: user.displayName ?? "Private learner",
    email: user.email ?? "",
    photoURL: user.photoURL ?? "",
    currentHskLevel: 1,
    currentUnitId: "hsk1-u1",
    currentLessonId: "hsk1-hello",
    xp: 0,
    streakCount: 0,
    lastActiveDate: "",
    role: "learner" as const,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(userRef, newProfile);
  return { user, profile: newProfile };
}

export async function signOutOfFirebase() {
  if (!hasFirebaseConfig()) return;
  await signOut(getFirebaseAuth());
}
