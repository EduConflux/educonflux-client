import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  className = 'py-12',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 text-center ${className}`}>
      <Loader2 className="w-6 h-6 animate-spin text-[#F97316]" />
      <span className="text-xs font-semibold text-[#737373]">{message}</span>
    </div>
  );
};
