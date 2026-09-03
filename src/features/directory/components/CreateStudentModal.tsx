import React, { useState } from 'react';
import type { StudentRequest } from '../types';

interface CreateStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StudentRequest) => Promise<void>;
}

export const CreateStudentModal: React.FC<CreateStudentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<StudentRequest>({
    enrollmentNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    status: 'ACTIVE',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch {
      // error handled by mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-[#E5E5E5] shadow-2xl space-y-4">
        <h3 className="font-bold text-sm text-[#171717]">Add Student Record</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">First Name</label>
              <input
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full border border-[#E5E5E5] rounded-lg p-2 text-xs"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">Last Name</label>
              <input
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full border border-[#E5E5E5] rounded-lg p-2 text-xs"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">Enrollment Number</label>
            <input
              required
              value={formData.enrollmentNumber}
              onChange={(e) => setFormData({ ...formData, enrollmentNumber: e.target.value })}
              className="w-full border border-[#E5E5E5] rounded-lg p-2 text-xs"
              placeholder="e.g. 2026-CS-001"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">Institutional Email</label>
            <input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border border-[#E5E5E5] rounded-lg p-2 text-xs"
              placeholder="john.doe@institution.edu"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full border border-[#E5E5E5] rounded-lg p-2 text-xs"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div className="flex gap-2 justify-end pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-[#E5E5E5] text-xs font-semibold rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 bg-[#F97316] text-white text-xs font-semibold rounded-lg hover:bg-[#EA580C] cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Register Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
