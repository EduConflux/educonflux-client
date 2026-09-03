import React, { useState } from 'react';
import { useUploadFile } from '../../learning/hooks/useLearningMaterials';
import { useCreateAssignment } from '../hooks/useAssignments';
import { X, UploadCloud, FileCheck, Loader2, AlertCircle } from 'lucide-react';

interface CreateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  classroomId: number;
}

export const CreateAssignmentModal: React.FC<CreateAssignmentModalProps> = ({
  isOpen,
  onClose,
  classroomId,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxMarks, setMaxMarks] = useState<number>(100);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadFileMutation = useUploadFile();
  const createAssignmentMutation = useCreateAssignment(classroomId);

  if (!isOpen) return null;

  const isSubmitting = uploadFileMutation.isPending || createAssignmentMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !dueDate) {
      setError('Please fill out all required fields');
      return;
    }

    try {
      setError(null);
      let fileId: number | undefined = undefined;

      // 1. If file attached, upload first
      if (attachmentFile) {
        const stored = await uploadFileMutation.mutateAsync(attachmentFile);
        fileId = stored.id;
      }

      // 2. Create assignment
      await createAssignmentMutation.mutateAsync({
        title,
        description,
        dueDate: new Date(dueDate).toISOString(),
        maxMarks: Number(maxMarks) || 100,
        fileId,
      });

      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to create assignment');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg border border-[#E5E5E5] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5] bg-[#F7F7F7]/50">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#F97316] block">
              Faculty Portal
            </span>
            <h3 className="text-sm font-black text-[#171717]">Create New Assignment</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#737373] hover:text-[#171717] p-1.5 rounded-lg hover:bg-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">
              Assignment Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lab 4: Binary Search Trees Implementation"
              className="w-full border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-[#F97316]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">
              Instructions & Description *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail expectations, test cases, and guidelines..."
              className="w-full border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-[#F97316]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">
                Due Date & Time *
              </label>
              <input
                type="datetime-local"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-[#F97316]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">
                Max Marks *
              </label>
              <input
                type="number"
                min={1}
                max={1000}
                required
                value={maxMarks}
                onChange={(e) => setMaxMarks(Number(e.target.value))}
                className="w-full border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-[#F97316]"
              />
            </div>
          </div>

          {/* Optional Attachment Upload */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">
              Brief / Reference File Attachment (Optional)
            </label>
            <label className="border border-dashed border-[#E5E5E5] hover:border-[#F97316] rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer bg-[#F7F7F7]/40 hover:bg-orange-50/20 transition-colors">
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setAttachmentFile(e.target.files[0]);
                  }
                }}
              />
              {attachmentFile ? (
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                  <FileCheck className="w-4 h-4" />
                  <span>{attachmentFile.name}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-[#737373]">
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload problem statement / starter code</span>
                </div>
              )}
            </label>
          </div>

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
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isSubmitting ? 'Creating Assignment...' : 'Publish Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
