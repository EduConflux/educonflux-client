import React, { useState } from 'react';
import { Logo } from '../components/common/Logo';
import { useAuth } from '../features/auth/context/AuthContext';
import { useClassSections } from '../features/academic/hooks/useAcademic';
import { useFacultyAttendance, useMarkAttendance } from '../features/attendance/hooks/useAttendance';
import { useFacultyTodayTimetable } from '../features/timetable/hooks/useTimetable';
import { 
  useFacultyClassrooms, 
  useFacultyClassroomPosts, 
  useCreatePost,
  useChatHistory 
} from '../features/classrooms/hooks/useClassrooms';
import type { ClassroomPost } from '../features/classrooms/types';
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  LogOut, 
  Send, 
  ChevronRight,
  Sparkles,
  Plus
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
  const [classroomTab, setClassroomTab] = useState<'feed' | 'chat'>('feed');

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

  // Active Classroom Feed
  const activeClassroomId = selectedClassroom || (liveClassrooms[0]?.id || liveSections[0]?.id || 1);
  const { data: classroomPosts = [] } = useFacultyClassroomPosts(activeClassroomId);
  const createPostMutation = useCreatePost(activeClassroomId);

  // Group chat
  const { data: remoteChat = [] } = useChatHistory(activeClassroomId);
  const [localChatMessages, setLocalChatMessages] = useState<{ id: number; sender: string; text: string; time: string }[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);

  // Combined classrooms list
  const displayClassrooms = liveClassrooms.length > 0 
    ? liveClassrooms 
    : liveSections.map(s => ({
        id: s.id,
        name: s.sectionName,
        courseTitle: s.courseTitle || 'Course Section',
        description: `Capacity: ${s.capacity} Students`,
      }));

  const activeClassroom = displayClassrooms.find(c => c.id === selectedClassroom) || displayClassrooms[0];

  const handleLogout = () => {
    logout();
    onNavigate('/login');
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || !newPostTitle.trim()) return;

    try {
      await createPostMutation.mutateAsync({
        title: newPostTitle.trim(),
        content: newPostContent.trim(),
        type: 'ANNOUNCEMENT',
      });
      setNewPostTitle('');
      setNewPostContent('');
      setShowPostModal(false);
    } catch {
      setShowPostModal(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: teacherName,
      text: newMessageText.trim(),
      time: 'Just now',
    };
    setLocalChatMessages(prev => [...prev, newMsg]);
    setNewMessageText('');
  };

  const allChatMessages = [
    ...remoteChat.map(m => ({ id: m.id, sender: m.senderName, text: m.messageContent, time: m.timestamp })),
    ...localChatMessages,
  ];

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
                  <h2 className="text-xl font-bold tracking-tight text-[#171717]">
                    {selectedClassroom ? activeClassroom?.name : 'My Classrooms'}
                  </h2>
                  <p className="text-xs text-[#737373]">
                    {selectedClassroom ? (activeClassroom?.courseTitle || 'Classroom Stream') : 'Manage your teaching streams, posts, and student discussion'}
                  </p>
                </div>

                {selectedClassroom && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowPostModal(true)}
                      className="flex items-center gap-1.5 bg-[#F97316] text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-[#EA580C] cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Announcement</span>
                    </button>
                    <button
                      onClick={() => setSelectedClassroom(null)}
                      className="text-xs text-[#737373] hover:text-[#171717] border border-[#E5E5E5] px-3 py-2 rounded-xl cursor-pointer"
                    >
                      ← Back to Classrooms
                    </button>
                  </div>
                )}
              </div>

              {!selectedClassroom ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayClassrooms.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setSelectedClassroom(c.id)}
                      className="bg-white border border-[#E5E5E5] hover:border-[#F97316] p-6 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer space-y-4 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F97316] flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                          Active Stream
                        </span>
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-sm text-[#171717] group-hover:text-[#F97316] transition-colors">{c.name}</h3>
                        <p className="text-xs text-[#737373] line-clamp-2">{c.courseTitle || c.description || 'Academic Section'}</p>
                      </div>
                      <div className="pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-xs text-[#F97316] font-bold">
                        <span>Open Workspace</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Subtabs for selected classroom */}
                  <div className="flex border-b border-[#E5E5E5] gap-4">
                    <button
                      onClick={() => setClassroomTab('feed')}
                      className={`pb-3 text-xs font-bold border-b-2 cursor-pointer transition-all ${
                        classroomTab === 'feed' ? 'border-[#F97316] text-[#F97316]' : 'border-transparent text-[#737373]'
                      }`}
                    >
                      Announcements & Feed ({classroomPosts.length})
                    </button>
                    <button
                      onClick={() => setClassroomTab('chat')}
                      className={`pb-3 text-xs font-bold border-b-2 cursor-pointer transition-all ${
                        classroomTab === 'chat' ? 'border-[#F97316] text-[#F97316]' : 'border-transparent text-[#737373]'
                      }`}
                    >
                      Section Chat Stream
                    </button>
                  </div>

                  {classroomTab === 'feed' && (
                    <div className="space-y-4">
                      {classroomPosts.length === 0 ? (
                        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-12 text-center space-y-2">
                          <Sparkles className="w-8 h-8 text-[#737373] mx-auto opacity-50" />
                          <h4 className="font-bold text-sm text-[#171717]">No Announcements Posted Yet</h4>
                          <p className="text-xs text-[#737373]">Click "Create Announcement" to post updates to your students.</p>
                        </div>
                      ) : (
                        classroomPosts.map((post: ClassroomPost) => (
                          <div key={post.id} className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-xs space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-[#171717]">{post.title}</span>
                              <span className="text-[10px] font-bold text-[#F97316] bg-orange-50 px-2 py-0.5 rounded-full">
                                {post.type}
                              </span>
                            </div>
                            <p className="text-xs text-[#525252] leading-relaxed">{post.content}</p>
                            <span className="text-[10px] text-[#737373] block pt-2 border-t border-[#F7F7F7]">
                              Posted by {post.facultyName || teacherName}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {classroomTab === 'chat' && (
                    <div className="bg-white border border-[#E5E5E5] rounded-2xl flex flex-col h-[500px] overflow-hidden">
                      <div className="flex-1 p-5 overflow-y-auto space-y-3">
                        {allChatMessages.length === 0 ? (
                          <div className="h-full flex items-center justify-center text-xs text-[#737373]">
                            No chat messages in this section.
                          </div>
                        ) : (
                          allChatMessages.map((msg) => (
                            <div key={msg.id} className="p-3 bg-[#F7F7F7] rounded-xl text-xs space-y-1">
                              <div className="flex items-center justify-between text-[11px] font-bold text-[#171717]">
                                <span>{msg.sender}</span>
                                <span className="text-[9px] text-[#737373]">{msg.time}</span>
                              </div>
                              <p className="text-[#525252]">{msg.text}</p>
                            </div>
                          ))
                        )}
                      </div>

                      <form onSubmit={handleSendMessage} className="p-4 border-t border-[#E5E5E5] flex gap-2">
                        <input
                          value={newMessageText}
                          onChange={(e) => setNewMessageText(e.target.value)}
                          placeholder="Type a message to the classroom..."
                          className="flex-1 bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-xs text-[#171717] focus:outline-hidden focus:border-[#F97316]"
                        />
                        <button
                          type="submit"
                          disabled={!newMessageText.trim()}
                          className="px-4 py-2.5 bg-[#F97316] text-white rounded-xl hover:bg-[#EA580C] disabled:opacity-40 transition-colors cursor-pointer"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {/* Create Post Modal */}
              {showPostModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-in fade-in">
                  <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-[#E5E5E5] shadow-2xl space-y-4">
                    <h3 className="font-bold text-sm text-[#171717]">Publish Classroom Announcement</h3>
                    <form onSubmit={handleCreatePost} className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">Title</label>
                        <input
                          required
                          value={newPostTitle}
                          onChange={(e) => setNewPostTitle(e.target.value)}
                          className="w-full border border-[#E5E5E5] rounded-lg p-2 text-xs"
                          placeholder="e.g. Midterm Examination Schedule"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">Content</label>
                        <textarea
                          required
                          rows={4}
                          value={newPostContent}
                          onChange={(e) => setNewPostContent(e.target.value)}
                          className="w-full border border-[#E5E5E5] rounded-lg p-2 text-xs"
                          placeholder="Write announcement details..."
                        />
                      </div>
                      <div className="flex gap-2 justify-end pt-3">
                        <button
                          type="button"
                          onClick={() => setShowPostModal(false)}
                          className="px-3 py-1.5 border border-[#E5E5E5] text-xs font-semibold rounded-lg cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={createPostMutation.isPending}
                          className="px-4 py-1.5 bg-[#F97316] text-white text-xs font-semibold rounded-lg hover:bg-[#EA580C] cursor-pointer shadow-xs disabled:opacity-50"
                        >
                          {createPostMutation.isPending ? 'Publishing...' : 'Publish'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
