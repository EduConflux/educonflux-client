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
          <span>Live Sync Active</span>
        </div>
      </div>

      {/* 2-Column Channel Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-220px)]">
        {/* Left Pane: Channels List */}
        <div className="lg:col-span-4 bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full overflow-hidden">
          <div className="space-y-4 flex-1 overflow-y-auto min-h-0 pr-1">
            <div className="flex items-center justify-between pb-2 border-b border-[#F7F7F7] sticky top-0 bg-white z-10">
              <span className="text-xs font-extrabold text-[#171717] uppercase tracking-wider">Your Section Channels</span>
              <span className="text-[10px] font-bold bg-[#F7F7F7] px-2 py-0.5 rounded-full text-[#737373]">
                {channelList.length} Active
              </span>
            </div>

            <div className="space-y-1">
              {channelList.map((ch) => {
                const isSelected = ch.id === activeChannelId;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => onSelectChannel(ch.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 cursor-pointer group ${
                      isSelected
                        ? 'bg-orange-50/80 border border-orange-200/80 text-[#171717]'
                        : 'hover:bg-[#F7F7F7] border border-transparent text-[#525252]'
                    }`}
                  >
                    <div className={`p-2 rounded-lg mt-0.5 ${isSelected ? 'bg-[#F97316] text-white' : 'bg-[#F7F7F7] text-[#737373] group-hover:text-[#171717]'}`}>
                      <Hash className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold truncate ${isSelected ? 'text-[#F97316]' : 'text-[#171717]'}`}>
                          #{ch.name}
                        </span>
                        {ch.unread > 0 && (
                          <span className="bg-[#F97316] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                            {ch.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#737373] truncate mt-0.5">{ch.courseTitle}</p>
                      <span className="text-[10px] text-[#737373] block mt-1 font-semibold">{ch.instructor}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-xs text-[#737373]">
            <div className="flex items-center gap-1.5 font-bold">
              <Users className="w-3.5 h-3.5 text-[#F97316]" />
              <span>Section Roster Active</span>
            </div>
          </div>
        </div>

        {/* Right Pane: Channel Stream & Input */}
        <div className="lg:col-span-8 bg-white border border-[#E5E5E5] rounded-2xl flex flex-col h-full shadow-xs overflow-hidden">
          {/* Channel Header */}
          <div className="p-4 border-b border-[#E5E5E5] flex items-center justify-between bg-[#F7F7F7]/40 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-[#F97316]">
                <Hash className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-[#171717]">#{currentActiveChannel?.name || 'general'}</h4>
                <p className="text-[10px] text-[#737373]">{currentActiveChannel?.courseTitle || 'Academic Discussion'}</p>
              </div>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-5 overflow-y-auto min-h-0 space-y-4">
            {chatMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-[#737373] space-y-2">
                <Hash className="w-8 h-8 text-[#E5E5E5]" />
                <p className="text-xs font-semibold">No messages in this channel yet.</p>
                <p className="text-[11px] text-[#737373]">Be the first to say hello to your section classmates!</p>
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'} animate-in fade-in duration-200`}
                >
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[11px] font-bold text-[#171717]">{msg.sender}</span>
                    <span className="text-[9px] text-[#737373]">{msg.time}</span>
                  </div>
                  <div
                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                      msg.isSelf
                        ? 'bg-[#F97316] text-white rounded-tr-xs'
                        : 'bg-[#F7F7F7] text-[#171717] border border-[#E5E5E5] rounded-tl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input Footer */}
          <form onSubmit={onSendMessage} className="p-4 border-t border-[#E5E5E5] bg-white shrink-0">
            <div className="relative flex items-center">
              <input
                type="text"
                value={chatInputText}
                onChange={(e) => onChatInputChange(e.target.value)}
                placeholder={`Message #${currentActiveChannel?.name || 'channel'}...`}
                className="w-full bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl pl-4 pr-12 py-3 text-xs text-[#171717] placeholder:text-[#737373] focus:outline-hidden focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
              />
              <button
                type="submit"
                disabled={!chatInputText.trim()}
                className="absolute right-2 p-2 bg-[#F97316] text-white rounded-lg hover:bg-[#EA580C] disabled:opacity-40 disabled:hover:bg-[#F97316] transition-all cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
