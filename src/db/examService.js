import { getAllDocs, safeGet, setDocument, deleteDocument, generateId } from './firebase.js';
import { getGrade } from '../utils/grading.js';

const COL_EXAMS   = 'exams';
const COL_RESULTS = 'exam_results';

export const getExams = async (filters = {}) => {
  let results = await getAllDocs(COL_EXAMS);
  if (filters.classLevel)   results = results.filter((e) => e.classLevel   === filters.classLevel);
  if (filters.academicYear) results = results.filter((e) => e.academicYear === filters.academicYear);
  if (filters.term)         results = results.filter((e) => e.term         === filters.term);
  if (filters.classStream)  results = results.filter(
    (e) => e.classStream === filters.classStream || e.classStream === 'all'
  );
  return results.sort((a, b) => b.date?.localeCompare(a.date || '') || 0);
};

export const getExamById = async (id) => safeGet(COL_EXAMS, id);

export const createExam = async (data, createdBy) => {
  const id      = generateId('exam');
  const today   = new Date().toISOString().split('T')[0];
  const docData = {
    type:         'exam',
    name:         data.name.trim(),
    examType:     data.examType,
    classLevel:   data.classLevel,
    classStream:  data.classStream  || 'all',
    subjectId:    data.subjectId,
    subjectName:  data.subjectName  || '',
    academicYear: data.academicYear,
    term:         data.term,
    date:         data.date         || today,
    outOf:        Number(data.outOf) || 100,
    createdBy,
  };
  await setDocument(COL_EXAMS, id, docData);
  return { id, ...docData };
};

export const deleteExam = async (id) => deleteDocument(COL_EXAMS, id);

// ── Results ───────────────────────────────────────────────────────────────────

export const getResultsForExam = async (examId) => {
  const all = await getAllDocs(COL_RESULTS);
  return all.filter((r) => r.examId === examId);
};

export const getResultsForStudent = async (studentId) => {
  const all = await getAllDocs(COL_RESULTS);
  return all.filter((r) => r.studentId === studentId);
};

export const saveResult = async (examId, studentId, marks, outOf, recordedBy) => {
  // Deterministic ID: one result per student per exam — saving twice overwrites
  const id         = `result_${examId}_${studentId}`;
  const existing   = await safeGet(COL_RESULTS, id);
  const percentage = outOf > 0 ? Math.min(100, Math.round((marks / outOf) * 100)) : 0;
  const gradeInfo  = getGrade(percentage);

  const docData = {
    type:       'exam_result',
    examId,
    studentId,
    marks:      Number(marks),
    outOf:      Number(outOf),
    percentage,
    grade:      gradeInfo.grade,
    points:     gradeInfo.points,
    remarks:    gradeInfo.remarks,
    recordedBy,
  };

  await setDocument(COL_RESULTS, id, docData);
  return { id, ...docData };
};

export const bulkSaveResults = async (examId, results, outOf, recordedBy) =>
  Promise.all(results.map((r) => saveResult(examId, r.studentId, r.marks, outOf, recordedBy)));
