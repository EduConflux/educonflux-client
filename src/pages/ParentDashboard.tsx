import React, { useState } from 'react';
import { useAuth } from '../features/auth/context/AuthContext';
import { AppShell } from '../components/layout/AppShell';
import { MetricCard } from '../features/dashboard/components/MetricCard';
import {
  useMyStudents,
  useStudentAttendanceSummary,
  useStudentAttendanceHistory,
  useStudentAssignments,
  useStudentTodayTimetable,
  useStudentWeeklyTimetable,
} from '../features/parent/hooks/useParent';
import { Button } from '../components/common/Button';
import {
  LayoutDashboard,
  CalendarDays,
  CheckSquare,
  FileText,
  UserCheck,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Users,
} from 'lucide-react';
import type { DayOfWeek } from '../features/timetable/types';

interface ParentDashboardProps {
  onNavigate?: (route: string) => void;
}

const DAYS_OF_WEEK: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

export const ParentDashboard: React.FC<ParentDashboardProps> = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'timetable' | 'assignments' | 'profile'>('overview');
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [timetableMode, setTimetableMode] = useState<'today' | 'weekly'>('today');
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('MONDAY');

  // Load parent's linked wards
  const { data: myStudents = [], isLoading: isLoadingStudents, error: studentsError } = useMyStudents();

  // If no student is explicitly selected yet, pick the first student in the list
  const activeStudent = myStudents.find((s) => s.studentId === selectedStudentId) || myStudents[0];
  const currentStudentId = activeStudent?.studentId ?? 0;

  // Student queries (only run when a valid student is selected)
  const { data: attendanceSummary } = useStudentAttendanceSummary(currentStudentId);
  const { data: attendanceHistory = [], isLoading: isLoadingHistory } = useStudentAttendanceHistory(currentStudentId);
  const { data: todayTimetable = [], isLoading: isLoadingTodayTimetable } = useStudentTodayTimetable(currentStudentId);
  const { data: weeklyTimetable = [], isLoading: isLoadingWeeklyTimetable } = useStudentWeeklyTimetable(currentStudentId);
  const { data: assignmentsPage, isLoading: isLoadingAssignments } = useStudentAssignments(currentStudentId, 0, 30);

  const assignmentsList = assignmentsPage?.content ?? [];

  const parentName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : user?.email?.split('@')[0] || 'Parent / Guardian';

  const attendancePct = attendanceSummary?.attendancePercentage !== undefined
    ? Math.round(attendanceSummary.attendancePercentage)
    : 100;

  const getAttendanceStatusBadge = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Present
          </span>
        );
      case 'LATE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" /> Late
          </span>
        );
      case 'ABSENT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" /> Absent
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-[#737373]">
            {status}
          </span>
        );
    }
  };

  const filteredWeeklySchedule = weeklyTimetable.filter((entry) => entry.dayOfWeek === selectedDay);

  return (
    <AppShell activeRole="PARENT">
      <div className="space-y-6">
        {/* Loading State for Linked Students */}
        {isLoadingStudents && (
          <div className="bg-white border border-[#E5E5E5] rounded-2xl p-8 text-center animate-pulse">
            <div className="h-6 bg-[#F7F7F7] rounded w-1/4 mx-auto mb-4" />
            <div className="h-4 bg-[#F7F7F7] rounded w-1/2 mx-auto" />
          </div>
        )}

        {/* Error or No Students Linked State */}
        {!isLoadingStudents && (myStudents.length === 0 || studentsError) && (
          <div className="bg-white border border-[#E5E5E5] rounded-2xl p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 text-[#F97316] flex items-center justify-center mx-auto shadow-xs">
              <Users className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-black text-[#171717]">No Linked Students Found</h2>
              <p className="text-xs text-[#737373] max-w-md mx-auto leading-relaxed">
                Your parent account is verified, but no student records have been linked to your profile yet.
                Please contact the institution administrator with your email (
                <span className="font-semibold text-[#171717]">{user?.email}</span>) to link your student.
              </p>
            </div>
          </div>
        )}

        {/* Normal Content when student(s) exist */}
        {!isLoadingStudents && myStudents.length > 0 && activeStudent && (
          <>
            {/* Top Wards Selection Bar & Welcome */}
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-orange-100 text-[#F97316] uppercase tracking-wider">
                      Parent & Guardian Portal
                    </span>
                    <span className="text-xs text-[#737373]">Welcome back, {parentName}</span>
                  </div>
                  <h1 className="text-xl font-black text-[#171717] mt-1 flex items-center gap-2">
                    <span>{activeStudent.studentName || 'Student'}</span>
                    {activeStudent.enrollmentNumber && (
                      <span className="text-xs font-mono font-bold text-[#F97316] bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                        {activeStudent.enrollmentNumber}
                      </span>
                    )}
                  </h1>
                </div>

                {/* Multiple Wards Switcher */}
                {myStudents.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <span className="text-xs font-bold text-[#737373] whitespace-nowrap">Select Ward:</span>
                    <div className="flex gap-1.5">
                      {myStudents.map((ward) => {
                        const isSelected = (selectedStudentId ?? myStudents[0].studentId) === ward.studentId;
                        return (
                          <button
                            key={ward.studentId}
                            type="button"
                            onClick={() => setSelectedStudentId(ward.studentId || 0)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                              isSelected
                                ? 'bg-[#171717] text-white border-[#171717] shadow-xs'
                                : 'bg-[#F7F7F7] text-[#525252] border-[#E5E5E5] hover:bg-neutral-200'
                            }`}
                          >
                            {ward.studentName} ({ward.relationship || 'Ward'})
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Info Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#E5E5E5] text-xs">
                <div>
                  <span className="text-[10px] font-bold text-[#737373] block uppercase tracking-wider">Relationship</span>
                  <span className="font-bold text-[#171717]">{activeStudent.relationship || 'Guardian'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#737373] block uppercase tracking-wider">Attendance Standing</span>
                  <span
                    className={`font-bold ${
                      attendancePct >= 85
                        ? 'text-emerald-600'
                        : attendancePct >= 75
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }`}
                  >
                    {attendancePct}% Overall
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#737373] block uppercase tracking-wider">Today's Lectures</span>
                  <span className="font-bold text-[#171717]">{todayTimetable.length} Scheduled</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#737373] block uppercase tracking-wider">Active Assignments</span>
                  <span className="font-bold text-[#171717]">{assignmentsList.length} Tasks</span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs Header */}
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2">
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'overview'
                      ? 'bg-[#F97316] text-white shadow-xs'
                      : 'text-[#737373] hover:text-[#171717] hover:bg-neutral-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Overview</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('attendance')}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'attendance'
                      ? 'bg-[#F97316] text-white shadow-xs'
                      : 'text-[#737373] hover:text-[#171717] hover:bg-neutral-100'
                  }`}
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>Attendance History</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('timetable')}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'timetable'
                      ? 'bg-[#F97316] text-white shadow-xs'
                      : 'text-[#737373] hover:text-[#171717] hover:bg-neutral-100'
                  }`}
                >
                  <CalendarDays className="w-4 h-4" />
                  <span>Timetable</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('assignments')}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'assignments'
                      ? 'bg-[#F97316] text-white shadow-xs'
                      : 'text-[#737373] hover:text-[#171717] hover:bg-neutral-100'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Assignments ({assignmentsList.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'profile'
                      ? 'bg-[#F97316] text-white shadow-xs'
                      : 'text-[#737373] hover:text-[#171717] hover:bg-neutral-100'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Ward Profile</span>
                </button>
              </div>
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <MetricCard
                    title="ATTENDANCE PERCENTAGE"
                    value={`${attendancePct}%`}
                    sub={
                      attendancePct >= 85
                        ? 'Excellent attendance'
                        : attendancePct >= 75
                        ? 'Satisfactory'
                        : 'Attendance alert (<75%)'
                    }
                    color={
                      attendancePct >= 85
                        ? 'text-emerald-600'
                        : attendancePct >= 75
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }
                    icon={<CheckSquare className="w-5 h-5 text-emerald-600" />}
                    bg="bg-emerald-50"
                  />

                  <MetricCard
                    title="CLASSES ATTENDED"
                    value={String(attendanceSummary?.present ?? 0)}
                    sub={`Out of ${attendanceSummary?.totalClasses ?? 0} total sessions`}
                    icon={<UserCheck className="w-5 h-5 text-blue-600" />}
                    bg="bg-blue-50"
                  />

                  <MetricCard
                    title="ABSENCES / LATE"
                    value={`${attendanceSummary?.absent ?? 0} / ${attendanceSummary?.late ?? 0}`}
                    sub="Recorded class sessions"
                    color="text-amber-600"
                    icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
                    bg="bg-amber-50"
                  />

                  <MetricCard
                    title="ACTIVE ASSIGNMENTS"
                    value={String(assignmentsList.length)}
                    sub="Course coursework tasks"
                    color="text-purple-600"
                    icon={<FileText className="w-5 h-5 text-purple-600" />}
                    bg="bg-purple-50"
                  />
                </div>

                {/* Today's Lectures & Recent Attendance Highlights */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Today's Schedule Card */}
                  <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-[#F97316]" />
                        <h3 className="font-bold text-sm text-[#171717]">Today's Academic Schedule</h3>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab('timetable')}
                        className="text-xs"
                      >
                        Full Week
                      </Button>
                    </div>

                    {isLoadingTodayTimetable ? (
                      <div className="p-8 text-center text-xs text-[#737373] animate-pulse">
                        Loading today's schedule...
                      </div>
                    ) : todayTimetable.length === 0 ? (
                      <div className="p-8 text-center border border-dashed border-[#E5E5E5] rounded-xl space-y-2">
                        <Clock className="w-6 h-6 text-[#737373] mx-auto opacity-50" />
                        <p className="text-xs text-[#737373]">No classes scheduled for today.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-[#E5E5E5]">
                        {todayTimetable.map((entry) => (
                          <div key={entry.id} className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                            <div className="space-y-1">
                              <span className="font-bold text-xs text-[#171717] block">
                                {entry.courseName || entry.courseCode || 'Scheduled Lecture'}
                              </span>
                              <div className="flex items-center gap-3 text-[11px] text-[#737373]">
                                <span className="flex items-center gap-1 font-mono font-medium">
                                  <Clock className="w-3 h-3 text-[#F97316]" />
                                  {entry.startTime.substring(0, 5)} - {entry.endTime.substring(0, 5)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-neutral-400" />
                                  Room {entry.room}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-[11px] font-semibold text-[#525252] block">
                                {entry.facultyName || 'Instructor'}
                              </span>
                              <span className="text-[10px] text-[#737373]">
                                {entry.classSectionName || 'Section'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recent Attendance Log Snippet */}
                  <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                        <h3 className="font-bold text-sm text-[#171717]">Recent Attendance Log</h3>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab('attendance')}
                        className="text-xs"
                      >
                        View All
                      </Button>
                    </div>

                    {isLoadingHistory ? (
                      <div className="p-8 text-center text-xs text-[#737373] animate-pulse">
                        Loading attendance history...
                      </div>
                    ) : attendanceHistory.length === 0 ? (
                      <div className="p-8 text-center border border-dashed border-[#E5E5E5] rounded-xl space-y-2">
                        <CheckCircle2 className="w-6 h-6 text-[#737373] mx-auto opacity-50" />
                        <p className="text-xs text-[#737373]">No attendance records logged yet.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-[#E5E5E5]">
                        {attendanceHistory.slice(0, 5).map((record) => (
                          <div key={record.id} className="py-2.5 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                            <div>
                              <span className="font-bold text-xs text-[#171717] block">
                                {record.courseName || record.courseCode || 'Class Session'}
                              </span>
                              <span className="text-[11px] text-[#737373]">
                                {record.attendanceDate} • {record.facultyName || 'Instructor'}
                              </span>
                            </div>
                            <div>
                              {getAttendanceStatusBadge(record.status)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ATTENDANCE HISTORY */}
            {activeTab === 'attendance' && (
              <div className="space-y-6">
                {/* Attendance Summary Banner */}
                <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-xs">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                      <h3 className="font-black text-base text-[#171717]">Attendance Breakdown</h3>
                      <p className="text-xs text-[#737373]">
                        Institutional criteria requires maintaining at least 75% attendance for academic eligibility.
                      </p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <span className="text-2xl font-black text-[#171717] block">
                          {attendanceSummary?.totalClasses ?? 0}
                        </span>
                        <span className="text-[10px] font-bold text-[#737373] uppercase tracking-wider">Total</span>
                      </div>
                      <div className="h-8 w-px bg-[#E5E5E5]" />
                      <div className="text-center">
                        <span className="text-2xl font-black text-emerald-600 block">
                          {attendanceSummary?.present ?? 0}
                        </span>
                        <span className="text-[10px] font-bold text-[#737373] uppercase tracking-wider">Present</span>
                      </div>
                      <div className="h-8 w-px bg-[#E5E5E5]" />
                      <div className="text-center">
                        <span className="text-2xl font-black text-amber-600 block">
                          {attendanceSummary?.late ?? 0}
                        </span>
                        <span className="text-[10px] font-bold text-[#737373] uppercase tracking-wider">Late</span>
                      </div>
                      <div className="h-8 w-px bg-[#E5E5E5]" />
                      <div className="text-center">
                        <span className="text-2xl font-black text-rose-600 block">
                          {attendanceSummary?.absent ?? 0}
                        </span>
                        <span className="text-[10px] font-bold text-[#737373] uppercase tracking-wider">Absent</span>
                      </div>
                      <div className="h-8 w-px bg-[#E5E5E5]" />
                      <div className="text-center">
                        <span
                          className={`text-2xl font-black block ${
                            attendancePct >= 85
                              ? 'text-emerald-600'
                              : attendancePct >= 75
                              ? 'text-amber-600'
                              : 'text-rose-600'
                          }`}
                        >
                          {attendancePct}%
                        </span>
                        <span className="text-[10px] font-bold text-[#737373] uppercase tracking-wider">Percentage</span>
                      </div>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full bg-neutral-100 h-2.5 rounded-full mt-5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        attendancePct >= 85
                          ? 'bg-emerald-500'
                          : attendancePct >= 75
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, attendancePct))}%` }}
                    />
                  </div>
                </div>

                {/* Complete Attendance Records Table */}
                <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden shadow-xs">
                  <div className="p-4 border-b border-[#E5E5E5] bg-[#F7F7F7]/50 flex items-center justify-between">
                    <h3 className="font-bold text-xs text-[#171717] uppercase tracking-wider">
                      Detailed Session Logs ({attendanceHistory.length})
                    </h3>
                  </div>

                  {isLoadingHistory ? (
                    <div className="p-12 text-center text-xs text-[#737373] animate-pulse">
                      Loading session logs...
                    </div>
                  ) : attendanceHistory.length === 0 ? (
                    <div className="p-12 text-center space-y-2">
                      <CheckSquare className="w-8 h-8 text-[#737373] mx-auto opacity-50" />
                      <p className="text-xs text-[#737373]">No attendance records available for this student.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#F7F7F7] border-b border-[#E5E5E5] font-bold text-[#737373]">
                          <tr>
                            <th className="p-4">Date</th>
                            <th className="p-4">Course</th>
                            <th className="p-4">Class Section</th>
                            <th className="p-4">Instructor</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Remarks</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E5E5]">
                          {attendanceHistory.map((rec) => (
                            <tr key={rec.id} className="hover:bg-[#F7F7F7]/50 transition-colors">
                              <td className="p-4 font-mono font-medium text-[#171717]">
                                {rec.attendanceDate}
                              </td>
                              <td className="p-4">
                                <span className="font-bold text-[#171717] block">
                                  {rec.courseName || 'Course'}
                                </span>
                                {rec.courseCode && (
                                  <span className="text-[10px] text-[#737373] font-mono">
                                    {rec.courseCode}
                                  </span>
                                )}
                              </td>
                              <td className="p-4 text-[#525252]">
                                {rec.classSectionName || 'Default Section'}
                              </td>
                              <td className="p-4 text-[#525252]">
                                {rec.facultyName || 'Instructor'}
                              </td>
                              <td className="p-4">
                                {getAttendanceStatusBadge(rec.status)}
                              </td>
                              <td className="p-4 text-[11px] text-[#737373]">
                                {rec.remarks || '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: TIMETABLE */}
            {activeTab === 'timetable' && (
              <div className="space-y-6">
                {/* Timetable Sub-tab Bar: Today vs Weekly */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTimetableMode('today')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        timetableMode === 'today'
                          ? 'bg-[#171717] text-white'
                          : 'text-[#737373] hover:text-[#171717] hover:bg-neutral-100'
                      }`}
                    >
                      Today's Schedule
                    </button>
                    <button
                      type="button"
                      onClick={() => setTimetableMode('weekly')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        timetableMode === 'weekly'
                          ? 'bg-[#171717] text-white'
                          : 'text-[#737373] hover:text-[#171717] hover:bg-neutral-100'
                      }`}
                    >
                      Full Weekly Timetable
                    </button>
                  </div>

                  {timetableMode === 'weekly' && (
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                      {DAYS_OF_WEEK.map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => setSelectedDay(day)}
                          className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors capitalize ${
                            selectedDay === day
                              ? 'bg-[#F97316] text-white shadow-xs'
                              : 'text-[#737373] hover:text-[#171717] hover:bg-neutral-100'
                          }`}
                        >
                          {day.substring(0, 3)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Today's Timetable Mode */}
                {timetableMode === 'today' && (
                  <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-[#171717]">Today's Classes</h3>
                      <span className="text-xs text-[#737373] font-medium">
                        {todayTimetable.length} lecture period(s)
                      </span>
                    </div>

                    {isLoadingTodayTimetable ? (
                      <div className="p-8 text-center text-xs text-[#737373] animate-pulse">
                        Loading today's schedule...
                      </div>
                    ) : todayTimetable.length === 0 ? (
                      <div className="p-12 text-center border border-dashed border-[#E5E5E5] rounded-xl space-y-2">
                        <Clock className="w-8 h-8 text-[#737373] mx-auto opacity-50" />
                        <h4 className="font-bold text-xs text-[#171717]">No Classes Today</h4>
                        <p className="text-xs text-[#737373]">
                          There are no scheduled lectures for your child on this day.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {todayTimetable.map((entry) => (
                          <div
                            key={entry.id}
                            className="bg-[#F7F7F7]/60 border border-[#E5E5E5] p-4 rounded-xl space-y-3 hover:border-[#F97316]/50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold text-[#F97316] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                                {entry.startTime.substring(0, 5)} - {entry.endTime.substring(0, 5)}
                              </span>
                              <span className="text-[10px] font-bold text-[#737373] flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> Room {entry.room}
                              </span>
                            </div>

                            <div className="space-y-0.5">
                              <h4 className="font-bold text-sm text-[#171717]">
                                {entry.courseName || entry.courseCode || 'Lecture'}
                              </h4>
                              {entry.courseCode && (
                                <span className="text-[11px] text-[#737373] font-mono">
                                  {entry.courseCode}
                                </span>
                              )}
                            </div>

                            <div className="pt-2 border-t border-[#E5E5E5] flex items-center justify-between text-[11px] text-[#525252]">
                              <span>{entry.facultyName || 'Instructor'}</span>
                              <span className="text-[10px] text-[#737373]">
                                {entry.classSectionName || 'Section'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Weekly Timetable Mode */}
                {timetableMode === 'weekly' && (
                  <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-[#171717] capitalize">
                        {selectedDay.toLowerCase()} Schedule
                      </h3>
                      <span className="text-xs text-[#737373]">
                        {filteredWeeklySchedule.length} session(s)
                      </span>
                    </div>

                    {isLoadingWeeklyTimetable ? (
                      <div className="p-8 text-center text-xs text-[#737373] animate-pulse">
                        Loading weekly timetable...
                      </div>
                    ) : filteredWeeklySchedule.length === 0 ? (
                      <div className="p-12 text-center border border-dashed border-[#E5E5E5] rounded-xl space-y-2">
                        <CalendarDays className="w-8 h-8 text-[#737373] mx-auto opacity-50" />
                        <h4 className="font-bold text-xs text-[#171717]">No Lectures on {selectedDay}</h4>
                        <p className="text-xs text-[#737373]">
                          No timetable entries are scheduled for this day of the week.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredWeeklySchedule.map((entry) => (
                          <div
                            key={entry.id}
                            className="bg-[#F7F7F7]/60 border border-[#E5E5E5] p-4 rounded-xl space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold text-[#F97316] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                                {entry.startTime.substring(0, 5)} - {entry.endTime.substring(0, 5)}
                              </span>
                              <span className="text-[10px] font-bold text-[#737373] flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> Room {entry.room}
                              </span>
                            </div>

                            <div className="space-y-0.5">
                              <h4 className="font-bold text-sm text-[#171717]">
                                {entry.courseName || entry.courseCode || 'Class'}
                              </h4>
                              {entry.courseCode && (
                                <span className="text-[11px] text-[#737373] font-mono">
                                  {entry.courseCode}
                                </span>
                              )}
                            </div>

                            <div className="pt-2 border-t border-[#E5E5E5] flex items-center justify-between text-[11px] text-[#525252]">
                              <span>{entry.facultyName || 'Instructor'}</span>
                              <span className="text-[10px] text-[#737373]">
                                {entry.classSectionName || 'Section'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: ASSIGNMENTS */}
            {activeTab === 'assignments' && (
              <div className="space-y-6">
                <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden shadow-xs">
                  <div className="p-4 border-b border-[#E5E5E5] bg-[#F7F7F7]/50 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-xs text-[#171717] uppercase tracking-wider">
                        Assigned Coursework & Projects
                      </h3>
                      <p className="text-[11px] text-[#737373]">
                        Track your child's published homework, due dates, and marks criteria.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#737373]">
                      Total: {assignmentsList.length}
                    </span>
                  </div>

                  {isLoadingAssignments ? (
                    <div className="p-12 text-center text-xs text-[#737373] animate-pulse">
                      Loading assignments...
                    </div>
                  ) : assignmentsList.length === 0 ? (
                    <div className="p-12 text-center space-y-2">
                      <FileText className="w-8 h-8 text-[#737373] mx-auto opacity-50" />
                      <h4 className="font-bold text-xs text-[#171717]">No Assignments Published</h4>
                      <p className="text-xs text-[#737373]">
                        Your child has no pending assignments across enrolled courses.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#E5E5E5]">
                      {assignmentsList.map((assignment) => {
                        const dueDate = new Date(assignment.dueDate);
                        const isPast = dueDate < new Date();
                        return (
                          <div
                            key={assignment.id}
                            className="p-5 hover:bg-[#F7F7F7]/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                          >
                            <div className="space-y-1.5 max-w-2xl">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-[#525252]">
                                  {assignment.classroomName || 'Classroom'}
                                </span>
                                {isPast ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-200 text-[#525252]">
                                    Past Deadline
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    Active Task
                                  </span>
                                )}
                              </div>
                              <h4 className="font-bold text-sm text-[#171717]">{assignment.title}</h4>
                              <p className="text-xs text-[#737373] leading-relaxed line-clamp-2">
                                {assignment.description || 'No description provided.'}
                              </p>
                              {assignment.fileName && (
                                <div className="text-[11px] text-[#F97316] font-medium flex items-center gap-1">
                                  <FileText className="w-3 h-3" /> Attached Asset: {assignment.fileName}
                                </div>
                              )}
                            </div>

                            <div className="flex md:flex-col items-center md:items-end justify-between gap-1 text-right text-xs">
                              <div>
                                <span className="text-[10px] font-bold text-[#737373] uppercase block">Due Date</span>
                                <span className="font-mono font-medium text-[#171717]">
                                  {assignment.dueDate.replace('T', ' ').substring(0, 16)}
                                </span>
                              </div>
                              <div className="mt-1">
                                <span className="text-[10px] font-bold text-[#737373] uppercase block">Max Marks</span>
                                <span className="font-bold text-[#F97316]">
                                  {assignment.maxMarks} pts
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: PROFILE & WARD DETAILS */}
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Student Details Card */}
                <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-[#F97316]" />
                    <h3 className="font-bold text-sm text-[#171717]">Student Scholar Profile</h3>
                  </div>

                  <div className="space-y-3 pt-2 text-xs divide-y divide-[#E5E5E5]">
                    <div className="flex justify-between py-2 first:pt-0">
                      <span className="text-[#737373] font-medium">Student Full Name</span>
                      <span className="font-bold text-[#171717]">{activeStudent.studentName}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-[#737373] font-medium">Enrollment Number</span>
                      <span className="font-mono font-bold text-[#F97316]">{activeStudent.enrollmentNumber || '—'}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-[#737373] font-medium">Relationship to Parent</span>
                      <span className="font-semibold text-[#171717]">{activeStudent.relationship || 'Ward'}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-[#737373] font-medium">Student ID Ref</span>
                      <span className="font-mono text-[#737373]">{activeStudent.studentId}</span>
                    </div>
                  </div>
                </div>

                {/* Parent / Guardian Profile Card */}
                <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-sm text-[#171717]">Guardian Profile</h3>
                  </div>

                  <div className="space-y-3 pt-2 text-xs divide-y divide-[#E5E5E5]">
                    <div className="flex justify-between py-2 first:pt-0">
                      <span className="text-[#737373] font-medium">Parent Name</span>
                      <span className="font-bold text-[#171717]">
                        {activeStudent.firstName} {activeStudent.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-[#737373] font-medium">Institutional Email</span>
                      <span className="font-mono text-[#171717]">{activeStudent.email}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-[#737373] font-medium">Personal Contact Email</span>
                      <span className="text-[#171717]">{activeStudent.personalEmail || '—'}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-[#737373] font-medium">Phone</span>
                      <span className="font-mono text-[#171717]">{activeStudent.phone || '—'}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-[#737373] font-medium">Occupation</span>
                      <span className="text-[#171717]">{activeStudent.occupation || '—'}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-[#737373] font-medium">Residential Address</span>
                      <span className="text-[#171717] text-right max-w-xs">{activeStudent.address || '—'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
};
export default ParentDashboard;
