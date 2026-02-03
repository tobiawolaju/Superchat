
import React, { useState, useEffect, useRef } from 'react';
import { Contact, UserProfile, Message } from '../types';
import { encryptMessage } from '../services/crypto';
import { rtdb, getChatPath } from '../services/db';
import { AvatarDisplay } from './Avatar';
import { Sticker } from './Sticker';
import { MessageOptionsMenu } from './MessageOptionsMenu';
import { MessageItem } from './MessageItem';

import './ChatWindow.css';

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
      if (data) setMessages(data);
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
    <div className="chat-window animate-in slide-in-from-right">
      {!hideHeader && (
        <div className="chat-header">
          <div className="chat-header-left">
            <button onClick={onBack} className="back-button">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <AvatarDisplay id={contact.id} username={contact.username} className="w-10 h-10" />
            <div className="chat-header-info">
              <h3>{contact.username}</h3>
              <p className="chat-header-subtitle">End-to-end Hashed</p>
            </div>
          </div>
        </div>
      )}

      <div ref={scrollRef} className="messages-container">
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

      <div className="chat-footer">
        {showStickers && (
          <div className="sticker-panel animate-in slide-in-from-bottom">
            <div className="sticker-grid no-scrollbar">
              {Array.from({ length: EMOJI_COUNT }).map((_, idx) => {
                const num = idx + 1;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => sendEmoji(num)}
                    className="sticker-select-button"
                  >
                    <Sticker index={num} className="w-full h-full" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="input-container">
          <form onSubmit={handleSend} className="message-form">
            <button
              type="button"
              onClick={() => setShowStickers(!showStickers)}
              className={`sticker-toggle-button ${showStickers ? 'active' : ''}`}
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
              className="message-input"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="send-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="send-icon" viewBox="0 0 20 20" fill="currentColor">
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
