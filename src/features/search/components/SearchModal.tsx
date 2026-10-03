import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, ArrowRight, BookOpen, Users, FileText, Layers, X } from 'lucide-react';
import { searchApi } from '../api/searchApi';
import type { SearchResult } from '../types';
import { Modal } from '../../../components/common/Modal';

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult?: (result: SearchResult) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectResult }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timeout = setTimeout(() => {
      searchApi
        .search(query)
        .then((res) => {
          setResults(Array.isArray(res) ? res : []);
        })
        .catch(() => {
          setResults([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  const getResultIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('course')) return <BookOpen className="w-4 h-4 text-blue-500" />;
    if (t.includes('user') || t.includes('student') || t.includes('faculty'))
      return <Users className="w-4 h-4 text-emerald-500" />;
    if (t.includes('material') || t.includes('assignment'))
      return <FileText className="w-4 h-4 text-purple-500" />;
    return <Layers className="w-4 h-4 text-[#F97316]" />;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg" showCloseButton={false}>
      <div className="-m-5">
        <div className="relative border-b border-[#E5E5E5] flex items-center px-4 py-3">
          <Search className="w-5 h-5 text-[#737373] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses, classrooms, faculty, students..."
            className="w-full text-sm text-[#171717] placeholder:text-[#737373] outline-hidden bg-transparent"
          />
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#F97316] shrink-0 ml-2" />
          ) : (
            query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-[#737373] hover:text-[#171717] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )
          )}
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {query.trim().length === 0 ? (
            <div className="py-8 text-center text-xs text-[#737373]">
              Type a keyword to search across the entire institution workspace.
            </div>
          ) : results.length === 0 && !isLoading ? (
            <div className="py-8 text-center text-xs text-[#737373]">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((res) => (
                <button
                  key={`${res.type}-${res.id}`}
                  type="button"
                  onClick={() => {
                    if (onSelectResult) onSelectResult(res);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 transition-colors text-left group cursor-pointer"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-neutral-100 shrink-0 mt-0.5">
                      {getResultIcon(res.type)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#171717] truncate">
                          {res.title}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-neutral-100 text-[#737373] rounded-md shrink-0">
                          {res.type}
                        </span>
                      </div>
                      {res.description && (
                        <p className="text-[11px] text-[#737373] mt-0.5 truncate">
                          {res.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-[#F97316] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 bg-neutral-50 border-t border-[#E5E5E5] flex items-center justify-between text-[11px] text-[#737373] rounded-b-2xl">
          <span>Press ESC to close</span>
          <span>Instant Institutional Search</span>
        </div>
      </div>
    </Modal>
  );
};
