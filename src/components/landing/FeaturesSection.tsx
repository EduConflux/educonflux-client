import React from 'react';
import { 
  Building2, 
  GraduationCap, 
  MessageSquare, 
  BarChart3, 
  ShieldCheck, 
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const FeaturesSection: React.FC = () => {
  const capabilities = [
    {
      icon: <Building2 className="w-6 h-6 text-[#F97316]" />,
      category: "Academic Operations",
      title: "Class, Course & Timetable Control",
      description: "Manage institution timetables, faculty assignments, student rosters, and daily attendance with real-time updates.",
      metrics: "Live Schedule Syncing",
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-blue-600" />,
      category: "Learning Management",
      title: "Assignments & Submissions Workspace",
      description: "Distribute course materials, track homework deadlines, enable digital submissions, and streamline grading.",
      metrics: "Automated Feedback Flow",
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-emerald-600" />,
      category: "Communication Hub",
      title: "Unified Messaging & Announcements",
      description: "Eliminate scattered group chats. Connect administration, teachers, students, and parents in secure channels.",
      metrics: "Role-Based Broadcasts",
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-purple-600" />,
      category: "Analytics & Reporting",
      title: "Institutional Performance Insights",
      description: "Track academic progress, attendance trends, and operational bottlenecks with real-time institutional metrics.",
      metrics: "Live Performance Analytics",
    },
  ];

  return (
    <section id="platform" className="py-20 bg-white border-t border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <Badge variant="neutral" size="md">
            Platform Overview
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#171717]">
            Built for total institutional convergence.
          </h2>
          <p className="text-base sm:text-lg text-[#525252]">
            EduConflux replaces fragmented tools with a single operating system engineered for clarity and performance.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {capabilities.map((item, idx) => (
            <div
              key={idx}
              className="group p-8 rounded-2xl border border-[#E5E5E5] bg-white hover:border-[#F97316]/40 hover:shadow-lg transition-all duration-200 relative flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-[#F7F7F7] group-hover:bg-orange-50 transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#737373] group-hover:text-[#F97316] transition-colors">
                    {item.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#171717] group-hover:text-[#F97316] transition-colors flex items-center gap-1.5">
                  {item.title}
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>

                <p className="text-sm text-[#525252] leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[#E5E5E5] flex items-center justify-between text-xs text-[#737373]">
                <span className="flex items-center gap-1.5 font-medium text-[#171717]">
                  <Layers className="w-3.5 h-3.5 text-[#F97316]" /> {item.metrics}
                </span>
                <span className="font-mono text-[#737373]">Module 0{idx + 1}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Institutional Trust Banner */}
        <div className="mt-16 p-6 rounded-2xl border border-[#E5E5E5] bg-[#F7F7F7] flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-[#F97316] shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-[#171717]">Single Educational Institution Optimized</h4>
              <p className="text-xs text-[#525252]">Engineered specifically for complete institutional deployment without multi-tenant friction.</p>
            </div>
          </div>
          <Badge variant="outline" size="md">Phase 1 Release</Badge>
        </div>
      </div>
    </section>
  );
};
