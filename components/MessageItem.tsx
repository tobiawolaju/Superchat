import React from 'react';
import { Message, UserProfile, Contact } from '../types';
import { decryptMessage } from '../services/crypto';
import { AvatarDisplay } from './Avatar';
import { Sticker } from './Sticker';
import { useLongPress } from '../hooks/useLongPress';
import './MessageItem.css';

interface MessageItemProps {
    msg: Message;
    user: UserProfile;
    contact: Contact;
    isMe: boolean;
    isLastInGroup: boolean;
    onSelect: (msg: Message) => void;
    onReact: (emoji: string) => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({
    msg,
    user,
    contact,
    isMe,
    isLastInGroup,
    onSelect,
    onReact,
}) => {
    const decrypted = decryptMessage(msg.content, contact.hashingKey);
    const isEmoji = decrypted.startsWith('EMOJI:');
    const emojiIndex = isEmoji ? parseInt(decrypted.split(':')[1], 10) : -1;

    const longPressProps = useLongPress(() => onSelect(msg));

    return (
        <div className={`message-item-container ${isMe ? 'message-item-reverse' : ''}`}>
            <div className={`message-avatar-spacer ${isLastInGroup ? 'visible' : 'invisible'}`}>
                <AvatarDisplay
                    id={isMe ? user.id : contact.id}
                    username={isMe ? user.username : contact.username}
                    className="w-full h-full"
                />
            </div>
            <div className={`message-content-wrapper ${isMe ? 'items-end' : 'items-start'}`}>
                {isEmoji ? (
                    <div
                        className="sticker-wrapper animate-in zoom-in"
                        onDoubleClick={() => onSelect(msg)}
                        {...longPressProps}
                    >
                        <Sticker index={emojiIndex} className="sticker-image" />
                    </div>
                ) : (
                    <div
                        className={`message-bubble ${isMe ? 'bubble-me' : 'bubble-contact'}`}
                        onDoubleClick={() => onSelect(msg)}
                        {...longPressProps}
                    >
                        <p className="message-text">{decrypted}</p>
                    </div>
                )}

                {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                    <div className={`reactions-list ${isMe ? 'justify-end' : 'justify-start'}`}>
                        {Object.entries(msg.reactions).map(([emoji, users]) => {
                            const isActive = (users as string[]).includes(user.id);
                            return (
                                <button
                                    key={emoji}
                                    onClick={() => {
                                        onSelect(msg);
                                        onReact(emoji);
                                    }}
                                    className={`reaction-tag ${isActive ? 'reaction-tag-active' : 'reaction-tag-inactive'}`}
                                >
                                    <span className="reaction-emoji">{emoji}</span>
                                    <span className="reaction-count">{(users as string[]).length}</span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {isLastInGroup && (
                    <span className="message-timestamp">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                )}
            </div>
        </div>
    );
};
