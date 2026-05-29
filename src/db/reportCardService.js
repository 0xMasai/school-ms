import { getExams, getResultsForExam } from './examService.js';
import { getStudents } from './studentService.js';
import { getGradeFromMarks } from '../utils/grading.js';

/**
 * Compiles full report card data for a class/stream in a given term.
 * Groups results by subject (not by exam), averaging across CAT + Final etc.
 */
export const getReportCardData = async (classLevel, stream, academicYear, term) => {
  const streamParam = !stream || stream === 'all' ? undefined : stream.replace(classLevel, '');

  const [students, allExams] = await Promise.all([
    getStudents({ classLevel, stream: streamParam }),
    getExams({ academicYear, term }),
  ]);

  // Exams that belong to this class/stream
  const classExams = allExams.filter((e) => {
    if (e.classLevel !== classLevel) return false;
    if (e.classStream === 'all') return true;
    if (!stream || stream === 'all') return true;
    return e.classStream === stream;
  });

  if (classExams.length === 0) return { reportCards: [], classExams: [], students };

  // Fetch all results in parallel
  const resultArrays = await Promise.all(classExams.map((e) => getResultsForExam(e.id)));

  // Build lookup: examId → { studentId → {marks, outOf} }
  const resultsByExam = {};
  classExams.forEach((exam, i) => {
    resultsByExam[exam.id] = {};
    resultArrays[i].forEach((r) => {
      resultsByExam[exam.id][r.studentId] = { marks: r.marks, outOf: Number(exam.outOf) };
    });
  });

  // Group exams by subjectName so report card has one row per subject
  const subjectMap = {};
  classExams.forEach((exam) => {
    if (!subjectMap[exam.subjectName]) subjectMap[exam.subjectName] = [];
    subjectMap[exam.subjectName].push(exam);
  });
  const subjects = Object.keys(subjectMap).sort();

  // Build per-student report card
  const reportCards = students.map((student) => {
    const subjectRows = subjects.map((subjectName) => {
      const examsForSubject = subjectMap[subjectName];

      // Collect each exam's marks for this student
      const examResults = examsForSubject.map((exam) => {
        const r = resultsByExam[exam.id]?.[student.id];
        return r ? { marks: r.marks, outOf: r.outOf, examType: exam.examType, examName: exam.name } : null;
      }).filter(Boolean);

      const totalMarks  = examResults.reduce((s, r) => s + r.marks, 0);
      const totalOutOf  = examResults.reduce((s, r) => s + r.outOf, 0);
      const gradeInfo   = examResults.length > 0 ? getGradeFromMarks(totalMarks, totalOutOf) : null;

      return {
        subjectName,
        examResults,           // individual CAT/Midterm/Final breakdown
        totalMarks:  examResults.length > 0 ? totalMarks  : null,
        totalOutOf:  examResults.length > 0 ? totalOutOf  : null,
        percentage:  gradeInfo?.percentage ?? null,
        grade:       gradeInfo?.grade      ?? '—',
        remarks:     gradeInfo?.remarks    ?? '',
      };
    });

    const attempted       = subjectRows.filter((r) => r.totalMarks !== null);
    const aggMarks        = attempted.reduce((s, r) => s + r.totalMarks, 0);
    const aggOutOf        = attempted.reduce((s, r) => s + r.totalOutOf, 0);
    const avgPercentage   = aggOutOf > 0 ? Math.round((aggMarks / aggOutOf) * 100) : null;
    const overallGrade    = aggOutOf > 0 ? getGradeFromMarks(aggMarks, aggOutOf) : null;

    return {
      student,
      subjectRows,
      aggMarks,
      aggOutOf,
      avgPercentage,
      overallGrade:  overallGrade?.grade   ?? '—',
      overallRemarks: overallGrade?.remarks ?? '',
    };
  });

  // Rank students by average percentage (descending)
  const ranked = [...reportCards].sort(
    (a, b) => (b.avgPercentage ?? -1) - (a.avgPercentage ?? -1),
  );
  ranked.forEach((card, i) => {
    card.position    = card.avgPercentage !== null ? i + 1 : null;
    card.totalInClass = students.length;
  });

  return { reportCards, classExams, subjects, students, classLevel, stream, academicYear, term };
};
