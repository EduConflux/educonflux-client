import React from 'react';
import type { Course } from '../types';
import { BookOpen } from 'lucide-react';

interface CourseCatalogTableProps {
  courses?: Course[];
  isLoading?: boolean;
  limit?: number;
}

export const CourseCatalogTable: React.FC<CourseCatalogTableProps> = ({
  courses = [],
  isLoading = false,
  limit
}) => {
  const displayCourses = limit ? courses.slice(0, limit) : courses;

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 shadow-xs animate-pulse">
        <div className="h-4 bg-[#F7F7F7] rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-10 bg-[#F7F7F7] rounded w-full"></div>
          <div className="h-10 bg-[#F7F7F7] rounded w-full"></div>
          <div className="h-10 bg-[#F7F7F7] rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (displayCourses.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8 text-center shadow-xs">
        <BookOpen className="w-8 h-8 text-[#737373] mx-auto mb-2 opacity-50" />
        <h4 className="text-xs font-bold text-[#171717]">No Courses Registered</h4>
        <p className="text-[11px] text-[#737373] mt-1">Institutional catalog courses will display here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#E5E5E5] bg-[#F7F7F7]/60 text-[#737373] font-semibold uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4">Code</th>
              <th className="py-3 px-4">Course Title</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Credits</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5] text-[#525252]">
            {displayCourses.map((c) => (
              <tr key={c.id} className="hover:bg-[#F7F7F7]/50 transition-colors">
                <td className="py-3 px-4 font-bold text-[#171717]">{c.courseCode}</td>
                <td className="py-3 px-4 font-medium text-[#171717]">{c.courseTitle}</td>
                <td className="py-3 px-4">{c.departmentName || 'Computer Science'}</td>
                <td className="py-3 px-4">
                  <span className="bg-[#F7F7F7] px-2 py-0.5 rounded text-[10px] font-bold text-[#171717]">
                    {c.credits} Credits
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-[10px] font-bold text-[#F97316] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200/50">
                    {c.courseType}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
