import React, { useState, useEffect } from 'react';
import { 
  useFacultyClassroomPosts, 
  useStudentClassroomPosts, 
  useCreatePost, 
  useChatHistory,
  useClassroomMembers 
} from '../hooks/useClassrooms';
import { wsManager } from '../../../lib/websocket';
import { AssignmentList } from '../../assignments/components/AssignmentList';
import { CreateAssignmentModal } from '../../assignments/components/CreateAssignmentModal';
import { ClassFilesBrowser } from '../../learning/components/ClassFilesBrowser';
import { UploadMaterialModal } from '../../learning/components/UploadMaterialModal';
import type { ClassroomPost, PostType } from '../types';
import { 
  MessageSquare, 
  FileText, 
  Folder, 
  Users, 
  Send, 
  Plus, 
  Sparkles, 
  Megaphone, 
  Hash, 
  ChevronRight,
  UserCheck,
  Layers
} from 'lucide-react';

export interface ClassroomHubClassItem {
  id: number;
  name: string;
  courseTitle?: string;
  sectionCode?: string;
  facultyName?: string;
  room?: string;
}

interface ClassroomHubProps {
  role: 'student' | 'faculty';
  classrooms: ClassroomHubClassItem[];
  activeClassroomId: number;
  onSelectClassroom: (id: number) => void;
  currentUser: { id: number; name: string; email?: string };
}

type WorkspaceTab = 'stream' | 'assignments' | 'files' | 'roster';

