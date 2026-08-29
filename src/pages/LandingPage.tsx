import React, { useEffect, useState } from 'react';
import { Logo } from '../components/common/Logo';
import { Badge } from '../components/common/Badge';
import {
  Phone,
  Mail,
  Users,
  MessageSquare,
  FileText,
  Calendar,
  Lock,
  Layers,
  Sparkles,
  CheckCircle2,
  Send,
  Check,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Clock
} from 'lucide-react';

// Import assets logos and video
import heroVideo from '../assets/I_want_an_abstract_video_for_l.mp4';
import teamsLogo from '../assets/Teams-Logo-1.webp';
import whatsappIcon from '../assets/WhatsApp_icon.png';
import googleClassroomLogo from '../assets/google_classroom.png';
import moodleLogo from '../assets/moodle.jpeg';
import slackLogo from '../assets/slack-new.jpg';

interface LandingPageProps {
  onNavigate: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeFeatureTab, setActiveFeatureTab] = useState<string>('Setup');
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Pure React Scroll Progress Handler
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(Math.min(1, Math.max(0, window.scrollY / totalScroll)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#171717] flex flex-col font-sans relative overflow-x-hidden selection:bg-[#F97316] selection:text-white">
      {/* Top Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#F97316] to-[#EA580C] z-50 origin-left transition-transform duration-75 ease-out"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />

      {/* HERO SECTION WITH VIDEO BACKGROUND & TRANSPARENT HEADER */}
      <div className="relative text-white overflow-hidden">
        {/* Background Video */}
        <video
          ref={videoRef}
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          onTimeUpdate={(e) => {
            if (e.currentTarget.currentTime >= 6) {
              e.currentTarget.currentTime = 0;
            }
          }}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
        />

        {/* Subtle dark tint overlay (very light) */}
        <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none" />

        {/* 1. TRANSPARENT HEADER */}
        <header className="relative z-30 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="md" variant="light" />
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm sm:text-[15px] font-bold text-white/95 drop-shadow-xs">
            <a href="#features" className="hover:text-[#F97316] transition-colors">Features</a>
            <a href="#services" className="hover:text-[#F97316] transition-colors">Services</a>
            <a href="#multitenant" className="hover:text-[#F97316] transition-colors">Architecture</a>
            <a href="#integrations" className="hover:text-[#F97316] transition-colors">Integrations</a>
          </nav>

          <div className="flex items-center">
            <button 
              onClick={() => onNavigate('/login')}
              className="text-sm font-bold bg-[#F97316] hover:bg-[#EA580C] text-white px-5 py-2.5 rounded-lg transition-all shadow-md cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </header>

        {/* 2. HERO CONTENT (LEFT-ALIGNED & WHITE TYPOGRAPHY) */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-28">
          <div className="max-w-3xl space-y-6 text-left">
            

            <h1 className="font-['Outfit',sans-serif] text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] drop-shadow-md">
              Academic operations, <br />
              simplified in one workspace.
            </h1>

            <p className="text-sm sm:text-base text-neutral-100 leading-relaxed font-medium max-w-2xl drop-shadow-xs">
              A cohesive platform for educational institutions to coordinate course scheduling, attendance rosters, department announcements, and faculty workflows without administrative clutter.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-start gap-3 pt-2">
              <button 
                onClick={() => onNavigate('/login')}
                className="w-full sm:w-auto bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold px-6 py-3.5 rounded-lg transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Explore Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => {
                  const el = document.getElementById('features');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto bg-black/35 hover:bg-black/50 backdrop-blur-md border border-white/30 text-white text-xs font-semibold px-6 py-3.5 rounded-lg transition-all cursor-pointer shadow-xs"
              >
                View System Overview
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 4. ROUNDED WHITE CONTAINER TRANSITION (AMLY STYLE) */}
      <div className="relative z-30 bg-white rounded-t-[40px] -mt-6 pt-16 border-t border-[#E5E5E5] shadow-2xl">
        <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          {/* Main Workspace Headline */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#171717]">
              Everything you need to create a high performance workspace
            </h2>
            <p className="text-xs sm:text-sm text-[#525252] max-w-2xl mx-auto leading-relaxed">
              EduConflux helps your institution stay on track, accelerate performance, and close the gap between administration, curriculum, and results.
            </p>
          </div>

          {/* Interactive Feature Icon Tabs Row */}
          <div className="flex flex-wrap items-center justify-center gap-2 border-b border-[#E5E5E5] pb-4">
            {[
              { id: 'Setup', label: 'Academic Setup', icon: <Layers className="w-4 h-4" /> },
              { id: 'Attendance', label: 'Attendance Sheets', icon: <CheckCircle2 className="w-4 h-4" /> },
              { id: 'Schedules', label: 'Timetable Matrix', icon: <Calendar className="w-4 h-4" /> },
              { id: 'Streams', label: 'Classroom Streams', icon: <FileText className="w-4 h-4" /> },
              { id: 'Chats', label: 'Support Chats', icon: <MessageSquare className="w-4 h-4" /> },
              { id: 'Registry', label: 'Campus Registry', icon: <Users className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFeatureTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${activeFeatureTab === tab.id
                    ? 'bg-[#F97316] text-white shadow-md'
                    : 'bg-[#F7F7F7] text-[#525252] hover:text-[#171717] hover:bg-[#E5E5E5]'
                  }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Active Tab Content Display (Left Details, Right Mockup) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-[#FDFDFD] border border-[#E5E5E5] rounded-3xl p-8 shadow-xs">
            {/* Left Column: Descriptions & Bullet List */}
            <div className="lg:col-span-6 space-y-6">
              {activeFeatureTab === 'Setup' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <h3 className="text-2xl font-black text-[#171717]">Academic Setup Console</h3>
                  <p className="text-xs text-[#525252] leading-relaxed">Simplify course cataloging with smart automation—create departments, manage semester periods, and map degree programs seamlessly.</p>
                  <ul className="space-y-2.5 text-xs text-[#525252] font-semibold">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#F97316]" /> Single/Multi Academic Year Setup</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#F97316]" /> Department & Degree Program Mapping</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#F97316]" /> Course Catalog & Core/Elective Classification</li>
                  </ul>
                </div>
              )}

              {activeFeatureTab === 'Attendance' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <h3 className="text-2xl font-black text-[#171717]">Roster Attendance Telemetry</h3>
                  <p className="text-xs text-[#525252] leading-relaxed">Sign course rosters in single-tap grids with automated percentage calculations and real-time student analytics.</p>
                  <ul className="space-y-2.5 text-xs text-[#525252] font-semibold">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#F97316]" /> Single-click Present / Absent / Late Toggles</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#F97316]" /> Timetable-synced roster sheets</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#F97316]" /> Cumulative attendance rate telemetry</li>
                  </ul>
                </div>
              )}

              {activeFeatureTab === 'Schedules' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <h3 className="text-2xl font-black text-[#171717]">Timetable Scheduler Matrix</h3>
                  <p className="text-xs text-[#525252] leading-relaxed">Schedule timing slots, days of the week, classrooms, and courses without overlapping slot conflicts.</p>
                  <ul className="space-y-2.5 text-xs text-[#525252] font-semibold">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#F97316]" /> Interactive timing slot builder</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#F97316]" /> Conflict-free room & instructor assignments</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#F97316]" /> Automatic calendar updates for faculty and students</li>
                  </ul>
                </div>
              )}

              {activeFeatureTab === 'Streams' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <h3 className="text-2xl font-black text-[#171717]">Classroom Announcement Streams</h3>
                  <p className="text-xs text-[#525252] leading-relaxed">Publish announcements, homework updates, and lesson resources directly into dedicated class feeds.</p>
                  <ul className="space-y-2.5 text-xs text-[#525252] font-semibold">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#F97316]" /> Chronological announcement streams</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#F97316]" /> Slide & resource file distribution</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#F97316]" /> Roster-wide broadcasts</li>
                  </ul>
                </div>
              )}

              {activeFeatureTab === 'Chats' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <h3 className="text-2xl font-black text-[#171717]">Websocket Support Chats</h3>
                  <p className="text-xs text-[#525252] leading-relaxed">Launch classroom support chat channels or direct peer messaging boards safely inside the workspace console.</p>
                  <ul className="space-y-2.5 text-xs text-[#525252] font-semibold">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#F97316]" /> Inbuilt websocket group chat rooms</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#F97316]" /> Private student-instructor queries</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#F97316]" /> Secure message history logs</li>
                  </ul>
                </div>
              )}

              {activeFeatureTab === 'Registry' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <h3 className="text-2xl font-black text-[#171717]">Campus User Directory</h3>
                  <p className="text-xs text-[#525252] leading-relaxed">Maintain comprehensive profiles for students, faculty, and administrative staff with token activation controls.</p>
                  <ul className="space-y-2.5 text-xs text-[#737373] font-semibold">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#F97316]" /> Demographics linked to class sections</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#F97316]" /> Token activation & security resets</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#F97316]" /> Paginated search & role filtering</li>
                  </ul>
                </div>
              )}

              <button
                onClick={() => onNavigate('/login')}
                className="bg-[#F97316] hover:bg-[#EA580C] text-white px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-sm cursor-pointer"
              >
                Access Workspace Console
              </button>
            </div>

            {/* Right Column: Visual Component Card Mockup */}
            <div className="lg:col-span-6 bg-white border border-[#E5E5E5] p-6 rounded-2xl shadow-md min-h-[240px] flex flex-col justify-center">
              {activeFeatureTab === 'Setup' && (
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center bg-[#F7F7F7] p-3 rounded-xl border border-[#E5E5E5] font-semibold">
                    <span>CS101: Introduction to Algorithms</span>
                    <span className="text-[#F97316] font-bold text-[10px] bg-orange-50 px-2 py-0.5 rounded-md">CORE</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#F7F7F7] p-3 rounded-xl border border-[#E5E5E5] font-semibold">
                    <span>CS202: Database Management Systems</span>
                    <span className="text-[#F97316] font-bold text-[10px] bg-orange-50 px-2 py-0.5 rounded-md">CORE</span>
                  </div>
                </div>
              )}

              {activeFeatureTab === 'Attendance' && (
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-bold text-[#737373] border-b border-[#F7F7F7] pb-2">
                    <span>ROSTER NAME</span>
                    <span>ATTENDANCE STATUS</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold">John Doe (STU-001)</span>
                    <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md font-bold text-[10px]">PRESENT</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold">Jane Smith (STU-002)</span>
                    <span className="bg-red-50 text-red-700 px-2.5 py-1 rounded-md font-bold text-[10px]">ABSENT</span>
                  </div>
                </div>
              )}

              {activeFeatureTab === 'Schedules' && (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="border border-[#E5E5E5] p-3.5 rounded-xl bg-orange-50/60 space-y-1">
                    <span className="font-bold text-[#F97316]">CS101 (Sec A)</span>
                    <span className="text-[10px] text-[#737373] block">09:00 AM - Room 302</span>
                  </div>
                  <div className="border border-[#E5E5E5] p-3.5 rounded-xl bg-neutral-50 space-y-1">
                    <span className="font-bold text-[#171717]">CS202 (Sec B)</span>
                    <span className="text-[10px] text-[#737373] block">11:30 AM - Room 405</span>
                  </div>
                </div>
              )}

              {activeFeatureTab === 'Streams' && (
                <div className="border border-[#E5E5E5] rounded-xl p-4 space-y-2 bg-[#F7F7F7]/60 text-xs">
                  <div className="flex justify-between text-[9px] text-[#737373] font-bold">
                    <span>Dr. Sharma</span>
                    <span>Just now</span>
                  </div>
                  <p className="text-xs text-[#525252] leading-relaxed">The reading materials for CS101 Lecture 12 have been updated in resources. Download resource folder before next lecture.</p>
                </div>
              )}

              {activeFeatureTab === 'Chats' && (
                <div className="space-y-3 text-xs">
                  <div className="bg-[#F7F7F7] p-3 rounded-xl max-w-xs">
                    <span className="font-bold block text-[10px]">Dr. Sharma</span>
                    <span>Welcome to CS101 support group chat.</span>
                  </div>
                  <div className="bg-orange-50 border border-orange-100 p-3 rounded-xl max-w-xs float-right">
                    <span className="font-bold block text-[10px] text-[#F97316]">John Doe</span>
                    <span>Thank you professor!</span>
                  </div>
                </div>
              )}

              {activeFeatureTab === 'Registry' && (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                    <span className="font-bold text-emerald-800">sharma.dr@educonflux.com</span>
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold text-[9px]">ACTIVE</span>
                  </div>
                  <div className="flex justify-between items-center bg-red-50 border border-red-200 p-3 rounded-xl">
                    <span className="font-bold text-red-800">inactive.user@educonflux.com</span>
                    <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-md font-bold text-[9px]">INACTIVE</span>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* 5. "AT EDUCONFLUX WE DELIVER QUALITY DIGITAL CONVERGENCE" BLOCK */}
        <div id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-[#E5E5E5] mt-16 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171717] tracking-tight">
                At EduConflux we deliver <br />
                <span className="text-[#F97316]">quality digital convergence</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#525252] leading-relaxed">
                We have commitment to improve the teaching and learning in the school community by delivering rich, high quality program of international education that shares a powerful vision and develops the intellectual, personal, emotional and social skills needed to live, learn and work in a rapidly globalizing world.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('/login')}
                  className="bg-[#171717] hover:bg-black text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Connect Workspace
                </button>
              </div>
            </div>

            <div className="relative flex justify-center items-center h-72">
              <div className="w-80 h-52 bg-white border border-[#E5E5E5] rounded-2xl shadow-xl p-5 flex flex-col justify-between hover:scale-105 transition-all z-20">
                <span className="text-[10px] font-extrabold text-[#EA580C] uppercase tracking-wider">Live Lecture Tracker</span>
                <div className="space-y-1.5">
                  <span className="font-bold text-sm text-[#171717] block">Algorithms CS101</span>
                  <span className="text-[11px] text-[#737373] block">09:00 AM - Room 302 • Dr. Sharma</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-[#737373]">
                    <span>Class Completion</span>
                    <span className="text-[#F97316]">80%</span>
                  </div>
                  <div className="bg-[#E5E5E5] h-2.5 rounded-full w-full overflow-hidden">
                    <div className="bg-[#F97316] h-full w-[80%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <MessageSquare className="w-6 h-6 text-[#F97316]" />,
                title: "Chat Communication",
                desc: "Secure classroom websockets chat groups and direct private message boards to establish direct, instant student-instructor queries."
              },
              {
                icon: <FileText className="w-6 h-6 text-[#F97316]" />,
                title: "Assignment Desk",
                desc: "Distribute course assignments, establish timing slot parameters, enable digital profile uploads, and configure files."
              },
              {
                icon: <Layers className="w-6 h-6 text-[#F97316]" />,
                title: "Grade & Materials",
                desc: "Provide grade management metrics dashboards combined with direct course study material resource catalogs."
              }
            ].map((serv, i) => (
              <div key={i} className="bg-[#F7F7F7] border border-[#E5E5E5] p-6 rounded-2xl space-y-4 hover:border-[#F97316]/50 transition-colors">
                <div className="p-3 bg-white rounded-xl w-fit shadow-xs">{serv.icon}</div>
                <h4 className="font-extrabold text-sm text-[#171717]">{serv.title}</h4>
                <p className="text-xs text-[#737373] leading-relaxed">{serv.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 6. CORE SERVICES & MULTITENANT OVERVIEW */}
        <div id="multitenant" className="bg-[#F7F7F7] py-20 border-t border-b border-[#E5E5E5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="orange" size="md">Multi-Tenant Solution</Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#171717]">
                Multi-tenant architecture <br />
                <span className="text-[#F97316]">built for institutional scale.</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#525252] leading-relaxed">
                EduConflux provides secure isolation for multiple institutional tenants while unifying data models, course catalogs, student rosters, and schedules under a single multi-tenant infrastructure.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                {
                  title: "Multi-tenant Platform",
                  desc: "Separate and manage multiple institutional database nodes securely.",
                  icon: <Lock className="w-5 h-5 text-[#F97316]" />
                },
                {
                  title: "Timetable Schedules",
                  desc: "Conflict-free scheduler engine mapping times, courses, and rooms.",
                  icon: <Calendar className="w-5 h-5 text-[#F97316]" />
                },
                {
                  title: "Roster Attendance",
                  desc: "Sign student rosters and collect dynamic attendance analytics.",
                  icon: <Users className="w-5 h-5 text-[#F97316]" />
                },
                {
                  title: "Websocket Streams",
                  desc: "Instant announcements broadcasts and live classrooms discussions.",
                  icon: <MessageSquare className="w-5 h-5 text-[#F97316]" />
                }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white border border-[#E5E5E5] p-5 rounded-2xl flex gap-3.5 items-start">
                  <div className="p-2 bg-orange-50 rounded-lg shrink-0">{stat.icon}</div>
                  <div className="text-xs space-y-1">
                    <h4 className="font-extrabold text-[#171717]">{stat.title}</h4>
                    <p className="text-[11px] text-[#737373] leading-normal">{stat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. CONFLUX INTEGRATION STANDALONE SECTION */}
        <div id="integrations" className="bg-white py-20 border-b border-[#E5E5E5] rounded-b-[40px] lg:rounded-b-[48px] relative z-30 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left logos grid using asset icons */}
            <div className="grid grid-cols-3 gap-6 items-center">
              {[
                { img: googleClassroomLogo, name: 'Google Classroom' },
                { img: teamsLogo, name: 'Microsoft Teams' },
                { img: slackLogo, name: 'Slack' },
                { img: moodleLogo, name: 'Moodle' },
                { img: whatsappIcon, name: 'WhatsApp' }
              ].map((logo, idx) => (
                <div key={idx} className="border border-[#E5E5E5] rounded-2xl p-5 flex flex-col items-center justify-center text-center bg-white shadow-xs hover:border-[#F97316] transition-colors gap-2.5">
                  <img
                    src={logo.img}
                    alt={logo.name}
                    className="h-10 w-auto object-contain"
                  />
                  <span className="text-[10px] font-bold text-[#737373]">{logo.name}</span>
                </div>
              ))}
              <div className="border border-dashed border-[#F97316]/40 rounded-2xl p-5 flex items-center justify-center text-center bg-orange-50/20 text-[#F97316] text-[10px] font-extrabold h-full">
                + More Inbuilt
              </div>
            </div>

            {/* Right description */}
            <div className="space-y-6">
              <Badge variant="orange" size="md">Active Integrations</Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#171717]">
                We give all these <br />
                <span className="text-[#F97316]">applications together.</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#525252] leading-relaxed">
                Why pay for siloed subscriptions like Google Classroom, MS Teams, Moodle, Slack, and WhatsApp? EduConflux merges all class announcements, rosters, websocket support chats, and timetable calendars into a single inbuilt service.
              </p>
            </div>
          </div>
        </div>

        {/* 6. BOTTOM CALL TO ACTION WITH VIDEO BACKGROUND (OVERLAPPED UNDER ROUNDED SECTION) */}
        <div className="relative overflow-hidden bg-neutral-950 text-white min-h-[440px] lg:min-h-[500px] -mt-12 lg:-mt-16 pt-32 pb-24 lg:pt-36 lg:pb-28 px-4 sm:px-6 lg:px-8 z-10">
          {/* Background Video */}
          <video 
            src={heroVideo}
            autoPlay 
            loop 
            muted 
            playsInline 
            onTimeUpdate={(e) => {
              if (e.currentTarget.currentTime >= 6) {
                e.currentTarget.currentTime = 0;
              }
            }}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
          />

          {/* Dark Tint Overlay */}
          <div className="absolute inset-0 bg-black/60 z-10 pointer-events-none" />

          {/* CTA Content */}
          <div className="relative z-20 max-w-4xl mx-auto text-center space-y-6">


            <h2 className="font-['Outfit',sans-serif] text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
              Transform your institution's academic operations.
            </h2>

            <p className="text-xs sm:text-sm text-neutral-200 max-w-xl mx-auto leading-relaxed font-normal drop-shadow-xs">
              Eliminate software fragmentation. Empower professors, streamline attendance, and coordinate schedules on a single reliable platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button 
                onClick={() => onNavigate('/login')}
                className="w-full sm:w-auto bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold px-6 py-3.5 rounded-lg transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Access Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto bg-black/35 hover:bg-black/50 backdrop-blur-md border border-white/30 text-white text-xs font-semibold px-6 py-3.5 rounded-lg transition-all cursor-pointer shadow-xs"
              >
                Back to Top
              </button>
            </div>
          </div>
        </div>

        {/* 7. FOOTER */}
        <footer className="bg-[#171717] text-white/90 text-xs py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <span className="font-black text-sm block">EDUCONFLUX ACADEMY</span>
              <p className="text-[11px] text-white/60 leading-relaxed">The unified platform designed for modern school/college convergence, consolidating timetables, registrations, and live stream chats.</p>
            </div>
            <div className="space-y-4">
              <span className="font-bold text-xs block text-[#F97316]">Services</span>
              <div className="flex flex-col gap-2 text-[11px] text-white/70">
                <a href="#" className="hover:text-white">Google Classroom Portal</a>
                <a href="#" className="hover:text-white">Personal Student Desk</a>
                <a href="#" className="hover:text-white">McGraw-Hill Hub</a>
                <a href="#" className="hover:text-white">Class Dojo Desk</a>
              </div>
            </div>
            <div className="space-y-4">
              <span className="font-bold text-xs block text-[#F97316]">Support Desk</span>
              <div className="flex flex-col gap-2 text-[11px] text-white/70">
                <a href="#" className="hover:text-white">Institutional FAQs</a>
                <a href="#" className="hover:text-white">Privacy Regulations</a>
                <a href="#" className="hover:text-white">Contact Administration</a>
                <a href="#" className="hover:text-white">Security Terms</a>
              </div>
            </div>
            <div className="space-y-4">
              <span className="font-bold text-xs block text-[#F97316]">Contact Details</span>
              <div className="flex flex-col gap-2.5 text-[11px] text-white/70">
                <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-[#F97316]" /> +91 9489906672</span>
                <span className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-[#F97316]" /> info@educonflux.com</span>
                <span className="leading-relaxed">VIT,Chennai, Tamil Nadu, India</span>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/10 text-center text-[10px] text-white/50">
            © {new Date().getFullYear()} EduConflux Academy. All rights reserved. Registered Institution platform.
          </div>
        </footer>

      </div>
    </div>
  );
};
