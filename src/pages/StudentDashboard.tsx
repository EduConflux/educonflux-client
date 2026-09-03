import React, { useState } from 'react';
import { Logo } from '../components/common/Logo';
import { useAuth } from '../features/auth/context/AuthContext';
import { useCourses, useAcademicYears, useSemesters } from '../features/academic/hooks/useAcademic';
import { useStudentAttendance } from '../features/attendance/hooks/useAttendance';
import { useStudentWeeklyTimetable } from '../features/timetable/hooks/useTimetable';
import { useChatHistory } from '../features/classrooms/hooks/useClassrooms';

// Reusable Dashboard & Feature Components
import { WelcomeBanner } from '../features/dashboard/components/WelcomeBanner';
import { MetricCard } from '../features/dashboard/components/MetricCard';
import { CourseCatalogTable } from '../features/academic/components/CourseCatalogTable';
import { SectionChannelsChatWorkspace } from '../features/classrooms/components/SectionChannelsChatWorkspace';

import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  CalendarDays, 
  Calendar, 
  MessageSquare, 
  LogOut, 
  CheckCircle2
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (route: string) => void;
}

type TabType = 
  | 'dashboard' 
  | 'channels'
  | 'profile' 
  | 'courses' 
  | 'results' 
  | 'attendance' 
  | 'exams' 
  | 'timetable' 
  | 'noticeboard' 
  | 'calendar' 
  | 'downloads' 
  | 'feedback';

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const { user: authUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Active Chat Channel state
  const [activeChannelId, setActiveChannelId] = useState<number>(1);
  const [chatInputText, setChatInputText] = useState('');

  // User details from AuthContext
  const studentId = authUser?.id || 1;
  const userName = authUser?.firstName 
    ? `${authUser.firstName} ${authUser.lastName || ''}`.trim() 
    : (authUser?.email ? authUser.email.split('@')[0] : 'Student User');
  const userInitials = authUser?.firstName 
    ? `${authUser.firstName[0]}${authUser.lastName ? authUser.lastName[0] : ''}` 
    : (authUser?.email ? authUser.email.slice(0, 2).toUpperCase() : 'ST');
  const userRoleText = authUser?.role ? `${authUser.role} Portal • Active Roster` : 'Student Roster • Active';

  const { records: studentAttendanceRecords, summary: attendanceSummary } = useStudentAttendance();
  const { data: liveCourses = [], isLoading: isCoursesLoading } = useCourses();
  const { data: liveTimetableEntries = [] } = useStudentWeeklyTimetable();
  const { data: liveAcademicYears = [] } = useAcademicYears();
  const { data: liveSemesters = [] } = useSemesters();
  const { data: liveChatHistory = [] } = useChatHistory(activeChannelId);

  // Local fallback chat messages for active channel
  const [localChatMessages, setLocalChatMessages] = useState([
    { id: 1, sender: 'Dr. Sharma', text: 'Welcome everyone to the CS101 section channel! Post your lab queries here.', time: '10:15 AM', isSelf: false },
    { id: 2, sender: 'Jane Smith', text: 'Thank you professor. Is the project submission extended to Friday?', time: '10:20 AM', isSelf: false },
    { id: 3, sender: userName, text: 'I have uploaded my Algorithms assignment file into the submission portal.', time: '10:45 AM', isSelf: true }
  ]);

  const attendancePercentage = attendanceSummary?.percentage !== undefined ? attendanceSummary.percentage : 87;
  const presentCount = attendanceSummary?.presentCount !== undefined ? attendanceSummary.presentCount : 18;
  const absentCount = attendanceSummary?.absentCount !== undefined ? attendanceSummary.absentCount : 2;
  
  const enrolledCoursesCount = liveCourses.length || 6;
  const totalTimetableSlots = liveTimetableEntries.length || 18;
  const activeAcademicYearName = liveAcademicYears[0]?.yearName || 'Academic Term 2025-2026';
  const activeSemesterName = liveSemesters[0]?.semesterName || 'Spring Semester';

  const defaultChannels = [
    { id: 1, name: 'cs101-algorithms-sec-a', courseTitle: 'CS101: Introduction to Algorithms', instructor: 'Dr. Sharma', unread: 2 },
    { id: 2, name: 'cs202-databases-sec-b', courseTitle: 'CS202: Database Management Systems', instructor: 'Dr. Sharma', unread: 0 },
    { id: 3, name: 'cs401-ai-sec-c', courseTitle: 'CS401: Artificial Intelligence', instructor: 'Prof. Davis', unread: 5 },
    { id: 4, name: 'cs305-os-sec-a', courseTitle: 'CS305: Operating Systems', instructor: 'Dr. Sharma', unread: 1 }
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputText.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: userName,
      text: chatInputText.trim(),
      time: 'Just now',
      isSelf: true
    };

    setLocalChatMessages(prev => [...prev, newMsg]);
    setChatInputText('');
  };

  const allDisplayMessages = [
    ...localChatMessages,
    ...liveChatHistory.map(m => ({
      id: m.id,
      sender: m.senderName,
      text: m.messageContent,
      time: m.timestamp,
      isSelf: m.senderId === studentId,
    })),
  ];

  const handleLogout = () => {
    logout();
    onNavigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex text-[#171717] font-sans selection:bg-[#F97316] selection:text-white">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-[#E5E5E5] flex flex-col shrink-0">
        <div className="p-5 border-b border-[#E5E5E5]">
          <Logo size="md" />
          <span className="text-[10px] uppercase tracking-wider text-[#737373] block mt-1 font-bold">Student Portal</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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
            onClick={() => setActiveTab('channels')} 
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'channels' ? 'bg-orange-50 text-[#F97316] font-bold' : 'hover:bg-[#F7F7F7] text-[#525252]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Channels & Chat</span>
          </button>

          <button 
            onClick={() => setActiveTab('courses')} 
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'courses' ? 'bg-orange-50 text-[#F97316] font-bold' : 'hover:bg-[#F7F7F7] text-[#525252]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>My Courses</span>
          </button>

          <button 
            onClick={() => setActiveTab('attendance')} 
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'attendance' ? 'bg-orange-50 text-[#F97316] font-bold' : 'hover:bg-[#F7F7F7] text-[#525252]'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Attendance</span>
          </button>

          <button 
            onClick={() => setActiveTab('timetable')} 
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'timetable' ? 'bg-orange-50 text-[#F97316] font-bold' : 'hover:bg-[#F7F7F7] text-[#525252]'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Timetable</span>
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
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-sm text-[#171717]">Student Learning Workspace</h2>
            <span className="text-[10px] bg-orange-50 text-[#F97316] font-bold px-2 py-0.5 rounded-full border border-orange-200">
              TanStack Query Active
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="font-bold text-xs block text-[#171717]">{userName}</span>
              <span className="text-[10px] text-[#737373]">{userRoleText}</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center font-bold text-[#F97316] text-xs">
              {userInitials}
            </div>
          </div>
        </header>

        <div className="flex-1 p-8">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <WelcomeBanner
                userName={userName}
                semesterName={activeSemesterName}
                academicYearName={activeAcademicYearName}
                enrolledCoursesCount={enrolledCoursesCount}
                timetableSlotsCount={totalTimetableSlots}
              />

              {/* Stats Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="ATTENDANCE RATE"
                  value={`${attendancePercentage}%`}
                  sub={`${presentCount} Present / ${absentCount} Absent`}
                  icon={<CheckCircle2 className="w-5 h-5 text-[#F97316]" />}
                />
                <MetricCard
                  title="ENROLLED COURSES"
                  value={String(enrolledCoursesCount)}
                  sub="Active semester curriculum"
                  icon={<BookOpen className="w-5 h-5 text-blue-600" />}
                  color="text-blue-600"
                  bg="bg-blue-50"
                />
                <MetricCard
                  title="SCHEDULE SLOTS"
                  value={String(totalTimetableSlots)}
                  sub="Classes this week"
                  icon={<Calendar className="w-5 h-5 text-emerald-600" />}
                  color="text-emerald-600"
                  bg="bg-emerald-50"
                />
                <MetricCard
                  title="SECTION CHANNELS"
                  value={String(defaultChannels.length)}
                  sub="Discussion workspaces"
                  icon={<MessageSquare className="w-5 h-5 text-purple-600" />}
                  color="text-purple-600"
                  bg="bg-purple-50"
                />
              </div>

              {/* Course Catalog */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#737373]">Current Semester Courses</h3>
                  <button onClick={() => setActiveTab('courses')} className="text-xs font-bold text-[#F97316] hover:underline cursor-pointer">
                    View Catalog →
                  </button>
                </div>
                <CourseCatalogTable courses={liveCourses} isLoading={isCoursesLoading} limit={4} />
              </div>
            </div>
          )}

          {/* Channels & Chat Tab */}
          {activeTab === 'channels' && (
            <SectionChannelsChatWorkspace
              channelList={defaultChannels}
              activeChannelId={activeChannelId}
              onSelectChannel={setActiveChannelId}
              chatMessages={allDisplayMessages}
              chatInputText={chatInputText}
              onChatInputChange={setChatInputText}
              onSendMessage={handleSendMessage}
            />
          )}

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-[#171717]">Academic Course Catalog</h2>
                <p className="text-xs text-[#737373]">All registered courses for your current academic term and department</p>
              </div>
              <CourseCatalogTable courses={liveCourses} isLoading={isCoursesLoading} />
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === 'attendance' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-[#171717]">Personal Attendance Register</h2>
                <p className="text-xs text-[#737373]">Live attendance records retrieved from `/api/student/attendance`</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white border border-[#E5E5E5] p-6 rounded-2xl shadow-xs space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-[#737373] tracking-wider">Attendance Rate</span>
                  <span className="text-3xl font-black text-emerald-600 block">{attendancePercentage}%</span>
                  <span className="text-[11px] text-[#737373]">Institutional requirement: 75%</span>
                </div>
                <div className="bg-white border border-[#E5E5E5] p-6 rounded-2xl shadow-xs space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-[#737373] tracking-wider">Classes Attended</span>
                  <span className="text-3xl font-black text-[#171717] block">{presentCount}</span>
                  <span className="text-[11px] text-[#737373]">Marked PRESENT</span>
                </div>
                <div className="bg-white border border-[#E5E5E5] p-6 rounded-2xl shadow-xs space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-[#737373] tracking-wider">Classes Missed</span>
                  <span className="text-3xl font-black text-red-600 block">{absentCount}</span>
                  <span className="text-[11px] text-[#737373]">Marked ABSENT</span>
                </div>
              </div>

              {studentAttendanceRecords.length === 0 ? (
                <div className="bg-white border border-[#E5E5E5] rounded-2xl p-12 text-center space-y-3">
                  <CheckSquare className="w-10 h-10 text-[#737373] mx-auto opacity-50" />
                  <h4 className="font-bold text-sm text-[#171717]">No Individual Attendance Records Yet</h4>
                  <p className="text-xs text-[#737373] max-w-sm mx-auto">
                    Faculty attendance marks will appear in real time here.
                  </p>
                </div>
              ) : (
                <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F7F7F7] border-b border-[#E5E5E5] font-bold text-[#737373]">
                      <tr>
                        <th className="p-4">Date</th>
                        <th className="p-4">Course</th>
                        <th className="p-4">Section</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E5E5]">
                      {studentAttendanceRecords.map((r) => (
                        <tr key={r.id}>
                          <td className="p-4 font-semibold text-[#171717]">{r.attendanceDate}</td>
                          <td className="p-4">{r.courseName || r.courseCode || 'Lecture'}</td>
                          <td className="p-4 text-[#737373]">{r.classSectionName || 'Default Section'}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                              r.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                            }`}>
                              {r.status}
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

          {/* Timetable Tab */}
          {activeTab === 'timetable' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-[#171717]">Weekly Class Timetable</h2>
                <p className="text-xs text-[#737373]">Live schedule retrieved from `/api/student/timetable`</p>
              </div>

              {liveTimetableEntries.length === 0 ? (
                <div className="bg-white border border-[#E5E5E5] rounded-2xl p-12 text-center space-y-3">
                  <CalendarDays className="w-10 h-10 text-[#737373] mx-auto opacity-50" />
                  <h4 className="font-bold text-sm text-[#171717]">No Timetable Slots Configured</h4>
                  <p className="text-xs text-[#737373] max-w-sm mx-auto">
                    Weekly class slots created by administration will be displayed here.
                  </p>
                </div>
              ) : (
                <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F7F7F7] border-b border-[#E5E5E5] font-bold text-[#737373]">
                      <tr>
                        <th className="p-4">Day</th>
                        <th className="p-4">Time</th>
                        <th className="p-4">Course</th>
                        <th className="p-4">Room</th>
                        <th className="p-4">Instructor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E5E5]">
                      {liveTimetableEntries.map((slot) => (
                        <tr key={slot.id}>
                          <td className="p-4 font-bold text-[#F97316]">{slot.dayOfWeek}</td>
                          <td className="p-4 text-[#525252] font-mono">{slot.startTime} - {slot.endTime}</td>
                          <td className="p-4 font-semibold text-[#171717]">{slot.courseName || slot.courseCode || 'Class Session'}</td>
                          <td className="p-4 text-[#525252]">{slot.room || 'TBD'}</td>
                          <td className="p-4 text-[#737373]">{slot.facultyName || 'Faculty'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
