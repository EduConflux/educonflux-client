import React, { useState } from 'react';
import { useStudentSubmission, useSubmitAssignment, useDeleteSubmission } from '../hooks/useAssignments';
import { useUploadFile } from '../../learning/hooks/useLearningMaterials';
import { FileThumbnail } from './FileThumbnail';
import type { Assignment } from '../types';
import {
  X,
  UploadCloud,
  FileCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Award,
  Trash2,
  Loader2,
  AlertTriangle,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

interface StudentSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: Assignment;
  classroomId: number;
}

export const StudentSubmissionModal: React.FC<StudentSubmissionModalProps> = ({
  isOpen,
  onClose,
  assignment,
  classroomId,
}) => {
  const { data: submission, isLoading: isLoadingSubmission } = useStudentSubmission(assignment.id);
  const submitMutation = useSubmitAssignment(classroomId);
  const deleteMutation = useDeleteSubmission(classroomId, assignment.id);
  const uploadFileMutation = useUploadFile();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  if (!isOpen) return null;

  const dueDate = new Date(assignment.dueDate);
  const now = new Date();
  const isPastDue = dueDate.getTime() < now.getTime();

  const isSubmitted = !!submission;
  const isGraded = submission?.marks !== null && submission?.marks !== undefined;

  let isSubmittedLate = false;
  if (submission?.submittedAt) {
    const submittedDate = new Date(submission.submittedAt);
    isSubmittedLate = submittedDate.getTime() > dueDate.getTime();
  }

  const isSubmitting = uploadFileMutation.isPending || submitMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 50 * 1024 * 1024) {
        setError('File size must be under 50MB');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to submit');
      return;
    }

    try {
      setError(null);
      // 1. Upload file to Supabase storage via backend
      const storedFile = await uploadFileMutation.mutateAsync(selectedFile);

      // 2. Submit assignment with fileId
      await submitMutation.mutateAsync({
        assignmentId: assignment.id,
        fileId: storedFile.id,
      });

      setSelectedFile(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit assignment. Please try again.');
    }
  };

  const handleDeleteSubmission = async () => {
    try {
      setError(null);
      await deleteMutation.mutateAsync();
      setShowDeleteConfirm(false);
    } catch (err: any) {
      setError(err?.message || 'Failed to remove submission. Please try again.');
    }
  };

  const scorePercentage =
    isGraded && assignment.maxMarks > 0
      ? Math.round(((submission.marks || 0) / assignment.maxMarks) * 100)
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl border border-[#E5E5E5] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E5E5] bg-[#F7F7F7]/60 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#F97316]">
                Assignment Details & Submission
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#525252] border border-[#E5E5E5]">
                {assignment.maxMarks} Points
              </span>
            </div>
            <h3 className="text-base font-black text-[#171717]">{assignment.title}</h3>
          </div>

          <button
            onClick={onClose}
            className="text-[#737373] hover:text-[#171717] p-2 rounded-xl hover:bg-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Due Date & Deadline Banner */}
          <div
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border text-xs ${
              isPastDue
                ? isSubmitted
                  ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                  : 'bg-red-50/70 border-red-200 text-red-900'
                : 'bg-orange-50/50 border-orange-200/70 text-[#171717]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Clock
                className={`w-4 h-4 shrink-0 ${
                  isPastDue
                    ? isSubmitted
                      ? 'text-amber-600'
                      : 'text-red-600'
                    : 'text-[#F97316]'
                }`}
              />
              <div>
                <span className="font-bold block">
                  Deadline:{' '}
                  {dueDate.toLocaleDateString(undefined, {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  at{' '}
                  {dueDate.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <span className="text-[11px] opacity-80">
                  {isPastDue ? (
                    isSubmitted ? (
                      isSubmittedLate ? (
                        '⚠️ Turned in after deadline'
                      ) : (
                        '✓ Turned in before deadline'
                      )
                    ) : (
                      <span className="font-semibold text-red-700">
                        ⚠️ Past Due — Submissions are now closed
                      </span>
                    )
                  ) : (
                    'Submissions are currently open'
                  )}
                </span>
              </div>
            </div>

            {/* Submission Status Badge */}
            <div className="shrink-0">
              {isLoadingSubmission ? (
                <div className="flex items-center gap-1 text-[#737373]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Checking status...</span>
                </div>
              ) : isGraded ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white font-bold rounded-full text-xs shadow-xs">
                  <Award className="w-3.5 h-3.5" />
                  Graded
                </span>
              ) : isSubmitted ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white font-bold rounded-full text-xs shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Submitted
                </span>
              ) : isPastDue ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white font-bold rounded-full text-xs shadow-xs">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Past Due
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F97316] text-white font-bold rounded-full text-xs shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  Assigned
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-[#F7F7F7]/60 rounded-2xl p-4 border border-[#E5E5E5] space-y-1">
            <h4 className="text-[11px] uppercase tracking-wider font-extrabold text-[#737373]">
              Assignment Instructions
            </h4>
            <p className="text-xs text-[#525252] leading-relaxed whitespace-pre-line">
              {assignment.description || 'No detailed instructions provided.'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2.5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* -------------------- SUBMITTED STATE -------------------- */}
          {isSubmitted && submission ? (
            <div className="space-y-4 pt-1">
              {/* Grading Result Banner (if graded) */}
              {isGraded ? (
                <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/60 pb-3">
                    <div className="flex items-center gap-2 text-emerald-900">
                      <Award className="w-5 h-5 text-emerald-600" />
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider">
                          Assignment Graded
                        </h4>
                        <span className="text-[11px] text-emerald-700">
                          Reviewed on{' '}
                          {submission.gradedAt
                            ? new Date(submission.gradedAt).toLocaleDateString()
                            : 'recently'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-emerald-700">
                        {submission.marks}
                      </span>
                      <span className="text-xs font-bold text-emerald-600">
                        / {assignment.maxMarks} Marks ({scorePercentage}%)
                      </span>
                    </div>
                  </div>

                  {/* Faculty Feedback */}
                  {submission.feedback && (
                    <div className="space-y-1 text-xs text-emerald-950">
                      <div className="flex items-center gap-1.5 font-bold text-[11px] text-emerald-800">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Teacher Feedback:</span>
                      </div>
                      <p className="bg-white/80 rounded-xl p-3 border border-emerald-200/60 text-xs leading-relaxed italic">
                        "{submission.feedback}"
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-blue-900">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                    <div>
                      <span className="font-bold block">
                        Submission Status: Submitted
                      </span>
                      <span className="text-[11px] text-blue-700">
                        Turned in on{' '}
                        {new Date(submission.submittedAt).toLocaleDateString()}{' '}
                        at{' '}
                        {new Date(submission.submittedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 bg-white border border-blue-200 text-blue-700 rounded-full shrink-0">
                    Awaiting Grading
                  </span>
                </div>
              )}

              {/* Uploaded File with Thumbnail Card */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#171717]">
                  Your Submitted File
                </h4>
                <FileThumbnail
                  fileId={submission.fileId}
                  fileName={submission.fileName || 'submitted_assignment_file'}
                  fileContentType={submission.fileContentType}
                  fileSize={submission.fileSize}
                  fileUrl={submission.fileUrl}
                />
              </div>

              {/* Remove Submission / Unsubmit Section */}
              <div className="pt-3 border-t border-[#E5E5E5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="text-[11px] text-[#737373]">
                  {isGraded ? (
                    <span>This submission has been graded and cannot be removed.</span>
                  ) : (
                    <span>
                      Need to change your solution? You can remove this submission and upload a new file.
                    </span>
                  )}
                </div>

                {!isGraded && (
                  <div className="shrink-0">
                    {showDeleteConfirm ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowDeleteConfirm(false)}
                          disabled={isDeleting}
                          className="px-3 py-1.5 text-xs font-semibold text-[#525252] hover:bg-[#F7F7F7] rounded-xl cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleDeleteSubmission}
                          disabled={isDeleting}
                          className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                          <span>{isDeleting ? 'Removing...' : 'Confirm Remove'}</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Submission</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* -------------------- NOT SUBMITTED STATE -------------------- */
            <div className="space-y-4">
              {isPastDue ? (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-2">
                  <AlertTriangle className="w-8 h-8 text-red-500 mx-auto" />
                  <h4 className="text-sm font-bold text-red-900">
                    Submission Deadline Expired
                  </h4>
                  <p className="text-xs text-red-700 max-w-md mx-auto">
                    The due date for this assignment has passed ({dueDate.toLocaleDateString()}). You cannot submit or upload new solutions.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#171717] block">
                      Upload Solution File
                    </label>

                    <label className="border-2 border-dashed border-[#E5E5E5] hover:border-[#F97316] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-[#F7F7F7]/40 hover:bg-orange-50/10 block text-center">
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isSubmitting}
                      />
                      {selectedFile ? (
                        <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                          <FileCheck className="w-5 h-5" />
                          <span className="text-[#171717]">{selectedFile.name}</span>
                          <span className="text-[10px] text-[#737373]">
                            ({(selectedFile.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                      ) : (
                        <>
                          <UploadCloud className="w-8 h-8 text-[#737373] opacity-60" />
                          <span className="text-xs font-bold text-[#171717]">
                            Click to select file or drag & drop
                          </span>
                          <span className="text-[10px] text-[#737373]">
                            Images, PDF, DOCX, ZIP, or Code up to 50MB
                          </span>
                        </>
                      )}
                    </label>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isSubmitting}
                      className="px-4 py-2 text-xs font-semibold text-[#525252] hover:bg-[#F7F7F7] rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !selectedFile}
                      className="px-5 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>{isSubmitting ? 'Uploading & Submitting...' : 'Turn In Solution'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
