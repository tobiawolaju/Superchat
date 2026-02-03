
import React from 'react';
import { Contact } from '../types';
import { AvatarDisplay } from './Avatar';

interface ChatListProps {
  contacts: Contact[];
  onChatClick: (contact: Contact) => void;
  activeContactId?: string;
  isMobile: boolean;
}

import './ChatList.css';

interface ChatListProps {
  contacts: Contact[];
  onChatClick: (contact: Contact) => void;
  activeContactId?: string;
  isMobile: boolean;
}

const ChatList: React.FC<ChatListProps> = ({ contacts, onChatClick, activeContactId, isMobile }) => {
  return (
    <div className={`chat-list-container ${isMobile ? 'chat-list-mobile' : 'chat-list-desktop'}`}>
      {!isMobile && (
        <div className="chat-list-header">
          <span className="chat-list-label">Recent Chats</span>
          <span className="chat-list-badge">{contacts.length}</span>
        </div>
      )}

      {contacts.map((contact) => {
        const isActive = activeContactId === contact.id && !isMobile;
        return (
          <button
            key={contact.id}
            onClick={() => onChatClick(contact)}
            className={`chat-item-button ${isActive ? 'chat-item-active' : 'chat-item-inactive'}`}
          >
            <div className="avatar-wrapper">
              <AvatarDisplay
                id={contact.id}
                username={contact.username}
                avatar={contact.avatar}
                className={isMobile ? 'w-14 h-14' : 'w-11 h-11'}
              />
            </div>
            <div className="chat-item-info">
              <p className={`chat-item-name ${isActive ? 'chat-item-name-active' : 'chat-item-name-inactive'}`}>
                {contact.username}
              </p>
              <p className={`chat-item-subtitle ${isActive ? 'chat-item-subtitle-active' : 'chat-item-subtitle-inactive'}`}>
                {contact.id.substring(0, 16)}...
              </p>
            </div>
          </button>
        );
      })}

      {contacts.length === 0 && (
        <div className={`empty-list-container ${isMobile ? 'empty-list-mobile' : 'empty-list-desktop'}`}>
          <div className="empty-list-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" className="empty-list-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <p className="empty-list-text">No contacts</p>
        </div>
      )}
    </div>
  );
};

export default ChatList;
