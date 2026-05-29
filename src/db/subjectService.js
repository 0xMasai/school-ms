import { getAllDocs, safeGet, setDocument, updateDocument, deleteDocument, generateId } from './firebase.js';

const COL = 'subjects';

export const getSubjects = async (filters = {}) => {
  let results = await getAllDocs(COL);
  if (filters.classLevel)
    results = results.filter((s) => s.applicableClasses?.includes(filters.classLevel));
  return results.sort((a, b) => a.name?.localeCompare(b.name || '') || 0);
};

export const getSubjectById = async (id) => safeGet(COL, id);

export const createSubject = async (data) => {
  const all = await getAllDocs(COL);
  if (all.find((s) => s.name?.toLowerCase() === data.name.toLowerCase().trim()))
    throw new Error('A subject with this name already exists.');

  const id      = generateId('subject');
  const docData = {
    type:               'subject',
    name:               data.name.trim(),
    code:               data.code?.trim().toUpperCase() || '',
    applicableClasses:  data.applicableClasses || [],
    outOf:              Number(data.outOf) || 100,
  };

  await setDocument(COL, id, docData);
  return { id, ...docData };
};

export const updateSubject = async (id, updates) => {
  await updateDocument(COL, id, updates);
  return safeGet(COL, id);
};

export const deleteSubject = async (id) => deleteDocument(COL, id);
