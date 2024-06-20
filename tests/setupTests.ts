import { afterEach, beforeEach } from "vitest";
import { auth } from "../src/utils/Firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "@firebase/auth";
import admin from "firebase-admin";

process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";
process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";

if (admin.apps.length === 0) {
  admin.initializeApp({
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    credential: admin.credential.applicationDefault(),
  });
}

const firestore = admin.firestore();

const testEmail = "test@test.com";
const testPassword = "test123";

const createTestUser = async () => {
  try {
    await createUserWithEmailAndPassword(auth, testEmail, testPassword);
  } catch (error: any) {
    if (error.code !== "auth/email-already-in-use") {
      console.log("Error creating test user: ", error);
      throw error;
    }
  }
};

const signInTestUser = async () => {
  try {
    await signInWithEmailAndPassword(auth, testEmail, testPassword);
  } catch (error: any) {
    if (error.code === "auth/user-not-found") {
      await createTestUser();
      await signInWithEmailAndPassword(auth, testEmail, testPassword);
    } else {
      console.log("Error signing in test user: ", error);
      throw error;
    }
  }
};

const clearFirestoreData = async () => {
  const collections = await firestore.listCollections();
  for (const collection of collections) {
    const snapshot = await collection.get();
    for (const doc of snapshot.docs) {
      await doc.ref.delete();
    }
  }
};

afterEach(async () => {
  await signOut(auth);
});

beforeEach(async () => {
  await clearFirestoreData();
  await signInTestUser();
});
