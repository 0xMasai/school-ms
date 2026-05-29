import { getAllDocs, safeGet, setDocument, updateDocument, deleteDocument, generateId } from './firebase.js';

const COL = 'staff';

export const getStaff = async (filters = {}) => {
  let results = await getAllDocs(COL);
  if (filters.status) results = results.filter((s) => s.status === filters.status);
  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (s) => s.fullName?.toLowerCase().includes(q) || s.staffNumber?.toLowerCase().includes(q)
    );
  }
  return results.sort((a, b) => a.fullName?.localeCompare(b.fullName || '') || 0);
};

export const getStaffById = async (id) => safeGet(COL, id);

export const createStaff = async (data) => {
  const all = await getAllDocs(COL);
  const staffNumber = data.staffNumber?.trim() || `STF${String(all.length + 1).padStart(3, '0')}`;

  if (all.find((s) => s.staffNumber === staffNumber))
    throw new Error('Staff number already exists.');

  const id      = generateId('staff');
  const today   = new Date().toISOString().split('T')[0];
  const docData = {
    type:       'staff',
    staffNumber,
    fullName:   data.fullName.trim(),
    email:      data.email      || '',
    phone:      data.phone      || '',
    position:   data.position   || 'Teacher',
    department: data.department || '',
    salary:     Number(data.salary) || 0,
    userId:     data.userId     || null,
    status:     'active',
    joinDate:   data.joinDate   || today,
    notes:      data.notes      || '',
  };

  await setDocument(COL, id, docData);
  return { id, ...docData };
};

export const updateStaff = async (id, updates) => {
  await updateDocument(COL, id, updates);
  return safeGet(COL, id);
};

export const deleteStaff = async (id) => deleteDocument(COL, id);

export const getStaffCount = async () => {
  const all = await getAllDocs(COL);
  return all.filter((s) => s.status === 'active').length;
};
