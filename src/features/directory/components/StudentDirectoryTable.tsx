import React from 'react';
import type { Student } from '../types';
import { Users, Trash2, Mail, Phone } from 'lucide-react';

interface StudentDirectoryTableProps {
  students: Student[];
  isLoading: boolean;
  onDeleteStudent?: (id: number) => void;
}

export const StudentDirectoryTable: React.FC<StudentDirectoryTableProps> = ({
  students,
  isLoading,
  onDeleteStudent,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-[#E5E5E5] p-8 text-center animate-pulse">
        <div className="h-4 bg-[#F7F7F7] rounded w-1/3 mx-auto mb-4" />
        <div className="space-y-2">
          <div className="h-8 bg-[#F7F7F7] rounded w-full" />
          <div className="h-8 bg-[#F7F7F7] rounded w-full" />
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="bg-white border border-[#E5E5E5] rounded-2xl p-12 text-center space-y-3">
        <Users className="w-10 h-10 text-[#737373] mx-auto opacity-50" />
        <h4 className="font-bold text-sm text-[#171717]">No Students Registered</h4>
        <p className="text-xs text-[#737373] max-w-sm mx-auto">
          Click "Add Student" to register student accounts in the database.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F7F7F7] border-b border-[#E5E5E5] font-bold text-[#737373]">
            <tr>
              <th className="p-4">Enrollment No</th>
              <th className="p-4">Student Name</th>
              <th className="p-4">Contact</th>
              <th className="p-4">Program / Section</th>
              <th className="p-4">Status</th>
              {onDeleteStudent && <th className="p-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5]">
            {students.map((st) => (
              <tr key={st.id} className="hover:bg-[#F7F7F7]/50 transition-colors">
                <td className="p-4 font-mono font-bold text-[#F97316]">{st.enrollmentNumber}</td>
                <td className="p-4">
                  <span className="font-bold text-[#171717] block">
                    {st.firstName} {st.lastName}
                  </span>
                  <span className="text-[10px] text-[#737373]">{st.email}</span>
                </td>
                <td className="p-4">
                  <div className="space-y-0.5 text-[11px] text-[#525252]">
                    {st.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#737373]" /> {st.phone}
                      </span>
                    )}
                    {st.personalEmail && (
                      <span className="flex items-center gap-1 text-[10px] text-[#737373]">
                        <Mail className="w-3 h-3 text-[#737373]" /> {st.personalEmail}
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <span className="font-semibold text-[#171717] block">{st.programName || 'Degree Program'}</span>
                  <span className="text-[10px] text-[#737373]">{st.classSectionName || 'Unassigned Section'}</span>
                </td>
                <td className="p-4">
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-bold text-[10px]">
                    {st.status}
                  </span>
                </td>
                {onDeleteStudent && (
                  <td className="p-4 text-right">
                    <button
                      type="button"
                      onClick={() => onDeleteStudent(st.id)}
                      className="p-1.5 text-[#737373] hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete student"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
