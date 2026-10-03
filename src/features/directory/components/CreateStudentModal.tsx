import React, { useState } from 'react';
import type { StudentRequest } from '../types';
import { useAcademicYears, usePrograms, useClassSections } from '../../academic/hooks/useAcademic';

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
  const { data: years = [] } = useAcademicYears();
  const { data: programs = [] } = usePrograms();
  const { data: sections = [] } = useClassSections();

  const [formData, setFormData] = useState<StudentRequest>({
    academicYearId: 0,
    programId: 0,
    classSectionId: 0,
    enrollmentNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    personalEmail: '',
    phone: '',
    status: 'ACTIVE',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.academicYearId || !formData.programId || !formData.classSectionId) {
      alert('Please select an Academic Year, Program, and Class Section.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        personalEmail: formData.personalEmail || formData.email,
      });
      onClose();
    } catch {
      // error handled by mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-[#E5E5E5] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <h3 className="font-bold text-sm text-[#171717]">Add Student Record</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">Academic Year *</label>
              <select
                required
                value={formData.academicYearId || ''}
                onChange={(e) => setFormData({ ...formData, academicYearId: Number(e.target.value) })}
                className="w-full border border-[#E5E5E5] rounded-lg p-2 text-xs bg-white text-[#171717]"
              >
                <option value="">Select Year...</option>
                {years.map((y) => (
                  <option key={y.id} value={y.id}>
                    {y.name || y.yearName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">Program *</label>
              <select
                required
                value={formData.programId || ''}
                onChange={(e) => setFormData({ ...formData, programId: Number(e.target.value) })}
                className="w-full border border-[#E5E5E5] rounded-lg p-2 text-xs bg-white text-[#171717]"
              >
                <option value="">Select Program...</option>
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name || p.programName} ({p.code || p.programCode})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">Class Section *</label>
            <select
              required
              value={formData.classSectionId || ''}
              onChange={(e) => setFormData({ ...formData, classSectionId: Number(e.target.value) })}
              className="w-full border border-[#E5E5E5] rounded-lg p-2 text-xs bg-white text-[#171717]"
            >
              <option value="">Select Section...</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name || s.sectionName} {s.semesterName ? `(${s.semesterName})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">First Name *</label>
              <input
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full border border-[#E5E5E5] rounded-lg p-2 text-xs"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">Last Name *</label>
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
            <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">Enrollment Number *</label>
            <input
              required
              value={formData.enrollmentNumber}
              onChange={(e) => setFormData({ ...formData, enrollmentNumber: e.target.value })}
              className="w-full border border-[#E5E5E5] rounded-lg p-2 text-xs"
              placeholder="e.g. 2026-CS-001"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">Institutional Email *</label>
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
            <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">Personal Email *</label>
            <input
              required
              type="email"
              value={formData.personalEmail}
              onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
              className="w-full border border-[#E5E5E5] rounded-lg p-2 text-xs"
              placeholder="john.personal@gmail.com"
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
