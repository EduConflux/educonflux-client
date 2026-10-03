import React, { useState } from 'react';
import { useAuth } from '../features/auth/context/AuthContext';
import { AppShell } from '../components/layout/AppShell';
import { MetricCard } from '../features/dashboard/components/MetricCard';
import { useFacultyDashboard } from '../features/dashboard/hooks/useDashboard';
import { useFacultyAttendance, useMarkAttendance } from '../features/attendance/hooks/useAttendance';
import { useFacultyTodayTimetable, useFacultyWeeklyTimetable } from '../features/timetable/hooks/useTimetable';
import {
  useFacultyClassrooms,
  useCreateClassroom,
  useCreateInvitation,
  useArchiveClassroom,
} from '../features/classrooms/hooks/useClassrooms';
import { ClassroomHub } from '../features/classrooms/components/ClassroomHub';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { EmptyState } from '../components/common/EmptyState';
import { useToast } from '../components/common/ToastContext';
import {
  LayoutDashboard,
  School,
  CheckSquare,
  Calendar,
  Plus,
  Users,
  FileText,
  Layers,
  Archive,
  UserPlus,
  Clock,
  MapPin,
  CalendarDays,
} from 'lucide-react';
import type { AttendanceStatus } from '../features/attendance/types';

interface TeacherDashboardProps {
  onNavigate?: (route: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'classrooms' | 'attendance' | 'timetable'>('dashboard');
  const [activeClassroomId, setActiveClassroomId] = useState<number>(0);

  // Modals
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteClassroomId, setInviteClassroomId] = useState<number>(0);
  const [inviteStudentIdInput, setInviteStudentIdInput] = useState('');

  // Dashboard Metrics
  const { data: facultyDashboard } = useFacultyDashboard();

  // Classrooms
  const { data: liveClassrooms = [] } = useFacultyClassrooms();
  const createClassroomMutation = useCreateClassroom();
  const archiveClassroomMutation = useArchiveClassroom();
  const createInvitationMutation = useCreateInvitation(inviteClassroomId);

  // Timetable
  const { data: todayTimetable = [] } = useFacultyTodayTimetable();
  const { data: weeklyTimetable = [] } = useFacultyWeeklyTimetable();

  // Attendance
  const activeTimetableEntryId = todayTimetable[0]?.id || 1;
  const [attendanceDate, setAttendanceDate] = useState(() => new Date().toISOString().split('T')[0]);
  const { data: liveAttendance = [] } = useFacultyAttendance(
    activeTimetableEntryId,
    attendanceDate
  );
  const markAttendanceMutation = useMarkAttendance();

  // Create Classroom Form State
  const [createClassForm, setCreateClassForm] = useState({
    name: '',
    description: '',
    courseOfferingId: 1,
    classSectionId: 1,
  });

