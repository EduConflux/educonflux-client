import React, { useState } from 'react';
import { useClassroomAssignments, useStudentSubmission } from '../hooks/useAssignments';
import { SubmitAssignmentModal } from './SubmitAssignmentModal';
import { SubmissionsReviewModal } from './SubmissionsReviewModal';
import { learningApi } from '../../learning/api/learningApi';
import type { Assignment } from '../types';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Upload, 
  Users, 
  Loader2 
} from 'lucide-react';

interface AssignmentListProps {
  classroomId: number;
  role: 'faculty' | 'student';
  onOpenCreate?: () => void;
}

export const AssignmentList: React.FC<AssignmentListProps> = ({
  classroomId,
  role,
  onOpenCreate,
}) => {
  const { data: assignments = [], isLoading } = useClassroomAssignments(classroomId, role);

  const [selectedForSubmit, setSelectedForSubmit] = useState<Assignment | null>(null);
  const [selectedForReview, setSelectedForReview] = useState<Assignment | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 gap-2 text-xs text-[#737373]">
        <Loader2 className="w-5 h-5 animate-spin text-[#F97316]" />
        <span>Loading assignments...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#171717]">Class Assignments</h3>
          <p className="text-xs text-[#737373]">Coursework, lab projects, and assessment milestones</p>
        </div>

        {role === 'faculty' && onOpenCreate && (
          <button
            onClick={onOpenCreate}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Assignment</span>
          </button>
        )}
      </div>

      {assignments.length === 0 ? (
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-12 text-center space-y-2">
          <FileText className="w-10 h-10 text-[#737373] mx-auto opacity-40" />
          <h4 className="font-bold text-sm text-[#171717]">No Assignments Posted</h4>
          <p className="text-xs text-[#737373]">
            {role === 'faculty' 
              ? 'Click "Create Assignment" to post coursework for your students.' 
              : 'You have no pending assignments for this class.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              classroomId={classroomId}
              role={role}
              onSubmitClick={() => setSelectedForSubmit(assignment)}
              onReviewClick={() => setSelectedForReview(assignment)}
            />
          ))}
        </div>
      )}

      {/* Student Submission Modal */}
      {selectedForSubmit && (
        <SubmitAssignmentModal
          isOpen={!!selectedForSubmit}
          onClose={() => setSelectedForSubmit(null)}
          assignment={selectedForSubmit}
          classroomId={classroomId}
        />
      )}

      {/* Faculty Grading Modal */}
      {selectedForReview && (
        <SubmissionsReviewModal
          isOpen={!!selectedForReview}
          onClose={() => setSelectedForReview(null)}
          assignment={selectedForReview}
        />
      )}
    </div>
  );
};

interface AssignmentCardProps {
  assignment: Assignment;
  classroomId: number;
  role: 'faculty' | 'student';
  onSubmitClick: () => void;
  onReviewClick: () => void;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  role,
  onSubmitClick,
  onReviewClick,
}) => {
  const isStudent = role === 'student';
  const { data: mySubmission } = useStudentSubmission(isStudent ? assignment.id : 0);

  const dueDateObj = new Date(assignment.dueDate);
  const isPastDue = dueDateObj.getTime() < Date.now();
  const isSubmitted = !!mySubmission;
  const isGraded = mySubmission?.marks !== null && mySubmission?.marks !== undefined;

  return (
    <div className="bg-white border border-[#E5E5E5] hover:border-[#F97316]/50 rounded-2xl p-5 shadow-xs transition-all space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm text-[#171717]">{assignment.title}</h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F7F7F7] text-[#525252] border border-[#E5E5E5]">
              {assignment.maxMarks} Points
            </span>
          </div>
          <p className="text-xs text-[#525252] leading-relaxed whitespace-pre-line">
            {assignment.description}
          </p>
        </div>

        {/* Due Date & Submission Status */}
        <div className="shrink-0 flex flex-col sm:items-end gap-1.5">
          <div className={`flex items-center gap-1.5 text-xs font-semibold ${isPastDue ? 'text-red-600' : 'text-[#737373]'}`}>
            <Clock className="w-3.5 h-3.5" />
            <span>Due {dueDateObj.toLocaleDateString()} {dueDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          {isStudent && (
            <div>
              {isGraded ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Score: {mySubmission.marks} / {assignment.maxMarks}
                </span>
              ) : isSubmitted ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Turned In
                </span>
              ) : isPastDue ? (
                <span className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                  Missing
                </span>
              ) : (
                <span className="text-[11px] font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                  Assigned
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Attachment download & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#F7F7F7]">
        <div>
          {assignment.fileId ? (
            <a
              href={learningApi.getFileDownloadUrl(assignment.fileId)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F97316] hover:underline cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Attachment ({assignment.fileName || 'Assignment Brief'})</span>
            </a>
          ) : (
            <span className="text-[11px] text-[#737373]">No file attachment</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isStudent ? (
            <button
              onClick={onSubmitClick}
              className={`px-4 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs ${
                isSubmitted
                  ? 'bg-[#F7F7F7] hover:bg-orange-50 hover:text-[#F97316] text-[#171717] border border-[#E5E5E5]'
                  : 'bg-[#F97316] hover:bg-[#EA580C] text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isSubmitted ? 'Resubmit Solution' : 'Turn In Solution'}</span>
            </button>
          ) : (
            <button
              onClick={onReviewClick}
              className="px-4 py-1.5 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Review Submissions & Grade</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
