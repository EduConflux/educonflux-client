import React, { useState } from 'react';
import { useStudents } from '../../directory/hooks/useDirectory';
import {
  useParentsForStudent,
  useCreateParent,
  useLinkStudent,
} from '../hooks/useParent';
import { CreateParentModal } from './CreateParentModal';
import { LinkStudentModal } from './LinkStudentModal';
import { Button } from '../../../components/common/Button';
import {
  Users,
  UserPlus,
  Link as LinkIcon,
  Search,
  Mail,
  Phone,
  Briefcase,
  Home,
  GraduationCap,
  ChevronRight,
} from 'lucide-react';
import type { ParentResponse, ParentRequest, LinkStudentRequest } from '../types';

export const ParentManagementView: React.FC = () => {
  const { data: students = [], isLoading: isLoadingStudents } = useStudents();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [preselectedStudentId, setPreselectedStudentId] = useState<number | undefined>(undefined);
  const [linkingParent, setLinkingParent] = useState<ParentResponse | null>(null);

  // Mutations
  const createParentMutation = useCreateParent();
  const linkStudentMutation = useLinkStudent();

  // If no student selected yet, default to first student once loaded
  const activeStudentId = selectedStudentId ?? (students[0]?.id || 0);
  const activeStudent = students.find((s) => s.id === activeStudentId);

  // Query parents for the active student
  const { data: linkedParents = [], isLoading: isLoadingParents } = useParentsForStudent(activeStudentId);

  // Filter students based on search
  const filteredStudents = students.filter((s) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
    const enroll = (s.enrollmentNumber || '').toLowerCase();
    const email = (s.email || '').toLowerCase();
    return fullName.includes(query) || enroll.includes(query) || email.includes(query);
  });

  const handleCreateParentSubmit = async (data: ParentRequest) => {
    await createParentMutation.mutateAsync(data);
  };

  const handleLinkStudentSubmit = async (parentId: number, data: LinkStudentRequest) => {
    await linkStudentMutation.mutateAsync({ parentId, data });
  };

  const openCreateForStudent = (studentId?: number) => {
    setPreselectedStudentId(studentId || activeStudentId);
    setShowCreateModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E5E5E5] p-5 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-orange-100 text-[#F97316] uppercase tracking-wider">
              Family & Guardian Network
            </span>
          </div>
          <h2 className="text-xl font-black text-[#171717] mt-1">Parents & Guardians</h2>
          <p className="text-xs text-[#737373] mt-0.5">
            Register parent accounts, link guardians to student scholars, and govern family access to academic portals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => openCreateForStudent()}
            className="text-xs flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Parent / Guardian</span>
          </Button>
        </div>
      </div>

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Student Scholar Directory (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#E5E5E5] rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-[#171717] uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-[#F97316]" />
                <span>Enrolled Students ({students.length})</span>
              </h3>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#737373] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search students by name, email, roll..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-[#E5E5E5] rounded-xl text-xs bg-[#F7F7F7] focus:bg-white focus:border-[#F97316] outline-hidden transition-all"
              />
            </div>

            {/* Student List */}
            {isLoadingStudents ? (
              <div className="p-8 text-center text-xs text-[#737373] animate-pulse">
                Loading students...
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#737373]">
                No matching students found.
              </div>
            ) : (
              <div className="divide-y divide-[#E5E5E5] max-h-[600px] overflow-y-auto pr-1">
                {filteredStudents.map((st) => {
                  const isSelected = st.id === activeStudentId;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSelectedStudentId(st.id)}
                      className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-orange-50/80 border border-orange-200 shadow-xs'
                          : 'hover:bg-[#F7F7F7]'
                      }`}
                    >
                      <div className="space-y-0.5 truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-[#171717]">
                            {st.firstName} {st.lastName}
                          </span>
                          {st.enrollmentNumber && (
                            <span className="font-mono text-[10px] text-[#F97316] font-bold">
                              {st.enrollmentNumber}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#737373] block truncate">
                          {st.email}
                        </span>
                        <span className="text-[10px] text-[#525252] block">
                          {st.programName || 'Program'} • {st.classSectionName || 'Section'}
                        </span>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isSelected ? 'text-[#F97316] translate-x-0.5' : 'text-[#737373]'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Linked Parents & Details (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {activeStudent ? (
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-xs space-y-5">
              {/* Active Student Header Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E5E5]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#737373]">Selected Student:</span>
                    <span className="font-mono text-xs font-bold text-[#F97316] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                      {activeStudent.enrollmentNumber || 'No Enroll #'}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-[#171717]">
                    {activeStudent.firstName} {activeStudent.lastName}
                  </h3>
                  <p className="text-xs text-[#737373]">
                    {activeStudent.email} • {activeStudent.programName || 'Degree Program'}
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => openCreateForStudent(activeStudent.id)}
                  className="text-xs flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Add Parent for this Student</span>
                </Button>
              </div>

              {/* Linked Parents List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-[#171717] uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-neutral-600" />
                    <span>Registered Guardians ({linkedParents.length})</span>
                  </h4>
                  <span className="text-[11px] text-[#737373]">
                    Authorized portal access
                  </span>
                </div>

                {isLoadingParents ? (
                  <div className="p-12 text-center text-xs text-[#737373] animate-pulse">
                    Loading guardian links...
                  </div>
                ) : linkedParents.length === 0 ? (
                  <div className="p-12 text-center border border-dashed border-[#E5E5E5] rounded-xl space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-[#F7F7F7] flex items-center justify-center text-[#737373] mx-auto">
                      <Users className="w-6 h-6 opacity-60" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#171717]">No Linked Guardians</h4>
                      <p className="text-xs text-[#737373] max-w-sm mx-auto mt-0.5">
                        This student scholar does not have any parent accounts registered yet.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openCreateForStudent(activeStudent.id)}
                      className="text-xs mt-2"
                    >
                      <UserPlus className="w-3.5 h-3.5 mr-1" />
                      Register Parent Now
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {linkedParents.map((parent) => (
                      <div
                        key={parent.id}
                        className="bg-[#F7F7F7]/60 border border-[#E5E5E5] rounded-xl p-4.5 space-y-3 hover:border-neutral-300 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-sm text-[#171717]">
                                {parent.firstName} {parent.lastName}
                              </h5>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-[#F97316]">
                                {parent.relationship || 'Guardian'}
                              </span>
                            </div>
                            <span className="text-xs text-[#737373] font-mono block">
                              {parent.email}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setLinkingParent(parent)}
                              className="text-xs flex items-center gap-1"
                              title="Link another student (e.g. sibling) to this parent"
                            >
                              <LinkIcon className="w-3 h-3" />
                              <span>Link Sibling / Student</span>
                            </Button>
                          </div>
                        </div>

                        {/* Contact & Meta Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#E5E5E5] text-xs text-[#525252]">
                          {parent.personalEmail && (
                            <div className="flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-[#737373] shrink-0" />
                              <span className="truncate">{parent.personalEmail}</span>
                            </div>
                          )}
                          {parent.phone && (
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-[#737373] shrink-0" />
                              <span className="font-mono">{parent.phone}</span>
                            </div>
                          )}
                          {parent.occupation && (
                            <div className="flex items-center gap-1.5">
                              <Briefcase className="w-3.5 h-3.5 text-[#737373] shrink-0" />
                              <span>{parent.occupation}</span>
                            </div>
                          )}
                          {parent.address && (
                            <div className="flex items-center gap-1.5 sm:col-span-2">
                              <Home className="w-3.5 h-3.5 text-[#737373] shrink-0" />
                              <span className="truncate">{parent.address}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-12 text-center space-y-2">
              <Users className="w-8 h-8 text-[#737373] mx-auto opacity-50" />
              <p className="text-xs text-[#737373]">
                Select a student from the list to view or link guardians.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal 1: Register Parent Modal */}
      <CreateParentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateParentSubmit}
        preselectedStudentId={preselectedStudentId}
      />

      {/* Modal 2: Link Additional Student Modal */}
      <LinkStudentModal
        isOpen={Boolean(linkingParent)}
        onClose={() => setLinkingParent(null)}
        onSubmit={handleLinkStudentSubmit}
        parent={linkingParent}
      />
    </div>
  );
};
export default ParentManagementView;
