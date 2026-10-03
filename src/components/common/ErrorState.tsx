import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error loading this data. Please try again.',
  onRetry,
  className = 'py-12',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 text-center max-w-sm mx-auto ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 mb-1">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-bold text-[#171717]">{title}</h4>
      <p className="text-xs text-[#737373] leading-relaxed">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="mt-2 text-xs flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </Button>
      )}
    </div>
  );
};
