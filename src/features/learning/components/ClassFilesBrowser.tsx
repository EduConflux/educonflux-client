import React, { useState } from 'react';
import { useClassroomMaterials, useDeleteMaterial } from '../hooks/useLearningMaterials';
import { learningApi } from '../api/learningApi';
import type { LearningMaterial } from '../types';
import { 
  Folder, 
  FileText, 
  Download, 
  Trash2, 
  Plus, 
  Loader2, 
  BookOpen, 
  FileCode, 
  FileSpreadsheet, 
  FileCheck 
} from 'lucide-react';

interface ClassFilesBrowserProps {
  classroomId: number;
  role: 'faculty' | 'student';
  onOpenUpload?: () => void;
}

type FolderCategory = 'All' | 'Lecture Notes' | 'Syllabus & Docs' | 'Lab Manuals' | 'Reference Books' | 'General';

export const ClassFilesBrowser: React.FC<ClassFilesBrowserProps> = ({
  classroomId,
  role,
  onOpenUpload,
}) => {
  const { data: materials = [], isLoading } = useClassroomMaterials(classroomId, role);
  const deleteMutation = useDeleteMaterial(classroomId);

  const [activeFolder, setActiveFolder] = useState<FolderCategory>('All');

  // Parse folder category from title if it was saved like "[Lecture Notes] Chapter 1"
  const parseCategory = (mat: LearningMaterial): FolderCategory => {
    const title = mat.title || '';
    if (title.includes('[Lecture Notes]')) return 'Lecture Notes';
    if (title.includes('[Syllabus & Docs]')) return 'Syllabus & Docs';
    if (title.includes('[Lab Manuals]')) return 'Lab Manuals';
    if (title.includes('[Reference Books]')) return 'Reference Books';
    if (title.includes('[General]')) return 'General';
    return 'Lecture Notes'; // Default
  };

  const cleanTitle = (mat: LearningMaterial): string => {
    return mat.title.replace(/\[.*?\]\s*/g, '');
  };

  const filteredMaterials = materials.filter((m) => {
    if (activeFolder === 'All') return true;
    return parseCategory(m) === activeFolder;
  });

  const getFolderCount = (cat: FolderCategory) => {
    if (cat === 'All') return materials.length;
    return materials.filter(m => parseCategory(m) === cat).length;
  };

  const getFileIcon = (fileName?: string) => {
    if (!fileName) return <FileText className="w-5 h-5 text-[#F97316]" />;
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FileText className="w-5 h-5 text-red-500" />;
    if (ext === 'doc' || ext === 'docx') return <FileText className="w-5 h-5 text-blue-500" />;
    if (ext === 'xls' || ext === 'xlsx' || ext === 'csv') return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
    if (ext === 'zip' || ext === 'rar') return <FileCheck className="w-5 h-5 text-amber-500" />;
    if (ext === 'java' || ext === 'py' || ext === 'ts' || ext === 'js' || ext === 'cpp') return <FileCode className="w-5 h-5 text-purple-500" />;
    return <FileText className="w-5 h-5 text-[#F97316]" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 gap-2 text-xs text-[#737373]">
        <Loader2 className="w-5 h-5 animate-spin text-[#F97316]" />
        <span>Loading class files and folders...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#171717]">Class Files & Folders</h3>
          <p className="text-xs text-[#737373]">Course lecture notes, syllabus, lab worksheets, and documents</p>
        </div>

        {role === 'faculty' && onOpenUpload && (
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        )}
      </div>

      {/* Visual Folder Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { id: 'All', label: 'All Files', icon: BookOpen, color: 'text-orange-600', bg: 'bg-orange-50' },
          { id: 'Lecture Notes', label: 'Lecture Notes', icon: Folder, color: 'text-blue-600', bg: 'bg-blue-50' },
          { id: 'Syllabus & Docs', label: 'Syllabus & Docs', icon: Folder, color: 'text-purple-600', bg: 'bg-purple-50' },
          { id: 'Lab Manuals', label: 'Lab Manuals', icon: Folder, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { id: 'Reference Books', label: 'Reference Books', icon: Folder, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((f) => {
          const Icon = f.icon;
          const isSelected = activeFolder === f.id;
          const count = getFolderCount(f.id as FolderCategory);

          return (
            <div
              key={f.id}
              onClick={() => setActiveFolder(f.id as FolderCategory)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none space-y-1 group ${
                isSelected 
                  ? 'border-[#F97316] bg-orange-50/40 shadow-xs ring-1 ring-[#F97316]' 
                  : 'border-[#E5E5E5] bg-white hover:border-[#F97316]/50 hover:bg-[#F7F7F7]/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-8 h-8 rounded-xl ${f.bg} flex items-center justify-center ${f.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#F7F7F7] text-[#525252]">
                  {count}
                </span>
              </div>
              <h4 className="font-bold text-xs text-[#171717] group-hover:text-[#F97316] transition-colors truncate">
                {f.label}
              </h4>
              <span className="text-[10px] text-[#737373] block">
                {count === 1 ? '1 file' : `${count} files`}
              </span>
            </div>
          );
        })}
      </div>

      {/* Files List Table */}
      <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#E5E5E5] flex items-center justify-between bg-[#F7F7F7]/40">
          <span className="text-xs font-bold text-[#171717]">
            {activeFolder === 'All' ? 'All Shared Files' : `${activeFolder} Files`} ({filteredMaterials.length})
          </span>
          <span className="text-[11px] text-[#737373]">Shared by course faculty</span>
        </div>

        {filteredMaterials.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Folder className="w-10 h-10 text-[#737373] mx-auto opacity-40" />
            <h4 className="font-bold text-sm text-[#171717]">Folder is Empty</h4>
            <p className="text-xs text-[#737373]">
              {role === 'faculty' 
                ? 'Click "Upload Document" above to share lecture slides, code files, or guides.'
                : 'No files have been added to this folder yet.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#E5E5E5]">
            {filteredMaterials.map((mat) => {
              const cat = parseCategory(mat);
              const title = cleanTitle(mat);

              return (
                <div
                  key={mat.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F7F7F7]/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] flex items-center justify-center shrink-0 mt-0.5">
                      {getFileIcon(mat.fileName)}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#171717]">{title}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F7F7F7] text-[#737373] border border-[#E5E5E5]">
                          {cat}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#737373] line-clamp-1">{mat.description}</p>
                      <span className="text-[10px] text-[#737373] block">
                        Posted by {mat.facultyName || 'Instructor'} • {mat.createdAt ? new Date(mat.createdAt).toLocaleDateString() : 'Active Term'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {mat.fileId ? (
                      <a
                        href={learningApi.getFileDownloadUrl(mat.fileId)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-[#F7F7F7] hover:bg-orange-50 hover:text-[#F97316] text-[#171717] text-xs font-bold rounded-xl border border-[#E5E5E5] flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </a>
                    ) : (
                      <span className="text-[10px] text-[#737373] italic">Text Note</span>
                    )}

                    {role === 'faculty' && (
                      <button
                        onClick={() => deleteMutation.mutate(mat.id)}
                        disabled={deleteMutation.isPending}
                        className="p-1.5 text-[#737373] hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        title="Delete material"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
