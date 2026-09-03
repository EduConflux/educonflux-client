import React from 'react';
import type { UserRole, RoleConfig } from '../types';
import { Shield, GraduationCap, BookOpen, Users } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface RoleSelectorProps {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

export const ROLES_DATA: RoleConfig[] = [
  {
    id: "ADMIN",
    title: "Admin",
    subtitle: "Manage your institution",
    description: "Full institutional administration, users & global policy control.",
    iconName: "Shield",
    badge: "Operations",
  },
  {
    id: "TEACHER",
    title: "Teacher",
    subtitle: "Manage classes and learning",
    description: "Course delivery, attendance tracking, grading & class channels.",
    iconName: "GraduationCap",
    badge: "Faculty",
  },
  {
    id: "STUDENT",
    title: "Student",
    subtitle: "Access your academic workspace",
    description: "Class assignments, timetables, resource hub & peer messaging.",
    iconName: "BookOpen",
    badge: "Academic",
  },
  {
    id: "PARENT",
    title: "Parent",
    subtitle: "Monitor your child's progress",
    description: "Attendance reports, grade tracking & direct teacher communication.",
    iconName: "Users",
    badge: "Guardian",
  },
];

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onSelectRole,
}) => {
  const getRoleIcon = (iconName: string, isSelected: boolean) => {
    const iconClass = cn("w-5 h-5 shrink-0 transition-colors", isSelected ? "text-[#F97316]" : "text-[#737373]");
    switch (iconName) {
      case "Shield":
        return <Shield className={iconClass} />;
      case "GraduationCap":
        return <GraduationCap className={iconClass} />;
      case "BookOpen":
        return <BookOpen className={iconClass} />;
      case "Users":
        return <Users className={iconClass} />;
      default:
        return <BookOpen className={iconClass} />;
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-semibold text-[#171717] tracking-tight">
        Select Workspace Role
      </label>
      
      <div className="grid grid-cols-4 gap-1.5">
        {ROLES_DATA.map((role) => {
          const isSelected = selectedRole === role.id;
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onSelectRole(role.id)}
              className={cn(
                "py-2 px-1 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer focus:outline-hidden",
                isSelected
                  ? "border-[#F97316] bg-orange-50/70 text-[#F97316] font-bold shadow-xs ring-1 ring-[#F97316]/30"
                  : "border-[#E5E5E5] bg-white text-[#525252] hover:bg-[#F7F7F7] hover:border-[#171717]/20"
              )}
            >
              {getRoleIcon(role.iconName, isSelected)}
              <span className="text-[11px] leading-none">{role.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
