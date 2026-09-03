import React, { useState } from 'react';
import { useUploadFile, useCreateMaterial } from '../hooks/useLearningMaterials';
import { X, UploadCloud, FileCheck, Loader2, AlertCircle } from 'lucide-react';

interface UploadMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  classroomId: number;
}

export const UploadMaterialModal: React.FC<UploadMaterialModalProps> = ({
  isOpen,
  onClose,
  classroomId,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Lecture Notes' | 'Syllabus & Docs' | 'Lab Manuals' | 'Reference Books' | 'General'>('Lecture Notes');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadFileMutation = useUploadFile();
  const createMaterialMutation = useCreateMaterial(classroomId);

  if (!isOpen) return null;

  const isSubmitting = uploadFileMutation.isPending || createMaterialMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required');
      return;
    }

    try {
      setError(null);
      let fileId: number | undefined = undefined;

      // 1. Upload file if selected
      if (selectedFile) {
        const stored = await uploadFileMutation.mutateAsync(selectedFile);
        fileId = stored.id;
      }

      // 2. Create learning material
      // Prefix category in description or title so it maps nicely
      await createMaterialMutation.mutateAsync({
        title: `[${category}] ${title}`,
        description,
        fileId,
      });

      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to upload material');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg border border-[#E5E5E5] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5] bg-[#F7F7F7]/50">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#F97316] block">
              Class Library
            </span>
            <h3 className="text-sm font-black text-[#171717]">Upload Learning Material</h3>
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
              Folder / Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs bg-white focus:outline-hidden focus:border-[#F97316]"
            >
              <option value="Lecture Notes">📁 Lecture Notes & Slides</option>
              <option value="Syllabus & Docs">📁 Syllabus & Course Policies</option>
              <option value="Lab Manuals">📁 Lab Sheets & Exercises</option>
              <option value="Reference Books">📁 Reference Books & Papers</option>
              <option value="General">📁 General Materials</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">
              Material Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chapter 3: Tree Traversals & AVL Trees.pdf"
              className="w-full border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-[#F97316]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">
              Description / Notes *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of what this document covers..."
              className="w-full border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-[#F97316]"
            />
          </div>

          {/* File Upload Zone */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#737373] mb-1">
              Upload Document / File Attachment
            </label>
            <label className="border-2 border-dashed border-[#E5E5E5] hover:border-[#F97316] rounded-2xl p-5 flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-[#F7F7F7]/30 hover:bg-orange-50/10 transition-colors">
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
              />
              {selectedFile ? (
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                  <FileCheck className="w-5 h-5" />
                  <span className="text-[#171717]">{selectedFile.name}</span>
                  <span className="text-[10px] text-[#737373]">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-7 h-7 text-[#737373] opacity-60" />
                  <span className="text-xs font-bold text-[#171717]">Select document from computer</span>
                  <span className="text-[10px] text-[#737373]">PDF, PPTX, DOCX, ZIP, or Code</span>
                </>
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
              {isSubmitting ? 'Uploading to Class...' : 'Save & Share File'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
