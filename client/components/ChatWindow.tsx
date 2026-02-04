
import React, { useState, useEffect, useRef } from 'react';
import { Contact, UserProfile, Message } from '../types';
import { encryptMessage } from '../services/crypto';
import { rtdb, getChatPath } from '../services/db';
import { AvatarDisplay } from './Avatar';
import { Sticker } from './Sticker';
import { MessageOptionsMenu } from './MessageOptionsMenu';
import { MessageItem } from './MessageItem';

const EMOJI_COUNT = 40;

interface ChatWindowProps {
  contact: Contact;
  user: UserProfile;
  onBack: () => void;
  hideHeader?: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ contact, user, onBack, hideHeader = false }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [showStickers, setShowStickers] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatPath = getChatPath(user.id, contact.id);

  useEffect(() => {
    const unsubscribe = rtdb.onValue(chatPath, (data) => {
      if (data) {
        const messageArray = Object.values(data) as Message[];
        setMessages(messageArray);
      } else {
        setMessages([]);
      }
    });
    return () => unsubscribe();
  }, [chatPath]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (content: string) => {
    const hashedContent = encryptMessage(content, contact.hashingKey);
    const newMessage = {
      senderId: user.id,
      content: hashedContent,
      timestamp: Date.now(),
    };
    rtdb.push(chatPath, newMessage);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  const sendEmoji = (index: number) => {
    sendMessage(`EMOJI:${index}`);
    setShowStickers(false);
  };

  const handleDeleteMessage = () => {
    if (selectedMessage) {
      rtdb.removeMessage(chatPath, selectedMessage.id);
      setSelectedMessage(null);
    }
  };

  const handleReact = (emoji: string) => {
    if (selectedMessage) {
      const reactions = selectedMessage.reactions || {};
      const currentReactionUsers = reactions[emoji] || [];

      let newReactionUsers;
      if (currentReactionUsers.includes(user.id)) {
        // Remove reaction
        newReactionUsers = currentReactionUsers.filter(id => id !== user.id);
      } else {
        // Add reaction
        newReactionUsers = [...currentReactionUsers, user.id];
      }

      const newReactions = { ...reactions };
      if (newReactionUsers.length > 0) {
        newReactions[emoji] = newReactionUsers;
      } else {
        delete newReactions[emoji];
      }

      rtdb.updateMessage(chatPath, selectedMessage.id, { reactions: newReactions });
      setSelectedMessage(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-500">
      {!hideHeader && (
        <div className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-50 sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="lg:hidden p-2 -ml-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <AvatarDisplay id={contact.id} username={contact.username} className="w-10 h-10" />
            <div>
              <h3 className="font-black text-slate-900 leading-tight text-sm lg:text-base">{contact.username}</h3>
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">End-to-end Hashed</p>
            </div>
          </div>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 lg:px-12 py-8 space-y-6 bg-white">
        {messages.map((msg, i) => {
          const isMe = msg.senderId === user.id;
          const nextMsg = messages[i + 1];
          const isLastInGroup = !nextMsg || nextMsg.senderId !== msg.senderId;

          return (
            <MessageItem
              key={msg.id || i}
              msg={msg}
              user={user}
              contact={contact}
              isMe={isMe}
              isLastInGroup={isLastInGroup}
              onSelect={setSelectedMessage}
              onReact={handleReact}
            />
          );
        })}
      </div>

      <div className="bg-white shrink-0 border-t border-slate-50 pb-safe">
        {showStickers && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 animate-in slide-in-from-bottom duration-300">
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3 max-h-[280px] overflow-y-auto no-scrollbar py-2">
              {Array.from({ length: EMOJI_COUNT }).map((_, idx) => {
                const num = idx + 1;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => sendEmoji(num)}
                    className="aspect-square flex items-center justify-center p-1.5 bg-white rounded-2xl hover:bg-slate-100 hover:shadow-sm transition-all active:scale-90 border border-slate-100 overflow-hidden"
                  >
                    <Sticker index={num} className="w-full h-full" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="p-4 lg:p-6 pb-[calc(1rem+env(safe-area-inset-bottom))] lg:pb-6 max-w-5xl mx-auto w-full">
          <form onSubmit={handleSend} className="flex items-center gap-3 bg-slate-50 rounded-full px-5 py-2 border border-slate-100 focus-within:border-slate-300 focus-within:bg-white focus-within:shadow-sm focus-within:scale-[1.01] transition-all duration-300">
            <button
              type="button"
              onClick={() => setShowStickers(!showStickers)}
              className={`p-2 rounded-full transition-all ${showStickers ? 'text-slate-900 bg-white rotate-12' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Secure hashed message..."
              className="flex-1 bg-transparent border-none py-2 text-slate-900 focus:outline-none placeholder-slate-400 font-bold text-sm lg:text-base"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-10 h-10 bg-slate-900 hover:bg-black rounded-full flex items-center justify-center text-white disabled:opacity-20 transition-all active:scale-90 shrink-0 border-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {selectedMessage && (
        <MessageOptionsMenu
          isMe={selectedMessage.senderId === user.id}
          onDelete={handleDeleteMessage}
          onReact={handleReact}
          onClose={() => setSelectedMessage(null)}
        />
      )}
    </div>
  );
};

export default ChatWindow;
