export interface AcademicYear {
  id: number;
  yearName: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'UPCOMING';
}

export interface Department {
  id: number;
  departmentCode: string;
  departmentName: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Program {
  id: number;
  programCode: string;
  programName: string;
  departmentId: number;
  departmentName?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Semester {
  id: number;
  semesterName: string;
  academicYearId: number;
  academicYearName?: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'UPCOMING';
}

export interface Course {
  id: number;
  courseCode: string;
  courseTitle: string;
  credits: number;
  departmentId: number;
  departmentName?: string;
  courseType: 'THEORY' | 'LAB' | 'PROJECT';
  status: 'ACTIVE' | 'INACTIVE';
}

export interface ClassSection {
  id: number;
  sectionName: string;
  capacity: number;
  courseId: number;
  courseTitle?: string;
  status: 'ACTIVE' | 'INACTIVE';
}
