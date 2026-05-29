import { getAllDocs, safeGet, setDocument } from './firebase.js';

const COL = 'attendance';

const sessionId = (date, classStream) => `att_${date}_${classStream}`;

export const getAttendanceSession = async (date, classStream) =>
  safeGet(COL, sessionId(date, classStream));

export const saveAttendanceSession = async (date, classStream, records, markedBy, config = {}) => {
  const id      = sessionId(date, classStream);
  const docData = {
    type:         'attendance_session',
    date,
    classStream,
    academicYear: config.academicYear || '',
    term:         config.term         || '',
    records,   // [{ studentId, studentName, status }]
    markedBy,
  };
  await setDocument(COL, id, docData);
  return { id, ...docData };
};

export const getAttendanceForStudent = async (studentId) => {
  const all = await getAllDocs(COL);
  return all
    .flatMap((session) => {
      const record = session.records?.find((r) => r.studentId === studentId);
      return record ? [{ date: session.date, classStream: session.classStream, status: record.status }] : [];
    })
    .sort((a, b) => b.date?.localeCompare(a.date || '') || 0);
};

export const getTodayStats = async (date) => {
  const all      = await getAllDocs(COL);
  const sessions = all.filter((s) => s.date === date);
  let present = 0, absent = 0, late = 0;
  sessions.forEach((s) => s.records?.forEach((r) => {
    if (r.status === 'present') present++;
    else if (r.status === 'absent') absent++;
    else if (r.status === 'late') late++;
  }));
  return { present, absent, late, sessions: sessions.length };
};
