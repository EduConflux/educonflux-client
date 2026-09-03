import React, { useState } from 'react';
import { useUploadFile } from '../../learning/hooks/useLearningMaterials';
import { useSubmitAssignment } from '../hooks/useAssignments';
import type { Assignment } from '../types';
import { X, UploadCloud, FileCheck, Loader2, AlertCircle } from 'lucide-react';

interface SubmitAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: Assignment;
  classroomId: number;
}

export const SubmitAssignmentModal: React.FC<SubmitAssignmentModalProps> = ({
  isOpen,
  onClose,
  assignment,
  classroomId,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadFileMutation = useUploadFile();
  const submitAssignmentMutation = useSubmitAssignment(classroomId);

  if (!isOpen) return null;

  const isSubmitting = uploadFileMutation.isPending || submitAssignmentMutation.isPending;

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
      // 1. Upload file to backend
      const storedFile = await uploadFileMutation.mutateAsync(selectedFile);

      // 2. Submit to assignment
      await submitAssignmentMutation.mutateAsync({
        assignmentId: assignment.id,
        fileId: storedFile.id,
      });

      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to submit assignment. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg border border-[#E5E5E5] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5] bg-[#F7F7F7]/50">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#F97316] block">
              Submit Assignment
            </span>
            <h3 className="text-sm font-black text-[#171717]">{assignment.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#737373] hover:text-[#171717] p-1.5 rounded-lg hover:bg-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-orange-50/50 border border-orange-200/60 rounded-xl p-3 text-xs space-y-1">
            <div className="flex justify-between font-bold text-[#171717]">
              <span>Max Points: {assignment.maxMarks}</span>
              <span className="text-[#F97316]">
                Due: {new Date(assignment.dueDate).toLocaleDateString()} {new Date(assignment.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-[11px] text-[#737373] line-clamp-2">{assignment.description}</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Drag & Drop File Zone */}
          <label className="border-2 border-dashed border-[#E5E5E5] hover:border-[#F97316] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-[#F7F7F7]/30 hover:bg-orange-50/10 block text-center">
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
                <span className="text-[10px] text-[#737373]">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
              </div>
            ) : (
              <>
                <UploadCloud className="w-8 h-8 text-[#737373] opacity-60" />
                <span className="text-xs font-bold text-[#171717]">Click to choose file or drag & drop</span>
                <span className="text-[10px] text-[#737373]">PDF, DOCX, ZIP, or Code up to 50MB</span>
              </>
            )}
          </label>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E5E5]">
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
              {isSubmitting ? 'Uploading & Submitting...' : 'Turn In Solution'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
