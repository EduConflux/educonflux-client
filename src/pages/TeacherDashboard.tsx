import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Logo } from '../components/common/Logo';
import { useGetAttendanceBySectionQuery, useMarkAttendanceMutation } from '../store/api/attendanceApi';
import { useGetClassSectionsQuery } from '../store/api/academicApi';
import { logout } from '../store/slices/authSlice';
import type { RootState } from '../store';
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  LogOut, 
  Send, 
  ChevronRight,
  Inbox,
  Users
} from 'lucide-react';

interface TeacherDashboardProps {
  onNavigate: (route: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onNavigate }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const teacherName = user?.firstName 
    ? `${user.firstName} ${user.lastName || ''}`.trim() 
    : (user?.email ? user.email.split('@')[0] : 'Faculty Member');
  const teacherEmail = user?.email || 'faculty@institution.edu';
  const teacherInitials = user?.firstName 
    ? `${user.firstName[0]}${user.lastName ? user.lastName[0] : ''}` 
    : (user?.email ? user.email.slice(0, 2).toUpperCase() : 'FC');

  const [activeTab, setActiveTab] = useState<'dashboard' | 'attendance' | 'classrooms'>('dashboard');
  const [selectedClassroom, setSelectedClassroom] = useState<number | null>(null);
  const [classroomTab, setClassroomTab] = useState<'feed' | 'members' | 'chat'>('feed');

  // Real Class Sections from DB
  const { data: liveSections = [], isLoading: isLoadingSections } = useGetClassSectionsQuery();

