// Centralized Query Keys Factory for TanStack Query

export const queryKeys = {
  // Auth
  auth: {
    all: ['auth'] as const,
    currentUser: () => [...queryKeys.auth.all, 'currentUser'] as const,
  },

  // Academic
  academic: {
    all: ['academic'] as const,
    years: () => [...queryKeys.academic.all, 'years'] as const,
    departments: () => [...queryKeys.academic.all, 'departments'] as const,
    programs: () => [...queryKeys.academic.all, 'programs'] as const,
    semesters: () => [...queryKeys.academic.all, 'semesters'] as const,
    courses: () => [...queryKeys.academic.all, 'courses'] as const,
    sections: () => [...queryKeys.academic.all, 'sections'] as const,
  },

  // Attendance
  attendance: {
    all: ['attendance'] as const,
    facultyByEntry: (timetableEntryId: number, date: string) => 
      [...queryKeys.attendance.all, 'faculty', timetableEntryId, date] as const,
    studentAll: () => [...queryKeys.attendance.all, 'student'] as const,
    studentByDate: (date: string) => [...queryKeys.attendance.all, 'student', date] as const,
  },

  // Timetable
  timetable: {
    all: ['timetable'] as const,
    studentToday: () => [...queryKeys.timetable.all, 'student', 'today'] as const,
    studentWeekly: () => [...queryKeys.timetable.all, 'student', 'weekly'] as const,
    facultyToday: () => [...queryKeys.timetable.all, 'faculty', 'today'] as const,
    facultyWeekly: () => [...queryKeys.timetable.all, 'faculty', 'weekly'] as const,
    adminAll: () => [...queryKeys.timetable.all, 'admin'] as const,
    bySection: (classSectionId: number) => [...queryKeys.timetable.all, 'section', classSectionId] as const,
  },

  // Classrooms, Posts, Members & Chat
  classrooms: {
    all: ['classrooms'] as const,
    facultyList: () => [...queryKeys.classrooms.all, 'faculty'] as const,
    studentList: () => [...queryKeys.classrooms.all, 'student'] as const,
    detail: (id: number) => [...queryKeys.classrooms.all, id] as const,
    members: (classroomId: number) => [...queryKeys.classrooms.all, classroomId, 'members'] as const,
    facultyPosts: (classroomId: number) => [...queryKeys.classrooms.all, classroomId, 'posts', 'faculty'] as const,
    studentPosts: (classroomId: number) => [...queryKeys.classrooms.all, classroomId, 'posts', 'student'] as const,
    chatHistory: (classroomId: number) => [...queryKeys.classrooms.all, classroomId, 'chat'] as const,
    privateChat: (classroomId: number, userId: number) => [...queryKeys.classrooms.all, classroomId, 'chat', 'private', userId] as const,
  },

  // Assignments & Submissions
  assignments: {
    all: ['assignments'] as const,
    classroom: (classroomId: number, role: 'faculty' | 'student') => 
      [...queryKeys.assignments.all, 'classroom', classroomId, role] as const,
    submissions: (assignmentId: number) => 
      [...queryKeys.assignments.all, 'submissions', assignmentId] as const,
    mySubmission: (assignmentId: number) => 
      [...queryKeys.assignments.all, 'my-submission', assignmentId] as const,
  },

  // Learning Materials (Files & Folders)
  learning: {
    all: ['learning'] as const,
    classroom: (classroomId: number, role: 'faculty' | 'student') => 
      [...queryKeys.learning.all, 'classroom', classroomId, role] as const,
  },

  // Files & Attachments
  files: {
    all: ['files'] as const,
    details: (fileId: number) => [...queryKeys.files.all, fileId] as const,
  },

  // Directory (Students & Faculty)
  directory: {
    all: ['directory'] as const,
    students: () => [...queryKeys.directory.all, 'students'] as const,
    studentDetail: (id: number) => [...queryKeys.directory.all, 'students', id] as const,
    studentsBySection: (sectionId: number) => [...queryKeys.directory.all, 'students', 'section', sectionId] as const,
    faculty: () => [...queryKeys.directory.all, 'faculty'] as const,
    facultyDetail: (id: number) => [...queryKeys.directory.all, 'faculty', id] as const,
    facultyByDepartment: (deptId: number) => [...queryKeys.directory.all, 'faculty', 'department', deptId] as const,
  },
};
