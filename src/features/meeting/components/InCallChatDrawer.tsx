import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

interface InCallChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Array<{ senderId: number; senderName: string; text: string; time: string }>;
  onSendMessage: (text: string) => void;
}

export const InCallChatDrawer: React.FC<InCallChatDrawerProps> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
}) => {
  const [text, setText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text.trim());
    setText('');
  };

  return (
    <div className="w-80 bg-neutral-900 border-l border-neutral-800 flex flex-col h-full z-20 animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
        <div>
          <h4 className="font-bold text-sm text-white">In-Call Chat</h4>
          <span className="text-[10px] text-neutral-400">Classroom participants</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto no-scrollbar">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-xs text-neutral-500">
            No in-call messages yet. Say hello to the class!
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-orange-400">{msg.senderName}</span>
                <span className="text-neutral-500 font-mono">{msg.time}</span>
              </div>
              <p className="text-xs text-neutral-200 bg-neutral-800/80 p-2.5 rounded-xl border border-neutral-700/50 leading-relaxed break-words">
                {msg.text}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-neutral-800 flex items-center gap-2">
        <input
          type="text"
          placeholder="Send a message to everyone..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 outline-hidden focus:border-[#F97316]"
        />
        <button
          type="submit"
          className="p-2 rounded-xl bg-[#F97316] hover:bg-orange-600 text-white cursor-pointer shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
export default InCallChatDrawer;

