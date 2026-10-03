export interface AdminDashboardData {
  institutionId?: number;
  institutionName?: string;
  totalUsers: number;
  totalStudents: number;
  totalFaculty: number;
  totalClassrooms: number;
  totalAssignments: number;
  totalLearningMaterials: number;
}

export interface UpcomingAssignment {
  assignmentId: number;
  classroomId: number;
  classroomName: string;
  title: string;
  dueDate: string;
  maxMarks: number;
}

export interface FacultyDashboardData {
  facultyId: number;
  facultyName: string;
  email: string;
  classroomCount: number;
  studentCount: number;
  assignmentCount: number;
  learningMaterialCount: number;
  upcomingAssignments: UpcomingAssignment[];
}

export interface StudentDashboardData {
  studentId: number;
  studentName: string;
  email: string;
  enrollmentNumber: string;
  classroomCount: number;
  assignmentCount: number;
  learningMaterialCount: number;
  upcomingAssignments: UpcomingAssignment[];
}
