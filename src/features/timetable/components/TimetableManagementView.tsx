import React, { useState } from 'react';
import {
  useAdminTimetable,
  useCreateTimetableEntry,
  useUpdateTimetableStatus,
  useDeleteTimetableEntry,
} from '../hooks/useTimetable';
import { useClassSections } from '../../academic/hooks/useAcademic';
import { useCourseOfferings, useFacultyAssignments } from '../../curriculum/hooks/useCurriculum';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import { Input } from '../../../components/common/Input';
import { useToast } from '../../../components/common/ToastContext';
import type { DayOfWeek, TimetableEntry, TimetableStatus } from '../types';
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  BookOpen,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Filter,
  Layers,
} from 'lucide-react';

const DAYS: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

export const TimetableManagementView: React.FC = () => {
  const { success, error } = useToast();

  // Queries
  const { data: entries = [], isLoading } = useAdminTimetable();
  const { data: sections = [] } = useClassSections();
  const { data: offerings = [] } = useCourseOfferings();
  const { data: assignments = [] } = useFacultyAssignments();

  // Mutations
  const createMutation = useCreateTimetableEntry();
  const updateStatusMutation = useUpdateTimetableStatus();
  const deleteMutation = useDeleteTimetableEntry();

  // Filters & State
  const [selectedDay, setSelectedDay] = useState<string>('ALL');
  const [selectedSection, setSelectedSection] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [form, setForm] = useState<{
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    room: string;
    classSectionId: number;
    courseOfferingId: number;
    facultyAssignmentId: number;
  }>({
    dayOfWeek: 'MONDAY',
    startTime: '09:00',
    endTime: '10:00',
    room: '',
    classSectionId: 0,
    courseOfferingId: 0,
    facultyAssignmentId: 0,
  });

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.classSectionId || !form.courseOfferingId || !form.facultyAssignmentId) {
      error('Validation Error', 'Please select Section, Course Offering, and Faculty Assignment.');
      return;
    }

    try {
      // Backend expects LocalTime format e.g. "09:00:00"
      const formatTime = (t: string) => (t.length === 5 ? `${t}:00` : t);

      await createMutation.mutateAsync({
        dayOfWeek: form.dayOfWeek,
        startTime: formatTime(form.startTime),
        endTime: formatTime(form.endTime),
        room: form.room || 'TBD',
        classSectionId: Number(form.classSectionId),
        courseOfferingId: Number(form.courseOfferingId),
        facultyAssignmentId: Number(form.facultyAssignmentId),
      });

      success('Timetable Slot Created', 'New scheduled session added successfully.');
      setShowAddModal(false);
      setForm({
        dayOfWeek: 'MONDAY',
        startTime: '09:00',
        endTime: '10:00',
        room: '',
        classSectionId: 0,
        courseOfferingId: 0,
        facultyAssignmentId: 0,
      });
    } catch (err: any) {
      error('Creation Failed', err?.message || 'Could not create timetable slot.');
    }
  };

  const handleToggleStatus = async (entry: TimetableEntry) => {
    const nextStatus: TimetableStatus = entry.status === 'ACTIVE' ? 'CANCELLED' : 'ACTIVE';
    try {
      await updateStatusMutation.mutateAsync({ id: entry.id, status: nextStatus });
      success('Status Updated', `Slot status set to ${nextStatus}.`);
    } catch (err: any) {
      error('Update Failed', err?.message || 'Failed to update timetable status.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this scheduled slot?')) return;
    try {
      await deleteMutation.mutateAsync(id);
      success('Slot Deleted', 'Timetable slot removed successfully.');
    } catch (err: any) {
      error('Delete Failed', err?.message || 'Failed to delete timetable slot.');
    }
  };

  const filteredEntries = entries.filter((e) => {
    if (selectedDay !== 'ALL' && e.dayOfWeek !== selectedDay) return false;
    if (selectedSection !== 'ALL' && e.classSectionId !== Number(selectedSection)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F97316] mb-1">
            <CalendarDays className="w-4 h-4" />
            <span>Academic Scheduling Matrix</span>
          </div>
          <h2 className="text-xl font-black text-[#171717]">Institutional Timetable Manager</h2>
          <p className="text-xs text-[#737373] mt-0.5">
            Coordinate lecture schedules, room bookings, and instructor teaching commitments across class sections.
          </p>
        </div>

        <Button
          onClick={() => setShowAddModal(true)}
          className="gap-2 shrink-0 bg-[#F97316] hover:bg-[#EA580C] text-white"
        >
          <Plus className="w-4 h-4" />
          <span>Add Timetable Slot</span>
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 bg-white border border-[#E5E5E5] rounded-xl p-4 shadow-xs text-xs">
        <div className="flex items-center gap-1.5 text-[#737373] font-bold">
          <Filter className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>

        {/* Day Filter */}
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          aria-label="Filter by day of week"
          className="px-3 py-1.5 border border-[#E5E5E5] rounded-lg bg-neutral-50 font-medium text-[#171717] outline-hidden focus:border-[#F97316]"
        >
          <option value="ALL">All Days of Week</option>
          {DAYS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        {/* Section Filter */}
        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          aria-label="Filter by class section"
          className="px-3 py-1.5 border border-[#E5E5E5] rounded-lg bg-neutral-50 font-medium text-[#171717] outline-hidden focus:border-[#F97316]"
        >
          <option value="ALL">All Class Sections</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <span className="ml-auto text-[11px] font-semibold text-[#737373]">
          Showing {filteredEntries.length} of {entries.length} scheduled sessions
        </span>
      </div>

      {/* Slots Table / Grid */}
      {isLoading ? (
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-12 text-center text-xs text-[#737373]">
          Loading institutional timetable slots...
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-12 text-center space-y-3">
          <CalendarDays className="w-10 h-10 text-[#737373] mx-auto opacity-40" />
          <h4 className="font-bold text-sm text-[#171717]">No Timetable Slots Found</h4>
          <p className="text-xs text-[#737373] max-w-sm mx-auto">
            No schedule matches the selected filters. Click "Add Timetable Slot" to assign lectures.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F7F7] border-b border-[#E5E5E5] font-bold text-[#737373]">
                <tr>
                  <th className="p-4">Day & Time</th>
                  <th className="p-4">Course & Subject</th>
                  <th className="p-4">Class Section</th>
                  <th className="p-4">Faculty Instructor</th>
                  <th className="p-4">Location / Room</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]">
                {filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-[#F7F7F7]/60 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-[#171717]">{entry.dayOfWeek}</div>
                      <div className="flex items-center gap-1 text-[11px] text-[#737373] mt-0.5">
                        <Clock className="w-3 h-3 text-[#F97316]" />
                        <span>
                          {entry.startTime?.slice(0, 5)} - {entry.endTime?.slice(0, 5)}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 font-bold text-[#171717]">
                        <BookOpen className="w-3.5 h-3.5 text-[#F97316]" />
                        <span>{entry.courseName || entry.courseCode || `Course #${entry.courseId}`}</span>
                      </div>
                      {entry.courseCode && (
                        <div className="text-[10px] font-mono text-[#737373] mt-0.5">{entry.courseCode}</div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 font-semibold text-[#171717]">
                        <Layers className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{entry.classSectionName || `Section #${entry.classSectionId}`}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 font-semibold text-[#171717]">
                        <User className="w-3.5 h-3.5 text-blue-500" />
                        <span>{entry.facultyName || `Faculty #${entry.facultyId}`}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 font-semibold text-[#171717]">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{entry.room || 'TBD'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          entry.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {entry.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(entry)}
                          title={entry.status === 'ACTIVE' ? 'Cancel Slot' : 'Activate Slot'}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            entry.status === 'ACTIVE'
                              ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                              : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                          }`}
                        >
                          {entry.status === 'ACTIVE' ? (
                            <XCircle className="w-3.5 h-3.5" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(entry.id)}
                          title="Delete Timetable Slot"
                          className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Timetable Slot Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create New Timetable Slot"
        description="Assign a lecture slot to a class section with course offering and faculty details."
      >
        <form onSubmit={handleCreateEntry} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">Day of Week</label>
              <select
                value={form.dayOfWeek}
                onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value as DayOfWeek })}
                className="w-full px-3 py-2 border border-[#E5E5E5] rounded-xl text-xs bg-white text-[#171717] outline-hidden focus:border-[#F97316]"
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Room / Hall / Lab"
              placeholder="e.g. Hall 101, Lab B"
              value={form.room}
              onChange={(e) => setForm({ ...form, room: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="time"
              label="Start Time"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              required
            />
            <Input
              type="time"
              label="End Time"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1">Target Class Section</label>
            <select
              value={form.classSectionId}
              onChange={(e) => setForm({ ...form, classSectionId: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-[#E5E5E5] rounded-xl text-xs bg-white text-[#171717] outline-hidden focus:border-[#F97316]"
              required
            >
              <option value={0}>-- Select Section --</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (Semester #{s.semesterId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1">Course Offering</label>
            <select
              value={form.courseOfferingId}
              onChange={(e) => setForm({ ...form, courseOfferingId: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-[#E5E5E5] rounded-xl text-xs bg-white text-[#171717] outline-hidden focus:border-[#F97316]"
              required
            >
              <option value={0}>-- Select Course Offering --</option>
              {offerings.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.courseName || `Course #${o.courseId}`} ({o.courseCode || 'CORE'} | Offering #{o.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1">Faculty Assignment</label>
            <select
              value={form.facultyAssignmentId}
              onChange={(e) => setForm({ ...form, facultyAssignmentId: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-[#E5E5E5] rounded-xl text-xs bg-white text-[#171717] outline-hidden focus:border-[#F97316]"
              required
            >
              <option value={0}>-- Select Assigned Faculty --</option>
              {assignments.map((fa) => (
                <option key={fa.id} value={fa.id}>
                  {fa.facultyName || `Faculty #${fa.facultyId}`} - {fa.role || 'INSTRUCTOR'} (Assignment #{fa.id})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#E5E5E5]">
            <Button type="button" variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={createMutation.isPending}
              className="bg-[#F97316] hover:bg-[#EA580C] text-white"
            >
              {createMutation.isPending ? 'Scheduling...' : 'Save Timetable Slot'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
