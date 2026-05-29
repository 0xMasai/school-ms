import { safeGet, setDocument, updateDocument } from './firebase.js';

const COL = 'config';
const DOC = 'app_config';

// ─────────────────────────────────────────────────────────────────────────────
// READ  — both functions read config/app_config, which Firestore rules allow
//         WITHOUT authentication (allow read: if true) so the app can check
//         setup status on every cold boot before any user is signed in.
// ─────────────────────────────────────────────────────────────────────────────

export const isSetupComplete = async () => {
  const cfg = await safeGet(COL, DOC);   // reads  →  config/app_config
  return cfg?.setupComplete === true;
};

export const getConfig = async () => {
  return await safeGet(COL, DOC);        // reads  →  config/app_config
};

// ─────────────────────────────────────────────────────────────────────────────
// WRITE — called from SetupWizard AFTER createFirstAdmin() has signed the
//         admin into Firebase Auth, so request.auth is set and rules pass.
// ─────────────────────────────────────────────────────────────────────────────

export const createConfig = async (data) => {
  const now = new Date().toISOString();

  // Renamed from 'doc' to 'configData' — avoids shadowing the doc() helper
  // if it were ever imported from firebase/firestore in the future.
  const configData = {
    type:          'config',
    schoolName:    data.schoolName,
    schoolMotto:   data.schoolMotto   || '',
    schoolAddress: data.schoolAddress || '',
    schoolPhone:   data.schoolPhone   || '',
    schoolEmail:   data.schoolEmail   || '',
    academicYear:  data.academicYear,
    currentTerm:   data.currentTerm,
    setupComplete: true,
    createdAt:     now,
    updatedAt:     now,
  };

  return await setDocument(COL, DOC, configData); // writes → config/app_config
};

export const updateConfig = async (data) => {
  const updates = {
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await updateDocument(COL, DOC, updates);
  return await safeGet(COL, DOC);
};
