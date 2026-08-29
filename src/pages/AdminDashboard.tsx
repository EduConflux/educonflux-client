import React, { useState } from 'react';
import { Logo } from '../components/common/Logo';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  FolderTree, 
  GraduationCap, 
  BookOpen, 
  CalendarDays, 
  LogOut, 
  Plus, 
  Search, 
  Mail,
  Shield
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (route: string) => void;
}

type TabType = 'dashboard' | 'institutions' | 'users' | 'academic' | 'students' | 'faculty' | 'timetable';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [academicSubTab, setAcademicSubTab] = useState<'years' | 'departments' | 'programs' | 'semesters' | 'courses' | 'sections'>('years');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals / forms state
  const [showAddModal, setShowAddModal] = useState(false);

  // Demo data states
  const [institutions, setInstitutions] = useState([
    { id: 1, name: 'EduConflux Academy', code: 'ECA', status: 'ACTIVE', location: 'New York, USA' },
    { id: 2, name: 'Apex Tech University', code: 'ATU', status: 'ACTIVE', location: 'San Francisco, USA' },
    { id: 3, name: 'Saffron Global School', code: 'SGS', status: 'INACTIVE', location: 'London, UK' }
  ]);

  const [users, setUsers] = useState([
    { id: 1, email: 'admin@educonflux.com', role: 'ADMIN', status: 'ACTIVE', lastLogin: 'Today, 10:15 AM' },
    { id: 2, email: 'sharma.dr@educonflux.com', role: 'TEACHER', status: 'ACTIVE', lastLogin: 'Yesterday, 4:30 PM' },
    { id: 3, email: 'doe.john@educonflux.com', role: 'STUDENT', status: 'ACTIVE', lastLogin: 'Today, 8:45 AM' },
    { id: 4, email: 'inactive.user@educonflux.com', role: 'STUDENT', status: 'INACTIVE', lastLogin: 'Never' }
  ]);

  const [courses, setCourses] = useState([
    { id: 1, name: 'Introduction to Algorithms', code: 'CS101', type: 'Core', status: 'ACTIVE' },
    { id: 2, name: 'Database Management Systems', code: 'CS202', type: 'Core', status: 'ACTIVE' },
    { id: 3, name: 'Artificial Intelligence', code: 'CS401', type: 'Elective', status: 'ACTIVE' }
  ]);

  const handleAddInstitution = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newInst = {
      id: institutions.length + 1,
      name: formData.get('name') as string,
      code: formData.get('code') as string,
      status: 'ACTIVE',
      location: formData.get('location') as string
    };
    setInstitutions([...institutions, newInst]);
    setShowAddModal(false);
  };

  const handleAddUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newUser = {
      id: users.length + 1,
      email: formData.get('email') as string,
      role: formData.get('role') as string,
      status: 'ACTIVE',
      lastLogin: 'Never'
    };
    setUsers([...users, newUser]);
    setShowAddModal(false);
  };

  const handleToggleUserStatus = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : u));
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex text-[#171717]">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-[#E5E5E5] flex flex-col shrink-0">
        <div className="p-5 border-b border-[#E5E5E5]">
          <Logo size="md" />
          <span className="text-[10px] uppercase tracking-wider text-[#737373] block mt-1 font-bold">Admin Console</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'dashboard' ? 'bg-orange-50 text-[#F97316]' : 'hover:bg-[#F7F7F7] text-[#525252]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>

          <button 
            onClick={() => setActiveTab('institutions')} 
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'institutions' ? 'bg-orange-50 text-[#F97316]' : 'hover:bg-[#F7F7F7] text-[#525252]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Institutions
          </button>

          <button 
            onClick={() => setActiveTab('users')} 
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'users' ? 'bg-orange-50 text-[#F97316]' : 'hover:bg-[#F7F7F7] text-[#525252]'
            }`}
          >
            <Users className="w-4 h-4" />
            User Directory
          </button>

          <button 
            onClick={() => setActiveTab('academic')} 
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'academic' ? 'bg-orange-50 text-[#F97316]' : 'hover:bg-[#F7F7F7] text-[#525252]'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            Academic Setup
          </button>

          <button 
            onClick={() => setActiveTab('students')} 
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'students' ? 'bg-orange-50 text-[#F97316]' : 'hover:bg-[#F7F7F7] text-[#525252]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Student Profiles
          </button>

          <button 
            onClick={() => setActiveTab('faculty')} 
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'faculty' ? 'bg-orange-50 text-[#F97316]' : 'hover:bg-[#F7F7F7] text-[#525252]'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Faculty Profiles
          </button>

          <button 
            onClick={() => setActiveTab('timetable')} 
            className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'timetable' ? 'bg-orange-50 text-[#F97316]' : 'hover:bg-[#F7F7F7] text-[#525252]'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            Timetable Scheduler
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

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-[#E5E5E5] px-8 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-72">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#737373]" />
              <input 
                type="text" 
                placeholder="Global platform search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-[#E5E5E5] rounded-xl text-xs focus:ring-[#F97316] focus:border-[#F97316] outline-hidden bg-[#F7F7F7]"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="font-bold text-xs block">EduConflux Admin</span>
              <span className="text-[10px] text-[#737373]">Operations Desk</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center font-bold text-[#F97316] text-xs">
              AD
            </div>
          </div>
        </header>

        <div className="flex-1 p-8">
          {/* Active Tab Screens */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Vibrant Academic Banner */}
              <div className="bg-gradient-to-r from-[#F97316] to-[#EA580C] p-6 rounded-2xl text-white shadow-md relative overflow-hidden flex items-center justify-between">
                <div className="space-y-1 relative z-10">
                  <span className="text-[10px] uppercase font-extrabold tracking-widest bg-white/20 px-2 py-0.5 rounded-md">Operations Hub</span>
                  <h3 className="text-xl font-black">EduConflux Academic Command Console</h3>
                  <p className="text-xs text-orange-100 font-medium">Provision nodes, register departments, manage courses and monitor real-time school activity.</p>
                </div>
                <div className="absolute right-[-5%] bottom-[-20%] text-white/10 text-9xl font-black select-none pointer-events-none">
                  EC
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[#737373]">Telemetry Summary</h2>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-6">
                {[
                  { label: 'Total Institutions', value: institutions.length, desc: 'Registered platforms', gradient: 'from-orange-500 to-amber-500' },
                  { label: 'Active Users', value: users.filter(u => u.status === 'ACTIVE').length, desc: 'Online/onboarded users', gradient: 'from-blue-500 to-indigo-500' },
                  { label: 'Course Directory', value: courses.length, desc: 'Courses configured', gradient: 'from-emerald-500 to-teal-500' },
                  { label: 'Pending Invitations', value: '18', desc: 'Awaiting token activation', gradient: 'from-purple-500 to-pink-500' }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white border border-[#E5E5E5]/60 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
                    <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${stat.gradient}`} />
                    <span className="text-[10px] font-extrabold text-[#737373] block uppercase tracking-wider">{stat.label}</span>
                    <span className="text-3xl font-black text-[#171717] block mt-2 group-hover:scale-105 transition-transform duration-200">{stat.value}</span>
                    <span className="text-[11px] text-[#737373] block mt-1">{stat.desc}</span>
                  </div>
                ))}
              </div>

              {/* Recent Action Desk */}
              <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#737373] mb-4">Telemetry Stream</h3>
                <div className="space-y-4">
                  {[
                    { log: 'Institution APEX Tech registered successfully', time: '5 mins ago', badge: 'Institution', color: 'bg-orange-50 text-orange-700 border-orange-200' },
                    { log: 'Student doe.john@educonflux.com activated profile', time: '12 mins ago', badge: 'Auth', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                    { log: 'New course offering CS202 added for Fall 2026', time: '40 mins ago', badge: 'Academic', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
                  ].map((activity, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs pb-3 border-b border-[#F7F7F7] last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${activity.color}`}>{activity.badge}</span>
                        <span className="font-semibold text-[#525252]">{activity.log}</span>
                      </div>
                      <span className="text-[10px] text-[#737373] font-medium">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'institutions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Institution Registry</h2>
                  <p className="text-xs text-[#737373]">Provision and manage active educational nodes</p>
                </div>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 bg-[#F97316] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#EA580C] transition-all"
                >
                  <Plus className="w-4 h-4" /> Provision Node
                </button>
              </div>

              <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F7F7F7] border-b border-[#E5E5E5] text-[10px] uppercase font-bold text-[#737373]">
                      <th className="p-4">Name</th>
                      <th className="p-4">Short Code</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E5] text-xs">
                    {institutions.map(inst => (
                      <tr key={inst.id} className="hover:bg-[#F7F7F7]/50">
                        <td className="p-4 font-bold">{inst.name}</td>
                        <td className="p-4">{inst.code}</td>
                        <td className="p-4">{inst.location}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                            inst.status === 'ACTIVE' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                          }`}>{inst.status}</span>
                        </td>
                        <td className="p-4 text-right">
                          <button className="text-[#525252] hover:text-[#171717] font-semibold">Configure</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Provision Modal */}
              {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                  <div className="bg-white rounded-2xl p-6 w-md border border-[#E5E5E5] shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
                    <h3 className="font-bold text-sm">Provision New Institutional Node</h3>
                    <form onSubmit={handleAddInstitution} className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">Institution Name</label>
                        <input name="name" type="text" required className="w-full border border-[#E5E5E5] rounded-lg p-2 text-xs" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">Short Code</label>
                          <input name="code" type="text" required className="w-full border border-[#E5E5E5] rounded-lg p-2 text-xs" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">Location</label>
                          <input name="location" type="text" required className="w-full border border-[#E5E5E5] rounded-lg p-2 text-xs" />
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end pt-2">
                        <button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-1.5 border border-[#E5E5E5] text-xs font-semibold rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-1.5 bg-[#F97316] text-white text-xs font-semibold rounded-lg">Provision</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Platform Users</h2>
                  <p className="text-xs text-[#737373]">Directory operations and security control</p>
                </div>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 bg-[#F97316] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#EA580C] transition-all"
                >
                  <Plus className="w-4 h-4" /> Create Profile Invite
                </button>
              </div>

              <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F7F7F7] border-b border-[#E5E5E5] text-[10px] uppercase font-bold text-[#737373]">
                      <th className="p-4">User</th>
                      <th className="p-4">System Role</th>
                      <th className="p-4">Last Active</th>
                      <th className="p-4">Profile Status</th>
                      <th className="p-4 text-right">Access Options</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E5] text-xs">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-[#F7F7F7]/50">
                        <td className="p-4 font-bold flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-[#737373]" /> {u.email}
                        </td>
                        <td className="p-4">
                          <span className="flex items-center gap-1">
                            <Shield className="w-3.5 h-3.5 text-orange-500" /> {u.role}
                          </span>
                        </td>
                        <td className="p-4 text-[#737373]">{u.lastLogin}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                            u.status === 'ACTIVE' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                          }`}>{u.status}</span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button 
                            onClick={() => handleToggleUserStatus(u.id)}
                            className={`font-semibold ${u.status === 'ACTIVE' ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                          >
                            {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Invite Modal */}
              {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                  <div className="bg-white rounded-2xl p-6 w-md border border-[#E5E5E5] shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
                    <h3 className="font-bold text-sm">Create Profile Invite</h3>
                    <form onSubmit={handleAddUser} className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">User Email Address</label>
                        <input name="email" type="email" required className="w-full border border-[#E5E5E5] rounded-lg p-2 text-xs" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">System Workspace Role</label>
                        <select name="role" className="w-full border border-[#E5E5E5] rounded-lg p-2 text-xs bg-white">
                          <option value="STUDENT">Student</option>
                          <option value="TEACHER">Teacher/Faculty</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </div>
                      <div className="flex gap-2 justify-end pt-2">
                        <button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-1.5 border border-[#E5E5E5] text-xs font-semibold rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-1.5 bg-[#F97316] text-white text-xs font-semibold rounded-lg">Send Invite</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'academic' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Academic Workspace Configuration</h2>
                  <p className="text-xs text-[#737373]">Construct institutional directories, periods, programs, and courses</p>
                </div>
              </div>

              {/* Sub tabs navigation */}
              <div className="flex border-b border-[#E5E5E5] gap-2">
                {[
                  { id: 'years', label: 'Academic Years' },
                  { id: 'departments', label: 'Departments' },
                  { id: 'programs', label: 'Programs' },
                  { id: 'semesters', label: 'Semesters' },
                  { id: 'courses', label: 'Course Catalog' },
                  { id: 'sections', label: 'Class Sections' }
                ].map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setAcademicSubTab(sub.id as any)}
                    className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 ${
                      academicSubTab === sub.id ? 'border-[#F97316] text-[#F97316]' : 'border-transparent text-[#737373] hover:text-[#171717]'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>

              {/* Catalog catalog detail */}
              {academicSubTab === 'courses' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#737373] font-semibold">{courses.length} courses cataloged</span>
                    <button 
                      onClick={() => {
                        const newCourse = { id: courses.length+1, name: 'Advanced Engineering Physics', code: 'PHY201', type: 'Core', status: 'ACTIVE' };
                        setCourses([...courses, newCourse]);
                      }}
                      className="flex items-center gap-1.5 text-xs bg-orange-50 text-[#F97316] px-3 py-1.5 rounded-lg font-bold hover:bg-orange-100"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Course Catalog
                    </button>
                  </div>

                  <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#F7F7F7] border-b border-[#E5E5E5] text-[10px] uppercase font-bold text-[#737373]">
                          <th className="p-3">Course Code</th>
                          <th className="p-3">Course Title</th>
                          <th className="p-3">Classification</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E5E5]">
                        {courses.map(c => (
                          <tr key={c.id}>
                            <td className="p-3 font-semibold">{c.code}</td>
                            <td className="p-3">{c.name}</td>
                            <td className="p-3">{c.type}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded-md bg-green-50 text-green-700 text-[10px] font-bold">{c.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {academicSubTab !== 'courses' && (
                <div className="bg-white border border-[#E5E5E5] p-8 rounded-2xl text-center space-y-2">
                  <FolderTree className="w-10 h-10 text-[#737373] mx-auto opacity-40" />
                  <h4 className="font-bold text-xs">Configure {academicSubTab.toUpperCase()} Data</h4>
                  <p className="text-[11px] text-[#737373] max-w-xs mx-auto">This academic subunit stores records dynamically linked with courses, student rosters and timetable blocks.</p>
                  <button className="text-xs bg-[#F97316] text-white px-3 py-1.5 rounded-lg font-bold">Populate Section Records</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'students' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Student Rosters</h2>
                  <p className="text-xs text-[#737373]">Roster profiles, performance charts, and section enrollments</p>
                </div>
              </div>
              <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F7F7] border-b border-[#E5E5E5] font-bold text-[#737373]">
                    <tr>
                      <th className="p-4">Student Name</th>
                      <th className="p-4">Institutional Roll No</th>
                      <th className="p-4">Academic Division</th>
                      <th className="p-4">Class Section</th>
                      <th className="p-4">Enrollment Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#E5E5E5] hover:bg-[#F7F7F7]/50">
                      <td className="p-4 font-semibold">John Doe</td>
                      <td className="p-4">STU-2026-9081</td>
                      <td className="p-4">Computer Science Engineering</td>
                      <td className="p-4">Section A</td>
                      <td className="p-4"><span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-md font-bold text-[10px]">ENROLLED</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'faculty' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Faculty Directory</h2>
                  <p className="text-xs text-[#737373]">Manage institutional instructors and course assignments</p>
                </div>
              </div>
              <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F7F7] border-b border-[#E5E5E5] font-bold text-[#737373]">
                    <tr>
                      <th className="p-4">Instructor</th>
                      <th className="p-4">Faculty ID</th>
                      <th className="p-4">Department Designation</th>
                      <th className="p-4">Assigned Courses</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#E5E5E5] hover:bg-[#F7F7F7]/50">
                      <td className="p-4 font-semibold">Dr. Sharma</td>
                      <td className="p-4">FAC-2024-889</td>
                      <td className="p-4">Computer Science</td>
                      <td className="p-4">CS101, CS202</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'timetable' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Timetable Scheduler</h2>
                  <p className="text-xs text-[#737373]">Define academic timing slots, days of week, and room mappings</p>
                </div>
              </div>
              <div className="bg-white border border-[#E5E5E5] p-6 rounded-2xl space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#737373]">Create Scheduling Slot</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">Class Section</label>
                    <select className="w-full border border-[#E5E5E5] p-2 text-xs rounded-lg bg-white"><option>Section A</option></select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">Course Assignment</label>
                    <select className="w-full border border-[#E5E5E5] p-2 text-xs rounded-lg bg-white"><option>CS101 - Intro to Algorithms</option></select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">Timing Slot</label>
                    <select className="w-full border border-[#E5E5E5] p-2 text-xs rounded-lg bg-white"><option>09:00 AM - 10:00 AM</option></select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">Room Assignment</label>
                    <input type="text" defaultValue="Room 302" className="w-full border border-[#E5E5E5] p-2 text-xs rounded-lg" />
                  </div>
                </div>
                <button className="bg-[#F97316] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#EA580C]">Schedule Slot Block</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
