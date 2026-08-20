import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { 
  ArrowRight, 
  BookOpen, 
  Users, 
  CheckCircle2,
  Search,
  Bell,
  Sliders,
  Calendar,
  Clock,
  TrendingUp,
  MessageSquare
} from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (route: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'academics' | 'learning' | 'communication'>('academics');

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-[#F7F7F7]/60 to-white">
      {/* Background Subtle Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5E5E5_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center justify-center">
            <Badge variant="orange" size="md">
              Unified Education Operations
            </Badge>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#171717] leading-[1.15]">
            The operating platform for <span className="text-[#F97316]">modern education</span>.
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-[#525252] leading-relaxed max-w-2xl mx-auto font-normal">
            EduConflux unifies academic operations, learning management, institutional communication, and collaboration into one seamless digital workspace.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto shadow-md hover:shadow-lg transition-shadow"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => onNavigate('/login')}
            >
              Get Started Free
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => {
                const el = document.getElementById('platform');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Platform
            </Button>
          </div>

          {/* Key Value Bullets */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-[#737373] font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#F97316]" /> Enterprise Grade Security
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#F97316]" /> Single Institution Ready
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#F97316]" /> Multi-Role Support
            </span>
          </div>
        </div>

        {/* Product Interactive Preview Card (SaaS Mockup) */}
        <div className="mt-12 lg:mt-16 max-w-5xl mx-auto rounded-2xl border border-[#E5E5E5] bg-white shadow-2xl overflow-hidden transition-all duration-300">
          {/* Top Window Toolbar */}
          <div className="bg-[#F7F7F7] px-4 py-3 border-b border-[#E5E5E5] flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400/80" />
              <div className="w-3 h-3 rounded-full bg-amber-400/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
            </div>

            {/* Top Workspace Tab Nav */}
            <div className="hidden sm:flex items-center bg-white rounded-lg p-1 border border-[#E5E5E5] text-xs font-medium">
              <button
                onClick={() => setActiveTab('academics')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeTab === 'academics' 
                    ? 'bg-[#171717] text-white shadow-xs' 
                    : 'text-[#525252] hover:text-[#171717]'
                }`}
              >
                Academic Operations
              </button>
              <button
                onClick={() => setActiveTab('learning')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeTab === 'learning' 
                    ? 'bg-[#171717] text-white shadow-xs' 
                    : 'text-[#525252] hover:text-[#171717]'
                }`}
              >
                Learning Management
              </button>
              <button
                onClick={() => setActiveTab('communication')}
                className={`px-3 py-1 rounded-md transition-all ${
                  activeTab === 'communication' 
                    ? 'bg-[#171717] text-white shadow-xs' 
                    : 'text-[#525252] hover:text-[#171717]'
                }`}
              >
                Communication Hub
              </button>
            </div>

            <div className="flex items-center gap-2 text-[#737373]">
              <Search className="w-4 h-4" />
              <Bell className="w-4 h-4" />
              <Sliders className="w-4 h-4" />
            </div>
          </div>

          {/* Interactive Workspace Body */}
          <div className="p-6 md:p-8 bg-white min-h-[360px]">
            {activeTab === 'academics' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#171717]">Academic Operations & Schedule</h3>
                    <p className="text-xs text-[#737373]">Real-time institution attendance, classes and timetable control</p>
                  </div>
                  <Badge variant="orange">Spring Semester 2026</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-[#E5E5E5] bg-[#F7F7F7]/50 space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#737373]">
                      <span>Today's Attendance</span>
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-2xl font-bold text-[#171717]">96.4%</div>
                    <p className="text-[11px] text-[#525252]">1,240 of 1,286 Students Present</p>
                  </div>

                  <div className="p-4 rounded-xl border border-[#E5E5E5] bg-[#F7F7F7]/50 space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#737373]">
                      <span>Active Classes</span>
                      <Calendar className="w-4 h-4 text-[#F97316]" />
                    </div>
                    <div className="text-2xl font-bold text-[#171717]">42 Sessions</div>
                    <p className="text-[11px] text-[#525252]">12 Laboratories in Progress</p>
                  </div>

                  <div className="p-4 rounded-xl border border-[#E5E5E5] bg-[#F7F7F7]/50 space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#737373]">
                      <span>Faculty On Duty</span>
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-[#171717]">88 Members</div>
                    <p className="text-[11px] text-[#525252]">0 Unassigned Substitutions</p>
                  </div>
                </div>

                {/* Timetable Snippet */}
                <div className="rounded-xl border border-[#E5E5E5] overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F7F7F7] border-b border-[#E5E5E5] text-[#525252] font-semibold">
                      <tr>
                        <th className="p-3">Time</th>
                        <th className="p-3">Subject / Course</th>
                        <th className="p-3">Instructor</th>
                        <th className="p-3">Room</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E5E5] text-[#171717]">
                      <tr>
                        <td className="p-3 font-mono text-[#525252] flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#F97316]" /> 09:00 - 10:30</td>
                        <td className="p-3 font-semibold">Advanced Computer Science</td>
                        <td className="p-3 text-[#525252]">Dr. Sarah Jenkins</td>
                        <td className="p-3">Lab 304</td>
                        <td className="p-3"><Badge variant="orange" size="sm">In Progress</Badge></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-[#525252] flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 10:45 - 12:15</td>
                        <td className="p-3 font-semibold">Data Structures & Algorithms</td>
                        <td className="p-3 text-[#525252]">Prof. Robert Chen</td>
                        <td className="p-3">Hall B</td>
                        <td className="p-3"><Badge variant="neutral" size="sm">Upcoming</Badge></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'learning' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#171717]">Learning & Resource Hub</h3>
                    <p className="text-xs text-[#737373]">Assignments, course content, submission trackers and grading</p>
                  </div>
                  <Badge variant="neutral">Course Workspace</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-[#E5E5E5] bg-white space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-[#F97316]" />
                        <span className="font-semibold text-sm text-[#171717]">Algorithm Design Assignment</span>
                      </div>
                      <Badge variant="orange" size="sm">Due in 2 days</Badge>
                    </div>
                    <p className="text-xs text-[#525252]">Implement sorting and graph traversal algorithms in Python.</p>
                    <div className="w-full bg-[#F7F7F7] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#F97316] h-full w-[78%]" />
                    </div>
                    <div className="flex justify-between text-[11px] text-[#737373]">
                      <span>78 Submissions</span>
                      <span>100 Enrolled</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-[#E5E5E5] bg-white space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-sm text-[#171717]">Database Normalization Quiz</span>
                      </div>
                      <Badge variant="neutral" size="sm">Graded</Badge>
                    </div>
                    <p className="text-xs text-[#525252]">Comprehensive check on 3NF, BCNF, and relational schema.</p>
                    <div className="w-full bg-[#F7F7F7] h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full w-[100%]" />
                    </div>
                    <div className="flex justify-between text-[11px] text-[#737373]">
                      <span>Avg Score: 88.5%</span>
                      <span>Complete</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'communication' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#171717]">Institutional Communication</h3>
                    <p className="text-xs text-[#737373]">Announcements, department channels, parent updates and notices</p>
                  </div>
                  <Badge variant="neutral">Live Hub</Badge>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl border border-[#E5E5E5] bg-[#F7F7F7]/30 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-orange-50 text-[#F97316] shrink-0">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#171717]">Dean's Office Announcement</span>
                        <span className="text-[10px] text-[#737373]">10 mins ago</span>
                      </div>
                      <p className="text-xs text-[#525252]">Mid-term examination schedules have been published across all student portals.</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-[#E5E5E5] bg-[#F7F7F7]/30 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#171717]">Parent-Teacher Sync Channel</span>
                        <span className="text-[10px] text-[#737373]">1 hour ago</span>
                      </div>
                      <p className="text-xs text-[#525252]">Monthly progress reports are ready for review in the parent dashboard.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
