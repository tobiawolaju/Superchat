import React from 'react';
import { Message, UserProfile, Contact } from '../types';
import { decryptMessage } from '../services/crypto';
import { AvatarDisplay } from './Avatar';
import { Sticker } from './Sticker';
import { useLongPress } from '../hooks/useLongPress';

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
        <div className={`flex items-end gap-3 ${isMe ? 'flex-row-reverse' : ''} mb-2 animate-super-slide`}>
            <div className={`shrink-0 ${isLastInGroup ? 'opacity-100' : 'opacity-0'} w-8 h-8`}>
                <AvatarDisplay
                    id={isMe ? user.id : contact.id}
                    username={isMe ? user.username : contact.username}
                    className="w-8 h-8"
                />
            </div>
            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[80%]`}>
                {isEmoji ? (
                    <div
                        className="p-2 animate-super-pop duration-300 transform transition-transform hover:scale-110 cursor-pointer"
                        onDoubleClick={() => onSelect(msg)}
                        {...longPressProps}
                    >
                        <Sticker index={emojiIndex} className="w-28 h-28 lg:w-44 lg:h-44" />
                    </div>
                ) : (
                    <div
                        className={`px-5 py-3 rounded-3xl transition-all cursor-pointer select-none animate-super-bounce ${isMe
                            ? `bg-slate-900 text-white rounded-br-none hover:bg-black`
                            : `bg-slate-100 text-slate-800 rounded-bl-none hover:bg-slate-200`
                            }`}
                        onDoubleClick={() => onSelect(msg)}
                        {...longPressProps}
                    >
                        <p className="text-sm lg:text-base font-bold leading-relaxed whitespace-pre-wrap">{decrypted}</p>
                    </div>
                )}

                {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                    <div className={`flex flex-wrap gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        {Object.entries(msg.reactions).map(([emoji, users]) => (
                            <button
                                key={emoji}
                                onClick={() => {
                                    onSelect(msg);
                                    onReact(emoji);
                                }}
                                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs border transition-all ${(users as string[]).includes(user.id)
                                    ? 'bg-slate-900 border-slate-900 text-white'
                                    : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300'
                                    }`}
                            >
                                <span className="text-sm">{emoji}</span>
                                <span className="font-black text-[10px]">{(users as string[]).length}</span>
                            </button>
                        ))}
                    </div>
                )}

                {isLastInGroup && (
                    <span className="text-[8px] font-black text-slate-300 mt-1 uppercase tracking-widest">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                )}
            </div>
        </div>
    );
};
