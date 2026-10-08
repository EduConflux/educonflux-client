import React, { useState, useEffect } from 'react';
import { learningApi } from '../../learning/api/learningApi';
import {
  FileText,
  FileCode,
  FileArchive,
  Image as ImageIcon,
  File,
  Download,
  Loader2,
  ExternalLink,
} from 'lucide-react';

interface FileThumbnailProps {
  fileId?: number;
  fileName?: string;
  fileContentType?: string;
  fileSize?: number;
  fileUrl?: string;
  className?: string;
  showDownload?: boolean;
}

export const FileThumbnail: React.FC<FileThumbnailProps> = ({
  fileId,
  fileName = 'file',
  fileContentType,
  fileSize,
  className = '',
  showDownload = true,
}) => {
  const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const extension = (fileName.split('.').pop() || '').toLowerCase();

  const isImage =
    (fileContentType && fileContentType.startsWith('image/')) ||
    ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp'].includes(extension);

  const isPdf =
    fileContentType === 'application/pdf' || extension === 'pdf';

  const isCode =
    ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'cs', 'html', 'css', 'json', 'sql', 'go', 'rs', 'php', 'rb'].includes(extension);

  const isArchive =
    ['zip', 'rar', '7z', 'tar', 'gz'].includes(extension);

  useEffect(() => {
    let active = true;
    let createdUrl: string | null = null;

    if (isImage && fileId && !imageError) {
      setLoadingImage(true);
      // Fetch image blob via authenticated apiClient download
      const fetchImage = async () => {
        try {
          // Use fetch with authorization header to get the blob
          const token = localStorage.getItem('token');
          const headers: HeadersInit = {};
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }

          const response = await fetch(`/api/files/${fileId}/download`, {
            method: 'GET',
            headers,
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          const blob = await response.blob();
          if (active) {
            createdUrl = URL.createObjectURL(blob);
            setImageBlobUrl(createdUrl);
            setLoadingImage(false);
          }
        } catch (err) {
          if (active) {
            console.warn('Failed to load image thumbnail:', err);
            setImageError(true);
            setLoadingImage(false);
          }
        }
      };

      fetchImage();
    }

    return () => {
      active = false;
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [fileId, isImage, imageError]);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!fileId) return;

    try {
      setIsDownloading(true);
      await learningApi.downloadFile(fileId, fileName);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes <= 0) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      className={`group relative flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-white border border-[#E5E5E5] hover:border-[#F97316]/60 rounded-2xl shadow-xs transition-all ${className}`}
    >
      {/* Thumbnail Box */}
      <div className="relative w-full sm:w-20 h-24 sm:h-20 shrink-0 rounded-xl overflow-hidden bg-[#F7F7F7] border border-[#E5E5E5] flex items-center justify-center">
        {isImage && !imageError ? (
          loadingImage ? (
            <div className="flex flex-col items-center justify-center gap-1 text-[10px] text-[#737373]">
              <Loader2 className="w-4 h-4 animate-spin text-[#F97316]" />
              <span>Preview...</span>
            </div>
          ) : imageBlobUrl ? (
            <img
              src={imageBlobUrl}
              alt={fileName}
              className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-200"
            />
          ) : (
            <ImageIcon className="w-8 h-8 text-[#737373] opacity-60" />
          )
        ) : isPdf ? (
          <div className="flex flex-col items-center justify-center text-red-500">
            <FileText className="w-7 h-7" />
            <span className="text-[9px] font-black tracking-wider uppercase mt-0.5 bg-red-100 text-red-700 px-1 rounded">
              PDF
            </span>
          </div>
        ) : isCode ? (
          <div className="flex flex-col items-center justify-center text-indigo-500">
            <FileCode className="w-7 h-7" />
            <span className="text-[9px] font-black tracking-wider uppercase mt-0.5 bg-indigo-100 text-indigo-700 px-1 rounded">
              {extension.toUpperCase() || 'CODE'}
            </span>
          </div>
        ) : isArchive ? (
          <div className="flex flex-col items-center justify-center text-amber-500">
            <FileArchive className="w-7 h-7" />
            <span className="text-[9px] font-black tracking-wider uppercase mt-0.5 bg-amber-100 text-amber-700 px-1 rounded">
              ZIP
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-[#525252]">
            <File className="w-7 h-7" />
            <span className="text-[9px] font-bold tracking-wider uppercase mt-0.5 bg-[#E5E5E5] text-[#525252] px-1 rounded">
              {extension.toUpperCase() || 'FILE'}
            </span>
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-1.5">
          <h5
            className="text-xs font-bold text-[#171717] truncate hover:text-[#F97316] transition-colors"
            title={fileName}
          >
            {fileName}
          </h5>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#737373]">
          {fileSize ? <span>{formatFileSize(fileSize)}</span> : null}
          {fileSize && fileContentType ? <span>•</span> : null}
          <span className="uppercase text-[10px] font-semibold text-[#525252]">
            {extension ? `.${extension}` : 'Document'}
          </span>
        </div>
      </div>

      {/* Actions */}
      {showDownload && fileId && (
        <div className="shrink-0 flex items-center gap-2 mt-2 sm:mt-0 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F7F7F7] hover:bg-orange-50 hover:text-[#F97316] text-[#171717] border border-[#E5E5E5] text-xs font-bold rounded-xl transition-all cursor-pointer shadow-2xs disabled:opacity-50"
            title="Download file"
          >
            {isDownloading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F97316]" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{isDownloading ? 'Downloading...' : 'Download'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
