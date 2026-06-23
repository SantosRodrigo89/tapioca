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

// Lazy initialization — avoids module-level Firebase init during SSR/build
// where NEXT_PUBLIC_* env vars may not be available.
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

function maybeConnectEmulators(
  auth: Auth,
  db: Firestore,
  storage: FirebaseStorage,
) {
  if (_emulatorsConnected) return;
  if (
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true"
  ) {
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
    connectFirestoreEmulator(db, "localhost", 8080);
    connectStorageEmulator(storage, "localhost", 9199);
    _emulatorsConnected = true;
  }
}

export const auth: Auth = new Proxy({} as Auth, {
  get(_target, prop) {
    if (!_auth) {
      _auth = getAuth(getClientApp());
      if (!_db) _db = getFirestore(getClientApp());
      if (!_storage) _storage = getStorage(getClientApp());
      maybeConnectEmulators(_auth, _db!, _storage!);
    }
    return _auth[prop as keyof Auth];
  },
});

export const db: Firestore = new Proxy({} as Firestore, {
  get(_target, prop) {
    if (!_db) {
      _db = getFirestore(getClientApp());
      if (!_auth) _auth = getAuth(getClientApp());
      if (!_storage) _storage = getStorage(getClientApp());
      maybeConnectEmulators(_auth!, _db, _storage!);
    }
    return _db[prop as keyof Firestore];
  },
});

export const storage: FirebaseStorage = new Proxy({} as FirebaseStorage, {
  get(_target, prop) {
    if (!_storage) {
      _storage = getStorage(getClientApp());
      if (!_auth) _auth = getAuth(getClientApp());
      if (!_db) _db = getFirestore(getClientApp());
      maybeConnectEmulators(_auth!, _db!, _storage);
    }
    return _storage[prop as keyof FirebaseStorage];
  },
});
