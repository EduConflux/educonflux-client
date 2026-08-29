import React from 'react';
import { Hash, Users, Send } from 'lucide-react';

export interface ChannelItem {
  id: number;
  name: string;
  courseTitle: string;
  instructor: string;
  unread: number;
}

export interface ChatMessageItem {
  id: number;
  sender: string;
  text: string;
  time: string;
  isSelf: boolean;
}

export interface SectionChannelsChatWorkspaceProps {
  channelList: ChannelItem[];
  activeChannelId: number;
  onSelectChannel: (id: number) => void;
  chatMessages: ChatMessageItem[];
  chatInputText: string;
  onChatInputChange: (text: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
}

export const SectionChannelsChatWorkspace: React.FC<SectionChannelsChatWorkspaceProps> = ({
  channelList,
  activeChannelId,
  onSelectChannel,
  chatMessages,
  chatInputText,
  onChatInputChange,
  onSendMessage,
}) => {
  const currentActiveChannel = channelList.find((c) => c.id === activeChannelId) || channelList[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl border border-[#E5E5E5] shadow-xs flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-[#171717]">Classroom Section Channels & Live Chat</h2>
          <p className="text-xs text-[#737373]">Connect with your course section peers and instructors in dedicated section channels</p>
        </div>
        <div className="px-3 py-1.5 bg-orange-50 text-[#F97316] rounded-xl text-xs font-extrabold border border-orange-200 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#F97316] animate-ping" />
          <span>Websocket Active</span>
        </div>
      </div>

      {/* 2-Column Channel Workspace Grid (Fixed Viewport Height) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-220px)]">
        {/* Left Pane: Channels List */}
        <div className="lg:col-span-4 bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full overflow-hidden">
          <div className="space-y-4 flex-1 overflow-y-auto min-h-0 pr-1">
            <div className="flex items-center justify-between pb-2 border-b border-[#F7F7F7] sticky top-0 bg-white z-10">
              <span className="text-xs font-extrabold text-[#171717] uppercase tracking-wider">Your Section Channels</span>
              <span className="text-[10px] font-bold bg-orange-100 text-[#F97316] px-2 py-0.5 rounded-md">{channelList.length} Active</span>
            </div>

            <div className="space-y-2">
              {channelList.map((chan) => (
                <button
                  key={chan.id}
                  onClick={() => onSelectChannel(chan.id)}
                  className={`w-full p-3.5 rounded-xl border text-left flex items-start justify-between transition-all cursor-pointer ${
                    activeChannelId === chan.id 
                      ? 'bg-orange-50/80 border-[#F97316] shadow-xs' 
                      : 'bg-[#F7F7F7] border-[#E5E5E5] hover:bg-white'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-xs font-black text-[#171717] flex items-center gap-1.5">
                      <Hash className="w-3.5 h-3.5 text-[#F97316]" /> {chan.name}
                    </span>
                    <span className="text-[10px] text-[#737373] block">{chan.courseTitle}</span>
                    <span className="text-[10px] text-amber-700 font-bold block">Instructor: {chan.instructor}</span>
                  </div>

                  {chan.unread > 0 && (
                    <span className="bg-[#F97316] text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                      {chan.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-[#F7F7F7] rounded-xl border border-[#E5E5E5] text-[10px] text-[#737373] space-y-1 mt-3">
            <span className="font-extrabold text-[#171717] block flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#F97316]" /> Channel Access Security
            </span>
            <span>You are automatically joined into channels corresponding to your backend course section enrollments.</span>
          </div>
        </div>

        {/* Right Pane: Live Chat Stream Window */}
        <div className="lg:col-span-8 bg-white border border-[#E5E5E5] rounded-2xl shadow-xs flex flex-col justify-between overflow-hidden h-full">
          {/* Chat Header (Pinned Top) */}
          <div className="p-4 bg-[#F7F7F7] border-b border-[#E5E5E5] flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white border border-[#E5E5E5] rounded-xl text-[#F97316]">
                <Hash className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-[#171717]">{currentActiveChannel.name}</h4>
                <span className="text-[10px] text-[#737373] font-semibold">{currentActiveChannel.courseTitle} • {currentActiveChannel.instructor}</span>
              </div>
            </div>
            <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-md">
              Live Channel
            </span>
          </div>

          {/* Scrollable Chat History Thread (Independently Scrollable) */}
          <div className="p-6 overflow-y-auto space-y-4 flex-1 bg-white min-h-0">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'} space-y-1`}>
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#737373]">
                  <span>{msg.sender}</span>
                  <span>•</span>
                  <span>{msg.time}</span>
                </div>
                <div className={`p-3.5 rounded-2xl max-w-md text-xs font-semibold leading-relaxed shadow-2xs ${
                  msg.isSelf 
                    ? 'bg-[#F97316] text-white rounded-tr-none' 
                    : 'bg-[#F7F7F7] text-[#171717] border border-[#E5E5E5] rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Chat Input Form */}
          <form onSubmit={onSendMessage} className="p-4 border-t border-[#E5E5E5] bg-[#F7F7F7] flex gap-3 items-center">
            <input
              type="text"
              placeholder={`Message #${currentActiveChannel.name}...`}
              value={chatInputText}
              onChange={(e) => onChatInputChange(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-white border border-[#E5E5E5] rounded-xl text-xs font-medium focus:outline-hidden focus:border-[#F97316]"
            />
            <button
              type="submit"
              className="bg-[#F97316] hover:bg-[#EA580C] text-white p-2.5 rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
