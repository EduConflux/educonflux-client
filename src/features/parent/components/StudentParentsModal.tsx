import React from 'react';
import type { Student } from '../../directory/types';
import { useParentsForStudent } from '../hooks/useParent';
import { Button } from '../../../components/common/Button';
import {
  X,
  Users,
  Mail,
  Phone,
  Briefcase,
  Home,
  UserPlus,
} from 'lucide-react';

interface StudentParentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onRegisterParent?: (studentId: number) => void;
}

export const StudentParentsModal: React.FC<StudentParentsModalProps> = ({
  isOpen,
  onClose,
  student,
  onRegisterParent,
}) => {
  const studentId = student?.id ?? 0;
  const { data: parents = [], isLoading } = useParentsForStudent(studentId);

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl p-6 w-full max-w-xl border border-[#E5E5E5] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-50 text-[#F97316]">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#171717]">Linked Parents & Guardians</h3>
              <p className="text-[11px] text-[#737373]">
                Viewing guardians linked to {student.firstName} {student.lastName} ({student.enrollmentNumber || 'No Enroll #'})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#737373] hover:text-[#171717] hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Banner */}
        <div className="bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl p-3 flex items-center justify-between">
          <div>
            <span className="font-bold text-xs text-[#171717] block">
              {student.firstName} {student.lastName}
            </span>
            <span className="text-[11px] text-[#737373]">
              {student.email} • {student.programName || 'Program'}
            </span>
          </div>
          {onRegisterParent && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onClose();
                onRegisterParent(student.id);
              }}
              className="text-xs"
            >
              <UserPlus className="w-3.5 h-3.5 mr-1" />
              Add Parent
            </Button>
          )}
        </div>

        {/* Parents List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-[#737373] animate-pulse">
              Loading parent records...
            </div>
          ) : parents.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-[#E5E5E5] rounded-xl space-y-2">
              <Users className="w-8 h-8 text-[#737373] mx-auto opacity-50" />
              <h4 className="font-bold text-xs text-[#171717]">No Parents Linked</h4>
              <p className="text-xs text-[#737373] max-w-xs mx-auto">
                No parent accounts are currently connected to this student.
              </p>
              {onRegisterParent && (
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onClose();
                      onRegisterParent(student.id);
                    }}
                    className="text-xs"
                  >
                    Register Parent Now
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {parents.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-xs space-y-3 hover:border-[#F97316]/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#171717]">
                          {p.firstName} {p.lastName}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-[#F97316]">
                          {p.relationship || 'Guardian'}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#737373] block mt-0.5 font-mono">
                        {p.email}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#737373] bg-[#F7F7F7] px-2 py-0.5 rounded">
                      Parent ID #{p.id}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#525252] pt-2 border-t border-[#E5E5E5]">
                    {p.phone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#737373]" />
                        <span>{p.phone}</span>
                      </div>
                    )}
                    {p.personalEmail && (
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#737373]" />
                        <span>{p.personalEmail}</span>
                      </div>
                    )}
                    {p.occupation && (
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-[#737373]" />
                        <span>{p.occupation}</span>
                      </div>
                    )}
                    {p.address && (
                      <div className="flex items-center gap-1.5 sm:col-span-2">
                        <Home className="w-3.5 h-3.5 text-[#737373] shrink-0" />
                        <span className="truncate">{p.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-[#E5E5E5]">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
export default StudentParentsModal;
