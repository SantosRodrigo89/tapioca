import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";
import {
  getFirestore,
  connectFirestoreEmulator,
  type Firestore,
} from "firebase/firestore";
import {
  getStorage,
  connectStorageEmulator,
  type FirebaseStorage,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;
let _emulatorsConnected = false;

function getClientApp(): FirebaseApp {
  if (_app) return _app;
  _app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return _app;
}

function initClientSdk(): void {
  if (typeof window === "undefined") return;

  const app = getClientApp();
  if (!_auth) _auth = getAuth(app);
  if (!_db) _db = getFirestore(app);
  if (!_storage) _storage = getStorage(app);

  if (
    !_emulatorsConnected &&
    process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true"
  ) {
    connectAuthEmulator(_auth, "http://localhost:9099", { disableWarnings: true });
    connectFirestoreEmulator(_db, "localhost", 8080);
    connectStorageEmulator(_storage, "localhost", 9199);
    _emulatorsConnected = true;
  }
}

/** Real Auth instance — required for Firestore rules (custom claims in ID token). */
export function getClientAuth(): Auth {
  if (typeof window === "undefined") {
    throw new Error("Firebase Auth is only available in the browser");
  }
  initClientSdk();
  return _auth!;
}

/** Real Firestore instance — do not wrap in Proxy (breaks collection()). */
export function getClientDb(): Firestore {
  if (typeof window === "undefined") {
    throw new Error("Firestore is only available in the browser");
  }
  initClientSdk();
  return _db!;
}

export function getClientStorage(): FirebaseStorage {
  if (typeof window === "undefined") {
    throw new Error("Firebase Storage is only available in the browser");
  }
  initClientSdk();
  return _storage!;
}
