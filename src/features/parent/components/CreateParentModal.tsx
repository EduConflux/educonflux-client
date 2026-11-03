import React, { useState } from 'react';
import type { ParentRequest } from '../types';
import { useStudents } from '../../directory/hooks/useDirectory';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { useToast } from '../../../components/common/ToastContext';
import { X, UserPlus } from 'lucide-react';

interface CreateParentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ParentRequest) => Promise<any>;
  preselectedStudentId?: number;
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

export const CreateParentModal: React.FC<CreateParentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  preselectedStudentId,
}) => {
  const { data: students = [] } = useStudents();
  const { error: toastError, success: toastSuccess } = useToast();

  const [formData, setFormData] = useState<ParentRequest>({
    studentId: preselectedStudentId ?? 0,
    firstName: '',
    lastName: '',
    email: '',
    personalEmail: '',
    phone: '',
    relationship: 'Father',
    occupation: '',
    address: '',
  });

  const [searchStudent, setSearchStudent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync if preselected student changes
  React.useEffect(() => {
    if (preselectedStudentId) {
      setFormData((prev) => ({ ...prev, studentId: preselectedStudentId }));
    }
  }, [preselectedStudentId]);

  if (!isOpen) return null;

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

    if (!formData.studentId) {
      toastError('Validation Error', 'Please select a student to link to this parent.');
      return;
    }
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toastError('Validation Error', 'First and last name are required.');
      return;
    }
    if (!formData.email.trim()) {
      toastError('Validation Error', 'Institutional email is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        personalEmail: formData.personalEmail.trim() || formData.email.trim(),
      });
      toastSuccess('Parent Registered', 'Parent account created and linked successfully.');
      onClose();
    } catch (err: any) {
      toastError(
        'Failed to Register Parent',
        err?.response?.data?.message || err?.message || 'Check input details and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg border border-[#E5E5E5] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-50 text-[#F97316]">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#171717]">Register Parent / Guardian</h3>
              <p className="text-[11px] text-[#737373]">
                Create a parent user account and link to an enrolled student.
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student Selector */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase text-[#737373]">
              Select Linked Student *
            </label>
            <input
              type="text"
              placeholder="Filter students by name, email, or enrollment no..."
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
              className="w-full border border-[#E5E5E5] rounded-lg p-2 text-xs bg-white text-[#171717] mb-1.5 focus:border-[#F97316] outline-hidden"
            />
            <select
              required
              value={formData.studentId || ''}
              onChange={(e) => setFormData({ ...formData, studentId: Number(e.target.value) })}
              className="w-full border border-[#E5E5E5] rounded-lg p-2.5 text-xs bg-white text-[#171717] focus:border-[#F97316] outline-hidden"
            >
              <option value="">-- Choose Enrolled Student ({filteredStudents.length} available) --</option>
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
              Relationship to Student *
            </label>
            <select
              value={formData.relationship}
              onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
              className="w-full border border-[#E5E5E5] rounded-lg p-2 text-xs bg-white text-[#171717] focus:border-[#F97316] outline-hidden"
            >
              {RELATIONSHIP_OPTIONS.map((rel) => (
                <option key={rel} value={rel}>
                  {rel}
                </option>
              ))}
            </select>
          </div>

          {/* Parent Names */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name *"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="e.g. Robert"
            />
            <Input
              label="Last Name *"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="e.g. Miller"
            />
          </div>

          {/* Emails */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Institution Email *"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="parent@institution.edu"
            />
            <Input
              label="Personal Email"
              type="email"
              value={formData.personalEmail}
              onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
              placeholder="personal@gmail.com"
            />
          </div>

          {/* Phone & Occupation */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1-555-0199"
            />
            <Input
              label="Occupation"
              value={formData.occupation || ''}
              onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
              placeholder="e.g. Software Engineer"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">
              Residential Address
            </label>
            <textarea
              rows={2}
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Street address, City, State, Postal Code"
              className="w-full border border-[#E5E5E5] rounded-lg p-2.5 text-xs bg-white text-[#171717] focus:border-[#F97316] outline-hidden resize-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E5E5]">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register Parent & Link Student'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CreateParentModal;
