import React, { useState } from 'react';
import {
  useAssignmentSubmissions,
  useGradeSubmission,
} from '../hooks/useAssignments';
import { FileThumbnail } from './FileThumbnail';
import { learningApi } from '../../learning/api/learningApi';
import type { Assignment, AssignmentSubmission } from '../types';
import {
  X,
  Award,
  CheckCircle2,
  Loader2,
  FileText,
  User,
} from 'lucide-react';

interface SubmissionsReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: Assignment;
}

export const SubmissionsReviewModal: React.FC<
  SubmissionsReviewModalProps
> = ({
  isOpen,
  onClose,
  assignment,
}) => {
  const {
    data: submissions = [],
    isLoading,
  } = useAssignmentSubmissions(assignment.id);

  const gradeMutation =
    useGradeSubmission(assignment.id);

  const [editingSubmissionId, setEditingSubmissionId] =
    useState<number | null>(null);

  const [marks, setMarks] = useState<number>(0);

  const [feedback, setFeedback] =
    useState<string>('');

  const handleDownloadSubmission = async (
    sub: AssignmentSubmission
  ) => {
    if (!sub.fileId) return;

    try {
      await learningApi.downloadFile(
        sub.fileId,
        `submission_${sub.studentName || sub.studentId}`
      );
    } catch (error) {
      console.error(
        'Failed to download submission:',
        error
      );
    }
  };

  if (!isOpen) return null;

  const handleStartGrade = (
    sub: AssignmentSubmission
  ) => {
    setEditingSubmissionId(sub.id);
    setMarks(
      sub.marks ?? assignment.maxMarks
    );
    setFeedback(sub.feedback ?? '');
  };

  const handleSaveGrade = async (
    submissionId: number
  ) => {
    await gradeMutation.mutateAsync({
      submissionId,
      data: {
        marks: Number(marks),
        feedback,
      },
    });

    setEditingSubmissionId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-3xl border border-[#E5E5E5] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5] bg-[#F7F7F7]/60 shrink-0">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#F97316] block">
              Submissions Review & Grading
            </span>

            <h3 className="text-sm font-black text-[#171717]">
              {assignment.title}
            </h3>

            <span className="text-[11px] text-[#737373]">
              Max Marks: {assignment.maxMarks}
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-[#737373] hover:text-[#171717] p-1.5 rounded-lg hover:bg-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-xs text-[#737373]">
              <Loader2 className="w-4 h-4 animate-spin text-[#F97316]" />
              Loading student submissions...
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <FileText className="w-10 h-10 text-[#737373] mx-auto opacity-40" />

              <h4 className="font-bold text-sm text-[#171717]">
                No Submissions Turned In Yet
              </h4>

              <p className="text-xs text-[#737373]">
                Students who submit their homework file will appear here for grading.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub) => {
                const isEditing =
                  editingSubmissionId === sub.id;

                const isGraded =
                  sub.marks !== null &&
                  sub.marks !== undefined;

                return (
                  <div
                    key={sub.id}
                    className="border border-[#E5E5E5] rounded-xl p-4 bg-white shadow-xs space-y-3 transition-all hover:border-[#F97316]/50"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-[#F97316] font-bold text-xs">
                          <User className="w-4 h-4" />
                        </div>

                        <div>
                          <span className="font-bold text-xs text-[#171717] block">
                            {sub.studentName ||
                              `Student ID: ${sub.studentId}`}
                          </span>

                          <span className="text-[10px] text-[#737373]">
                            Submitted:{' '}
                            {new Date(
                              sub.submittedAt
                            ).toLocaleDateString()}{' '}
                            at{' '}
                            {new Date(
                              sub.submittedAt
                            ).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isGraded && !isEditing && (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />

                            <span>
                              {sub.marks} / {assignment.maxMarks}
                            </span>
                          </div>
                        )}

                        {!isEditing && (
                          <button
                            onClick={() =>
                              handleStartGrade(sub)
                            }
                            className="px-3 py-1.5 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                          >
                            {isGraded
                              ? 'Edit Grade'
                              : 'Grade'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Submitted File Thumbnail Preview */}
                    {sub.fileId && (
                      <div className="pt-1">
                        <FileThumbnail
                          fileId={sub.fileId}
                          fileName={sub.fileName || 'submission_file'}
                          fileContentType={sub.fileContentType}
                          fileSize={sub.fileSize}
                          fileUrl={sub.fileUrl}
                        />
                      </div>
                    )}

                    {/* Graded feedback view */}
                    {isGraded &&
                      !isEditing &&
                      sub.feedback && (
                        <div className="text-xs bg-[#F7F7F7]/60 rounded-lg p-2.5 text-[#525252] border border-[#E5E5E5]/60">
                          <span className="font-bold text-[#171717] block text-[10px] uppercase tracking-wider mb-0.5">
                            Faculty Feedback
                          </span>

                          <p>{sub.feedback}</p>
                        </div>
                      )}

                    {/* Inline Grading Form */}
                    {isEditing && (
                      <div className="pt-3 border-t border-[#E5E5E5] space-y-3 bg-[#F7F7F7]/40 p-3 rounded-lg animate-in fade-in duration-150">
                        <div className="flex items-center gap-3">
                          <label className="text-xs font-bold text-[#171717]">
                            Award Marks (out of{' '}
                            {assignment.maxMarks}):
                          </label>

                          <input
                            type="number"
                            min={0}
                            max={assignment.maxMarks}
                            value={marks}
                            onChange={(e) =>
                              setMarks(
                                Number(e.target.value)
                              )
                            }
                            className="w-24 border border-[#E5E5E5] rounded-lg px-2.5 py-1 text-xs bg-white font-bold text-[#F97316] focus:outline-hidden focus:border-[#F97316]"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold uppercase text-[#737373] block mb-1">
                            Feedback / Comments
                          </label>

                          <textarea
                            rows={2}
                            value={feedback}
                            onChange={(e) =>
                              setFeedback(e.target.value)
                            }
                            placeholder="Constructive review or grading notes for student..."
                            className="w-full border border-[#E5E5E5] rounded-lg p-2 text-xs bg-white focus:outline-hidden focus:border-[#F97316]"
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setEditingSubmissionId(null)
                            }
                            className="px-3 py-1 text-xs font-semibold text-[#525252] hover:bg-[#E5E5E5] rounded-lg cursor-pointer"
                          >
                            Cancel
                          </button>

                          <button
                            type="button"
                            disabled={
                              gradeMutation.isPending
                            }
                            onClick={() =>
                              handleSaveGrade(sub.id)
                            }
                            className="px-4 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            {gradeMutation.isPending ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Award className="w-3.5 h-3.5" />
                            )}

                            <span>Save Grade</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};