import { initializeApp }    from 'firebase/app';
import { getAuth }          from 'firebase/auth';
import { getStorage }       from 'firebase/storage';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentSingleTabManager,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG  —  paste your Firebase project values here (or use .env)
// ─────────────────────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth      = getAuth(app);
export const storage   = getStorage(app);
export const appConfig = firebaseConfig; // re-exported for secondary app instances

// Firestore with full offline persistence (IndexedDB).
// Reads/writes work offline; changes sync automatically when back online.
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentSingleTabManager(),
  }),
});

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export const generateId = (prefix) => {
  const ts  = Date.now().toString(36);
  const rnd = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}_${ts}_${rnd}`;
};

// Returns all documents in a collection as plain objects with an `id` field.
export const getAllDocs = async (col) => {
  const snap = await getDocs(collection(db, col));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// Returns a single document or null if it does not exist.
export const safeGet = async (col, id) => {
  const snap = await getDoc(doc(db, col, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

// Creates or fully replaces a document.
// ⚠️  Does NOT inject timestamps — each service sets its own timestamps
//     so the data shape stays predictable and consistent.
export const setDocument = async (col, id, data) => {
  await setDoc(doc(db, col, id), data);
  return { id, ...data };
};

// Creates a document with an auto-generated Firestore ID.
export const addDocument = async (col, data) => {
  const ref = await addDoc(collection(db, col), data);
  return { id: ref.id, ...data };
};

// Merges updates into an existing document.
// ⚠️  Does NOT inject updatedAt — callers set this themselves.
export const updateDocument = async (col, id, updates) => {
  await updateDoc(doc(db, col, id), updates);
};

// Permanently deletes a document.
export const deleteDocument = async (col, id) => {
  await deleteDoc(doc(db, col, id));
};

// Re-export Firestore primitives for services that need them directly.
export { collection, doc, query, where, orderBy };
