import React, { useState } from 'react';
import {
  useCourseOfferings,
  useFacultyAssignments,
  useStudentEnrollments,
  useCreateCourseOfferingMutation,
  useUpdateCourseOfferingStatusMutation,
  useCreateFacultyAssignmentMutation,
  useCreateStudentEnrollmentMutation,
} from '../hooks/useCurriculum';
import { useCourses, useAcademicYears, useSemesters, useClassSections } from '../../academic/hooks/useAcademic';
import { useFaculty, useStudents } from '../../directory/hooks/useDirectory';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import { useToast } from '../../../components/common/ToastContext';
import { Plus, BookOpen, UserCheck, Users, Loader2 } from 'lucide-react';
import type { CourseOfferingStatus } from '../types';

export const CurriculumManagementView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'offerings' | 'faculty' | 'enrollments'>('offerings');
  const { success, error } = useToast();

  // Queries
  const { data: offerings = [], isLoading: isLoadingOfferings } = useCourseOfferings();
  const { data: facultyAssignments = [], isLoading: isLoadingAssignments } = useFacultyAssignments();
  const { data: enrollments = [], isLoading: isLoadingEnrollments } = useStudentEnrollments();

  // Dependency Queries
  const { data: courses = [] } = useCourses();
  const { data: years = [] } = useAcademicYears();
  const { data: semesters = [] } = useSemesters();
  const { data: sections = [] } = useClassSections();
  const { data: facultyList = [] } = useFaculty();
  const { data: studentsList = [] } = useStudents();

  // Modal States
  const [showOfferingModal, setShowOfferingModal] = useState(false);
  const [showFacultyModal, setShowFacultyModal] = useState(false);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [updatingStatusOfferingId, setUpdatingStatusOfferingId] = useState<number | null>(null);

  // Forms
  const [offeringForm, setOfferingForm] = useState({ courseId: 0, academicYearId: 0, semesterId: 0 });
  const [facultyForm, setFacultyForm] = useState({ courseOfferingId: 0, facultyId: 0, classSectionId: 0, role: 'PRIMARY_INSTRUCTOR' });
  const [enrollmentForm, setEnrollmentForm] = useState({ courseOfferingId: 0, studentId: 0, classSectionId: 0 });

  // Mutations
  const createOfferingMutation = useCreateCourseOfferingMutation();
  const updateOfferingStatusMutation = useUpdateCourseOfferingStatusMutation();
  const createFacultyMutation = useCreateFacultyAssignmentMutation();
  const createEnrollmentMutation = useCreateStudentEnrollmentMutation();

  const handleStatusChange = async (offeringId: number, newStatus: CourseOfferingStatus) => {
    try {
      setUpdatingStatusOfferingId(offeringId);
      await updateOfferingStatusMutation.mutateAsync({ id: offeringId, status: newStatus });
      success('Status Updated', `Course Offering #${offeringId} status changed to ${newStatus}.`);
    } catch (err: any) {
      error('Failed to update status', err?.message || 'Could not change course offering status.');
    } finally {
      setUpdatingStatusOfferingId(null);
    }
  };

  const getStatusBadgeStyle = (status?: CourseOfferingStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100';
      case 'PLANNED':
        return 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100';
      case 'COMPLETED':
        return 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100';
      case 'CANCELLED':
        return 'bg-red-50 text-red-800 border-red-300 hover:bg-red-100';
      default:
        return 'bg-neutral-50 text-neutral-800 border-neutral-300';
    }
  };

  const handleCreateOffering = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offeringForm.courseId || !offeringForm.academicYearId || !offeringForm.semesterId) {
      error('Validation', 'Please select Course, Academic Year, and Semester.');
      return;
    }
    try {
      await createOfferingMutation.mutateAsync(offeringForm);
      success('Course Offered', 'New course offering created with default status PLANNED.');
      setShowOfferingModal(false);
      setOfferingForm({ courseId: 0, academicYearId: 0, semesterId: 0 });
    } catch (err: any) {
      error('Failed to create offering', err?.message);
    }
  };

  const handleCreateFacultyAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyForm.courseOfferingId || !facultyForm.facultyId || !facultyForm.classSectionId) {
      error('Validation', 'Please select Course Offering, Faculty, and Class Section.');
      return;
    }
    try {
      await createFacultyMutation.mutateAsync(facultyForm);
      success('Faculty Assigned', 'Faculty member assigned to course section.');
      setShowFacultyModal(false);
      setFacultyForm({ courseOfferingId: 0, facultyId: 0, classSectionId: 0, role: 'PRIMARY_INSTRUCTOR' });
    } catch (err: any) {
      error('Failed to assign faculty', err?.message);
    }
  };

  const handleCreateEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollmentForm.courseOfferingId || !enrollmentForm.studentId || !enrollmentForm.classSectionId) {
      error('Validation', 'Please select Course Offering, Student, and Class Section.');
      return;
    }
    try {
      await createEnrollmentMutation.mutateAsync(enrollmentForm);
      success('Student Enrolled', 'Student enrolled in course section.');
      setShowEnrollmentModal(false);
      setEnrollmentForm({ courseOfferingId: 0, studentId: 0, classSectionId: 0 });
    } catch (err: any) {
      error('Failed to enroll student', err?.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher & Action Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('offerings')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'offerings'
                ? 'bg-[#F97316] text-white shadow-xs'
                : 'text-[#737373] hover:text-[#171717] hover:bg-neutral-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Course Offerings ({offerings.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('faculty')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'faculty'
                ? 'bg-[#F97316] text-white shadow-xs'
                : 'text-[#737373] hover:text-[#171717] hover:bg-neutral-100'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Faculty Assignments ({facultyAssignments.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('enrollments')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'enrollments'
                ? 'bg-[#F97316] text-white shadow-xs'
                : 'text-[#737373] hover:text-[#171717] hover:bg-neutral-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Student Enrollments ({enrollments.length})</span>
          </button>
        </div>

        <div>
          {activeTab === 'offerings' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowOfferingModal(true)}
              className="flex items-center gap-1.5 text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Offer New Course</span>
            </Button>
          )}

          {activeTab === 'faculty' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowFacultyModal(true)}
              className="flex items-center gap-1.5 text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Assign Faculty</span>
            </Button>
          )}

          {activeTab === 'enrollments' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowEnrollmentModal(true)}
              className="flex items-center gap-1.5 text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Enroll Student</span>
            </Button>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden shadow-xs">
        {activeTab === 'offerings' && (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50/75 border-b border-[#E5E5E5] text-[#737373] font-bold">
                <th className="py-3 px-4">Offering ID</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Academic Year</th>
                <th className="py-3 px-4">Semester</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {isLoadingOfferings ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#737373]">
                    <Loader2 className="w-5 h-5 animate-spin text-[#F97316] mx-auto mb-2" />
                    <span>Loading offerings...</span>
                  </td>
                </tr>
              ) : offerings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#737373]">
                    No course offerings found. Click &ldquo;Offer New Course&rdquo; to schedule one.
                  </td>
                </tr>
              ) : (
                offerings.map((o) => (
                  <tr key={o.id} className="hover:bg-neutral-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-[#737373]">#{o.id}</td>
                    <td className="py-3 px-4 font-bold text-[#171717]">{o.courseName || `Course #${o.courseId}`}</td>
                    <td className="py-3 px-4 text-[#737373]">{o.academicYearName || `#${o.academicYearId}`}</td>
                    <td className="py-3 px-4 text-[#737373]">{o.semesterName || `#${o.semesterId}`}</td>
                    <td className="py-3 px-4">
                      <div className="inline-flex items-center gap-1.5">
                        <select
                          value={o.status || 'PLANNED'}
                          disabled={updatingStatusOfferingId === o.id}
                          onChange={(e) =>
                            handleStatusChange(o.id, e.target.value as CourseOfferingStatus)
                          }
                          className={`text-[11px] font-bold py-1 px-2.5 rounded-lg border cursor-pointer transition-all focus:outline-hidden ${getStatusBadgeStyle(
                            o.status
                          )}`}
                          title="Change course offering status"
                        >
                          <option value="PLANNED">PLANNED (Draft)</option>
                          <option value="ACTIVE">ACTIVE (Open)</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                        {updatingStatusOfferingId === o.id && (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F97316]" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {activeTab === 'faculty' && (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50/75 border-b border-[#E5E5E5] text-[#737373] font-bold">
                <th className="py-3 px-4">Assignment ID</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Faculty Member</th>
                <th className="py-3 px-4">Class Section</th>
                <th className="py-3 px-4">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {isLoadingAssignments ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#737373]">
                    <Loader2 className="w-5 h-5 animate-spin text-[#F97316] mx-auto mb-2" />
                    <span>Loading assignments...</span>
                  </td>
                </tr>
              ) : facultyAssignments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#737373]">
                    No faculty assignments configured yet.
                  </td>
                </tr>
              ) : (
                facultyAssignments.map((a) => (
                  <tr key={a.id} className="hover:bg-neutral-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-[#737373]">#{a.id}</td>
                    <td className="py-3 px-4 font-bold text-[#171717]">{a.courseName || `Offering #${a.courseOfferingId}`}</td>
                    <td className="py-3 px-4 font-medium text-[#171717]">{a.facultyName || `Faculty #${a.facultyId}`}</td>
                    <td className="py-3 px-4 text-[#737373]">{a.classSectionName || `Section #${a.classSectionId}`}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {a.role || 'INSTRUCTOR'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {activeTab === 'enrollments' && (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50/75 border-b border-[#E5E5E5] text-[#737373] font-bold">
                <th className="py-3 px-4">Enrollment ID</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Class Section</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {isLoadingEnrollments ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#737373]">
                    <Loader2 className="w-5 h-5 animate-spin text-[#F97316] mx-auto mb-2" />
                    <span>Loading enrollments...</span>
                  </td>
                </tr>
              ) : enrollments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#737373]">
                    No student enrollments recorded yet.
                  </td>
                </tr>
              ) : (
                enrollments.map((e) => (
                  <tr key={e.id} className="hover:bg-neutral-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-[#737373]">#{e.id}</td>
                    <td className="py-3 px-4 font-bold text-[#171717]">{e.courseName || `Offering #${e.courseOfferingId}`}</td>
                    <td className="py-3 px-4 font-medium text-[#171717]">{e.studentName || `Student #${e.studentId}`}</td>
                    <td className="py-3 px-4 text-[#737373]">{e.classSectionName || `Section #${e.classSectionId}`}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Course Offering Modal */}
      <Modal
        isOpen={showOfferingModal}
        onClose={() => setShowOfferingModal(false)}
        title="Create Course Offering"
        description="Schedule a curriculum course for an academic year and semester."
      >
        <form onSubmit={handleCreateOffering} className="space-y-4">
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 space-y-0.5">
            <span className="font-bold block text-[11px] uppercase tracking-wider text-amber-800">
              Default Status: PLANNED (Draft)
            </span>
            <p className="text-[11px] text-amber-700 leading-relaxed">
              New course offerings start in <strong>PLANNED</strong> status. You can assign faculty and timetable sections, then change the status to <strong>ACTIVE</strong> when ready for student enrollment.
            </p>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#171717]">Course *</label>
            <select
              required
              value={offeringForm.courseId || ''}
              onChange={(e) => setOfferingForm({ ...offeringForm, courseId: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-white border border-[#E5E5E5] rounded-xl text-xs"
            >
              <option value="">Select Course...</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name || c.courseTitle} ({c.code || c.courseCode})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#171717]">Academic Year *</label>
            <select
              required
              value={offeringForm.academicYearId || ''}
              onChange={(e) => setOfferingForm({ ...offeringForm, academicYearId: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-white border border-[#E5E5E5] rounded-xl text-xs"
            >
              <option value="">Select Academic Year...</option>
              {years.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.name || y.yearName}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#171717]">Semester *</label>
            <select
              required
              value={offeringForm.semesterId || ''}
              onChange={(e) => setOfferingForm({ ...offeringForm, semesterId: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-white border border-[#E5E5E5] rounded-xl text-xs"
            >
              <option value="">Select Semester...</option>
              {semesters.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name || s.semesterName} {s.programName ? `(${s.programName})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E5E5E5]">
            <Button type="button" variant="outline" size="sm" onClick={() => setShowOfferingModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={createOfferingMutation.isPending}>
              {createOfferingMutation.isPending ? 'Creating...' : 'Create Offering (Planned)'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Faculty Assignment Modal */}
      <Modal
        isOpen={showFacultyModal}
        onClose={() => setShowFacultyModal(false)}
        title="Assign Faculty to Course"
        description="Allocate an instructor to teach a course offering for a section."
      >
        <form onSubmit={handleCreateFacultyAssignment} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#171717]">Course Offering *</label>
            <select
              required
              value={facultyForm.courseOfferingId || ''}
              onChange={(e) => setFacultyForm({ ...facultyForm, courseOfferingId: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-white border border-[#E5E5E5] rounded-xl text-xs"
            >
              <option value="">Select Offering...</option>
              {offerings.map((o) => (
                <option key={o.id} value={o.id}>
                  #{o.id} — {o.courseName || `Course #${o.courseId}`} ({o.semesterName})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#171717]">Faculty Instructor *</label>
            <select
              required
              value={facultyForm.facultyId || ''}
              onChange={(e) => setFacultyForm({ ...facultyForm, facultyId: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-white border border-[#E5E5E5] rounded-xl text-xs"
            >
              <option value="">Select Faculty...</option>
              {facultyList.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.firstName} {f.lastName} ({f.employeeId})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#171717]">Class Section *</label>
            <select
              required
              value={facultyForm.classSectionId || ''}
              onChange={(e) => setFacultyForm({ ...facultyForm, classSectionId: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-white border border-[#E5E5E5] rounded-xl text-xs"
            >
              <option value="">Select Section...</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name || s.sectionName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E5E5E5]">
            <Button type="button" variant="outline" size="sm" onClick={() => setShowFacultyModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={createFacultyMutation.isPending}>
              {createFacultyMutation.isPending ? 'Assigning...' : 'Confirm Assignment'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Student Enrollment Modal */}
      <Modal
        isOpen={showEnrollmentModal}
        onClose={() => setShowEnrollmentModal(false)}
        title="Enroll Student"
        description="Enroll a student into a course offering and class section."
      >
        <form onSubmit={handleCreateEnrollment} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#171717]">Course Offering *</label>
            <select
              required
              value={enrollmentForm.courseOfferingId || ''}
              onChange={(e) => setEnrollmentForm({ ...enrollmentForm, courseOfferingId: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-white border border-[#E5E5E5] rounded-xl text-xs"
            >
              <option value="">Select Offering...</option>
              {offerings.map((o) => (
                <option key={o.id} value={o.id}>
                  #{o.id} — {o.courseName || `Course #${o.courseId}`} ({o.semesterName})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#171717]">Student *</label>
            <select
              required
              value={enrollmentForm.studentId || ''}
              onChange={(e) => setEnrollmentForm({ ...enrollmentForm, studentId: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-white border border-[#E5E5E5] rounded-xl text-xs"
            >
              <option value="">Select Student...</option>
              {studentsList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName} ({s.enrollmentNumber})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#171717]">Class Section *</label>
            <select
              required
              value={enrollmentForm.classSectionId || ''}
              onChange={(e) => setEnrollmentForm({ ...enrollmentForm, classSectionId: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-white border border-[#E5E5E5] rounded-xl text-xs"
            >
              <option value="">Select Section...</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name || s.sectionName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E5E5E5]">
            <Button type="button" variant="outline" size="sm" onClick={() => setShowEnrollmentModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={createEnrollmentMutation.isPending}>
              {createEnrollmentMutation.isPending ? 'Enrolling...' : 'Confirm Enrollment'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
