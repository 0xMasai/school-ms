// Re-exports all Firebase helpers for backward compatibility.
// Import directly from firebase.js or individual service files in new code.
export {
  default,
  auth, storage, appConfig,
  generateId, getAllDocs, safeGet,
  setDocument, addDocument, updateDocument, deleteDocument,
} from './firebase.js';