  const handleCreateClassroom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createClassForm.name.trim()) return;

    try {
      await createClassroomMutation.mutateAsync(createClassForm);
      success('Classroom Created', `Classroom "${createClassForm.name}" created successfully.`);
      setShowCreateClassModal(false);
      setCreateClassForm({ name: '', description: '', courseOfferingId: 1, classSectionId: 1 });
    } catch (err: any) {
      error('Failed to create classroom', err?.message);
    }
  };

  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    const ids = inviteStudentIdInput
      .split(',')
      .map((s) => Number(s.trim()))
      .filter((n) => !isNaN(n) && n > 0);

    if (ids.length === 0) {
      error('Invalid Input', 'Enter at least one numeric Student ID.');
      return;
    }

    try {
      const res = await createInvitationMutation.mutateAsync(ids);
      success('Invitation Generated', `Invite Token: ${res.token}`);
      setShowInviteModal(false);
      setInviteStudentIdInput('');
    } catch (err: any) {
      error('Invitation Failed', err?.message);
    }
  };

  const handleMarkAttendance = async (studentId: number, status: AttendanceStatus) => {
    try {
      await markAttendanceMutation.mutateAsync({
        studentId,
        timetableEntryId: activeTimetableEntryId,
        attendanceDate,
        status,
      });
      success('Attendance Recorded', `Student attendance updated to ${status}.`);
    } catch (err: any) {
      error('Attendance failed', err?.message);
    }
  };

  const handleArchiveClassroom = async (classroomId: number) => {
    if (!confirm('Are you sure you want to archive this classroom?')) return;
    try {
      await archiveClassroomMutation.mutateAsync(classroomId);
      success('Classroom Archived', 'The classroom is now archived.');
    } catch (err: any) {
      error('Archive failed', err?.message);
    }
  };

  const classroomsForHub = liveClassrooms.map((c) => ({
    id: c.id,
    name: c.name,
    courseTitle: c.courseName || c.courseCode || 'Assigned Course',
    sectionCode: c.classSectionName || 'Section',
    facultyName: user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Faculty',
  }));

  const selectedClassroomId = activeClassroomId || (liveClassrooms[0]?.id ?? 0);

  return (
    <AppShell activeRole="TEACHER">
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'dashboard'
                  ? 'bg-[#F97316] text-white shadow-xs'
                  : 'text-[#737373] hover:text-[#171717] hover:bg-neutral-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('classrooms')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'classrooms'
                  ? 'bg-[#F97316] text-white shadow-xs'
                  : 'text-[#737373] hover:text-[#171717] hover:bg-neutral-100'
              }`}
            >
              <School className="w-4 h-4" />
              <span>Classroom Hub ({liveClassrooms.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('attendance')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'attendance'
                  ? 'bg-[#F97316] text-white shadow-xs'
                  : 'text-[#737373] hover:text-[#171717] hover:bg-neutral-100'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Roster Attendance</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('timetable')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'timetable'
                  ? 'bg-[#F97316] text-white shadow-xs'
                  : 'text-[#737373] hover:text-[#171717] hover:bg-neutral-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Weekly Schedule</span>
            </button>
          </div>

          {activeTab === 'classrooms' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowCreateClassModal(true)}
              className="flex items-center gap-1.5 text-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create Classroom</span>
            </Button>
          )}
        </div>

        {/* 1. DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="CLASSROOMS"
                value={String(facultyDashboard?.classroomCount ?? liveClassrooms.length)}
                sub="Active cohorts"
                icon={<School className="w-5 h-5 text-[#F97316]" />}
                bg="bg-orange-50"
              />
              <MetricCard
                title="ENROLLED STUDENTS"
                value={String(facultyDashboard?.studentCount ?? 0)}
                sub="Total learners"
                icon={<Users className="w-5 h-5 text-blue-600" />}
                bg="bg-blue-50"
              />
              <MetricCard
                title="ASSIGNMENTS"
                value={String(facultyDashboard?.assignmentCount ?? 0)}
                sub="Tasks issued"
                icon={<FileText className="w-5 h-5 text-purple-600" />}
                bg="bg-purple-50"
              />
              <MetricCard
                title="LEARNING ASSETS"
                value={String(facultyDashboard?.learningMaterialCount ?? 0)}
                sub="Documents shared"
                icon={<Layers className="w-5 h-5 text-emerald-600" />}
                bg="bg-emerald-50"
              />
            </div>

            {/* Today's Timetable Section */}
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#F97316]" />
                  <h3 className="font-bold text-sm text-[#171717]">Today&apos;s Lectures & Sections</h3>
                </div>
                <span className="text-xs text-[#737373]">{todayTimetable.length} sessions scheduled</span>
              </div>

              {todayTimetable.length === 0 ? (
                <p className="text-xs text-[#737373] py-4 text-center">
                  No lectures scheduled for today. Enjoy your preparation time!
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {todayTimetable.map((slot) => (
                    <div
                      key={slot.id}
                      className="p-4 rounded-xl border border-[#E5E5E5] bg-neutral-50/50 space-y-2 hover:border-[#F97316] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#171717]">
                          {slot.courseName || `Course #${slot.courseId}`}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-[#F97316]">
                          {slot.startTime} - {slot.endTime}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-[#737373]">
                        <span>{slot.classSectionName || 'Section A'}</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {slot.room || 'Hall 101'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming Due Assignments */}
            {facultyDashboard?.upcomingAssignments && facultyDashboard.upcomingAssignments.length > 0 && (
              <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-xs space-y-3">
                <h3 className="font-bold text-sm text-[#171717]">Upcoming Deadlines & Submissions</h3>
                <div className="divide-y divide-[#E5E5E5]">
                  {facultyDashboard.upcomingAssignments.map((a) => (
                    <div key={a.assignmentId} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-[#171717]">{a.title}</p>
                        <p className="text-[11px] text-[#737373]">{a.classroomName}</p>
                      </div>
                      <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        Due: {new Date(a.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. CLASSROOM HUB */}
        {activeTab === 'classrooms' && (
          <div className="space-y-4">
            {liveClassrooms.length === 0 ? (
              <EmptyState
                icon={<School className="w-8 h-8 text-[#F97316]" />}
                title="No Classrooms Created Yet"
                description="Create your first teaching classroom to share lecture materials, assignments, and real-time discussion."
                actionLabel="Create Classroom"
                onAction={() => setShowCreateClassModal(true)}
              />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-white border border-[#E5E5E5] p-3 rounded-2xl">
                  <span className="text-xs text-[#737373] font-semibold pl-2">
                    Active Classroom Tools:
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setInviteClassroomId(selectedClassroomId);
                        setShowInviteModal(true);
                      }}
                      className="text-xs flex items-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-[#F97316]" />
                      <span>Invite Students</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleArchiveClassroom(selectedClassroomId)}
                      className="text-xs flex items-center gap-1.5 text-red-600 hover:bg-red-50"
                    >
                      <Archive className="w-3.5 h-3.5" />
                      <span>Archive Classroom</span>
                    </Button>
                  </div>
                </div>

                <ClassroomHub
                  role="faculty"
                  classrooms={classroomsForHub}
                  activeClassroomId={selectedClassroomId}
                  onSelectClassroom={(id) => setActiveClassroomId(id)}
                  currentUser={{
                    id: user?.id || 1,
                    name: user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Faculty Instructor',
                    email: user?.email,
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* 3. ROSTER ATTENDANCE */}
        {activeTab === 'attendance' && (
          <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E5]">
              <div>
                <h3 className="font-bold text-sm text-[#171717]">Mark Classroom Attendance</h3>
                <p className="text-xs text-[#737373]">
                  Record real-time attendance for students assigned to your timetable lectures.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-[#737373]">Date:</label>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="px-3 py-1.5 border border-[#E5E5E5] rounded-xl text-xs bg-white text-[#171717] outline-hidden focus:border-[#F97316]"
                />
              </div>
            </div>

            {/* Attendance Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-50/75 border-b border-[#E5E5E5] text-[#737373] font-bold">
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Enrollment Number</th>
                    <th className="py-3 px-4">Current Status</th>
                    <th className="py-3 px-4 text-right">Quick Mark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5]">
                  {liveAttendance.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-[#737373]">
                        No student attendance records recorded yet for this session date.
                      </td>
                    </tr>
                  ) : (
                    liveAttendance.map((rec) => (
                      <tr key={rec.id} className="hover:bg-neutral-50/50">
                        <td className="py-3 px-4 font-bold text-[#171717]">
                          {rec.studentName || `Student #${rec.studentId}`}
                        </td>
                        <td className="py-3 px-4 font-mono text-[#737373]">{rec.enrollmentNumber || '—'}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              rec.status === 'PRESENT'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : rec.status === 'LATE'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            {rec.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleMarkAttendance(rec.studentId, 'PRESENT')}
                              className="px-2 py-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                            >
                              Present
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMarkAttendance(rec.studentId, 'LATE')}
                              className="px-2 py-1 text-[10px] font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
                            >
                              Late
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMarkAttendance(rec.studentId, 'ABSENT')}
                              className="px-2 py-1 text-[10px] font-bold bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                            >
                              Absent
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. WEEKLY SCHEDULE */}
        {activeTab === 'timetable' && (
          <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E5E5E5]">
              <CalendarDays className="w-5 h-5 text-[#F97316]" />
              <h3 className="font-bold text-sm text-[#171717]">Faculty Weekly Lecture Timetable</h3>
            </div>

            {weeklyTimetable.length === 0 ? (
              <p className="text-xs text-[#737373] py-8 text-center">
                No weekly timetable entries assigned to your faculty profile yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {weeklyTimetable.map((slot) => (
                  <div
                    key={slot.id}
                    className="p-4 rounded-xl border border-[#E5E5E5] bg-neutral-50/50 space-y-2 hover:border-[#F97316] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#171717]">
                        {slot.courseName || `Course #${slot.courseId}`}
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-neutral-200 text-[#171717]">
                        {slot.dayOfWeek}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#737373]">
                      <span>{slot.classSectionName || 'Section'}</span>
                      <span>
                        {slot.startTime} - {slot.endTime}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#737373] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#F97316]" />
                      <span>{slot.room || 'Classroom Lab'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Classroom Modal */}
        <Modal
          isOpen={showCreateClassModal}
          onClose={() => setShowCreateClassModal(false)}
          title="Create New Classroom"
          description="Establish an interactive classroom space for posts, assignments, and discussions."
        >
          <form onSubmit={handleCreateClassroom} className="space-y-4">
            <Input
              label="Classroom Name *"
              placeholder="e.g. CS301 - Database Systems (Section A)"
              value={createClassForm.name}
              onChange={(e) => setCreateClassForm({ ...createClassForm, name: e.target.value })}
              required
            />

            <Input
              label="Description (Optional)"
              placeholder="e.g. Fall term cohort covering SQL & NoSQL architectures"
              value={createClassForm.description}
              onChange={(e) => setCreateClassForm({ ...createClassForm, description: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Course Offering ID *"
                type="number"
                min="1"
                value={createClassForm.courseOfferingId}
                onChange={(e) => setCreateClassForm({ ...createClassForm, courseOfferingId: Number(e.target.value) })}
                required
              />

              <Input
                label="Class Section ID *"
                type="number"
                min="1"
                value={createClassForm.classSectionId}
                onChange={(e) => setCreateClassForm({ ...createClassForm, classSectionId: Number(e.target.value) })}
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E5E5E5]">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowCreateClassModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" disabled={createClassroomMutation.isPending}>
                {createClassroomMutation.isPending ? 'Creating...' : 'Create Classroom'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Invite Students Modal */}
        <Modal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          title="Invite Students to Classroom"
          description="Enter student IDs (comma separated) to generate an enrollment token."
        >
          <form onSubmit={handleSendInvitation} className="space-y-4">
            <Input
              label="Student IDs (e.g. 1, 2, 5) *"
              placeholder="1, 2, 3"
              value={inviteStudentIdInput}
              onChange={(e) => setInviteStudentIdInput(e.target.value)}
              required
            />

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E5E5E5]">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowInviteModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" disabled={createInvitationMutation.isPending}>
                {createInvitationMutation.isPending ? 'Generating...' : 'Generate Invitation Token'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppShell>
  );
};

export default TeacherDashboard;
