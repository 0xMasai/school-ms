import {
  createUserWithEmailAndPassword,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  auth,
  appConfig,
  getAllDocs,
  safeGet,
  setDocument,
  updateDocument,
  generateId,
} from './firebase.js';

const COL = 'users';

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// Creates a Firebase Auth user using a temporary secondary app instance so the
// currently signed-in admin is NOT signed out during the process.
const createFirebaseAuthUser = async (email, password) => {
  const secondaryApp = initializeApp(appConfig, `sms_tmp_${Date.now()}`);
  try {
    const secondaryAuth = getAuth(secondaryApp);
    const credential    = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    return credential.user.uid;
  } finally {
    await deleteApp(secondaryApp);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// SETUP — first admin (called during SetupWizard, NO auth session yet)
// ─────────────────────────────────────────────────────────────────────────────

export const createFirstAdmin = async (data) => {
  // ⚠️  DO NOT call getUserByEmail here.
  //     getUserByEmail reads the 'users' Firestore collection.
  //     At setup time there is no authenticated user, so Firestore
  //     rules block that read and throw "Missing or insufficient permissions".
  //     Firebase Auth will reject a duplicate email on its own — that's enough.

  // 1. Create Firebase Auth account. This IMMEDIATELY signs the user in,
  //    so every Firestore write after this line runs as an authenticated user.
  const credential = await createUserWithEmailAndPassword(
    auth,
    data.email.trim(),
    data.password,
  );
  const uid = credential.user.uid;

  // 2. Write the Firestore profile. auth.currentUser is now set, so rules pass.
  const now     = new Date().toISOString();
  const docData = {
    type:            'user',
    uid,
    fullName:        data.fullName.trim(),
    email:           data.email.toLowerCase().trim(),
    role:            'admin',
    active:          true,
    assignedClasses: [],
    createdBy:       'system',
    createdAt:       now,
    updatedAt:       now,
  };

  await setDocument(COL, uid, docData);
  return { id: uid, ...docData };
};

// ─────────────────────────────────────────────────────────────────────────────
// USER MANAGEMENT — admin creates teacher / bursar accounts
// ─────────────────────────────────────────────────────────────────────────────

export const createUser = async (data, createdBy) => {
  // This runs while an admin IS signed in, so the getUserByEmail read is fine.
  const existing = await getUserByEmail(data.email);
  if (existing) throw new Error('A user with this email already exists.');

  // Secondary app keeps the admin signed in while the new account is created.
  const uid = await createFirebaseAuthUser(data.email.trim(), data.password);

  const now     = new Date().toISOString();
  const docData = {
    type:            'user',
    uid,
    fullName:        data.fullName.trim(),
    email:           data.email.toLowerCase().trim(),
    role:            data.role,
    active:          true,
    assignedClasses: data.assignedClasses || [],
    createdBy:       createdBy || 'admin',
    createdAt:       now,
    updatedAt:       now,
  };

  await setDocument(COL, uid, docData);
  return { id: uid, ...docData };
};

// ─────────────────────────────────────────────────────────────────────────────
// READ
// ─────────────────────────────────────────────────────────────────────────────

// Used by AuthContext.onAuthStateChanged to fetch the role/profile after login.
export const getUserByUid = async (uid) => safeGet(COL, uid);

export const getUserByEmail = async (email) => {
  const users = await getAllDocs(COL);
  return (
    users.find((u) => u.email?.toLowerCase() === email.toLowerCase().trim()) ||
    null
  );
};

export const getUsers = async () => {
  const users = await getAllDocs(COL);
  return users.sort((a, b) => a.fullName?.localeCompare(b.fullName || '') || 0);
};

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────────────────────────────────────

export const updateUser = async (id, updates) => {
  if (updates.email) {
    const clash = await getUserByEmail(updates.email);
    if (clash && clash.id !== id) throw new Error('Email already in use.');
    updates.email = updates.email.toLowerCase().trim();
  }

  // Never allow overwriting Firebase Auth credentials or UID via this path.
  delete updates.password;
  delete updates.uid;

  updates.updatedAt = new Date().toISOString();

  await updateDocument(COL, id, updates);
  return safeGet(COL, id);
};

// Requires the user to supply their current password to re-authenticate
// before the new password is accepted by Firebase Auth.
export const changeOwnPassword = async (currentPassword, newPassword) => {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) throw new Error('Not authenticated.');

  const credential = EmailAuthProvider.credential(
    firebaseUser.email,
    currentPassword,
  );
  await reauthenticateWithCredential(firebaseUser, credential);
  await updatePassword(firebaseUser, newPassword);
};

export const deactivateUser = async (id) =>
  updateUser(id, { active: false });

export const activateUser = async (id) =>
  updateUser(id, { active: true });

export const countAdmins = async () => {
  const users = await getAllDocs(COL);
  return users.filter((u) => u.role === 'admin' && u.active).length;
};
