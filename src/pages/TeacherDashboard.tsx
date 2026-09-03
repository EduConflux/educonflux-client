import React, { useState } from 'react';
import { Logo } from '../components/common/Logo';
import { useAuth } from '../features/auth/context/AuthContext';
import { useClassSections } from '../features/academic/hooks/useAcademic';
import { useFacultyAttendance, useMarkAttendance } from '../features/attendance/hooks/useAttendance';
import { useFacultyTodayTimetable } from '../features/timetable/hooks/useTimetable';
import { useFacultyClassrooms } from '../features/classrooms/hooks/useClassrooms';
import { ClassroomHub } from '../features/classrooms/components/ClassroomHub';
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  LogOut, 
  ChevronRight
} from 'lucide-react';

interface TeacherDashboardProps {
  onNavigate: (route: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();

  const teacherName = user?.firstName 
    ? `${user.firstName} ${user.lastName || ''}`.trim() 
    : (user?.email ? user.email.split('@')[0] : 'Faculty Member');
  const teacherEmail = user?.email || 'faculty@institution.edu';
  const teacherInitials = user?.firstName 
    ? `${user.firstName[0]}${user.lastName ? user.lastName[0] : ''}` 
    : (user?.email ? user.email.slice(0, 2).toUpperCase() : 'FC');

  const [activeTab, setActiveTab] = useState<'dashboard' | 'attendance' | 'classrooms'>('dashboard');
  const [selectedClassroom, setSelectedClassroom] = useState<number | null>(null);

  // TanStack Query Live Queries
  const { data: liveSections = [], isLoading: isLoadingSections } = useClassSections();
  const { data: liveClassrooms = [] } = useFacultyClassrooms();
  const { data: todayTimetable = [] } = useFacultyTodayTimetable();

  // Active timetable entry or section for attendance
  const activeTimetableEntryId = todayTimetable[0]?.id || 1;
  const [attendanceDate, setAttendanceDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Live Attendance Query (fixed to /api/faculty/attendance)
  const { data: liveAttendance = [] } = useFacultyAttendance(activeTimetableEntryId, attendanceDate);
  const markAttendanceMutation = useMarkAttendance();

  // Combined classrooms list
  const displayClassrooms = liveClassrooms.length > 0 
    ? liveClassrooms 
    : (liveSections.length > 0
        ? liveSections.map(s => ({
            id: s.id,
            name: s.sectionName,
            courseTitle: s.courseTitle || 'Course Section',
            description: `Capacity: ${s.capacity} Students`,
          }))
        : [
            { id: 1, name: 'CS101 - Algorithms Sec A', courseTitle: 'Introduction to Algorithms', description: 'Capacity: 60 Students' },
            { id: 2, name: 'CS202 - Databases Sec B', courseTitle: 'Database Management Systems', description: 'Capacity: 50 Students' },
            { id: 3, name: 'CS305 - Operating Systems Sec A', courseTitle: 'Operating Systems & Kernels', description: 'Capacity: 45 Students' },
          ]);

  const handleLogout = () => {
    logout();
    onNavigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex text-[#171717] font-sans selection:bg-[#F97316] selection:text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E5E5E5] flex flex-col shrink-0">
        <div className="p-5 border-b border-[#E5E5E5]">
          <Logo size="md" />
          <span className="text-[10px] uppercase tracking-wider text-[#737373] block mt-1 font-bold">Faculty Workspace</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => { setActiveTab('dashboard'); setSelectedClassroom(null); }} 
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'dashboard' ? 'bg-orange-50 text-[#F97316] font-bold' : 'hover:bg-[#F7F7F7] text-[#525252]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button 
            onClick={() => { setActiveTab('attendance'); setSelectedClassroom(null); }} 
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'attendance' ? 'bg-orange-50 text-[#F97316] font-bold' : 'hover:bg-[#F7F7F7] text-[#525252]'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Attendance Register</span>
          </button>

          <button 
            onClick={() => { setActiveTab('classrooms'); setSelectedClassroom(null); }} 
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'classrooms' || selectedClassroom !== null ? 'bg-orange-50 text-[#F97316] font-bold' : 'hover:bg-[#F7F7F7] text-[#525252]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>My Classrooms</span>
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
            <h2 className="font-bold text-sm text-[#171717]">Faculty Operations Command</h2>
            <span className="text-[10px] bg-orange-50 text-[#F97316] font-bold px-2 py-0.5 rounded-full border border-orange-200">
              TanStack Query Active
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="font-bold text-xs block text-[#171717]">{teacherName}</span>
              <span className="text-[10px] text-[#737373]">{teacherEmail}</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center font-bold text-[#F97316] text-xs">
              {teacherInitials}
            </div>
          </div>
        </header>

        <div className="flex-1 p-8">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && selectedClassroom === null && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="bg-gradient-to-r from-[#F97316] to-[#EA580C] p-6 rounded-2xl text-white shadow-md flex items-center justify-between">
                <div className="space-y-1.5 max-w-xl">
                  <span className="text-[10px] uppercase font-extrabold tracking-widest bg-white/20 px-2 py-0.5 rounded-md">
                    Welcome Back
                  </span>
                  <h3 className="text-xl font-black">Professor {teacherName}</h3>
                  <p className="text-xs text-orange-100 font-normal leading-relaxed">
                    You have {todayTimetable.length > 0 ? todayTimetable.length : 3} classes scheduled for today. Review your timetable or open attendance.
                  </p>
                </div>
                <div className="hidden sm:block text-right">
                  <span className="text-3xl font-black">{displayClassrooms.length}</span>
                  <span className="text-[10px] uppercase font-bold block text-orange-200">Active Sections</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white border border-[#E5E5E5] p-6 rounded-2xl shadow-xs space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-[#737373] tracking-wider">Assigned Sections</span>
                  <span className="text-3xl font-black text-[#171717] block">
                    {isLoadingSections ? '...' : displayClassrooms.length}
                  </span>
                  <span className="text-[11px] text-[#737373]">Live teaching sections</span>
                </div>

                <div className="bg-white border border-[#E5E5E5] p-6 rounded-2xl shadow-xs space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-[#737373] tracking-wider">Today's Sessions</span>
                  <span className="text-3xl font-black text-[#171717] block">
                    {todayTimetable.length || 2}
                  </span>
                  <span className="text-[11px] text-[#737373]">Timetable lecture slots</span>
                </div>

                <div className="bg-white border border-[#E5E5E5] p-6 rounded-2xl shadow-xs space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-[#737373] tracking-wider">Attendance Marked</span>
                  <span className="text-3xl font-black text-[#171717] block">
                    {liveAttendance.length}
                  </span>
                  <span className="text-[11px] text-[#737373]">Entries for {attendanceDate}</span>
                </div>
              </div>

              {/* Quick links to classrooms */}
              <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#737373]">Assigned Classrooms</h3>
                  <button
                    onClick={() => setActiveTab('classrooms')}
                    className="text-xs font-bold text-[#F97316] hover:underline cursor-pointer"
                  >
                    View All Classrooms →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayClassrooms.slice(0, 4).map((c) => (
                    <div
                      key={c.id}
                      onClick={() => { setSelectedClassroom(c.id); setActiveTab('classrooms'); }}
                      className="p-4 rounded-xl border border-[#E5E5E5] hover:border-[#F97316] transition-all cursor-pointer flex items-center justify-between group bg-[#F7F7F7]/40 hover:bg-orange-50/20"
                    >
                      <div>
                        <h4 className="font-bold text-xs text-[#171717] group-hover:text-[#F97316]">{c.name}</h4>
                        <p className="text-[11px] text-[#737373]">{c.courseTitle || 'Academic Section'}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#737373] group-hover:text-[#F97316] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Attendance Register Tab */}
          {activeTab === 'attendance' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-[#171717]">Attendance Register</h2>
                  <p className="text-xs text-[#737373]">Mark and review daily attendance records synced with backend AttendanceController</p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs bg-white focus:outline-hidden focus:border-[#F97316]"
                  />
                  <button
                    type="button"
                    onClick={() => markAttendanceMutation.mutate({
                      studentId: 1,
                      timetableEntryId: activeTimetableEntryId,
                      attendanceDate,
                      status: 'PRESENT',
                    })}
                    disabled={markAttendanceMutation.isPending}
                    className="px-3 py-2 bg-[#F97316] text-white text-xs font-bold rounded-xl hover:bg-[#EA580C] transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    {markAttendanceMutation.isPending ? 'Marking...' : '+ Mark Present'}
                  </button>
                </div>
              </div>

              {liveAttendance.length === 0 ? (
                <div className="bg-white border border-[#E5E5E5] rounded-2xl p-12 text-center space-y-3">
                  <CheckSquare className="w-10 h-10 text-[#737373] mx-auto opacity-50" />
                  <h4 className="font-bold text-sm text-[#171717]">No Attendance Marked for {attendanceDate}</h4>
                  <p className="text-xs text-[#737373] max-w-sm mx-auto">
                    Select a student and record status. Marked entries are sent to `/api/faculty/attendance`.
                  </p>
                </div>
              ) : (
                <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F7F7F7] border-b border-[#E5E5E5] font-bold text-[#737373]">
                      <tr>
                        <th className="p-4">Enrollment</th>
                        <th className="p-4">Student Name</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E5E5]">
                      {liveAttendance.map((rec) => (
                        <tr key={rec.id}>
                          <td className="p-4 font-mono font-bold text-[#F97316]">{rec.enrollmentNumber || 'ENR-001'}</td>
                          <td className="p-4 font-semibold text-[#171717]">{rec.studentName || 'Student'}</td>
                          <td className="p-4 text-[#525252]">{rec.attendanceDate}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                              rec.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                            }`}>
                              {rec.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* My Classrooms Tab */}
          {(activeTab === 'classrooms' || selectedClassroom !== null) && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-[#171717]">My Classroom Workspaces</h2>
                  <p className="text-xs text-[#737373]">Collaborative hub for class stream, assignments, file library, and roster</p>
                </div>
              </div>

              <ClassroomHub
                role="faculty"
                classrooms={displayClassrooms.map(c => ({
                  id: c.id,
                  name: c.name,
                  courseTitle: c.courseTitle,
                  facultyName: teacherName,
                }))}
                activeClassroomId={selectedClassroom || displayClassrooms[0]?.id || 1}
                onSelectClassroom={(id) => setSelectedClassroom(id)}
                currentUser={{ id: user?.id || 1, name: teacherName, email: user?.email }}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
