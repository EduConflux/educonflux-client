import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'orange' | 'neutral' | 'dark' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className,
}) => {
  const variants = {
    orange: 'bg-[#FFEDD5] text-[#EA580C] border border-[#F97316]/20 font-semibold',
    neutral: 'bg-[#F7F7F7] text-[#525252] border border-[#E5E5E5]',
    dark: 'bg-[#171717] text-white',
    outline: 'border border-[#E5E5E5] text-[#525252] bg-white',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 rounded-md',
    md: 'text-xs px-2.5 py-1 rounded-full',
  };

  return (
    <span className={cn("inline-flex items-center gap-1 font-medium tracking-tight select-none", variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
};
