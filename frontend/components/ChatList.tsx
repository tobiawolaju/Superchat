
import React, { useState, useEffect, useRef } from 'react';
import { Contact } from '../types';
import { AvatarDisplay } from './Avatar';
import { formatTimeAgo } from '../services/utils';
import { decryptMessage } from '../services/crypto';

interface ChatListProps {
  contacts: Contact[];
  onChatClick: (contact: Contact) => void;
  onPinChat: (contactId: string) => void;
  onRemoveChat: (contactId: string) => void;
  activeContactId?: string;
  isMobile: boolean;
}

const ChatList: React.FC<ChatListProps> = ({ contacts, onChatClick, onPinChat, onRemoveChat, activeContactId, isMobile }) => {
  const [menuOpen, setMenuOpen] = useState<{ x: number, y: number, contactId: string } | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setMenuOpen(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleContextMenu = (e: React.MouseEvent, contactId: string) => {
    e.preventDefault();
    setMenuOpen({ x: e.clientX, y: e.clientY, contactId });
  };

  const handleTouchStart = (contactId: string, e: React.TouchEvent) => {
    const touch = e.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;

    longPressTimerRef.current = setTimeout(() => {
      setMenuOpen({ x, y, contactId });
      // Vibrate if available
      if (navigator.vibrate) navigator.vibrate(50);
    }, 500); // 500ms long press
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
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
            onClick={() => onChatClick(contact)}
            onContextMenu={(e) => handleContextMenu(e, contact.id)}
            onTouchStart={(e) => handleTouchStart(contact.id, e)}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchEnd} // Cancel if moved
            className={`group w-full flex items-center gap-4 p-4 rounded-full transition-all relative ${activeContactId === contact.id && !isMobile
              ? 'bg-slate-900 text-white shadow-none'
              : 'bg-white hover:bg-slate-200 text-slate-600 border-none'
              } ${contact.pinned ? 'border-2 border-slate-900/10' : ''}`}
          >
            <div className="relative shrink-0">
              <AvatarDisplay
                id={contact.id}
                username={contact.username}
                avatar={contact.avatar}
                className={isMobile ? 'w-14 h-14' : 'w-11 h-11'}
              />
              {contact.pinned && (
                <div className="absolute -top-1 -right-1 bg-slate-900 text-white text-[8px] p-1 rounded-full border border-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                </div>
              )}
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

      {/* Context Menu */}
      {menuOpen && (
        <div
          className="fixed z-50 min-w-[160px] bg-white rounded-xl shadow-xl py-2 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-100"
          style={{
            left: Math.min(menuOpen.x, window.innerWidth - 170), // Prevent overflow right
            top: Math.min(menuOpen.y, window.innerHeight - 100)  // Prevent overflow bottom
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 py-2 border-b border-slate-50 mb-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Options</p>
          </div>
          <button
            onClick={() => { onPinChat(menuOpen.contactId); setMenuOpen(null); }}
            className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm font-bold text-slate-700 flex items-center gap-3 transition-colors border-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            {contacts.find(c => c.id === menuOpen.contactId)?.pinned ? 'Unpin Chat' : 'Pin Chat'}
          </button>
          <button
            onClick={() => { onRemoveChat(menuOpen.contactId); setMenuOpen(null); }}
            className="w-full text-left px-4 py-3 hover:bg-red-50 text-sm font-bold text-red-600 flex items-center gap-3 transition-colors border-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Remove Chat
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatList;
