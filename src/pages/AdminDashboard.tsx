import React, { useState } from 'react';
import { useAuth } from '../features/auth/context/AuthContext';
import { AppShell } from '../components/layout/AppShell';
import { MetricCard } from '../features/dashboard/components/MetricCard';
import { useAdminDashboard } from '../features/dashboard/hooks/useDashboard';
import {
  useAcademicYears,
  useCreateAcademicYear,
  useUpdateAcademicYearStatus,
  useDepartments,
  useCreateDepartment,
  useUpdateDepartmentStatus,
  usePrograms,
  useCreateProgram,
  useUpdateProgramStatus,
  useSemesters,
  useCreateSemester,
  useUpdateSemesterStatus,
  useCourses,
  useCreateCourse,
  useUpdateCourseStatus,
  useClassSections,
  useCreateClassSection,
  useUpdateClassSectionStatus,
} from '../features/academic/hooks/useAcademic';
import {
  useStudents,
  useCreateStudent,
  useDeleteStudent,
  useFaculty,
  useCreateFaculty,
  useDeleteFaculty,
} from '../features/directory/hooks/useDirectory';
import { StudentDirectoryTable } from '../features/directory/components/StudentDirectoryTable';
import { FacultyDirectoryTable } from '../features/directory/components/FacultyDirectoryTable';
import { CreateStudentModal } from '../features/directory/components/CreateStudentModal';
import { CreateFacultyModal } from '../features/directory/components/CreateFacultyModal';
import { UserManagementView } from '../features/users/components/UserManagementView';
import { CurriculumManagementView } from '../features/curriculum/components/CurriculumManagementView';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { useToast } from '../components/common/ToastContext';
import {
  LayoutDashboard,
  FolderTree,
  GraduationCap,
  BookOpen,
  Users,
  Layers,
  Plus,
  FileText,
  School,
} from 'lucide-react';
import type { CourseType } from '../features/academic/types';

interface AdminDashboardProps {
  onNavigate?: (route: string) => void;
}

type TabType = 'dashboard' | 'academic' | 'students' | 'faculty' | 'curriculum' | 'users';
type AcademicSubTab = 'years' | 'departments' | 'programs' | 'semesters' | 'courses' | 'sections';