export const ClassroomHub: React.FC<ClassroomHubProps> = ({
  role,
  classrooms,
  activeClassroomId,
  onSelectClassroom,
  currentUser,
}) => {
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>('stream');

  // Modals state
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [showUploadMaterial, setShowUploadMaterial] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);

  // New post form state
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postType, setPostType] = useState<PostType>('ANNOUNCEMENT');

  // Chat input
  const [chatMessage, setChatMessage] = useState('');
  const [localChat, setLocalChat] = useState<Array<{ id: number; sender: string; text: string; time: string; isSelf: boolean }>>([]);

  const activeClass = classrooms.find(c => c.id === activeClassroomId) || classrooms[0];

  // Queries for active class
  const { data: facultyPosts = [] } = useFacultyClassroomPosts(activeClass?.id || 0);
  const { data: studentPosts = [] } = useStudentClassroomPosts(activeClass?.id || 0);
  const posts: ClassroomPost[] = role === 'faculty' ? facultyPosts : studentPosts;

  const createPostMutation = useCreatePost(activeClass?.id || 0);
  const { data: remoteChat = [] } = useChatHistory(activeClass?.id || 0);
  const { data: rosterMembers = [], isLoading: isLoadingRoster } = useClassroomMembers(activeClass?.id || 0);

  // Handle post submit
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim() || !activeClass) return;
    await createPostMutation.mutateAsync({
      type: postType,
      title: postTitle,
      content: postContent,
    });
    setPostTitle('');
    setPostContent('');
    setShowCreatePost(false);
  };

  useEffect(() => {
    if (!activeClass?.id) return;
    let isCancelled = false;
    let unsubscribeFn: (() => void) | null = null;

    // Clear previous real-time buffer on active class change
    setLocalChat([]);

    wsManager
      .subscribeToClassroom(activeClass.id, (msg) => {
        if (isCancelled) return;
        setLocalChat((prev) => {
          // Avoid appending duplicate websocket events by message id
          if (msg.id && prev.some((m) => m.id === msg.id)) {
            return prev;
          }
          return [
            ...prev,
            {
              id: msg.id || Date.now(),
              sender: msg.senderName || 'Peer',
              text: msg.content,
              time: msg.createdAt
                ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isSelf: msg.senderId === currentUser.id,
            },
          ];
        });
      })
      .then((unsub) => {
        if (isCancelled) {
          unsub();
        } else {
          unsubscribeFn = unsub;
        }
      })
      .catch((err) => {
        console.warn('WebSocket subscription failed:', err);
      });

    return () => {
      isCancelled = true;
      if (unsubscribeFn) {
        unsubscribeFn();
      }
    };
  }, [activeClass?.id, currentUser.id]);

  // Handle chat send
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !activeClass) return;

    const messageText = chatMessage.trim();
    setChatMessage('');

    wsManager.sendGroupMessage(activeClass.id, messageText).catch((err) => {
      console.warn('Failed to send message over websocket:', err);
    });
  };

  // Combine historical REST messages and real-time WebSocket messages without duplicate IDs
  const allChat = React.useMemo(() => {
    const seenIds = new Set<number>();
    const list: Array<{ id: number; sender: string; text: string; time: string; isSelf: boolean }> = [];

    // 1. Add historical chat from REST API
    for (const m of remoteChat) {
      if (m.id) {
        if (seenIds.has(m.id)) continue;
        seenIds.add(m.id);
      }
      list.push({
        id: m.id,
        sender: m.senderName,
        text: m.content || m.messageContent || '',
        time: (m.createdAt || m.timestamp)
          ? new Date(m.createdAt || m.timestamp!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : '',
        isSelf: m.senderId === currentUser.id,
      });
    }

    // 2. Add real-time chat from WebSocket (deduplicating against already seen IDs)
    for (const m of localChat) {
      if (m.id) {
        if (seenIds.has(m.id)) continue;
        seenIds.add(m.id);
      }
      list.push(m);
    }

    return list;
  }, [remoteChat, localChat, currentUser.id]);

  if (!activeClass) {
    return (
      <div className="bg-white border border-[#E5E5E5] rounded-2xl p-16 text-center space-y-3">
        <Layers className="w-12 h-12 text-[#737373] mx-auto opacity-40" />
        <h3 className="font-bold text-base text-[#171717]">No Classrooms Assigned</h3>
        <p className="text-xs text-[#737373] max-w-sm mx-auto">
          You are currently not enrolled in any active class sections.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden shadow-xs flex flex-col md:flex-row min-h-[720px] animate-in fade-in duration-200">
      {/* Left Sidebar: Class Channels List */}
      <div className="w-full md:w-72 bg-[#F7F7F7]/60 border-r border-[#E5E5E5] flex flex-col shrink-0">
        <div className="p-4 border-b border-[#E5E5E5]">
          <span className="text-[10px] font-extrabold uppercase text-[#737373] tracking-wider block">
            {role === 'faculty' ? 'Taught Classes' : 'Enrolled Classes'}
          </span>
          <h4 className="font-bold text-xs text-[#171717] mt-0.5">Section Workspaces</h4>
        </div>

        <div className="flex-1 p-2 space-y-1 overflow-y-auto">
          {classrooms.map((c) => {
            const isSelected = c.id === activeClass.id;
            return (
              <button
                key={c.id}
                onClick={() => onSelectClassroom(c.id)}
                className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between group ${
                  isSelected
                    ? 'bg-white border border-[#E5E5E5] shadow-xs text-[#F97316]'
                    : 'hover:bg-white/80 text-[#525252]'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <Hash className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#F97316]' : 'text-[#737373]'}`} />
                    <span className="font-bold text-xs truncate">{c.name}</span>
                  </div>
                  <p className="text-[10px] text-[#737373] truncate pl-5 mt-0.5">
                    {c.courseTitle || c.facultyName || 'Academic Section'}
                  </p>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${isSelected ? 'text-[#F97316] translate-x-0.5' : 'text-transparent group-hover:text-[#737373]'}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Classroom Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Workspace Top Header */}
        <div className="px-6 py-4 border-b border-[#E5E5E5] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-[#171717]">{activeClass.name}</span>
              {activeClass.sectionCode && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-[#F97316] border border-orange-200">
                  {activeClass.sectionCode}
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#737373] mt-0.5">
              {activeClass.courseTitle ? `${activeClass.courseTitle} • ` : ''}
              {activeClass.facultyName ? `Instructor: ${activeClass.facultyName}` : 'Section Workspace'}
            </p>
          </div>

          {/* Sub Tabs: Stream, Assignments, Files & Folders, Roster */}
          <div className="flex items-center gap-1 bg-[#F7F7F7] p-1 rounded-xl border border-[#E5E5E5] self-start sm:self-center">
            {[
              { id: 'stream', label: 'Stream & Chat', icon: MessageSquare },
              { id: 'assignments', label: 'Assignments', icon: FileText },
              { id: 'files', label: 'Files & Folders', icon: Folder },
              { id: 'roster', label: 'Roster', icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = workspaceTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setWorkspaceTab(tab.id as WorkspaceTab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#F97316] shadow-xs'
                      : 'text-[#737373] hover:text-[#171717]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab 1: Stream & Chat */}
        {workspaceTab === 'stream' && (
          <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
            {/* Announcements Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-[#F97316]" />
                  <h3 className="font-bold text-xs text-[#171717] uppercase tracking-wider">Class Announcements</h3>
                </div>

                {role === 'faculty' && (
                  <button
                    onClick={() => setShowCreatePost(!showCreatePost)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-[#F97316] text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Announcement</span>
                  </button>
                )}
              </div>

              {/* Faculty Post Creation Box */}
              {showCreatePost && role === 'faculty' && (
                <form onSubmit={handleCreatePost} className="p-4 border border-orange-200 bg-orange-50/20 rounded-2xl space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#171717]">Publish Class Announcement</span>
                    <select
                      value={postType}
                      onChange={(e) => setPostType(e.target.value as any)}
                      className="text-xs border border-[#E5E5E5] rounded-lg px-2 py-1 bg-white"
                    >
                      <option value="ANNOUNCEMENT">Announcement</option>
                      <option value="MATERIAL">Material</option>
                      <option value="QUESTION">Question</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    required
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="Announcement Title"
                    className="w-full border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs bg-white focus:outline-hidden focus:border-[#F97316]"
                  />
                  <textarea
                    rows={3}
                    required
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Type details, guidelines, or notice for your students..."
                    className="w-full border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs bg-white focus:outline-hidden focus:border-[#F97316]"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCreatePost(false)}
                      className="px-3 py-1 text-xs font-semibold text-[#525252] hover:bg-white rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={createPostMutation.isPending}
                      className="px-4 py-1.5 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                    >
                      {createPostMutation.isPending ? 'Posting...' : 'Post to Channel'}
                    </button>
                  </div>
                </form>
              )}

              {/* Posts Feed */}
              {posts.length === 0 ? (
                <div className="p-8 border border-[#E5E5E5] rounded-2xl text-center space-y-1 bg-[#F7F7F7]/30">
                  <Sparkles className="w-6 h-6 text-[#737373] mx-auto opacity-40" />
                  <h5 className="font-bold text-xs text-[#171717]">No Announcements Yet</h5>
                  <p className="text-[11px] text-[#737373]">Recent broadcasts and updates will appear here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {posts.map((post) => (
                    <div key={post.id} className="border border-[#E5E5E5] rounded-2xl p-4 shadow-xs bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#171717]">{post.title}</span>
                        <span className="text-[10px] font-bold text-[#F97316] bg-orange-50 px-2 py-0.5 rounded-full">
                          {post.type}
                        </span>
                      </div>
                      <p className="text-xs text-[#525252] leading-relaxed">{post.content}</p>
                      <div className="text-[10px] text-[#737373] pt-2 border-t border-[#F7F7F7] flex items-center justify-between">
                        <span>Posted by {post.facultyName || activeClass.facultyName || 'Instructor'}</span>
                        <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Active Term'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Live Chat Section */}
            <div className="border-t border-[#E5E5E5] pt-6 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4 text-[#F97316]" />
                <h3 className="font-bold text-xs text-[#171717] uppercase tracking-wider">Channel Discussion</h3>
              </div>

              <div className="flex-1 bg-[#F7F7F7]/40 border border-[#E5E5E5] rounded-2xl p-4 flex flex-col min-h-[220px]">
                <div className="flex-1 overflow-y-auto space-y-3 mb-3">
                  {allChat.length === 0 ? (
                    <div className="text-center py-8 text-xs text-[#737373]">
                      Start the conversation in #{activeClass.name}!
                    </div>
                  ) : (
                    allChat.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col max-w-[80%] ${msg.isSelf ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                      >
                        <span className="text-[10px] font-bold text-[#737373] mb-0.5">
                          {msg.isSelf ? 'You' : msg.sender} • {msg.time}
                        </span>
                        <div
                          className={`px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                            msg.isSelf
                              ? 'bg-[#F97316] text-white rounded-tr-xs'
                              : 'bg-white border border-[#E5E5E5] text-[#171717] rounded-tl-xs shadow-xs'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Chat input box */}
                <form onSubmit={handleSendChat} className="flex gap-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder={`Message #${activeClass.name}...`}
                    className="flex-1 border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs bg-white focus:outline-hidden focus:border-[#F97316]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Assignments */}
        {workspaceTab === 'assignments' && (
          <div className="flex-1 p-6 overflow-y-auto">
            <AssignmentList
              classroomId={activeClass.id}
              role={role}
              onOpenCreate={() => setShowCreateAssignment(true)}
            />
          </div>
        )}

        {/* Tab 3: Files & Folders */}
        {workspaceTab === 'files' && (
          <div className="flex-1 p-6 overflow-y-auto">
            <ClassFilesBrowser
              classroomId={activeClass.id}
              role={role}
              onOpenUpload={() => setShowUploadMaterial(true)}
            />
          </div>
        )}

        {/* Tab 4: Roster */}
        {workspaceTab === 'roster' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#171717]">Class Roster & Members</h3>
                <p className="text-xs text-[#737373]">Students enrolled and active instructors in this class</p>
              </div>
              <span className="text-xs font-bold text-[#F97316] bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">
                {rosterMembers.length} Enrolled Students
              </span>
            </div>

            {/* Instructor Card */}
            <div className="bg-[#F7F7F7]/60 border border-[#E5E5E5] rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center font-bold text-[#F97316] text-xs">
                FAC
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#F97316] block">
                  Lead Instructor
                </span>
                <h4 className="font-bold text-xs text-[#171717]">{activeClass.facultyName || 'Course Faculty'}</h4>
                <p className="text-[11px] text-[#737373]">Head of Instruction & Course Content</p>
              </div>
            </div>

            {/* Student Members List */}
            {isLoadingRoster ? (
              <div className="text-center py-12 text-xs text-[#737373]">
                Loading class roster...
              </div>
            ) : rosterMembers.length === 0 ? (
              <div className="border border-[#E5E5E5] rounded-2xl p-10 text-center space-y-2 bg-white">
                <Users className="w-8 h-8 text-[#737373] mx-auto opacity-40" />
                <h5 className="font-bold text-xs text-[#171717]">No Students Registered in Section</h5>
                <p className="text-[11px] text-[#737373]">Enrolled students synced via ClassroomMembershipController will be displayed here.</p>
              </div>
            ) : (
              <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F7F7] border-b border-[#E5E5E5] font-bold text-[#737373]">
                    <tr>
                      <th className="p-3.5">Student Name</th>
                      <th className="p-3.5">Enrollment #</th>
                      <th className="p-3.5">Institutional Email</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E5]">
                    {rosterMembers.map((m) => (
                      <tr key={m.membershipId} className="hover:bg-[#F7F7F7]/50">
                        <td className="p-3.5 font-bold text-[#171717] flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-emerald-600" />
                          <span>{m.studentName}</span>
                        </td>
                        <td className="p-3.5 text-[#525252]">{m.enrollmentNumber || 'ENR-2026'}</td>
                        <td className="p-3.5 text-[#737373]">{m.email}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                            {m.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateAssignment && (
        <CreateAssignmentModal
          isOpen={showCreateAssignment}
          onClose={() => setShowCreateAssignment(false)}
          classroomId={activeClass.id}
        />
      )}

      {showUploadMaterial && (
        <UploadMaterialModal
          isOpen={showUploadMaterial}
          onClose={() => setShowUploadMaterial(false)}
          classroomId={activeClass.id}
        />
      )}
    </div>
  );
};
