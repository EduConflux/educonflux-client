import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode | React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  action,
  className = 'py-12',
}) => {
  const renderIcon = () => {
    if (!icon) return <Inbox className="w-6 h-6" />;
    if (React.isValidElement(icon)) return icon;
    if (typeof icon === 'function' || typeof icon === 'object') {
      const IconComponent = icon as React.ComponentType<{ className?: string }>;
      return <IconComponent className="w-6 h-6" />;
    }
    return <Inbox className="w-6 h-6" />;
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 text-center max-w-sm mx-auto ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-[#737373] mb-1">
        {renderIcon()}
      </div>
      <h4 className="text-sm font-bold text-[#171717]">{title}</h4>
      <p className="text-xs text-[#737373] leading-relaxed">{description}</p>
      {action ? (
        <div className="mt-2">{action}</div>
      ) : actionLabel && onAction ? (
        <Button
          variant="primary"
          size="sm"
          onClick={onAction}
          className="mt-2 text-xs"
        >
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
};