export const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [academicSubTab, setAcademicSubTab] = useState<AcademicSubTab>('years');

  // Modals
  const [showAddAcademicModal, setShowAddAcademicModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddFacultyModal, setShowAddFacultyModal] = useState(false);

  // Dashboard Aggregated Metrics
  const { data: dashboardData } = useAdminDashboard();

  // Academic Live Endpoints
  const { data: liveAcademicYears = [] } = useAcademicYears();
  const { data: liveDepartments = [] } = useDepartments();
  const { data: livePrograms = [] } = usePrograms();
  const { data: liveSemesters = [] } = useSemesters();
  const { data: liveCourses = [] } = useCourses();
  const { data: liveClassSections = [] } = useClassSections();

  // Directory Queries
  const { data: liveStudents = [], isLoading: isLoadingStudents } = useStudents();
  const { data: liveFaculty = [], isLoading: isLoadingFaculty } = useFaculty();

  // Academic Mutations
  const createAcademicYearMutation = useCreateAcademicYear();
  const updateYearStatusMutation = useUpdateAcademicYearStatus();
  const createDepartmentMutation = useCreateDepartment();
  const updateDeptStatusMutation = useUpdateDepartmentStatus();
  const createProgramMutation = useCreateProgram();
  const updateProgramStatusMutation = useUpdateProgramStatus();
  const createSemesterMutation = useCreateSemester();
  const updateSemesterStatusMutation = useUpdateSemesterStatus();
  const createCourseMutation = useCreateCourse();
  const updateCourseStatusMutation = useUpdateCourseStatus();
  const createClassSectionMutation = useCreateClassSection();
  const updateSectionStatusMutation = useUpdateClassSectionStatus();

  // Directory Mutations
  const createStudentMutation = useCreateStudent();
  const deleteStudentMutation = useDeleteStudent();
  const createFacultyMutation = useCreateFaculty();
  const deleteFacultyMutation = useDeleteFaculty();

  // Academic Form State
  const [yearForm, setYearForm] = useState({ name: '', startDate: '', endDate: '' });
  const [deptForm, setDeptForm] = useState({ code: '', name: '', description: '' });
  const [progForm, setProgForm] = useState({ departmentId: 0, code: '', name: '', durationYears: 4, description: '' });
  const [semForm, setSemForm] = useState({ programId: 0, semesterNumber: 1, name: '' });
  const [courseForm, setCourseForm] = useState({
    departmentId: 0,
    programId: 0,
    semesterId: 0,
    code: '',
    name: '',
    credits: 3,
    courseType: 'CORE' as CourseType,
    description: '',
  });
  const [sectionForm, setSectionForm] = useState({ semesterId: 0, name: '', description: '' });

  const handleCreateAcademicRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (academicSubTab === 'years') {
        await createAcademicYearMutation.mutateAsync(yearForm);
        success('Academic Year Created', `Year "${yearForm.name}" created successfully.`);
        setYearForm({ name: '', startDate: '', endDate: '' });
      } else if (academicSubTab === 'departments') {
        await createDepartmentMutation.mutateAsync(deptForm);
        success('Department Created', `Department "${deptForm.name}" created.`);
        setDeptForm({ code: '', name: '', description: '' });
      } else if (academicSubTab === 'programs') {
        if (!progForm.departmentId) {
          error('Validation', 'Please select a department.');
          return;
        }
        await createProgramMutation.mutateAsync(progForm);
        success('Program Created', `Degree program "${progForm.name}" created.`);
        setProgForm({ departmentId: 0, code: '', name: '', durationYears: 4, description: '' });
      } else if (academicSubTab === 'semesters') {
        if (!semForm.programId) {
          error('Validation', 'Please select a program.');
          return;
        }
        await createSemesterMutation.mutateAsync(semForm);
        success('Semester Created', `Semester "${semForm.name}" created.`);
        setSemForm({ programId: 0, semesterNumber: 1, name: '' });
      } else if (academicSubTab === 'courses') {
        if (!courseForm.departmentId || !courseForm.programId || !courseForm.semesterId) {
          error('Validation', 'Please select Department, Program, and Semester.');
          return;
        }
        await createCourseMutation.mutateAsync(courseForm);
        success('Course Created', `Course "${courseForm.name}" created.`);
        setCourseForm({
          departmentId: 0,
          programId: 0,
          semesterId: 0,
          code: '',
          name: '',
          credits: 3,
          courseType: 'CORE',
          description: '',
        });
      } else if (academicSubTab === 'sections') {
        if (!sectionForm.semesterId) {
          error('Validation', 'Please select a semester.');
          return;
        }
        await createClassSectionMutation.mutateAsync(sectionForm);
        success('Class Section Created', `Section "${sectionForm.name}" created.`);
        setSectionForm({ semesterId: 0, name: '', description: '' });
      }
      setShowAddAcademicModal(false);
    } catch (err: any) {
      error('Creation Failed', err?.message || 'Check validation constraints.');
    }
  };

  const handleToggleAcademicStatus = async (type: AcademicSubTab, id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      if (type === 'years') await updateYearStatusMutation.mutateAsync({ id, status: nextStatus });
      else if (type === 'departments') await updateDeptStatusMutation.mutateAsync({ id, status: nextStatus });
      else if (type === 'programs') await updateProgramStatusMutation.mutateAsync({ id, status: nextStatus });
      else if (type === 'semesters') await updateSemesterStatusMutation.mutateAsync({ id, status: nextStatus });
      else if (type === 'courses') await updateCourseStatusMutation.mutateAsync({ id, status: nextStatus });
      else if (type === 'sections') await updateSectionStatusMutation.mutateAsync({ id, status: nextStatus });
      success('Status Updated', `Entity marked as ${nextStatus}.`);
    } catch (err: any) {
      error('Update failed', err?.message);
    }
  };

  return (
    <AppShell activeRole="ADMIN">
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E5E5E5] p-5 sm:p-6 rounded-2xl shadow-xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#171717] tracking-tight">
              Institutional Administration
            </h1>
            <p className="text-xs text-[#737373] mt-0.5">
              Manage institution curriculum, directory rosters, academic calendar, and user governance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
              {user?.rawRole || 'INSTITUTION_ADMIN'}
            </span>
          </div>
        </div>

        {/* Top Primary Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-[#E5E5E5] pb-2 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-[#F97316] text-white shadow-xs'
                : 'text-[#737373] hover:text-[#171717] hover:bg-neutral-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('academic')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'academic'
                ? 'bg-[#F97316] text-white shadow-xs'
                : 'text-[#737373] hover:text-[#171717] hover:bg-neutral-100'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Academic Structure</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('curriculum')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'curriculum'
                ? 'bg-[#F97316] text-white shadow-xs'
                : 'text-[#737373] hover:text-[#171717] hover:bg-neutral-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Curriculum & Offerings</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'students'
                ? 'bg-[#F97316] text-white shadow-xs'
                : 'text-[#737373] hover:text-[#171717] hover:bg-neutral-100'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Students ({liveStudents.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('faculty')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'faculty'
                ? 'bg-[#F97316] text-white shadow-xs'
                : 'text-[#737373] hover:text-[#171717] hover:bg-neutral-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Faculty ({liveFaculty.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-[#F97316] text-white shadow-xs'
                : 'text-[#737373] hover:text-[#171717] hover:bg-neutral-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User Accounts</span>
          </button>
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <MetricCard
                title="TOTAL USERS"
                value={String(dashboardData?.totalUsers ?? liveStudents.length + liveFaculty.length)}
                sub="Accounts registered"
                icon={<Users className="w-5 h-5 text-purple-600" />}
                bg="bg-purple-50"
              />
              <MetricCard
                title="TOTAL STUDENTS"
                value={String(dashboardData?.totalStudents ?? liveStudents.length)}
                sub="Enrolled scholars"
                icon={<GraduationCap className="w-5 h-5 text-emerald-600" />}
                bg="bg-emerald-50"
              />
              <MetricCard
                title="TOTAL FACULTY"
                value={String(dashboardData?.totalFaculty ?? liveFaculty.length)}
                sub="Instructors & staff"
                icon={<BookOpen className="w-5 h-5 text-blue-600" />}
                bg="bg-blue-50"
              />
              <MetricCard
                title="CLASSROOMS"
                value={String(dashboardData?.totalClassrooms ?? liveClassSections.length)}
                sub="Active spaces"
                icon={<School className="w-5 h-5 text-[#F97316]" />}
                bg="bg-orange-50"
              />
              <MetricCard
                title="ASSIGNMENTS"
                value={String(dashboardData?.totalAssignments ?? 0)}
                sub="Tasks published"
                icon={<FileText className="w-5 h-5 text-amber-600" />}
                bg="bg-amber-50"
              />
              <MetricCard
                title="LEARNING ASSETS"
                value={String(dashboardData?.totalLearningMaterials ?? 0)}
                sub="Library materials"
                icon={<Layers className="w-5 h-5 text-rose-600" />}
                bg="bg-rose-50"
              />
            </div>

            {/* Quick Structure Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-[#E5E5E5] p-5 rounded-2xl shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#171717]">Academic Overview</h3>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('academic')}>
                    Manage Structure
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-neutral-50 border border-[#E5E5E5]">
                    <span className="text-[#737373]">Academic Years</span>
                    <p className="text-lg font-bold text-[#171717] mt-1">{liveAcademicYears.length}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-50 border border-[#E5E5E5]">
                    <span className="text-[#737373]">Departments</span>
                    <p className="text-lg font-bold text-[#171717] mt-1">{liveDepartments.length}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-50 border border-[#E5E5E5]">
                    <span className="text-[#737373]">Degree Programs</span>
                    <p className="text-lg font-bold text-[#171717] mt-1">{livePrograms.length}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-50 border border-[#E5E5E5]">
                    <span className="text-[#737373]">Course Catalog</span>
                    <p className="text-lg font-bold text-[#171717] mt-1">{liveCourses.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#E5E5E5] p-5 rounded-2xl shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#171717]">Institutional Setup</h3>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('users')}>
                    View Accounts
                  </Button>
                </div>
                <p className="text-xs text-[#737373] leading-relaxed">
                  Institutional administration enforces role-based security, campus-wide timetable orchestration, and curriculum enrollment management.
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setActiveTab('academic');
                      setAcademicSubTab('courses');
                      setShowAddAcademicModal(true);
                    }}
                    className="text-xs"
                  >
                    Add Course
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddStudentModal(true)}
                    className="text-xs"
                  >
                    Add Student
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddFacultyModal(true)}
                    className="text-xs"
                  >
                    Add Faculty
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. ACADEMIC STRUCTURE TAB */}
        {activeTab === 'academic' && (
          <div className="space-y-5">
            {/* Sub-tabs header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-3">
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {(['years', 'departments', 'programs', 'semesters', 'courses', 'sections'] as AcademicSubTab[]).map(
                  (sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setAcademicSubTab(sub)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer capitalize ${
                        academicSubTab === sub
                          ? 'bg-neutral-900 text-white'
                          : 'text-[#737373] hover:text-[#171717] hover:bg-neutral-100'
                      }`}
                    >
                      {sub}
                    </button>
                  )
                )}
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowAddAcademicModal(true)}
                className="flex items-center gap-1.5 text-xs shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>
                  Add {academicSubTab === 'years' ? 'Academic Year' : academicSubTab.slice(0, -1)}
                </span>
              </Button>
            </div>

            {/* Sub-tab Tables */}
            <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-neutral-50/75 border-b border-[#E5E5E5] text-[#737373] font-bold">
                      <th className="py-3 px-4">Name / Title</th>
                      <th className="py-3 px-4">Code / Details</th>
                      <th className="py-3 px-4">Relationship</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E5]">
                    {academicSubTab === 'years' &&
                      liveAcademicYears.map((y) => (
                        <tr key={y.id} className="hover:bg-neutral-50/50">
                          <td className="py-3 px-4 font-bold text-[#171717]">{y.name || y.yearName}</td>
                          <td className="py-3 px-4 text-[#737373]">
                            {y.startDate} to {y.endDate}
                          </td>
                          <td className="py-3 px-4 text-[#737373]">—</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {y.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleToggleAcademicStatus('years', y.id, y.status)}
                              className="text-[11px] text-[#F97316] hover:underline font-semibold"
                            >
                              Toggle Status
                            </button>
                          </td>
                        </tr>
                      ))}

                    {academicSubTab === 'departments' &&
                      liveDepartments.map((d) => (
                        <tr key={d.id} className="hover:bg-neutral-50/50">
                          <td className="py-3 px-4 font-bold text-[#171717]">{d.name || d.departmentName}</td>
                          <td className="py-3 px-4 font-mono font-semibold text-[#737373]">{d.code || d.departmentCode}</td>
                          <td className="py-3 px-4 text-[#737373] truncate max-w-xs">{d.description || '—'}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {d.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleToggleAcademicStatus('departments', d.id, d.status)}
                              className="text-[11px] text-[#F97316] hover:underline font-semibold"
                            >
                              Toggle Status
                            </button>
                          </td>
                        </tr>
                      ))}

                    {academicSubTab === 'programs' &&
                      livePrograms.map((p) => (
                        <tr key={p.id} className="hover:bg-neutral-50/50">
                          <td className="py-3 px-4 font-bold text-[#171717]">{p.name || p.programName}</td>
                          <td className="py-3 px-4 font-mono font-semibold text-[#737373]">{p.code || p.programCode}</td>
                          <td className="py-3 px-4 text-[#737373]">{p.departmentName || `Dept #${p.departmentId}`}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleToggleAcademicStatus('programs', p.id, p.status)}
                              className="text-[11px] text-[#F97316] hover:underline font-semibold"
                            >
                              Toggle Status
                            </button>
                          </td>
                        </tr>
                      ))}

                    {academicSubTab === 'semesters' &&
                      liveSemesters.map((s) => (
                        <tr key={s.id} className="hover:bg-neutral-50/50">
                          <td className="py-3 px-4 font-bold text-[#171717]">{s.name || s.semesterName}</td>
                          <td className="py-3 px-4 text-[#737373]">Semester #{s.semesterNumber}</td>
                          <td className="py-3 px-4 text-[#737373]">{s.programName || `Program #${s.programId}`}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {s.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleToggleAcademicStatus('semesters', s.id, s.status)}
                              className="text-[11px] text-[#F97316] hover:underline font-semibold"
                            >
                              Toggle Status
                            </button>
                          </td>
                        </tr>
                      ))}

                    {academicSubTab === 'courses' &&
                      liveCourses.map((c) => (
                        <tr key={c.id} className="hover:bg-neutral-50/50">
                          <td className="py-3 px-4 font-bold text-[#171717]">{c.name || c.courseTitle}</td>
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-[#737373]">{c.code || c.courseCode}</span>
                            <span className="ml-2 px-1.5 py-0.5 bg-neutral-100 rounded text-[10px] font-semibold text-[#737373]">
                              {c.credits} Credits ({c.courseType})
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[#737373]">
                            {c.departmentName || `Dept #${c.departmentId}`} / {c.semesterName || `Sem #${c.semesterId}`}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {c.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleToggleAcademicStatus('courses', c.id, c.status)}
                              className="text-[11px] text-[#F97316] hover:underline font-semibold"
                            >
                              Toggle Status
                            </button>
                          </td>
                        </tr>
                      ))}

                    {academicSubTab === 'sections' &&
                      liveClassSections.map((sec) => (
                        <tr key={sec.id} className="hover:bg-neutral-50/50">
                          <td className="py-3 px-4 font-bold text-[#171717]">{sec.name || sec.sectionName}</td>
                          <td className="py-3 px-4 text-[#737373]">{sec.description || 'General Section'}</td>
                          <td className="py-3 px-4 text-[#737373]">
                            {sec.semesterName || `Semester #${sec.semesterId}`}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {sec.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleToggleAcademicStatus('sections', sec.id, sec.status)}
                              className="text-[11px] text-[#F97316] hover:underline font-semibold"
                            >
                              Toggle Status
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. CURRICULUM TAB */}
        {activeTab === 'curriculum' && <CurriculumManagementView />}

        {/* 4. STUDENTS DIRECTORY TAB */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowAddStudentModal(true)}
                className="flex items-center gap-1.5 text-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Student Record</span>
              </Button>
            </div>
            <StudentDirectoryTable
              students={liveStudents}
              isLoading={isLoadingStudents}
              onDeleteStudent={deleteStudentMutation.mutateAsync}
            />
          </div>
        )}

        {/* 5. FACULTY DIRECTORY TAB */}
        {activeTab === 'faculty' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowAddFacultyModal(true)}
                className="flex items-center gap-1.5 text-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Faculty Member</span>
              </Button>
            </div>
            <FacultyDirectoryTable
              faculty={liveFaculty}
              isLoading={isLoadingFaculty}
              onDeleteFaculty={deleteFacultyMutation.mutateAsync}
            />
          </div>
        )}

        {/* 6. USERS MANAGEMENT TAB */}
        {activeTab === 'users' && <UserManagementView />}

        {/* Modals for Academic Creations */}
        <Modal
          isOpen={showAddAcademicModal}
          onClose={() => setShowAddAcademicModal(false)}
          title={`Create ${
            academicSubTab === 'years'
              ? 'Academic Year'
              : academicSubTab.charAt(0).toUpperCase() + academicSubTab.slice(1, -1)
          }`}
          description="Configure institutional curriculum hierarchy."
        >
          <form onSubmit={handleCreateAcademicRecord} className="space-y-3.5">
            {academicSubTab === 'years' && (
              <>
                <Input
                  label="Academic Year Name *"
                  placeholder="e.g. 2026-2027"
                  value={yearForm.name}
                  onChange={(e) => setYearForm({ ...yearForm, name: e.target.value })}
                  required
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Start Date *"
                    type="date"
                    value={yearForm.startDate}
                    onChange={(e) => setYearForm({ ...yearForm, startDate: e.target.value })}
                    required
                  />
                  <Input
                    label="End Date *"
                    type="date"
                    value={yearForm.endDate}
                    onChange={(e) => setYearForm({ ...yearForm, endDate: e.target.value })}
                    required
                  />
                </div>
              </>
            )}

            {academicSubTab === 'departments' && (
              <>
                <Input
                  label="Department Code *"
                  placeholder="e.g. CS"
                  value={deptForm.code}
                  onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value })}
                  required
                />
                <Input
                  label="Department Name *"
                  placeholder="e.g. Computer Science & Engineering"
                  value={deptForm.name}
                  onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                  required
                />
                <Input
                  label="Description"
                  placeholder="Department details..."
                  value={deptForm.description}
                  onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                />
              </>
            )}

            {academicSubTab === 'programs' && (
              <>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#171717]">Department *</label>
                  <select
                    required
                    value={progForm.departmentId || ''}
                    onChange={(e) => setProgForm({ ...progForm, departmentId: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[#E5E5E5] rounded-xl text-xs"
                  >
                    <option value="">Select Department...</option>
                    {liveDepartments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name || d.departmentName}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Program Code *"
                  placeholder="e.g. BTECH-CSE"
                  value={progForm.code}
                  onChange={(e) => setProgForm({ ...progForm, code: e.target.value })}
                  required
                />
                <Input
                  label="Program Name *"
                  placeholder="e.g. Bachelor of Technology in Computer Science"
                  value={progForm.name}
                  onChange={(e) => setProgForm({ ...progForm, name: e.target.value })}
                  required
                />
                <Input
                  label="Duration (Years) *"
                  type="number"
                  min="1"
                  max="10"
                  value={progForm.durationYears}
                  onChange={(e) => setProgForm({ ...progForm, durationYears: Number(e.target.value) })}
                  required
                />
              </>
            )}

            {academicSubTab === 'semesters' && (
              <>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#171717]">Program *</label>
                  <select
                    required
                    value={semForm.programId || ''}
                    onChange={(e) => setSemForm({ ...semForm, programId: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[#E5E5E5] rounded-xl text-xs"
                  >
                    <option value="">Select Program...</option>
                    {livePrograms.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name || p.programName}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Semester Number *"
                  type="number"
                  min="1"
                  max="20"
                  value={semForm.semesterNumber}
                  onChange={(e) => setSemForm({ ...semForm, semesterNumber: Number(e.target.value) })}
                  required
                />
                <Input
                  label="Semester Name *"
                  placeholder="e.g. Fall Semester 2026"
                  value={semForm.name}
                  onChange={(e) => setSemForm({ ...semForm, name: e.target.value })}
                  required
                />
              </>
            )}

            {academicSubTab === 'courses' && (
              <>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#171717]">Department *</label>
                  <select
                    required
                    value={courseForm.departmentId || ''}
                    onChange={(e) => setCourseForm({ ...courseForm, departmentId: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[#E5E5E5] rounded-xl text-xs"
                  >
                    <option value="">Select Department...</option>
                    {liveDepartments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name || d.departmentName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-[#171717]">Program *</label>
                    <select
                      required
                      value={courseForm.programId || ''}
                      onChange={(e) => setCourseForm({ ...courseForm, programId: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-[#E5E5E5] rounded-xl text-xs"
                    >
                      <option value="">Select Program...</option>
                      {livePrograms.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name || p.programName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-[#171717]">Semester *</label>
                    <select
                      required
                      value={courseForm.semesterId || ''}
                      onChange={(e) => setCourseForm({ ...courseForm, semesterId: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-[#E5E5E5] rounded-xl text-xs"
                    >
                      <option value="">Select Semester...</option>
                      {liveSemesters.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name || s.semesterName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Course Code *"
                    placeholder="e.g. CS301"
                    value={courseForm.code}
                    onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                    required
                  />
                  <Input
                    label="Credits *"
                    type="number"
                    min="1"
                    max="20"
                    value={courseForm.credits}
                    onChange={(e) => setCourseForm({ ...courseForm, credits: Number(e.target.value) })}
                    required
                  />
                </div>

                <Input
                  label="Course Title *"
                  placeholder="e.g. Database Management Systems"
                  value={courseForm.name}
                  onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                  required
                />

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#171717]">Course Type *</label>
                  <select
                    value={courseForm.courseType}
                    onChange={(e) => setCourseForm({ ...courseForm, courseType: e.target.value as CourseType })}
                    className="w-full px-3 py-2 bg-white border border-[#E5E5E5] rounded-xl text-xs"
                  >
                    <option value="CORE">Core</option>
                    <option value="ELECTIVE">Elective</option>
                    <option value="LAB">Lab</option>
                    <option value="PROJECT">Project</option>
                  </select>
                </div>
              </>
            )}

            {academicSubTab === 'sections' && (
              <>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#171717]">Semester *</label>
                  <select
                    required
                    value={sectionForm.semesterId || ''}
                    onChange={(e) => setSectionForm({ ...sectionForm, semesterId: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[#E5E5E5] rounded-xl text-xs"
                  >
                    <option value="">Select Semester...</option>
                    {liveSemesters.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name || s.semesterName} ({s.programName})
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Section Name *"
                  placeholder="e.g. Section A"
                  value={sectionForm.name}
                  onChange={(e) => setSectionForm({ ...sectionForm, name: e.target.value })}
                  required
                />

                <Input
                  label="Description"
                  placeholder="e.g. Morning cohort"
                  value={sectionForm.description}
                  onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })}
                />
              </>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E5E5E5]">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowAddAcademicModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Create Record
              </Button>
            </div>
          </form>
        </Modal>

        {/* Directory Modals */}
        <CreateStudentModal
          isOpen={showAddStudentModal}
          onClose={() => setShowAddStudentModal(false)}
          onSubmit={async (data) => {
            await createStudentMutation.mutateAsync(data);
          }}
        />

        <CreateFacultyModal
          isOpen={showAddFacultyModal}
          onClose={() => setShowAddFacultyModal(false)}
          onSubmit={async (data) => {
            await createFacultyMutation.mutateAsync(data);
          }}
        />
      </div>
    </AppShell>
  );
};

export default AdminDashboard;
