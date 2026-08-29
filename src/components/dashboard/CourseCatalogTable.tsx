import React from 'react';
import { Inbox } from 'lucide-react';
import type { Course } from '../../store/api/academicApi';

export interface CourseCatalogTableProps {
  courses: Course[];
  isLoading?: boolean;
  onViewAll?: () => void;
  maxRows?: number;
}

export const CourseCatalogTable: React.FC<CourseCatalogTableProps> = ({
  courses,
  isLoading = false,
  onViewAll,
  maxRows = 5,
}) => {
  const displayedCourses = courses.slice(0, maxRows);

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-xs space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-[#F7F7F7]">
        <h3 className="font-extrabold text-sm text-[#171717]">Backend Registered Courses</h3>
        {onViewAll && (
          <button onClick={onViewAll} className="text-xs font-extrabold text-[#F97316] hover:underline">
            View All Courses ({courses.length})
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-xs text-[#737373] animate-pulse">Loading live course backend data...</div>
      ) : courses.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-[#E5E5E5] rounded-xl space-y-2">
          <Inbox className="w-8 h-8 text-[#737373] mx-auto opacity-50" />
          <p className="text-xs font-extrabold text-[#171717]">No courses in backend catalog</p>
          <p className="text-[11px] text-[#737373]">Courses added via Admin console will display here live.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F7F7] text-[#737373] font-extrabold">
              <tr>
                <th className="p-3">Course Code</th>
                <th className="p-3">Title</th>
                <th className="p-3">Type</th>
                <th className="p-3">Credits</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F7F7F7] text-[#525252] font-semibold">
              {displayedCourses.map((row) => (
                <tr key={row.id} className="hover:bg-[#F7F7F7]">
                  <td className="p-3 font-extrabold text-[#171717]">
                    <span className="bg-orange-50 text-[#F97316] px-2 py-0.5 rounded-md text-[10px]">
                      {row.courseCode}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-[#171717]">{row.courseTitle}</td>
                  <td className="p-3 text-[#737373]">{row.courseType}</td>
                  <td className="p-3">{row.credits} Credits</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-md bg-orange-100 text-[#F97316] text-[10px] font-extrabold">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
