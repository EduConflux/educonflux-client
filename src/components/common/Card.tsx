import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-xs ${
        hoverable ? 'hover:shadow-md transition-shadow duration-150' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
