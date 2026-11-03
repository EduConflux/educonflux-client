import React, { useState } from 'react';
import type { LinkStudentRequest, ParentResponse } from '../types';
import { useStudents } from '../../directory/hooks/useDirectory';
import { Button } from '../../../components/common/Button';
import { useToast } from '../../../components/common/ToastContext';
import { X, Link as LinkIcon } from 'lucide-react';

interface LinkStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (parentId: number, data: LinkStudentRequest) => Promise<any>;
  parent: ParentResponse | null;
}

const RELATIONSHIP_OPTIONS = [
  'Father',
  'Mother',
  'Guardian',
  'Step-Father',
  'Step-Mother',
  'Grandfather',
  'Grandmother',
  'Uncle',
  'Aunt',
  'Other',
];

export const LinkStudentModal: React.FC<LinkStudentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  parent,
}) => {
  const { data: students = [] } = useStudents();
  const { error: toastError, success: toastSuccess } = useToast();

  const [studentId, setStudentId] = useState<number>(0);
  const [relationship, setRelationship] = useState<string>('Father');
  const [searchStudent, setSearchStudent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !parent) return null;

  const filteredStudents = students.filter((s) => {
    if (!searchStudent.trim()) return true;
    const query = searchStudent.toLowerCase();
    const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
    const enroll = (s.enrollmentNumber || '').toLowerCase();
    const email = (s.email || '').toLowerCase();
    return fullName.includes(query) || enroll.includes(query) || email.includes(query);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentId) {
      toastError('Validation Error', 'Please select a student to link.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(parent.id, {
        studentId,
        relationship,
      });
      toastSuccess('Student Linked', `Linked successfully to parent ${parent.firstName} ${parent.lastName}.`);
      onClose();
    } catch (err: any) {
      toastError(
        'Failed to Link Student',
        err?.response?.data?.message || err?.message || 'Could not link student to this parent.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-[#E5E5E5] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-50 text-[#F97316]">
              <LinkIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#171717]">Link Student to Parent</h3>
              <p className="text-[11px] text-[#737373]">
                Connect an additional student to an existing parent profile.
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

        {/* Selected Parent Summary */}
        <div className="bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E5E5] flex items-center justify-center text-[#737373] font-bold text-xs">
            {parent.firstName?.charAt(0)}{parent.lastName?.charAt(0)}
          </div>
          <div className="space-y-0.5">
            <span className="font-bold text-xs text-[#171717] block">
              {parent.firstName} {parent.lastName}
            </span>
            <span className="text-[11px] text-[#737373] block">
              {parent.email} • Parent ID #{parent.id}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student Selector */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase text-[#737373]">
              Choose Student *
            </label>
            <input
              type="text"
              placeholder="Search by student name or enrollment no..."
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
              className="w-full border border-[#E5E5E5] rounded-lg p-2 text-xs bg-white text-[#171717] mb-1.5 focus:border-[#F97316] outline-hidden"
            />
            <select
              required
              value={studentId || ''}
              onChange={(e) => setStudentId(Number(e.target.value))}
              className="w-full border border-[#E5E5E5] rounded-lg p-2.5 text-xs bg-white text-[#171717] focus:border-[#F97316] outline-hidden"
            >
              <option value="">-- Choose Student ({filteredStudents.length} available) --</option>
              {filteredStudents.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.firstName} {st.lastName} ({st.enrollmentNumber || 'No Enroll #'}) — {st.email}
                </option>
              ))}
            </select>
          </div>

          {/* Relationship Selection */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">
              Relationship to this Student *
            </label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full border border-[#E5E5E5] rounded-lg p-2 text-xs bg-white text-[#171717] focus:border-[#F97316] outline-hidden"
            >
              {RELATIONSHIP_OPTIONS.map((rel) => (
                <option key={rel} value={rel}>
                  {rel}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E5E5]">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
              {isSubmitting ? 'Linking...' : 'Confirm Link'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default LinkStudentModal;