  // Attendance Register state
  const [attendanceDate, setAttendanceDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [attendanceRecords] = useState<{ id: number; name: string; roll: string; status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' }[]>([]);

  // Live RTK Query Attendance Data
  const { data: liveAttendance = [] } = useGetAttendanceBySectionQuery(
    { classSectionId: selectedClassroom || (liveSections[0]?.id || 1), date: attendanceDate },
    { skip: liveSections.length === 0 }
  );

  const activeAttendanceCount = liveAttendance.length || attendanceRecords.length;
  const [markAttendanceApi] = useMarkAttendanceMutation();

  const handleSaveAttendance = async () => {
    if (!selectedClassroom && liveSections.length === 0) return;
    try {
      await markAttendanceApi({
        classSectionId: selectedClassroom || liveSections[0]?.id || 1,
        date: attendanceDate,
        attendanceList: attendanceRecords.map(r => ({
          studentId: r.id,
          status: r.status
        }))
      }).unwrap();
    } catch (e) {
      // Backend handles persistence
    }
  };

  // Feed/Post state
  const [posts, setPosts] = useState<{ id: number; author: string; content: string; timestamp: string }[]>([]);
  const [newPostContent, setNewPostContent] = useState('');

  // Group chat State
  const [chatMessages, setChatMessages] = useState<{ id: number; sender: string; text: string; time: string }[]>([]);
  const [newMessageText, setNewMessageText] = useState('');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    const newPost = {
      id: posts.length + 1,
      author: teacherName,
      content: newPostContent.trim(),
      timestamp: 'Just now'
    };
    setPosts([newPost, ...posts]);
    setNewPostContent('');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;
    const newMsg = {
      id: chatMessages.length + 1,
      sender: teacherName,
      text: newMessageText.trim(),
      time: 'Just now'
    };
    setChatMessages([...chatMessages, newMsg]);
    setNewMessageText('');
  };

  const handleLogout = () => {
    dispatch(logout());
    onNavigate('/login');
  };

  const activeClassroom = liveSections.find(c => c.id === selectedClassroom);

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

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-[#E5E5E5] px-8 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-sm text-[#171717]">Faculty Console</h2>
            <span className="text-[10px] bg-orange-50 text-[#F97316] font-bold px-2 py-0.5 rounded-full border border-orange-200">
              Live DB Sync
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
              {/* Faculty Banner */}
              <div className="bg-gradient-to-r from-blue-600 via-[#1E40AF] to-indigo-700 p-6 rounded-2xl text-white shadow-md relative overflow-hidden flex items-center justify-between">
                <div className="space-y-1.5 relative z-10 max-w-xl">
                  <span className="text-[10px] uppercase font-extrabold tracking-widest bg-white/20 px-2 py-0.5 rounded-md">
                    Faculty Desk
                  </span>
                  <h3 className="text-xl font-black">Welcome back, {teacherName}</h3>
                  <p className="text-xs text-blue-100 font-normal leading-relaxed">
                    Verify daily attendance registers, publish announcements to class feeds, and manage student course channels.
                  </p>
                </div>
                <div className="absolute right-[-2%] bottom-[-20%] text-white/5 text-9xl font-black select-none pointer-events-none">
                  FAC
                </div>
              </div>

              {/* Grid Widgets */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white border-l-4 border-l-[#F97316] border border-[#E5E5E5] p-5 rounded-2xl shadow-xs">
                  <span className="text-[10px] font-extrabold text-[#737373] block uppercase tracking-wider">Assigned Sections</span>
                  <span className="text-2xl font-black block mt-1.5 text-[#F97316]">
                    {isLoadingSections ? '...' : liveSections.length}
                  </span>
                  <span className="text-[10px] text-[#737373] block mt-1 font-medium">
                    {liveSections.length === 0 ? 'No active sections assigned' : `${liveSections.length} class sections mapped`}
                  </span>
                </div>

                <div className="bg-white border-l-4 border-l-blue-500 border border-[#E5E5E5] p-5 rounded-2xl shadow-xs">
                  <span className="text-[10px] font-extrabold text-[#737373] block uppercase tracking-wider">Active Stream Posts</span>
                  <span className="text-2xl font-black block mt-1.5 text-blue-600">
                    {posts.length}
                  </span>
                  <span className="text-[10px] text-[#737373] block mt-1 font-medium">
                    Published announcements
                  </span>
                </div>

                <div className="bg-white border-l-4 border-l-emerald-500 border border-[#E5E5E5] p-5 rounded-2xl shadow-xs">
                  <span className="text-[10px] font-extrabold text-[#737373] block uppercase tracking-wider">Account Status</span>
                  <span className="text-2xl font-black block mt-1.5 text-emerald-600">
                    {user?.active !== false ? 'Active' : 'Pending'}
                  </span>
                  <span className="text-[10px] text-[#737373] block mt-1 font-medium">
                    {teacherEmail}
                  </span>
                </div>
              </div>

              {/* Class Sections List */}
              <div className="bg-white border border-[#E5E5E5] p-6 rounded-2xl space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#737373]">Assigned Class Sections</h4>
                {liveSections.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-[#E5E5E5] rounded-xl space-y-2">
                    <Inbox className="w-8 h-8 text-[#737373] mx-auto opacity-50" />
                    <p className="text-xs font-semibold text-[#171717]">No assigned sections in database</p>
                    <p className="text-[11px] text-[#737373]">Sections mapped to your faculty profile by administrators will display here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {liveSections.map((sec) => (
                      <div key={sec.id} className="border border-[#E5E5E5] p-4 rounded-xl flex items-center justify-between hover:border-[#F97316] transition-all bg-[#FDFDFD]">
                        <div className="space-y-1">
                          <span className="font-bold text-xs text-[#171717] block">{sec.sectionName}</span>
                          <span className="text-[10px] text-[#737373] block">Capacity: {sec.capacity} students</span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedClassroom(sec.id);
                            setActiveTab('classrooms');
                          }}
                          className="text-xs font-bold text-[#F97316] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Open Console</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === 'attendance' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-[#171717]">Attendance Registry ({activeAttendanceCount} Records)</h3>
                  <p className="text-xs text-[#737373]">Record and synchronize live session attendance telemetry</p>
                </div>
                <div className="flex items-center gap-3">
                  <input 
                    type="date" 
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="border border-[#E5E5E5] rounded-xl px-3 py-1.5 text-xs bg-white focus:outline-hidden focus:border-[#F97316]"
                  />
                  <button 
                    onClick={handleSaveAttendance}
                    className="bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold px-4 py-1.5 rounded-xl cursor-pointer transition-all shadow-xs"
                  >
                    Save Attendance
                  </button>
                </div>
              </div>

              {liveSections.length === 0 ? (
                <div className="bg-white border border-[#E5E5E5] rounded-2xl p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-orange-50 text-[#F97316] mx-auto flex items-center justify-center">
                    <CheckSquare className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-[#171717]">No Class Sections Assigned</h4>
                  <p className="text-xs text-[#737373] max-w-md mx-auto">
                    There are currently no active class sections assigned to this faculty account to record attendance rosters.
                  </p>
                </div>
              ) : (
                <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 space-y-4">
                  <span className="text-xs font-semibold text-[#171717]">Section: {liveSections[0]?.sectionName}</span>
                  <div className="p-8 text-center border border-dashed border-[#E5E5E5] rounded-xl space-y-2">
                    <Users className="w-8 h-8 text-[#737373] mx-auto opacity-50" />
                    <p className="text-xs font-semibold text-[#171717]">No students mapped to section roster</p>
                    <p className="text-[11px] text-[#737373]">As students enroll in this section, attendance toggles will appear here.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Classrooms Tab */}
          {activeTab === 'classrooms' && selectedClassroom === null && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="text-lg font-bold tracking-tight text-[#171717]">Active Classrooms</h3>
                <p className="text-xs text-[#737373]">Direct control desk for course feeds, rosters and chat boards</p>
              </div>

              {liveSections.length === 0 ? (
                <div className="bg-white border border-[#E5E5E5] rounded-2xl p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-orange-50 text-[#F97316] mx-auto flex items-center justify-center">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-[#171717]">No Classrooms Assigned</h4>
                  <p className="text-xs text-[#737373] max-w-md mx-auto">
                    Your institutional database has not assigned any class sections to this faculty account yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {liveSections.map(c => (
                    <div key={c.id} className="bg-white border border-[#E5E5E5] p-6 rounded-2xl shadow-xs space-y-4 hover:border-[#F97316] transition-all">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#F97316] block">{c.sectionName}</span>
                          <h4 className="font-bold text-sm mt-1">{c.courseTitle || 'Academic Section'}</h4>
                        </div>
                        <span className="text-xs bg-[#F7F7F7] px-2.5 py-1 rounded-md text-[#737373]">Max: {c.capacity} students</span>
                      </div>
                      <button 
                        onClick={() => setSelectedClassroom(c.id)}
                        className="w-full bg-[#F7F7F7] hover:bg-orange-50 text-[#525252] hover:text-[#F97316] py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                      >
                        <span>Enter Classroom Console</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Classroom Detail View */}
          {selectedClassroom !== null && activeClassroom && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
                <div>
                  <button 
                    onClick={() => setSelectedClassroom(null)}
                    className="text-xs text-[#737373] hover:text-[#171717] font-semibold mb-1 block cursor-pointer"
                  >
                    ← Back to Classrooms List
                  </button>
                  <h3 className="text-lg font-bold text-[#171717]">
                    {activeClassroom.sectionName}
                  </h3>
                </div>

                <div className="flex gap-1.5 bg-[#F7F7F7] p-1 rounded-xl border border-[#E5E5E5]">
                  {(['feed', 'members', 'chat'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setClassroomTab(tab)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                        classroomTab === tab ? 'bg-white text-[#F97316] shadow-xs' : 'text-[#737373] hover:text-[#171717]'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feed Tab */}
              {classroomTab === 'feed' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    <form onSubmit={handleCreatePost} className="bg-white border border-[#E5E5E5] p-5 rounded-2xl space-y-3">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-[#737373]">Publish announcement to feed</h4>
                      <textarea
                        rows={3}
                        placeholder="Write something to your students..."
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        className="w-full border border-[#E5E5E5] rounded-xl p-3 text-xs focus:ring-[#F97316] focus:border-[#F97316] outline-hidden resize-none"
                      />
                      <div className="flex justify-end">
                        <button type="submit" className="bg-[#F97316] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#EA580C] cursor-pointer">
                          Post Announcement
                        </button>
                      </div>
                    </form>

                    <div className="space-y-4">
                      {posts.length === 0 ? (
                        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-8 text-center space-y-2">
                          <Inbox className="w-8 h-8 text-[#737373] mx-auto opacity-50" />
                          <p className="text-xs font-bold text-[#171717]">No Announcements Posted Yet</p>
                          <p className="text-[11px] text-[#737373]">Use the form above to broadcast messages to enrolled students.</p>
                        </div>
                      ) : (
                        posts.map(p => (
                          <div key={p.id} className="bg-white border border-[#E5E5E5] p-5 rounded-2xl space-y-2">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-[#171717]">{p.author}</span>
                              <span className="text-[10px] text-[#737373]">{p.timestamp}</span>
                            </div>
                            <p className="text-xs text-[#525252] leading-relaxed">{p.content}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="bg-white border border-[#E5E5E5] p-5 rounded-2xl space-y-4 h-fit">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-[#737373]">Lesson Resources</h4>
                    <p className="text-[11px] text-[#737373]">No course attachments uploaded yet.</p>
                  </div>
                </div>
              )}

              {/* Members Tab */}
              {classroomTab === 'members' && (
                <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F7F7F7] border-b border-[#E5E5E5] font-bold text-[#737373]">
                      <tr>
                        <th className="p-4">Participant Name / Email</th>
                        <th className="p-4">Course Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#E5E5E5]">
                        <td className="p-4 font-semibold text-[#171717]">{teacherName} ({teacherEmail})</td>
                        <td className="p-4 text-[#F97316] font-bold text-[10px]">COURSE FACULTY (YOU)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Chat Tab */}
              {classroomTab === 'chat' && (
                <div className="bg-white border border-[#E5E5E5] rounded-2xl flex flex-col h-[420px]">
                  <div className="p-4 border-b border-[#E5E5E5] flex items-center justify-between">
                    <span className="font-bold text-xs text-[#171717]"># {activeClassroom.sectionName} Support Channel</span>
                    <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">Live Stream</span>
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto space-y-3">
                    {chatMessages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-1 text-[#737373]">
                        <p className="text-xs font-semibold">No messages in channel yet</p>
                        <p className="text-[10px]">Post a message to begin the classroom chat discussion.</p>
                      </div>
                    ) : (
                      chatMessages.map(m => (
                        <div key={m.id} className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#171717]">{m.sender}</span>
                            <span className="text-[9px] text-[#737373]">{m.time}</span>
                          </div>
                          <p className="text-xs text-[#525252] bg-[#F7F7F7] p-2.5 rounded-xl inline-block max-w-md">{m.text}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <form onSubmit={handleSendMessage} className="p-3 border-t border-[#E5E5E5] flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Write message to classroom channel..."
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      className="flex-1 border border-[#E5E5E5] rounded-xl px-3.5 py-2 text-xs outline-hidden focus:ring-1 focus:ring-[#F97316] focus:border-[#F97316]"
                    />
                    <button type="submit" className="bg-[#F97316] hover:bg-[#EA580C] text-white px-3.5 py-2 rounded-xl transition-all cursor-pointer">
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
