import { getAllDocs, safeGet, setDocument, generateId } from './firebase.js';

const COL_STRUCTURES = 'fee_structures';
const COL_PAYMENTS   = 'fee_payments';

// ── Fee Structures ────────────────────────────────────────────────────────────

export const getFeeStructures = async (filters = {}) => {
  let results = await getAllDocs(COL_STRUCTURES);
  if (filters.classLevel)   results = results.filter((f) => f.classLevel   === filters.classLevel);
  if (filters.academicYear) results = results.filter((f) => f.academicYear === filters.academicYear);
  if (filters.term)         results = results.filter((f) => f.term         === filters.term);
  return results;
};

export const upsertFeeStructure = async (data) => {
  // Deterministic ID: one structure per class per term per year
  const id          = `feestructure_${data.classLevel}_${data.academicYear.replace('/', '-')}_${data.term.replace(' ', '')}`;
  const items       = data.items || [];
  const totalAmount = items.reduce((s, i) => s + Number(i.amount), 0);

  const docData = {
    type:         'fee_structure',
    classLevel:   data.classLevel,
    academicYear: data.academicYear,
    term:         data.term,
    items,
    totalAmount,
  };

  await setDocument(COL_STRUCTURES, id, docData);
  return { id, ...docData };
};

// ── Fee Payments ──────────────────────────────────────────────────────────────

export const getFeePayments = async (filters = {}) => {
  let results = await getAllDocs(COL_PAYMENTS);
  if (filters.studentId)    results = results.filter((p) => p.studentId    === filters.studentId);
  if (filters.academicYear) results = results.filter((p) => p.academicYear === filters.academicYear);
  if (filters.term)         results = results.filter((p) => p.term         === filters.term);
  return results.sort((a, b) => b.paymentDate?.localeCompare(a.paymentDate || '') || 0);
};

export const recordPayment = async (data, recordedBy) => {
  const all           = await getAllDocs(COL_PAYMENTS);
  const receiptNumber = `RCP${String(all.length + 1).padStart(5, '0')}`;
  const today         = new Date().toISOString().split('T')[0];
  const id            = generateId('feepayment');

  const docData = {
    type:          'fee_payment',
    studentId:     data.studentId,
    academicYear:  data.academicYear,
    term:          data.term,
    amountPaid:    Number(data.amountPaid),
    receiptNumber,
    paymentMethod: data.paymentMethod || 'Cash',
    paidBy:        data.paidBy        || '',
    notes:         data.notes         || '',
    paymentDate:   data.paymentDate   || today,
    recordedBy,
  };

  await setDocument(COL_PAYMENTS, id, docData);
  return { id, ...docData };
};

export const getStudentBalance = async (studentId, classLevel, academicYear, term) => {
  const [structures, payments] = await Promise.all([
    getFeeStructures({ classLevel, academicYear, term }),
    getFeePayments({ studentId, academicYear, term }),
  ]);
  const totalDue  = structures[0]?.totalAmount || 0;
  const totalPaid = payments.reduce((s, p) => s + p.amountPaid, 0);
  return { totalDue, totalPaid, balance: totalDue - totalPaid };
};

export const getTermFeeCollection = async (academicYear, term) => {
  const payments = await getFeePayments({ academicYear, term });
  return payments.reduce((s, p) => s + p.amountPaid, 0);
};
