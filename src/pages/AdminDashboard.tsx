import React, { useState } from 'react';
import { Logo } from '../components/common/Logo';
import { useAuth } from '../features/auth/context/AuthContext';
import {
  useAcademicYears,
  useCreateAcademicYear,
  useDepartments,
  useCreateDepartment,
  usePrograms,
  useSemesters,
  useCourses,
  useCreateCourse,
  useClassSections,
  useCreateClassSection,
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
import { 
  LayoutDashboard, 
  FolderTree, 
  GraduationCap, 
  BookOpen, 
  LogOut, 
  Plus, 
  Inbox
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (route: string) => void;
}

type TabType = 'dashboard' | 'academic' | 'students' | 'faculty';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();

  const adminName = user?.firstName 
    ? `${user.firstName} ${user.lastName || ''}`.trim() 
    : (user?.email ? user.email.split('@')[0] : 'Administrator');
  const adminEmail = user?.email || 'admin@institution.edu';
  const adminInitials = user?.firstName 
    ? `${user.firstName[0]}${user.lastName ? user.lastName[0] : ''}` 
    : (user?.email ? user.email.slice(0, 2).toUpperCase() : 'AD');

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [academicSubTab, setAcademicSubTab] = useState<'years' | 'departments' | 'programs' | 'semesters' | 'courses' | 'sections'>('years');
  const [showAddAcademicModal, setShowAddAcademicModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddFacultyModal, setShowAddFacultyModal] = useState(false);

  // TanStack Query Live Endpoints
  const { data: liveAcademicYears = [], isLoading: isLoadingYears } = useAcademicYears();
  const { data: liveDepartments = [], isLoading: isLoadingDepts } = useDepartments();
  const { data: livePrograms = [] } = usePrograms();
  const { data: liveSemesters = [] } = useSemesters();
  const { data: liveCourses = [], isLoading: isLoadingCourses } = useCourses();
  const { data: liveClassSections = [], isLoading: isLoadingSections } = useClassSections();

  // Directory Queries
  const { data: liveStudents = [], isLoading: isLoadingStudents } = useStudents();
  const { data: liveFaculty = [], isLoading: isLoadingFaculty } = useFaculty();

  // Mutations
  const createAcademicYearMutation = useCreateAcademicYear();
  const createDepartmentMutation = useCreateDepartment();
  const createCourseMutation = useCreateCourse();
  const createClassSectionMutation = useCreateClassSection();
  const createStudentMutation = useCreateStudent();
  const deleteStudentMutation = useDeleteStudent();
  const createFacultyMutation = useCreateFaculty();
  const deleteFacultyMutation = useDeleteFaculty();

  const totalActiveYears = liveAcademicYears.length;
  const totalActiveDepts = liveDepartments.length;
  const totalActiveCourses = liveCourses.length;
  const totalActiveSections = liveClassSections.length;

  const handleLogout = () => {
    logout();
    onNavigate('/login');
  };

  const handleCreateAcademicRecord = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      if (academicSubTab === 'years') {
        await createAcademicYearMutation.mutateAsync({
          yearName: formData.get('yearName') as string,
          startDate: formData.get('startDate') as string,
          endDate: formData.get('endDate') as string,
          status: 'ACTIVE',
        });
      } else if (academicSubTab === 'departments') {
        await createDepartmentMutation.mutateAsync({
          departmentName: formData.get('departmentName') as string,
          departmentCode: formData.get('departmentCode') as string,
          status: 'ACTIVE',
        });
      } else if (academicSubTab === 'courses') {
        await createCourseMutation.mutateAsync({
          courseTitle: formData.get('courseTitle') as string,
          courseCode: formData.get('courseCode') as string,
          credits: Number(formData.get('credits') || 3),
          departmentId: Number(formData.get('departmentId') || (liveDepartments[0]?.id || 1)),
          courseType: 'THEORY',
          status: 'ACTIVE',
        });
      } else if (academicSubTab === 'sections') {
        await createClassSectionMutation.mutateAsync({
          sectionName: formData.get('sectionName') as string,
          capacity: Number(formData.get('capacity') || 50),
          courseId: Number(formData.get('courseId') || (liveCourses[0]?.id || 1)),
          status: 'ACTIVE',
        });
      }
      setShowAddAcademicModal(false);
    } catch {
      setShowAddAcademicModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex text-[#171717] font-sans selection:bg-[#F97316] selection:text-white">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-[#E5E5E5] flex flex-col shrink-0">
        <div className="p-5 border-b border-[#E5E5E5]">
          <Logo size="md" />
          <span className="text-[10px] uppercase tracking-wider text-[#737373] block mt-1 font-bold">Admin Console</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'dashboard' ? 'bg-orange-50 text-[#F97316] font-bold' : 'hover:bg-[#F7F7F7] text-[#525252]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button 
            onClick={() => setActiveTab('academic')} 
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'academic' ? 'bg-orange-50 text-[#F97316] font-bold' : 'hover:bg-[#F7F7F7] text-[#525252]'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Academic Setup</span>
          </button>

          <button 
            onClick={() => setActiveTab('students')} 
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'students' ? 'bg-orange-50 text-[#F97316] font-bold' : 'hover:bg-[#F7F7F7] text-[#525252]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Student Directory</span>
          </button>

          <button 
            onClick={() => setActiveTab('faculty')} 
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'faculty' ? 'bg-orange-50 text-[#F97316] font-bold' : 'hover:bg-[#F7F7F7] text-[#525252]'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Faculty Directory</span>
          </button>
        </nav>

        <div className="p-4 border-t border-[#E5E5E5]">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-[#E5E5E5] px-8 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-sm text-[#171717]">Operations Command Console</h2>
            <span className="text-[10px] bg-orange-50 text-[#F97316] font-bold px-2 py-0.5 rounded-full border border-orange-200">
              TanStack Query Active
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="font-bold text-xs block text-[#171717]">{adminName}</span>
              <span className="text-[10px] text-[#737373]">{adminEmail}</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center font-bold text-[#F97316] text-xs">
              {adminInitials}
            </div>
          </div>
        </header>

        <div className="flex-1 p-8">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
              {/* Banner */}
              <div className="bg-gradient-to-r from-[#F97316] to-[#EA580C] p-6 rounded-2xl text-white shadow-md relative overflow-hidden flex items-center justify-between">
                <div className="space-y-1.5 relative z-10 max-w-xl">
                  <span className="text-[10px] uppercase font-extrabold tracking-widest bg-white/20 px-2 py-0.5 rounded-md">
                    Administration
                  </span>
                  <h3 className="text-xl font-black">EduConflux Academic Command Center</h3>
                  <p className="text-xs text-orange-100 font-normal leading-relaxed">
                    Provision academic periods, register departments, manage courses, and review real-time roster databases.
                  </p>
                </div>
                <div className="absolute right-[-5%] bottom-[-20%] text-white/10 text-9xl font-black select-none pointer-events-none">
                  ADM
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Academic Years', value: isLoadingYears ? '...' : totalActiveYears, desc: 'Configured academic years', gradient: 'from-orange-500 to-amber-500' },
                  { label: 'Departments', value: isLoadingDepts ? '...' : totalActiveDepts, desc: 'Active institutional departments', gradient: 'from-blue-500 to-indigo-500' },
                  { label: 'Course Catalog', value: isLoadingCourses ? '...' : totalActiveCourses, desc: 'Courses cataloged in DB', gradient: 'from-emerald-500 to-teal-500' },
                  { label: 'Class Sections', value: isLoadingSections ? '...' : totalActiveSections, desc: 'Active class sections', gradient: 'from-purple-500 to-pink-500' }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white border border-[#E5E5E5]/60 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
                    <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${stat.gradient}`} />
                    <span className="text-[10px] font-extrabold text-[#737373] block uppercase tracking-wider">{stat.label}</span>
                    <span className="text-3xl font-black text-[#171717] block mt-2 group-hover:scale-105 transition-transform duration-200">{stat.value}</span>
                    <span className="text-[11px] text-[#737373] block mt-1">{stat.desc}</span>
                  </div>
                ))}
              </div>

              {/* Live Directory Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-xs flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#737373]">Student Roster</span>
                    <h4 className="text-2xl font-black text-[#171717]">
                      {isLoadingStudents ? '...' : liveStudents.length} Registered
                    </h4>
                    <p className="text-xs text-[#525252]">Active students enrolled across institutional programs.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('students')}
                    className="px-4 py-2 bg-orange-50 text-[#F97316] hover:bg-orange-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    View Students →
                  </button>
                </div>

                <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-xs flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#737373]">Faculty Members</span>
                    <h4 className="text-2xl font-black text-[#171717]">
                      {isLoadingFaculty ? '...' : liveFaculty.length} Registered
                    </h4>
                    <p className="text-xs text-[#525252]">Faculty and instructors assigned across departments.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('faculty')}
                    className="px-4 py-2 bg-orange-50 text-[#F97316] hover:bg-orange-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    View Faculty →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Academic Setup Tab */}
          {activeTab === 'academic' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-[#171717]">Academic Workspace Configuration</h2>
                  <p className="text-xs text-[#737373]">Manage institutional terms, departments, programs, and courses directly in the database</p>
                </div>

                <button 
                  onClick={() => setShowAddAcademicModal(true)}
                  className="flex items-center gap-2 bg-[#F97316] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#EA580C] transition-all cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Add Record
                </button>
              </div>

              {/* Sub tabs navigation */}
              <div className="flex border-b border-[#E5E5E5] gap-2 overflow-x-auto">
                {[
                  { id: 'years', label: 'Academic Years', count: liveAcademicYears.length },
                  { id: 'departments', label: 'Departments', count: liveDepartments.length },
                  { id: 'programs', label: 'Programs', count: livePrograms.length },
                  { id: 'semesters', label: 'Semesters', count: liveSemesters.length },
                  { id: 'courses', label: 'Courses', count: liveCourses.length },
                  { id: 'sections', label: 'Class Sections', count: liveClassSections.length }
                ].map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setAcademicSubTab(sub.id as any)}
                    className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      academicSubTab === sub.id ? 'border-[#F97316] text-[#F97316]' : 'border-transparent text-[#737373] hover:text-[#171717]'
                    }`}
                  >
                    <span>{sub.label}</span>
                    <span className="text-[10px] bg-[#F7F7F7] px-2 py-0.5 rounded-full text-[#525252]">{sub.count}</span>
                  </button>
                ))}
              </div>

              {/* Academic Years */}
              {academicSubTab === 'years' && (
                <div>
                  {liveAcademicYears.length === 0 ? (
                    <div className="bg-white border border-[#E5E5E5] rounded-2xl p-12 text-center space-y-3">
                      <Inbox className="w-10 h-10 text-[#737373] mx-auto opacity-50" />
                      <h4 className="font-bold text-sm text-[#171717]">No Academic Years Configured</h4>
                      <p className="text-xs text-[#737373] max-w-sm mx-auto">Click "Add Record" above to register your first academic term.</p>
                    </div>
                  ) : (
                    <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-xs">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#F7F7F7] border-b border-[#E5E5E5] font-bold text-[#737373]">
                          <tr>
                            <th className="p-4">Academic Term</th>
                            <th className="p-4">Start Date</th>
                            <th className="p-4">End Date</th>
                            <th className="p-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E5E5]">
                          {liveAcademicYears.map(y => (
                            <tr key={y.id}>
                              <td className="p-4 font-bold text-[#171717]">{y.yearName}</td>
                              <td className="p-4 text-[#525252]">{y.startDate}</td>
                              <td className="p-4 text-[#525252]">{y.endDate}</td>
                              <td className="p-4">
                                <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-md font-bold text-[10px]">{y.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Departments */}
              {academicSubTab === 'departments' && (
                <div>
                  {liveDepartments.length === 0 ? (
                    <div className="bg-white border border-[#E5E5E5] rounded-2xl p-12 text-center space-y-3">
                      <Inbox className="w-10 h-10 text-[#737373] mx-auto opacity-50" />
                      <h4 className="font-bold text-sm text-[#171717]">No Departments Added</h4>
                      <p className="text-xs text-[#737373] max-w-sm mx-auto">Click "Add Record" to create your institutional departments.</p>
                    </div>
                  ) : (
                    <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-xs">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#F7F7F7] border-b border-[#E5E5E5] font-bold text-[#737373]">
                          <tr>
                            <th className="p-4">Department Code</th>
                            <th className="p-4">Department Name</th>
                            <th className="p-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E5E5]">
                          {liveDepartments.map(d => (
                            <tr key={d.id}>
                              <td className="p-4 font-semibold text-[#171717]">{d.departmentCode}</td>
                              <td className="p-4 text-[#525252]">{d.departmentName}</td>
                              <td className="p-4">
                                <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-md font-bold text-[10px]">{d.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Courses */}
              {academicSubTab === 'courses' && (
                <div>
                  {liveCourses.length === 0 ? (
                    <div className="bg-white border border-[#E5E5E5] rounded-2xl p-12 text-center space-y-3">
                      <Inbox className="w-10 h-10 text-[#737373] mx-auto opacity-50" />
                      <h4 className="font-bold text-sm text-[#171717]">No Courses in Catalog</h4>
                      <p className="text-xs text-[#737373] max-w-sm mx-auto">Click "Add Record" to create courses in your academic catalog.</p>
                    </div>
                  ) : (
                    <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-xs">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#F7F7F7] border-b border-[#E5E5E5] font-bold text-[#737373]">
                          <tr>
                            <th className="p-4">Course Code</th>
                            <th className="p-4">Course Title</th>
                            <th className="p-4">Credits</th>
                            <th className="p-4">Type</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E5E5]">
                          {liveCourses.map(c => (
                            <tr key={c.id}>
                              <td className="p-4 font-semibold text-[#171717]">{c.courseCode}</td>
                              <td className="p-4 text-[#525252]">{c.courseTitle}</td>
                              <td className="p-4 text-[#525252]">{c.credits} Credits</td>
                              <td className="p-4">
                                <span className="bg-orange-50 text-[#F97316] px-2 py-0.5 rounded-md font-bold text-[10px]">{c.courseType}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Class Sections */}
              {academicSubTab === 'sections' && (
                <div>
                  {liveClassSections.length === 0 ? (
                    <div className="bg-white border border-[#E5E5E5] rounded-2xl p-12 text-center space-y-3">
                      <Inbox className="w-10 h-10 text-[#737373] mx-auto opacity-50" />
                      <h4 className="font-bold text-sm text-[#171717]">No Class Sections Configured</h4>
                      <p className="text-xs text-[#737373] max-w-sm mx-auto">Click "Add Record" to create class sections mapped to catalog courses.</p>
                    </div>
                  ) : (
                    <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-xs">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#F7F7F7] border-b border-[#E5E5E5] font-bold text-[#737373]">
                          <tr>
                            <th className="p-4">Section Name</th>
                            <th className="p-4">Capacity</th>
                            <th className="p-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E5E5]">
                          {liveClassSections.map(sec => (
                            <tr key={sec.id}>
                              <td className="p-4 font-bold text-[#171717]">{sec.sectionName}</td>
                              <td className="p-4 text-[#525252]">{sec.capacity} Students</td>
                              <td className="p-4">
                                <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-md font-bold text-[10px]">{sec.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Programs & Semesters */}
              {(academicSubTab === 'programs' || academicSubTab === 'semesters') && (
                <div className="bg-white border border-[#E5E5E5] p-10 rounded-2xl text-center space-y-2">
                  <FolderTree className="w-10 h-10 text-[#737373] mx-auto opacity-40" />
                  <h4 className="font-bold text-xs text-[#171717]">{academicSubTab.toUpperCase()} Records</h4>
                  <p className="text-[11px] text-[#737373] max-w-sm mx-auto">
                    {academicSubTab === 'programs' ? `${livePrograms.length} programs configured.` : `${liveSemesters.length} semesters active.`}
                  </p>
                </div>
              )}

              {/* Add Academic Modal */}
              {showAddAcademicModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                  <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-[#E5E5E5] shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
                    <h3 className="font-bold text-sm text-[#171717]">Create {academicSubTab.toUpperCase()} Record</h3>
                    <form onSubmit={handleCreateAcademicRecord} className="space-y-3">
                      {academicSubTab === 'years' && (
                        <>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">Academic Year Name</label>
                            <input name="yearName" placeholder="e.g. 2026-2027" required className="w-full border border-[#E5E5E5] rounded-lg p-2 text-xs" />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">Start Date</label>
                              <input name="startDate" type="date" required className="w-full border border-[#E5E5E5] rounded-lg p-2 text-xs" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">End Date</label>
                              <input name="endDate" type="date" required className="w-full border border-[#E5E5E5] rounded-lg p-2 text-xs" />
                            </div>
                          </div>
                        </>
                      )}

                      {academicSubTab === 'departments' && (
                        <>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">Department Name</label>
                            <input name="departmentName" placeholder="e.g. Computer Science and Engineering" required className="w-full border border-[#E5E5E5] rounded-lg p-2 text-xs" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">Department Code</label>
                            <input name="departmentCode" placeholder="e.g. CSE" required className="w-full border border-[#E5E5E5] rounded-lg p-2 text-xs" />
                          </div>
                        </>
                      )}

                      {academicSubTab === 'courses' && (
                        <>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">Course Title</label>
                            <input name="courseTitle" placeholder="e.g. Database Management Systems" required className="w-full border border-[#E5E5E5] rounded-lg p-2 text-xs" />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">Course Code</label>
                              <input name="courseCode" placeholder="e.g. CS202" required className="w-full border border-[#E5E5E5] rounded-lg p-2 text-xs" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">Credits</label>
                              <input name="credits" type="number" defaultValue={4} min={1} max={10} required className="w-full border border-[#E5E5E5] rounded-lg p-2 text-xs" />
                            </div>
                          </div>
                        </>
                      )}

                      {academicSubTab === 'sections' && (
                        <>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">Section Name</label>
                            <input name="sectionName" placeholder="e.g. Section A" required className="w-full border border-[#E5E5E5] rounded-lg p-2 text-xs" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">Capacity</label>
                            <input name="capacity" type="number" defaultValue={50} min={10} max={200} required className="w-full border border-[#E5E5E5] rounded-lg p-2 text-xs" />
                          </div>
                        </>
                      )}

                      <div className="flex gap-2 justify-end pt-3">
                        <button type="button" onClick={() => setShowAddAcademicModal(false)} className="px-3 py-1.5 border border-[#E5E5E5] text-xs font-semibold rounded-lg cursor-pointer">Cancel</button>
                        <button type="submit" className="px-4 py-1.5 bg-[#F97316] text-white text-xs font-semibold rounded-lg cursor-pointer hover:bg-[#EA580C]">Save Record</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Students Directory Tab */}
          {activeTab === 'students' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-[#171717]">Student Directory</h2>
                  <p className="text-xs text-[#737373]">Live registered student accounts connected with backend StudentController</p>
                </div>

                <button 
                  onClick={() => setShowAddStudentModal(true)}
                  className="flex items-center gap-2 bg-[#F97316] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#EA580C] transition-all cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Add Student
                </button>
              </div>

              <StudentDirectoryTable
                students={liveStudents}
                isLoading={isLoadingStudents}
                onDeleteStudent={(id) => deleteStudentMutation.mutate(id)}
              />

              <CreateStudentModal
                isOpen={showAddStudentModal}
                onClose={() => setShowAddStudentModal(false)}
                onSubmit={async (data) => {
                  await createStudentMutation.mutateAsync(data);
                }}
              />
            </div>
          )}

          {/* Faculty Directory Tab */}
          {activeTab === 'faculty' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-[#171717]">Faculty Directory</h2>
                  <p className="text-xs text-[#737373]">Live registered faculty accounts connected with backend FacultyController</p>
                </div>

                <button 
                  onClick={() => setShowAddFacultyModal(true)}
                  className="flex items-center gap-2 bg-[#F97316] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#EA580C] transition-all cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Add Faculty
                </button>
              </div>

              <FacultyDirectoryTable
                faculty={liveFaculty}
                isLoading={isLoadingFaculty}
                onDeleteFaculty={(id) => deleteFacultyMutation.mutate(id)}
              />

              <CreateFacultyModal
                isOpen={showAddFacultyModal}
                onClose={() => setShowAddFacultyModal(false)}
                onSubmit={async (data) => {
                  await createFacultyMutation.mutateAsync(data);
                }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
