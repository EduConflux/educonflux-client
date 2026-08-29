import React from 'react';

export interface MetricCardProps {
  title: string;
  value: string;
  sub: string;
  color?: string;
  icon: React.ReactNode;
  bg?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  sub,
  color = 'text-[#F97316]',
  icon,
  bg = 'bg-orange-50',
}) => {
  return (
    <div className="bg-white border border-[#E5E5E5] p-5 rounded-2xl shadow-xs space-y-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold text-[#737373]">{title}</span>
        <div className={`p-2 rounded-xl ${bg}`}>{icon}</div>
      </div>
      <div className="space-y-0.5">
        <span className="text-2xl font-black text-[#171717]">{value}</span>
        <span className={`text-[10px] font-extrabold block ${color}`}>{sub}</span>
      </div>
    </div>
  );
};
