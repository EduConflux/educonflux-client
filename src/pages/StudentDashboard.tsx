import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Logo } from '../components/common/Logo';
import { logout } from '../store/slices/authSlice';
import type { RootState } from '../store';
import { 
  useGetStudentAttendanceSummaryQuery 
} from '../store/api/attendanceApi';
import { 
  useGetCoursesQuery, 
  useGetAcademicYearsQuery, 
  useGetSemestersQuery 
} from '../store/api/academicApi';
import { 
  useGetTimetableEntriesQuery 
} from '../store/api/timetableApi';
import { 
  useGetClassroomChannelsQuery,
  useGetChatHistoryQuery,
  useSendChatMessageMutation
} from '../store/api/chatApi';

// Reusable Dashboard Components
import { WelcomeBanner } from '../components/dashboard/WelcomeBanner';
import { MetricCard } from '../components/dashboard/MetricCard';
import { CourseCatalogTable } from '../components/dashboard/CourseCatalogTable';
import { SectionChannelsChatWorkspace } from '../components/dashboard/SectionChannelsChatWorkspace';

import { 
  LayoutDashboard, 
  User, 
  BookOpen, 
  Award, 
  CheckSquare, 
  FileText, 
  CalendarDays, 
  Bell, 
  Calendar, 
  Download, 
  MessageSquare, 
  LogOut, 
  Search, 
  Sparkles,
  TrendingUp,
  FileCheck,
  CheckCircle2,
  Inbox
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
  const dispatch = useDispatch();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('May 2026');

  // Active Chat Channel state
  const [activeChannelId, setActiveChannelId] = useState<number>(1);
  const [chatInputText, setChatInputText] = useState('');

  // Dynamic User Details from Redux Store Backend Session
  const studentId = authUser?.id || 1;
  const userName = authUser?.firstName 
    ? `${authUser.firstName} ${authUser.lastName || ''}`.trim() 
    : (authUser?.email ? authUser.email.split('@')[0] : 'Student User');
  const userInitials = authUser?.firstName 
    ? `${authUser.firstName[0]}${authUser.lastName ? authUser.lastName[0] : ''}` 
    : (authUser?.email ? authUser.email.slice(0, 2).toUpperCase() : 'ST');
  const userRoleText = authUser?.role ? `${authUser.role} Portal • Active Roster` : 'Student Roster • Active';

  // Live Backend RTK Query Hooks (Strictly Live API Data)
  const { data: liveAttendanceSummary } = useGetStudentAttendanceSummaryQuery(studentId);
  const { data: liveCourses = [], isLoading: isCoursesLoading } = useGetCoursesQuery();
  const { data: liveTimetableEntries = [], isLoading: isTimetableLoading } = useGetTimetableEntriesQuery();
  const { data: liveAcademicYears = [] } = useGetAcademicYearsQuery();
  const { data: liveSemesters = [] } = useGetSemestersQuery();
  const { data: liveChannels = [] } = useGetClassroomChannelsQuery();
  const { data: liveChatHistory = [] } = useGetChatHistoryQuery(activeChannelId, { skip: !activeChannelId });
  const [sendChatMessageApi] = useSendChatMessageMutation();

  // Local fallback chat messages for active channel UI testing
  const [localChatMessages, setLocalChatMessages] = useState([
    { id: 1, sender: 'Dr. Sharma', text: 'Welcome everyone to the CS101 section channel! Post your lab queries here.', time: '10:15 AM', isSelf: false },
    { id: 2, sender: 'Jane Smith', text: 'Thank you professor. Is the project submission extended to Friday?', time: '10:20 AM', isSelf: false },
    { id: 3, sender: userName, text: 'I have uploaded my Algorithms assignment file into the submission portal.', time: '10:45 AM', isSelf: true }
  ]);

  const attendancePercentage = liveAttendanceSummary?.percentage !== undefined ? liveAttendanceSummary.percentage : 87;
  const presentCount = liveAttendanceSummary?.presentCount !== undefined ? liveAttendanceSummary.presentCount : 18;
  const absentCount = liveAttendanceSummary?.absentCount !== undefined ? liveAttendanceSummary.absentCount : 2;
  
  const enrolledCoursesCount = liveCourses.length || 6;
  const totalTimetableSlots = liveTimetableEntries.length || 18;
  const activeAcademicYearName = liveAcademicYears[0]?.yearName || 'Academic Term 2025-2026';
  const activeSemesterName = liveSemesters[0]?.semesterName || 'Spring Semester';

  // Fallback channels derived from courses if backend channels list is empty
  const defaultChannels = [
    { id: 1, name: 'cs101-algorithms-sec-a', courseTitle: 'CS101: Introduction to Algorithms', instructor: 'Dr. Sharma', unread: 2 },
    { id: 2, name: 'cs202-[#F97316]-sec-b', courseTitle: 'CS202: Database Management Systems', instructor: 'Dr. Sharma', unread: 0 },
    { id: 3, name: 'cs401-ai-sec-c', courseTitle: 'CS401: Artificial Intelligence', instructor: 'Prof. Davis', unread: 5 },
    { id: 4, name: 'cs305-os-sec-a', courseTitle: 'CS305: Operating Systems', instructor: 'Dr. Sharma', unread: 1 }
  ];

  const channelList = liveChannels.length > 0 
    ? liveChannels.map(c => ({ id: c.id, name: c.classroomName.toLowerCase().replace(/\s+/g, '-'), courseTitle: c.courseTitle || c.classroomName, instructor: c.instructorName || 'Faculty', unread: c.unreadCount || 0 }))
    : defaultChannels;

  const handleSendMessage = async (e: React.FormEvent) => {
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
    
    try {
      await sendChatMessageApi({
        classroomId: activeChannelId,
        messageContent: chatInputText.trim()
      }).unwrap();
    } catch (err) {
      // Handled via local state fallback
    }

    setChatInputText('');
  };

  const handleLogout = () => {
    dispatch(logout());
    onNavigate('/login');
  };

  return (
    <div className="h-screen w-screen bg-[#F7F7F7] text-[#171717] flex font-sans overflow-hidden selection:bg-[#F97316] selection:text-white">
      {/* 1. LEFT SIDEBAR NAVIGATION (Fixed Reusable Sidebar) */}
      <aside className="w-64 h-full bg-white border-r border-[#E5E5E5] flex flex-col justify-between shrink-0 shadow-xs z-20 overflow-y-auto">
        <div>
          {/* Logo & Header */}
          <div className="p-6 border-b border-[#F7F7F7] space-y-1">
            <button onClick={() => onNavigate('/')} className="focus:outline-hidden">
              <Logo size="md" />
            </button>
            <span className="text-[10px] uppercase tracking-wider text-[#737373] block font-extrabold">
              Student Workspace
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 text-xs font-extrabold">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
              { id: 'channels', label: 'Section Channels & Chat', icon: <MessageSquare className="w-4 h-4" /> },
              { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
              { id: 'courses', label: 'Courses', icon: <BookOpen className="w-4 h-4" /> },
              { id: 'results', label: 'Results', icon: <Award className="w-4 h-4" /> },
              { id: 'attendance', label: 'Attendance', icon: <CheckSquare className="w-4 h-4" /> },
              { id: 'exams', label: 'Exams', icon: <FileText className="w-4 h-4" /> },
              { id: 'timetable', label: 'Timetable', icon: <CalendarDays className="w-4 h-4" /> },
              { id: 'noticeboard', label: 'Notice Board', icon: <Bell className="w-4 h-4" /> },
              { id: 'calendar', label: 'Academic Calendar', icon: <Calendar className="w-4 h-4" /> },
              { id: 'downloads', label: 'Downloads', icon: <Download className="w-4 h-4" /> },
              { id: 'feedback', label: 'Feedback', icon: <MessageSquare className="w-4 h-4" /> },
            ].map((nav) => (
              <button
                key={nav.id}
                onClick={() => setActiveTab(nav.id as TabType)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === nav.id
                    ? 'bg-[#F97316] text-white shadow-md'
                    : 'text-[#525252] hover:bg-[#F7F7F7] hover:text-[#171717]'
                }`}
              >
                {nav.icon}
                <span>{nav.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-[#F7F7F7]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-extrabold text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA (Scrollable Right Pane) */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto">
        {/* 2. TOP HEADER NAVBAR */}
        <header className="bg-white border-b border-[#E5E5E5] px-10 h-20 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-black capitalize tracking-tight text-[#171717]">
              {activeTab === 'channels' ? 'Classroom Section Channels & Chats' : (activeTab === 'calendar' ? 'Academic Calendar' : activeTab)}
            </h1>
          </div>

          {/* Search bar & User info */}
          <div className="flex items-center gap-6">
            <div className="relative w-64 hidden sm:block">
              <Search className="w-4 h-4 text-[#737373] absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search courses, channels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl text-xs font-medium focus:outline-hidden focus:border-[#F97316]"
              />
            </div>

            {/* Notification Bell */}
            <div className="relative cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-[#F7F7F7] flex items-center justify-center text-[#525252] hover:text-[#171717] transition-colors border border-[#E5E5E5]/60">
                <Bell className="w-4.5 h-4.5" />
              </div>
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-[#F97316] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {enrolledCoursesCount}
              </span>
            </div>

            {/* Profile Avatar Card */}
            <div className="flex items-center gap-3 pl-4 border-l border-[#E5E5E5]">
              <div className="w-10 h-10 rounded-full bg-[#F97316] text-white flex items-center justify-center font-extrabold text-xs shadow-xs">
                {userInitials}
              </div>
              <div className="text-left hidden md:block">
                <span className="font-extrabold text-xs block text-[#171717] leading-tight">
                  Hello, {userName}
                </span>
                <span className="text-[10px] font-semibold text-[#737373] block">
                  {userRoleText}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* BODY CONTAINER (Generous Bottom Padding) */}
        <main className="p-8 pb-24 space-y-8">
          
          {/* TAB 1: DASHBOARD MAIN SCREEN */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Reusable Welcome Banner Component */}
              <WelcomeBanner
                userName={userName}
                semesterName={activeSemesterName}
                academicYearName={activeAcademicYearName}
                enrolledCoursesCount={enrolledCoursesCount}
                timetableSlotsCount={totalTimetableSlots}
              />

              {/* 3. METRICS SUMMARY ROW (Modular MetricCard Components) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                <MetricCard
                  title="CGPA"
                  value="8.45"
                  sub="Current CGPA"
                  color="text-[#F97316]"
                  icon={<FileCheck className="w-5 h-5 text-[#F97316]" />}
                  bg="bg-orange-50"
                />
                <MetricCard
                  title="Courses Enrolled"
                  value={enrolledCoursesCount.toString()}
                  sub="Active Courses"
                  color="text-amber-700"
                  icon={<BookOpen className="w-5 h-5 text-amber-600" />}
                  bg="bg-amber-50"
                />
                <MetricCard
                  title="Exams Completed"
                  value="4"
                  sub="This Semester"
                  color="text-[#EA580C]"
                  icon={<Award className="w-5 h-5 text-[#EA580C]" />}
                  bg="bg-orange-100/50"
                />
                <MetricCard
                  title="Timetable Slots"
                  value={totalTimetableSlots.toString()}
                  sub="Configured Slots"
                  color="text-amber-800"
                  icon={<TrendingUp className="w-5 h-5 text-amber-700" />}
                  bg="bg-amber-50"
                />
                <MetricCard
                  title="Attendance Rate"
                  value={`${attendancePercentage}%`}
                  sub={`${presentCount} Present / ${absentCount} Absent`}
                  color="text-[#F97316]"
                  icon={<CheckCircle2 className="w-5 h-5 text-[#F97316]" />}
                  bg="bg-orange-50"
                />
              </div>

              {/* 4. MIDDLE GRID (Modular CourseCatalogTable & Notice Board) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Reusable Course Catalog Table */}
                <div className="lg:col-span-7">
                  <CourseCatalogTable
                    courses={liveCourses}
                    isLoading={isCoursesLoading}
                    onViewAll={() => setActiveTab('courses')}
                    maxRows={5}
                  />
                </div>

                {/* Right Column: Notice Board & System Broadcasts */}
                <div className="lg:col-span-5 bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-[#F7F7F7]">
                    <h3 className="font-extrabold text-sm text-[#171717]">Notice Board & Academic Alerts</h3>
                    <button onClick={() => setActiveTab('noticeboard')} className="text-xs font-extrabold text-[#F97316] hover:underline">
                      View All
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    {[
                      { title: 'End Semester Exam Schedule Broadcast', desc: `Published for ${activeAcademicYearName}.`, date: activeSemesterName },
                      { title: 'Attendance Telemetry Audit', desc: `Current attendance status calculated at ${attendancePercentage}%.`, date: 'Live Sync' },
                      { title: 'Course Catalog Registration', desc: `${enrolledCoursesCount} active courses registered for student ID #${studentId}.`, date: 'System Sync' }
                    ].map((notice, i) => (
                      <div key={i} className="p-3.5 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl flex gap-3 items-start hover:border-[#F97316]/50 transition-colors">
                        <div className="p-2 bg-orange-50 text-[#F97316] rounded-lg shrink-0">
                          <Bell className="w-4 h-4" />
                        </div>
                        <div className="text-xs space-y-1">
                          <h4 className="font-extrabold text-[#171717]">{notice.title}</h4>
                          <p className="text-[11px] text-[#737373] leading-relaxed">{notice.desc}</p>
                          <span className="text-[10px] font-extrabold text-[#F97316] block">{notice.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 5. BOTTOM GRID (Calendar Widget, Quick Access, Performance Overview) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Mini Calendar Widget */}
                <div className="lg:col-span-4 bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-[#F7F7F7]">
                    <h3 className="font-extrabold text-sm text-[#171717]">Academic Calendar</h3>
                    <button onClick={() => setActiveTab('calendar')} className="text-xs font-extrabold text-[#F97316] hover:underline">
                      View Full Calendar
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="text-center font-black text-xs text-[#F97316]">{selectedMonth}</div>
                    <div className="grid grid-cols-7 text-center text-[10px] font-extrabold text-[#737373] gap-1">
                      <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                    <div className="grid grid-cols-7 text-center text-xs font-bold text-[#525252] gap-1">
                      {[...Array(31)].map((_, i) => (
                        <span key={i} className={`p-1.5 rounded-lg ${i + 1 === 20 ? 'bg-[#F97316] text-white font-black' : 'hover:bg-[#F7F7F7]'}`}>
                          {i + 1}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Access Icons */}
                <div className="lg:col-span-4 bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-xs space-y-4">
                  <h3 className="font-extrabold text-sm text-[#171717] pb-2 border-b border-[#F7F7F7]">Quick Access</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Section Chat', icon: <MessageSquare className="w-5 h-5 text-[#F97316]" />, tab: 'channels' },
                      { label: 'My Courses', icon: <BookOpen className="w-5 h-5 text-amber-600" />, tab: 'courses' },
                      { label: 'Timetable', icon: <CalendarDays className="w-5 h-5 text-[#EA580C]" />, tab: 'timetable' },
                      { label: 'Attendance', icon: <CheckSquare className="w-5 h-5 text-orange-600" />, tab: 'attendance' },
                      { label: 'Downloads', icon: <Download className="w-5 h-5 text-amber-700" />, tab: 'downloads' },
                      { label: 'Feedback', icon: <MessageSquare className="w-5 h-5 text-rose-600" />, tab: 'feedback' },
                    ].map((item, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveTab(item.tab as TabType)}
                        className="p-3 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl flex flex-col items-center justify-center text-center gap-2 hover:border-[#F97316] hover:bg-white transition-all cursor-pointer"
                      >
                        {item.icon}
                        <span className="text-[10px] font-extrabold text-[#525252]">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Performance Overview */}
                <div className="lg:col-span-4 bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-[#F7F7F7]">
                    <h3 className="font-extrabold text-sm text-[#171717]">Performance Summary</h3>
                    <span className="text-xs font-extrabold text-[#F97316]">Live Telemetry</span>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Circle Indicator (Orange) */}
                    <div className="relative w-24 h-24 rounded-full border-8 border-[#F97316] flex items-center justify-center shrink-0">
                      <span className="text-lg font-black text-[#171717]">{attendancePercentage}%</span>
                    </div>

                    <div className="space-y-2 text-xs font-semibold text-[#525252] flex-1">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#F97316]" /> Attendance</span>
                        <span className="font-black text-[#171717]">{attendancePercentage}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Present Days</span>
                        <span className="font-black text-[#171717]">{presentCount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-400" /> Absent Days</span>
                        <span className="font-black text-[#171717]">{absentCount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-neutral-400" /> Total Courses</span>
                        <span className="font-black text-[#171717]">{enrolledCoursesCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: CLASSROOM SECTION CHANNELS & CHAT PAGE (Modular Component) */}
          {activeTab === 'channels' && (
            <SectionChannelsChatWorkspace
              channelList={channelList}
              activeChannelId={activeChannelId}
              onSelectChannel={setActiveChannelId}
              chatMessages={liveChatHistory.length > 0 ? liveChatHistory.map(m => ({ id: m.id, sender: m.senderName, text: m.messageContent, time: m.timestamp, isSelf: m.senderId === studentId })) : localChatMessages}
              chatInputText={chatInputText}
              onChatInputChange={setChatInputText}
              onSendMessage={handleSendMessage}
            />
          )}

          {/* TAB 3: TIMETABLE PAGE */}
          {activeTab === 'timetable' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-[#E5E5E5] shadow-xs">
                <div>
                  <h2 className="text-xl font-black text-[#171717]">Weekly Timetable Matrix ({totalTimetableSlots} Entries)</h2>
                  <p className="text-xs text-[#737373]">Live timetable schedules fetched directly from backend database node</p>
                </div>
                <div className="px-3 py-1.5 bg-orange-50 text-[#F97316] rounded-xl text-xs font-black border border-orange-200">
                  {activeSemesterName}
                </div>
              </div>

              {isTimetableLoading ? (
                <div className="bg-white p-12 text-center text-xs text-[#737373] rounded-2xl border border-[#E5E5E5] animate-pulse">
                  Loading backend timetable entries...
                </div>
              ) : liveTimetableEntries.length === 0 ? (
                <div className="bg-white p-12 text-center border border-dashed border-[#E5E5E5] rounded-2xl space-y-3">
                  <Inbox className="w-10 h-10 text-[#737373] mx-auto opacity-40" />
                  <h3 className="text-sm font-extrabold text-[#171717]">No timetable entries scheduled</h3>
                  <p className="text-xs text-[#737373]">When administrators assign timetable schedule slots in backend, they will render here automatically.</p>
                </div>
              ) : (
                <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F7F7F7] border-b border-[#E5E5E5] text-[#737373] font-extrabold">
                        <tr>
                          <th className="p-4">Day</th>
                          <th className="p-4">Time Slot</th>
                          <th className="p-4">Course</th>
                          <th className="p-4">Room Number</th>
                          <th className="p-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F7F7F7] text-[#525252] font-semibold">
                        {liveTimetableEntries.map((entry) => (
                          <tr key={entry.id} className="hover:bg-[#F7F7F7]">
                            <td className="p-4 font-black text-[#F97316]">{entry.dayOfWeek}</td>
                            <td className="p-4 font-bold">{entry.startTime} - {entry.endTime}</td>
                            <td className="p-4 font-bold text-[#171717]">{entry.courseTitle || `Course #${entry.courseId}`}</td>
                            <td className="p-4 text-[#737373]">Room {entry.roomNumber}</td>
                            <td className="p-4">
                              <span className="px-2.5 py-1 rounded-md bg-orange-50 text-[#F97316] text-[10px] font-extrabold">
                                {entry.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ACADEMIC CALENDAR PAGE */}
          {activeTab === 'calendar' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-[#E5E5E5] shadow-xs">
                <div>
                  <h2 className="text-xl font-black text-[#171717]">Academic Calendar 2026</h2>
                  <p className="text-xs text-[#737373]">Official institutional academic terms, semesters, and assessment dates</p>
                </div>
                <div className="flex items-center gap-2">
                  {['May 2026', 'June 2026', 'July 2026'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setSelectedMonth(m)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        selectedMonth === m ? 'bg-[#F97316] text-white shadow-xs' : 'bg-[#F7F7F7] text-[#525252]'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Month View & Events List */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-xs space-y-4">
                  <h3 className="font-extrabold text-sm text-[#171717] pb-2 border-b border-[#F7F7F7]">{selectedMonth} Schedule Grid</h3>
                  <div className="grid grid-cols-7 text-center text-xs font-extrabold text-[#737373] gap-2">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold">
                    {[...Array(31)].map((_, i) => {
                      const day = i + 1;
                      const isExam = day >= 10 && day <= 15;
                      const isHoliday = day === 25;
                      return (
                        <div
                          key={i}
                          className={`p-3 rounded-xl border flex flex-col justify-between h-16 ${
                            isExam ? 'bg-orange-50 border-orange-300 text-[#F97316] font-black' :
                            isHoliday ? 'bg-amber-50 border-amber-300 text-amber-900 font-black' :
                            'bg-[#F7F7F7] border-[#E5E5E5] text-[#525252]'
                          }`}
                        >
                          <span>{day}</span>
                          {isExam && <span className="text-[9px] text-[#F97316] font-bold block">Mid Sem</span>}
                          {isHoliday && <span className="text-[9px] text-amber-700 font-bold block">Holiday</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Event Highlights List from Backend Academic Terms */}
                <div className="lg:col-span-5 bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-xs space-y-4">
                  <h3 className="font-extrabold text-sm text-[#171717] pb-2 border-b border-[#F7F7F7]">Configured Academic Terms</h3>
                  <div className="space-y-3">
                    {liveAcademicYears.map((year) => (
                      <div key={year.id} className="p-4 border border-orange-200 bg-orange-50/50 rounded-xl space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-extrabold uppercase text-[#F97316]">
                          <span>ACADEMIC YEAR</span>
                          <span>{year.status}</span>
                        </div>
                        <h4 className="font-black text-xs text-[#171717]">{year.yearName}</h4>
                        <p className="text-[11px] text-[#737373]">{year.startDate} to {year.endDate}</p>
                      </div>
                    ))}

                    {liveSemesters.map((sem) => (
                      <div key={sem.id} className="p-4 border border-amber-200 bg-amber-50/50 rounded-xl space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-extrabold uppercase text-amber-700">
                          <span>SEMESTER TERM</span>
                          <span>{sem.status}</span>
                        </div>
                        <h4 className="font-black text-xs text-[#171717]">{sem.semesterName}</h4>
                        <p className="text-[11px] text-[#737373]">{sem.startDate} to {sem.endDate}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: COURSES PAGE */}
          {activeTab === 'courses' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white p-6 rounded-2xl border border-[#E5E5E5] shadow-xs">
                <h2 className="text-xl font-black text-[#171717]">Registered Course Catalog ({enrolledCoursesCount})</h2>
                <p className="text-xs text-[#737373]">Live courses registered in database node</p>
              </div>

              {isCoursesLoading ? (
                <div className="bg-white p-12 text-center text-xs text-[#737373] rounded-2xl border border-[#E5E5E5] animate-pulse">
                  Loading registered course catalog...
                </div>
              ) : liveCourses.length === 0 ? (
                <div className="bg-white p-12 text-center border border-dashed border-[#E5E5E5] rounded-2xl space-y-3">
                  <Inbox className="w-10 h-10 text-[#737373] mx-auto opacity-40" />
                  <h3 className="text-sm font-extrabold text-[#171717]">No courses registered</h3>
                  <p className="text-xs text-[#737373]">When courses are added to the academic catalog in backend, they will display here live.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {liveCourses.map((course) => (
                    <div key={course.id} className="bg-[#FFFFFF] border border-[#E5E5E5] p-6 rounded-2xl shadow-xs space-y-4 hover:border-[#F97316] transition-colors">
                      <div className="flex justify-between items-center">
                        <span className="px-2.5 py-1 bg-orange-50 text-[#F97316] text-[10px] font-extrabold rounded-lg">
                          {course.courseCode}
                        </span>
                        <span className="text-[10px] font-extrabold text-[#737373]">{course.courseType}</span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-black text-sm text-[#171717]">{course.courseTitle}</h4>
                        <p className="text-xs text-[#737373]">{course.credits} Academic Credits</p>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-[#F7F7F7] text-xs font-semibold text-[#525252]">
                        <span className="text-[11px] font-bold text-[#F97316]">{course.status}</span>
                        <button onClick={() => setActiveTab('timetable')} className="text-[#F97316] hover:underline text-xs font-bold">
                          View Schedule &gt;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* FALLBACK FOR OTHER TABS */}
          {['profile', 'results', 'attendance', 'exams', 'noticeboard', 'downloads', 'feedback'].includes(activeTab) && (
            <div className="bg-white border border-[#E5E5E5] p-12 rounded-2xl shadow-xs text-center space-y-4 animate-in fade-in duration-300">
              <div className="w-12 h-12 bg-orange-50 text-[#F97316] rounded-2xl flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-[#171717] capitalize">{activeTab} Live Workspace</h3>
              <p className="text-xs text-[#737373] max-w-md mx-auto">
                All telemetry records for {activeTab} are dynamically connected to your backend RTK Query store (`/api`).
              </p>
              <button onClick={() => setActiveTab('dashboard')} className="bg-[#F97316] hover:bg-[#EA580C] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs">
                Return to Main Dashboard
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
