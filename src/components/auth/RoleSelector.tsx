import React from 'react';
import type { UserRole, RoleConfig } from '../../types/auth';
import { Shield, GraduationCap, BookOpen, Users, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

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
    <div className="space-y-2.5">
      <label className="block text-xs font-semibold text-[#171717] tracking-tight">
        Select Workspace Role
      </label>
      
      <div className="grid grid-cols-2 gap-2.5">
        {ROLES_DATA.map((role) => {
          const isSelected = selectedRole === role.id;
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onSelectRole(role.id)}
              className={cn(
                "group relative p-3 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between focus:outline-hidden focus:ring-2 focus:ring-[#F97316]",
                isSelected
                  ? "border-[#F97316] bg-orange-50/40 ring-1 ring-[#F97316]/30 shadow-xs"
                  : "border-[#E5E5E5] bg-white hover:border-[#171717]/30 hover:bg-[#F7F7F7]"
              )}
            >
              {/* Checkmark Indicator */}
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-[#F97316] text-white flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}

              <div className="flex items-center gap-2 mb-1">
                <div className={cn("p-1.5 rounded-lg transition-colors", isSelected ? "bg-white" : "bg-[#F7F7F7]")}>
                  {getRoleIcon(role.iconName, isSelected)}
                </div>
                <div>
                  <span className={cn("font-bold text-xs block", isSelected ? "text-[#171717]" : "text-[#525252]")}>
                    {role.title}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-[#737373] leading-tight font-medium">
                {role.subtitle}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
