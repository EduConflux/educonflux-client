import React, { useState } from 'react';
import { useAuth } from '../features/auth/context/AuthContext';
import { AppShell } from '../components/layout/AppShell';
import { MetricCard } from '../features/dashboard/components/MetricCard';
import { useStudentDashboard } from '../features/dashboard/hooks/useDashboard';
import { useStudentAttendance } from '../features/attendance/hooks/useAttendance';
import { useStudentWeeklyTimetable } from '../features/timetable/hooks/useTimetable';
import { useStudentClassrooms, useJoinClassroom } from '../features/classrooms/hooks/useClassrooms';
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
  CalendarDays,
  BookOpen,
  Plus,
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigate?: (route: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'classrooms' | 'attendance' | 'timetable'>('dashboard');
  const [activeClassroomId, setActiveClassroomId] = useState<number>(0);

  // Join Classroom Modal State
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [invitationToken, setInvitationToken] = useState('');

  // Queries
  const { data: studentDashboard } = useStudentDashboard();
  const { data: studentEnrolledClassrooms = [] } = useStudentClassrooms();
  const { records: studentAttendanceRecords, summary: attendanceSummary } = useStudentAttendance();
  const { data: liveTimetableEntries = [] } = useStudentWeeklyTimetable();

  // Mutations
  const joinClassroomMutation = useJoinClassroom();

  const handleJoinClassroom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitationToken.trim()) return;

    try {
      await joinClassroomMutation.mutateAsync(invitationToken.trim());
      success('Successfully joined the classroom!');
      setInvitationToken('');
      setShowJoinModal(false);
    } catch (err: any) {
      error(err?.message || 'Failed to join classroom. Please verify the invitation token.');
    }
  };

  const studentId = user?.id || 0;
  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : user?.email?.split('@')[0] || 'Student';

  const displayStudentClassrooms = studentEnrolledClassrooms.map((c) => ({
    id: c.classroomId,
    name: c.classroomName,
    courseTitle: c.courseName || c.courseCode || 'Enrolled Course',
    sectionCode: c.classSectionName || 'Section',
    facultyName: c.facultyName || 'Faculty Instructor',
  }));

  const selectedClassroomId = activeClassroomId || (displayStudentClassrooms[0]?.id ?? 0);

  const attendancePercentage = attendanceSummary?.percentage !== undefined ? attendanceSummary.percentage : 100;
  const presentCount = attendanceSummary?.presentCount !== undefined ? attendanceSummary.presentCount : 0;
  const absentCount = attendanceSummary?.absentCount !== undefined ? attendanceSummary.absentCount : 0;

  const totalClassrooms = studentDashboard?.classroomCount ?? displayStudentClassrooms.length;
  const totalAssignments = studentDashboard?.assignmentCount ?? 0;
  const totalMaterials = studentDashboard?.learningMaterialCount ?? 0;
  const upcomingAssignments = studentDashboard?.upcomingAssignments ?? [];

  return (
    <AppShell activeRole="STUDENT">
      <div className="space-y-6">
        {/* Navigation Tabs Header */}
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
              <span>Classrooms ({displayStudentClassrooms.length})</span>
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
              <span>Attendance</span>
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
              <CalendarDays className="w-4 h-4" />
              <span>Timetable</span>
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              onClick={() => setShowJoinModal(true)}
              className="flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Join Classroom</span>
            </Button>
          </div>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Student Welcome Banner */}
            <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xs">
              <div className="relative z-10 space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-orange-400 text-[11px] font-bold tracking-wide">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Student Workspace</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  Welcome back, {userName}
                </h1>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {studentDashboard?.enrollmentNumber ? `Enrollment: ${studentDashboard.enrollmentNumber} • ` : ''}
                  Stay up to date with your coursework, assignments, and real-time classroom updates.
                </p>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="ATTENDANCE RATE"
                value={`${attendancePercentage}%`}
                sub={`${presentCount} Present / ${absentCount} Absent`}
                icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                color="text-emerald-600"
                bg="bg-emerald-50"
              />
              <MetricCard
                title="ENROLLED CLASSES"
                value={String(totalClassrooms)}
                sub="Active sections"
                icon={<School className="w-5 h-5 text-[#F97316]" />}
                color="text-[#F97316]"
                bg="bg-orange-50"
              />
              <MetricCard
                title="ASSIGNMENTS"
                value={String(totalAssignments)}
                sub="Coursework tasks"
                icon={<FileText className="w-5 h-5 text-blue-600" />}
                color="text-blue-600"
                bg="bg-blue-50"
              />
              <MetricCard
                title="STUDY MATERIALS"
                value={String(totalMaterials)}
                sub="Shared documents"
                icon={<BookOpen className="w-5 h-5 text-purple-600" />}
                color="text-purple-600"
                bg="bg-purple-50"
              />
            </div>

            {/* Upcoming Assignments & Enrolled Classes Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Assignments */}
              <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#F97316]" />
                    <h3 className="font-bold text-sm text-[#171717]">Upcoming Assignments</h3>
                  </div>
                  <span className="text-[11px] font-bold text-[#737373]">
                    {upcomingAssignments.length} Pending
                  </span>
                </div>

                {upcomingAssignments.length === 0 ? (
                  <div className="py-8 text-center text-[#737373] text-xs">
                    No upcoming assignments due right now. Great job staying ahead!
                  </div>
                ) : (
                  <div className="divide-y divide-[#E5E5E5]">
                    {upcomingAssignments.map((a) => (
                      <div key={a.assignmentId} className="py-3 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-[#171717]">{a.title}</p>
                          <p className="text-[11px] text-[#737373]">{a.classroomName}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-bold text-[#F97316] block">
                            Due {new Date(a.dueDate).toLocaleDateString()}
                          </span>
                          <span className="text-[10px] text-[#737373]">{a.maxMarks} Marks</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Enrolled Classrooms Quick Roster */}
              <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <School className="w-4 h-4 text-[#F97316]" />
                    <h3 className="font-bold text-sm text-[#171717]">My Classrooms</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('classrooms')}
                    className="text-xs font-bold text-[#F97316] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View all</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {displayStudentClassrooms.length === 0 ? (
                  <div className="py-8 text-center space-y-2">
                    <p className="text-xs text-[#737373]">You have not joined any classrooms yet.</p>
                    <Button size="sm" variant="outline" onClick={() => setShowJoinModal(true)}>
                      Join with Token
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {displayStudentClassrooms.slice(0, 4).map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setActiveClassroomId(c.id);
                          setActiveTab('classrooms');
                        }}
                        className="text-left p-3.5 rounded-xl border border-[#E5E5E5] hover:border-[#F97316] hover:bg-orange-50/20 transition-all cursor-pointer group"
                      >
                        <p className="text-xs font-bold text-[#171717] group-hover:text-[#F97316] transition-colors truncate">
                          {c.name}
                        </p>
                        <p className="text-[11px] text-[#737373] truncate mt-0.5">{c.courseTitle}</p>
                        <div className="flex items-center justify-between text-[10px] text-[#737373] mt-2 font-mono">
                          <span>{c.sectionCode}</span>
                          <span>{c.facultyName}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Classrooms Hub */}
        {activeTab === 'classrooms' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {displayStudentClassrooms.length === 0 ? (
              <EmptyState
                icon={School}
                title="No Enrolled Classrooms"
                description="You are currently not enrolled in any classrooms. Enter an invitation token to join."
                action={
                  <Button size="sm" onClick={() => setShowJoinModal(true)}>
                    Join Classroom
                  </Button>
                }
              />
            ) : (
              <ClassroomHub
                role="student"
                classrooms={displayStudentClassrooms}
                activeClassroomId={selectedClassroomId}
                onSelectClassroom={(id) => setActiveClassroomId(id)}
                currentUser={{ id: studentId, name: userName, email: user?.email }}
              />
            )}
          </div>
        )}

        {/* Tab 3: Attendance */}
        {activeTab === 'attendance' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-[#171717]">Attendance Record</h2>
              <p className="text-xs text-[#737373]">Live attendance register for your enrolled courses</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-[#E5E5E5] p-5 rounded-2xl shadow-xs space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-[#737373] tracking-wider">Attendance Rate</span>
                <span className="text-3xl font-black text-emerald-600 block">{attendancePercentage}%</span>
                <span className="text-[11px] text-[#737373]">Institutional requirement: 75%</span>
              </div>
              <div className="bg-white border border-[#E5E5E5] p-5 rounded-2xl shadow-xs space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-[#737373] tracking-wider">Present Count</span>
                <span className="text-3xl font-black text-[#171717] block">{presentCount}</span>
                <span className="text-[11px] text-[#737373]">Lectures attended</span>
              </div>
              <div className="bg-white border border-[#E5E5E5] p-5 rounded-2xl shadow-xs space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-[#737373] tracking-wider">Absent Count</span>
                <span className="text-3xl font-black text-red-600 block">{absentCount}</span>
                <span className="text-[11px] text-[#737373]">Lectures missed</span>
              </div>
            </div>

            {studentAttendanceRecords.length === 0 ? (
              <EmptyState
                icon={CheckSquare}
                title="No Attendance Records Found"
                description="Attendance records will automatically appear here once marked by faculty instructors."
              />
            ) : (
              <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F7F7] border-b border-[#E5E5E5] font-bold text-[#737373]">
                    <tr>
                      <th className="p-4">Date</th>
                      <th className="p-4">Course</th>
                      <th className="p-4">Section</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E5]">
                    {studentAttendanceRecords.map((r) => (
                      <tr key={r.id}>
                        <td className="p-4 font-semibold text-[#171717]">{r.attendanceDate}</td>
                        <td className="p-4">{r.courseName || r.courseCode || 'Class Session'}</td>
                        <td className="p-4 text-[#737373]">{r.classSectionName || 'Default Section'}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                              r.status === 'PRESENT'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-red-50 text-red-700'
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Timetable */}
        {activeTab === 'timetable' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-[#171717]">Weekly Timetable</h2>
              <p className="text-xs text-[#737373]">Your enrolled lecture and lab schedule for this term</p>
            </div>

            {liveTimetableEntries.length === 0 ? (
              <EmptyState
                icon={CalendarDays}
                title="No Timetable Slots Found"
                description="Your academic schedule has not been published yet or no slots are scheduled for your section."
              />
            ) : (
              <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F7F7] border-b border-[#E5E5E5] font-bold text-[#737373]">
                    <tr>
                      <th className="p-4">Day</th>
                      <th className="p-4">Time</th>
                      <th className="p-4">Course</th>
                      <th className="p-4">Room</th>
                      <th className="p-4">Instructor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E5]">
                    {liveTimetableEntries.map((slot) => (
                      <tr key={slot.id}>
                        <td className="p-4 font-bold text-[#F97316]">{slot.dayOfWeek}</td>
                        <td className="p-4 text-[#525252] font-mono">
                          {slot.startTime} - {slot.endTime}
                        </td>
                        <td className="p-4 font-semibold text-[#171717]">
                          {slot.courseName || slot.courseCode || 'Class Session'}
                        </td>
                        <td className="p-4 text-[#525252]">{slot.room || 'TBD'}</td>
                        <td className="p-4 text-[#737373]">{slot.facultyName || 'Faculty'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Join Classroom Modal */}
      <Modal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        title="Join a Classroom"
        description="Enter the invitation token or join code provided by your instructor."
      >
        <form onSubmit={handleJoinClassroom} className="space-y-4">
          <Input
            label="Invitation Token / Code"
            placeholder="e.g. inv_ab12cd34ef56"
            value={invitationToken}
            onChange={(e) => setInvitationToken(e.target.value)}
            required
            autoFocus
          />

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowJoinModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={joinClassroomMutation.isPending || !invitationToken.trim()}
            >
              {joinClassroomMutation.isPending ? 'Joining...' : 'Join Classroom'}
            </Button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
};
