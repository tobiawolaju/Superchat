
import React from 'react';
import { Contact } from '../types';
import { AvatarDisplay } from './Avatar';
import { formatTimeAgo } from '../services/utils';
import { decryptMessage } from '../services/crypto';

interface ChatListProps {
  contacts: Contact[];
  onChatClick: (contact: Contact) => void;
  onDeleteChat: (contactId: string) => void;
  activeContactId?: string;
  isMobile: boolean;
}

const ChatList: React.FC<ChatListProps> = ({ contacts, onChatClick, onDeleteChat, activeContactId, isMobile }) => {
  const [showDeleteMenu, setShowDeleteMenu] = React.useState<string | null>(null);
  const pressTimer = React.useRef<any>(null);
  const lastTap = React.useRef<number>(0);

  const handleStartPress = (contactId: string) => {
    pressTimer.current = setTimeout(() => {
      setShowDeleteMenu(contactId);
    }, 500);
  };

  const handleEndPress = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const handleClick = (contact: Contact) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      setShowDeleteMenu(contact.id);
    } else {
      onChatClick(contact);
      setShowDeleteMenu(null);
    }
    lastTap.current = now;
  };
  const renderMessagePreview = (contact: Contact) => {
    if (!contact.lastMessage) return contact.id.substring(0, 16) + '...';

    let content = contact.lastMessage;
    // Decrypt if it's not a special type
    if (!content.startsWith('EMOJI:') && !content.startsWith('STICKER:')) {
      content = decryptMessage(content, contact.hashingKey);
    } else if (content.startsWith('EMOJI:')) {
      content = 'Sent a sticker';
    }

    return content;
  };

  return (
    <div className={`flex flex-col ${isMobile ? 'p-3' : 'gap-2'}`}>
      {!isMobile && (
        <div className="flex items-center justify-between px-3 mb-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Chats</span>
          <span className="bg-slate-200 text-slate-500 text-[9px] font-black px-2 py-0.5 rounded-none uppercase">{contacts.length}</span>
        </div>
      )}

      {contacts.map((contact) => (
        <div key={contact.id} className="relative">
          <button
            onMouseDown={() => handleStartPress(contact.id)}
            onMouseUp={handleEndPress}
            onMouseLeave={handleEndPress}
            onTouchStart={() => handleStartPress(contact.id)}
            onTouchEnd={handleEndPress}
            onContextMenu={(e) => {
              e.preventDefault();
              setShowDeleteMenu(contact.id);
            }}
            onClick={() => handleClick(contact)}
            className={`group w-full flex items-center gap-4 p-4 rounded-full transition-all relative ${activeContactId === contact.id && !isMobile
              ? 'bg-slate-900 text-white shadow-none'
              : 'bg-white hover:bg-slate-200 text-slate-600 border-none'
              } ${showDeleteMenu === contact.id ? 'opacity-50 blur-[2px]' : ''}`}
          >
            <div className="relative shrink-0">
              <AvatarDisplay
                id={contact.id}
                username={contact.username}
                avatar={contact.avatar}
                className={isMobile ? 'w-14 h-14' : 'w-11 h-11'}
              />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex justify-between items-baseline mb-0.5">
                <p className={`text-base font-black truncate ${activeContactId === contact.id && !isMobile ? 'text-white' : 'text-slate-900'}`}>
                  {contact.username}
                </p>
                {contact.lastTimestamp && (
                  <span className={`text-[10px] font-black uppercase tracking-tighter shrink-0 ml-2 ${activeContactId === contact.id && !isMobile ? 'text-white/50' : 'text-slate-400'}`}>
                    {formatTimeAgo(contact.lastTimestamp)}
                  </span>
                )}
              </div>
              <p className={`text-xs font-bold truncate opacity-80 ${activeContactId === contact.id && !isMobile ? 'text-white/60' : 'text-slate-400'}`}>
                {renderMessagePreview(contact)}
              </p>
            </div>
          </button>

          {showDeleteMenu === contact.id && (
            <div className="absolute inset-0 z-10 flex items-center justify-center p-2 animate-in fade-in zoom-in duration-200">
              <div className="bg-white shadow-2xl rounded-full flex items-center gap-2 border border-slate-100 p-1">
                <button
                  onClick={() => {
                    onDeleteChat(contact.id);
                    setShowDeleteMenu(null);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-colors border-none"
                >
                  Remove Chat
                </button>
                <button
                  onClick={() => setShowDeleteMenu(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-500 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-colors border-none"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {contacts.length === 0 && (
        <div className={`py-20 text-center ${isMobile ? 'px-8' : 'px-4'}`}>
          <div className="inline-flex w-16 h-16 bg-slate-100 items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <p className="text-sm text-slate-400 font-black leading-relaxed uppercase tracking-widest max-w-[180px] mx-auto opacity-60">No contacts</p>
        </div>
      )}
    </div>
  );
};

export default ChatList;
