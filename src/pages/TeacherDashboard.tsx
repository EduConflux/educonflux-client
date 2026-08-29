import React, { useState } from 'react';
import { Logo } from '../components/common/Logo';
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  LogOut, 
  Send, 
  Clock,
  ChevronRight
} from 'lucide-react';

interface TeacherDashboardProps {
  onNavigate: (route: string) => void;
}

const classrooms = [
  { id: 1, name: 'CS101: Introduction to Algorithms', section: 'Section A', count: '45 Students' },
  { id: 2, name: 'CS202: Database Management Systems', section: 'Section B', count: '38 Students' }
];

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'attendance' | 'classrooms' | 'chat'>('dashboard');
  const [selectedClassroom, setSelectedClassroom] = useState<number | null>(null);
  const [classroomTab, setClassroomTab] = useState<'feed' | 'members' | 'chat'>('feed');

  // Attendance Register state
  const [attendanceDate, setAttendanceDate] = useState('2026-08-29');
  const [attendanceRecords, setAttendanceRecords] = useState([
    { id: 1, name: 'John Doe', roll: 'STU-001', status: 'PRESENT' },
    { id: 2, name: 'Jane Smith', roll: 'STU-002', status: 'PRESENT' },
    { id: 3, name: 'Bob Johnson', roll: 'STU-003', status: 'ABSENT' }
  ]);

  // Feed/Post state
  const [posts, setPosts] = useState([
    { id: 1, author: 'Dr. Sharma', content: 'Reminder: Final project proposals are due by Sunday midnight.', timestamp: '2 hours ago' },
    { id: 2, author: 'Dr. Sharma', content: 'Reading materials for CS101 Lecture 12 have been updated in resources.', timestamp: '1 day ago' }
  ]);
  const [newPostContent, setNewPostContent] = useState('');

  // Group chat State
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'Dr. Sharma', text: 'Welcome to CS101 classroom chat support group.', time: '10:00 AM' },
    { id: 2, sender: 'John Doe', text: 'Thank you professor, will the slides be uploaded here?', time: '10:02 AM' }
  ]);
  const [newMessageText, setNewMessageText] = useState('');

  const handleToggleAttendance = (id: number) => {
    setAttendanceRecords(attendanceRecords.map(r => 
      r.id === id 
        ? { ...r, status: r.status === 'PRESENT' ? 'ABSENT' : r.status === 'ABSENT' ? 'LATE' : 'PRESENT' } 
        : r
    ));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    const newPost = {
      id: posts.length + 1,
      author: 'Dr. Sharma',
      content: newPostContent,
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
      sender: 'Dr. Sharma',
      text: newMessageText,
      time: 'Just now'
    };
    setChatMessages([...chatMessages, newMsg]);
    setNewMessageText('');
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex text-[#171717]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E5E5E5] flex flex-col shrink-0">
        <div className="p-5 border-b border-[#E5E5E5]">
          <Logo size="md" />
          <span className="text-[10px] uppercase tracking-wider text-[#737373] block mt-1 font-bold">Faculty Workspace</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => { setActiveTab('dashboard'); setSelectedClassroom(null); }} 
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'dashboard' ? 'bg-orange-50 text-[#F97316]' : 'hover:bg-[#F7F7F7] text-[#525252]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>

          <button 
            onClick={() => { setActiveTab('attendance'); setSelectedClassroom(null); }} 
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'attendance' ? 'bg-orange-50 text-[#F97316]' : 'hover:bg-[#F7F7F7] text-[#525252]'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            Attendance Register
          </button>

          <button 
            onClick={() => { setActiveTab('classrooms'); setSelectedClassroom(null); }} 
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'classrooms' || selectedClassroom !== null ? 'bg-orange-50 text-[#F97316]' : 'hover:bg-[#F7F7F7] text-[#525252]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            My Classrooms
          </button>
        </nav>

        <div className="p-4 border-t border-[#E5E5E5]">
          <button 
            onClick={() => onNavigate('/')}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-[#E5E5E5] px-8 py-4 flex items-center justify-between shrink-0">
          <h2 className="font-bold text-sm">Faculty Console</h2>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="font-bold text-xs block">Dr. Sharma</span>
              <span className="text-[10px] text-[#737373]">Senior CSE Faculty</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center font-bold text-[#F97316] text-xs">
              DS
            </div>
          </div>
        </header>

        <div className="flex-1 p-8">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && selectedClassroom === null && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* College Faculty Banner */}
              <div className="bg-gradient-to-r from-blue-600 via-[#1E40AF] to-indigo-700 p-6 rounded-2xl text-white shadow-md relative overflow-hidden flex items-center justify-between">
                <div className="space-y-1 relative z-10">
                  <span className="text-[10px] uppercase font-extrabold tracking-widest bg-white/20 px-2 py-0.5 rounded-md">Faculty Desk</span>
                  <h3 className="text-xl font-black">Welcome back, Dr. Sharma</h3>
                  <p className="text-xs text-blue-100 font-medium">Verify daily registers, launch classroom support groups, and coordinate courses.</p>
                </div>
                <div className="absolute right-[-2%] bottom-[-20%] text-white/5 text-9xl font-black select-none pointer-events-none">
                  CSE
                </div>
              </div>

              {/* Grid Widgets */}
              <div className="grid grid-cols-4 gap-6">
                {[
                  { label: 'Today\'s Classes', value: '3 Lectures', desc: 'Active scheduler block', color: 'border-orange-500', valueColor: 'text-[#F97316]' },
                  { label: 'Pending Tasks', value: '5 Items', desc: 'Requires faculty review', color: 'border-blue-500', valueColor: 'text-blue-600' },
                  { label: 'Unchecked Posts', value: '2 Announcements', desc: 'Classroom board stream', color: 'border-indigo-500', valueColor: 'text-indigo-600' },
                  { label: 'Attendance Rate', value: '92%', desc: 'Roster enrollment aggregate', color: 'border-emerald-500', valueColor: 'text-emerald-600' }
                ].map((widget, idx) => (
                  <div key={idx} className={`bg-white border-l-4 ${widget.color} border border-[#E5E5E5]/60 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all`}>
                    <span className="text-[10px] font-extrabold text-[#737373] block uppercase tracking-wider">{widget.label}</span>
                    <span className={`text-2xl font-black block mt-1.5 ${widget.valueColor}`}>{widget.value}</span>
                    <span className="text-[10px] text-[#737373] block mt-1 font-medium">{widget.desc}</span>
                  </div>
                ))}
              </div>

              {/* Weekly Timetable block */}
              <div className="bg-white border border-[#E5E5E5] p-6 rounded-2xl space-y-4 shadow-xs">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#737373]">Weekly Schedule View</h4>
                <div className="grid grid-cols-5 gap-3 text-xs">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, idx) => (
                    <div key={day} className="border border-[#E5E5E5] rounded-xl p-3 bg-[#F7F7F7]/50 space-y-2">
                      <span className="font-bold text-[10px] uppercase text-[#737373]">{day}</span>
                      <div className="p-2 border border-[#E5E5E5] rounded-lg bg-white space-y-1">
                        <span className="font-bold text-[11px] block">CS101 (Sec A)</span>
                        <span className="text-[10px] text-[#737373] flex items-center gap-1"><Clock className="w-3 h-3 text-[#F97316]" /> 09:00 AM</span>
                      </div>
                      {idx % 2 === 0 && (
                        <div className="p-2 border border-[#E5E5E5] rounded-lg bg-white space-y-1">
                          <span className="font-bold text-[11px] block">CS202 (Sec B)</span>
                          <span className="text-[10px] text-[#737373] flex items-center gap-1"><Clock className="w-3 h-3 text-[#F97316]" /> 11:30 AM</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === 'attendance' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold tracking-tight">Attendance Registry</h3>
                  <p className="text-xs text-[#737373]">Select timing slot to sign current student roster</p>
                </div>
                <input 
                  type="date" 
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="border border-[#E5E5E5] rounded-xl px-3 py-1.5 text-xs bg-white"
                />
              </div>

              <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F7F7] border-b border-[#E5E5E5] font-bold text-[#737373]">
                    <tr>
                      <th className="p-4">Student Name</th>
                      <th className="p-4">Roster Roll</th>
                      <th className="p-4">Attendance Status</th>
                      <th className="p-4 text-right">Click to Toggle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E5]">
                    {attendanceRecords.map(r => (
                      <tr key={r.id} className="hover:bg-[#F7F7F7]/50">
                        <td className="p-4 font-semibold">{r.name}</td>
                        <td className="p-4">{r.roll}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            r.status === 'PRESENT' ? 'bg-green-50 text-green-700' :
                            r.status === 'ABSENT' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                          }`}>{r.status}</span>
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => handleToggleAttendance(r.id)}
                            className="bg-orange-50 text-[#F97316] font-bold px-3 py-1 rounded-lg text-[10px] hover:bg-orange-100"
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
          )}

          {/* Classrooms Tab */}
          {activeTab === 'classrooms' && selectedClassroom === null && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold tracking-tight">Active Classrooms</h3>
                  <p className="text-xs text-[#737373]">Direct control desk for course feeds, rosters and chat boards</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {classrooms.map(c => (
                  <div key={c.id} className="bg-white border border-[#E5E5E5] p-6 rounded-2xl shadow-xs space-y-4 hover:border-[#F97316] transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#F97316] block">{c.section}</span>
                        <h4 className="font-bold text-sm mt-1">{c.name}</h4>
                      </div>
                      <span className="text-xs bg-[#F7F7F7] px-2.5 py-1 rounded-md text-[#737373]">{c.count}</span>
                    </div>
                    <button 
                      onClick={() => setSelectedClassroom(c.id)}
                      className="w-full bg-[#F7F7F7] hover:bg-orange-50 text-[#525252] hover:text-[#F97316] py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                    >
                      Enter Classroom Console <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Classroom Detail View */}
          {selectedClassroom !== null && (
            <div className="space-y-6">
              {/* Classroom header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
                <div>
                  <button 
                    onClick={() => setSelectedClassroom(null)}
                    className="text-xs text-[#737373] hover:text-[#171717] font-semibold mb-1 block"
                  >
                    ← Back to Classrooms List
                  </button>
                  <h3 className="text-lg font-bold">
                    {classrooms.find(c => c.id === selectedClassroom)?.name}
                  </h3>
                </div>

                <div className="flex gap-2 bg-[#F7F7F7] p-1 rounded-xl">
                  {['feed', 'members', 'chat'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setClassroomTab(tab as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                        classroomTab === tab ? 'bg-white text-[#F97316] shadow-xs' : 'text-[#737373] hover:text-[#171717]'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subtabs detail */}
              {classroomTab === 'feed' && (
                <div className="grid grid-cols-3 gap-6">
                  {/* Left compose Announcement block */}
                  <div className="col-span-2 space-y-4">
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
                        <button type="submit" className="bg-[#F97316] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#EA580C]">
                          Post Announcement
                        </button>
                      </div>
                    </form>

                    {/* Announcement Feed */}
                    <div className="space-y-4">
                      {posts.map(p => (
                        <div key={p.id} className="bg-white border border-[#E5E5E5] p-5 rounded-2xl space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold">{p.author}</span>
                            <span className="text-[10px] text-[#737373]">{p.timestamp}</span>
                          </div>
                          <p className="text-xs text-[#525252] leading-relaxed">{p.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right resources checklist */}
                  <div className="bg-white border border-[#E5E5E5] p-5 rounded-2xl space-y-4 h-fit">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-[#737373]">Lesson Resources</h4>
                    <div className="space-y-2 text-xs">
                      {['Syllabus.pdf', 'Lecture_1_Slides.pdf', 'Algorithms_Recap.zip'].map((res, i) => (
                        <div key={i} className="flex justify-between items-center p-2.5 border border-[#E5E5E5] rounded-xl hover:bg-[#F7F7F7]/50 cursor-pointer">
                          <span className="font-semibold">{res}</span>
                          <span className="text-[10px] text-[#737373]">Download</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {classroomTab === 'members' && (
                <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F7F7F7] border-b border-[#E5E5E5] font-bold text-[#737373]">
                      <tr>
                        <th className="p-4">Participant</th>
                        <th className="p-4">Course Role</th>
                        <th className="p-4 text-right">Channel Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#E5E5E5]">
                        <td className="p-4 font-semibold">Dr. Sharma</td>
                        <td className="p-4 text-[#F97316] font-bold text-[10px]">INSTRUCTOR (YOU)</td>
                        <td className="p-4 text-right">-</td>
                      </tr>
                      <tr className="border-b border-[#E5E5E5]">
                        <td className="p-4 font-semibold">John Doe</td>
                        <td className="p-4 text-[#737373]">Student</td>
                        <td className="p-4 text-right">
                          <button onClick={() => setClassroomTab('chat')} className="text-xs bg-orange-50 text-[#F97316] px-3 py-1 rounded-lg font-bold">Chat</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {classroomTab === 'chat' && (
                <div className="grid grid-cols-4 gap-6">
                  {/* Active list on left */}
                  <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4 h-[400px] flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] mb-3 block">Conversations</span>
                    <div className="space-y-1.5">
                      <div className="p-2.5 rounded-xl bg-orange-50 text-[#F97316] font-semibold text-xs cursor-pointer">
                        # Classroom Channel
                      </div>
                      <div className="p-2.5 rounded-xl hover:bg-[#F7F7F7] text-[#525252] text-xs cursor-pointer">
                        John Doe
                      </div>
                    </div>
                  </div>

                  {/* Chat interface on right */}
                  <div className="col-span-3 bg-white border border-[#E5E5E5] rounded-2xl flex flex-col h-[400px]">
                    <div className="p-4 border-b border-[#E5E5E5]">
                      <span className="font-bold text-xs"># Classroom Support Channel</span>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
                      {chatMessages.map(m => (
                        <div key={m.id} className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs">{m.sender}</span>
                            <span className="text-[9px] text-[#737373]">{m.time}</span>
                          </div>
                          <p className="text-xs text-[#525252] bg-[#F7F7F7] p-2.5 rounded-xl inline-block max-w-md">{m.text}</p>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleSendMessage} className="p-3 border-t border-[#E5E5E5] flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Write support message to classroom..."
                        value={newMessageText}
                        onChange={(e) => setNewMessageText(e.target.value)}
                        className="flex-1 border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs outline-hidden focus:ring-[#F97316] focus:border-[#F97316]"
                      />
                      <button type="submit" className="bg-[#F97316] hover:bg-[#EA580C] text-white p-2 rounded-xl">
                        <Send className="w-4 h-4" />
                      </button>
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
