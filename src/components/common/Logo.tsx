import React from 'react';
import logoImg from '../../assets/EduConflux_logo-removebg-.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
  variant?: 'dark' | 'light';
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  className = '', 
  showText = true,
  variant = 'dark'
}) => {
  const imgHeights = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const textColor = variant === 'light' ? 'text-white' : 'text-[#171717]';

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <img 
        src={logoImg} 
        alt="EduConflux Logo" 
        className={`${imgHeights[size]} w-auto object-contain transition-transform duration-200 hover:scale-105`} 
      />
      {showText && (
        <span className={`font-bold tracking-tight ${textColor} ${textSizes[size]}`}>
          Edu<span className="text-[#F97316]">Conflux</span>
        </span>
      )}
    </div>
  );
};
