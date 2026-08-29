import React from 'react';
import { Sparkles } from 'lucide-react';

export interface WelcomeBannerProps {
  userName: string;
  semesterName: string;
  academicYearName: string;
  enrolledCoursesCount: number;
  timetableSlotsCount: number;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  userName,
  semesterName,
  academicYearName,
  enrolledCoursesCount,
  timetableSlotsCount,
}) => {
  return (
    <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-[#F97316]/15 border border-orange-200/60 p-8 rounded-3xl relative overflow-hidden flex items-center justify-between shadow-xs">
      <div className="space-y-3 max-w-xl z-10">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100/90 border border-orange-200 text-[#F97316] text-[11px] font-black uppercase tracking-wider rounded-xl">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{semesterName} • {academicYearName}</span>
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-[#171717] tracking-tight">
          Good Morning, 👋 <br />
          <span className="text-[#F97316]">{userName}!</span>
        </h2>
        <p className="text-xs font-semibold text-[#525252] leading-relaxed">
          Stay updated with your academic journey. Review your current semester courses, attendance rates, and section channels.
        </p>
      </div>

      {/* 3D vector graphics simulation (Orange Theme) */}
      <div className="hidden lg:flex items-center gap-4 relative z-10">
        <div className="w-32 h-22 bg-white border border-orange-200 rounded-2xl shadow-lg p-3.5 flex flex-col justify-between transform -rotate-3">
          <span className="text-[9px] font-extrabold text-[#F97316] uppercase">Active Term</span>
          <span className="text-xs font-black text-[#171717]">{semesterName}</span>
          <div className="w-full bg-orange-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#F97316] h-full w-4/5" />
          </div>
        </div>
        <div className="w-32 h-22 bg-[#F97316] text-white rounded-2xl shadow-xl p-3.5 flex flex-col justify-between transform rotate-3">
          <span className="text-[9px] font-extrabold text-orange-200 uppercase">{academicYearName}</span>
          <span className="text-xs font-black">{enrolledCoursesCount} Courses</span>
          <span className="text-[9px] text-orange-100 font-semibold">{timetableSlotsCount} Schedule Slots</span>
        </div>
      </div>
    </div>
  );
};
