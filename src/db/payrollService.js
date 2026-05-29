import { getAllDocs, setDocument, deleteDocument, generateId } from './firebase.js';

const COL_PAYROLL  = 'payroll';
const COL_EXPENSES = 'expenses';

export const getPayrollEntries = async (filters = {}) => {
  let results = await getAllDocs(COL_PAYROLL);
  if (filters.staffId)      results = results.filter((p) => p.staffId      === filters.staffId);
  if (filters.academicYear) results = results.filter((p) => p.academicYear === filters.academicYear);
  if (filters.term)         results = results.filter((p) => p.term         === filters.term);
  return results.sort((a, b) => b.paymentDate?.localeCompare(a.paymentDate || '') || 0);
};

export const recordPayroll = async (data, recordedBy) => {
  const basic      = Number(data.basicSalary) || 0;
  const allowances = Number(data.allowances)  || 0;
  const deductions = Number(data.deductions)  || 0;
  const today      = new Date().toISOString().split('T')[0];
  const id         = generateId('payroll');

  const docData = {
    type:          'payroll_entry',
    staffId:       data.staffId,
    staffName:     data.staffName     || '',
    academicYear:  data.academicYear,
    term:          data.term,
    month:         data.month,
    basicSalary:   basic,
    allowances,
    deductions,
    netSalary:     basic + allowances - deductions,
    paymentDate:   data.paymentDate   || today,
    paymentMethod: data.paymentMethod || 'Cash',
    notes:         data.notes         || '',
    recordedBy,
  };

  await setDocument(COL_PAYROLL, id, docData);
  return { id, ...docData };
};

export const getPayrollTotal = async (academicYear, term) => {
  const entries = await getPayrollEntries({ academicYear, term });
  return entries.reduce((s, e) => s + e.netSalary, 0);
};

export const getExpenses = async (filters = {}) => {
  let results = await getAllDocs(COL_EXPENSES);
  if (filters.academicYear) results = results.filter((e) => e.academicYear === filters.academicYear);
  if (filters.term)         results = results.filter((e) => e.term         === filters.term);
  if (filters.category)     results = results.filter((e) => e.category     === filters.category);
  return results.sort((a, b) => b.date?.localeCompare(a.date || '') || 0);
};

export const recordExpense = async (data, recordedBy) => {
  const today   = new Date().toISOString().split('T')[0];
  const id      = generateId('expense');
  const docData = {
    type:         'expense',
    category:     data.category,
    description:  data.description.trim(),
    amount:       Number(data.amount),
    date:         data.date         || today,
    academicYear: data.academicYear,
    term:         data.term,
    notes:        data.notes        || '',
    recordedBy,
  };
  await setDocument(COL_EXPENSES, id, docData);
  return { id, ...docData };
};

export const deleteExpense = async (id) => deleteDocument(COL_EXPENSES, id);

export const getExpenseTotal = async (academicYear, term) => {
  const expenses = await getExpenses({ academicYear, term });
  return expenses.reduce((s, e) => s + e.amount, 0);
};
