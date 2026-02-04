import React, { useMemo } from 'react';
import { Message, UserProfile, Contact } from '../types';
import { decryptMessage } from '../services/crypto';
import { AvatarDisplay } from './Avatar';
import { Sticker } from './Sticker';
import { useLongPress } from '../hooks/useLongPress';
import { motion, AnimatePresence } from 'framer-motion';

interface MessageItemProps {
    msg: Message;
    user: UserProfile;
    contact: Contact;
    isMe: boolean;
    isLastInGroup: boolean;
    onSelect: (msg: Message) => void;
    onReact: (emoji: string) => void;
}

const TIER_STYLES = [
    'bg-gradient-to-br from-slate-900 to-slate-800 text-white',
    'bg-gradient-to-br from-blue-600 to-blue-500 text-white',
    'bg-gradient-to-br from-cyan-500 to-cyan-400 text-white',
    'bg-gradient-to-br from-yellow-500 to-yellow-400 text-slate-900',
    'bg-gradient-to-br from-orange-500 to-orange-400 text-white',
    'bg-gradient-to-br from-rose-500 to-rose-400 text-white',
    'bg-gradient-to-br from-purple-600 to-purple-500 text-white',
];

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

    // Deterministic style based on hash or senderId for "Super Chat" variety
    const tierStyle = useMemo(() => {
        if (isMe) return 'bg-slate-900 text-white';
        const index = Math.abs(contact.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % TIER_STYLES.length;
        return TIER_STYLES[index];
    }, [contact.id, isMe]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`flex items-end gap-3 ${isMe ? 'flex-row-reverse' : ''} mb-3`}
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: isLastInGroup ? 1 : 0 }}
                className={`shrink-0 w-8 h-8`}
            >
                <AvatarDisplay
                    id={isMe ? user.id : contact.id}
                    username={isMe ? user.username : contact.username}
                    className="w-8 h-8 shadow-sm"
                />
            </motion.div>

            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] relative`}>
                {isEmoji ? (
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 cursor-pointer"
                        onDoubleClick={() => onSelect(msg)}
                        {...longPressProps}
                    >
                        <Sticker index={emojiIndex} className="w-28 h-28 lg:w-44 lg:h-44" />
                    </motion.div>
                ) : (
                    <motion.div
                        whileTap={{ scale: 0.98 }}
                        className={`px-5 py-3 rounded-[24px] transition-all cursor-pointer select-none shadow-md ${tierStyle} ${isMe ? 'rounded-br-none' : 'rounded-bl-none'}`}
                        onDoubleClick={() => onSelect(msg)}
                        {...longPressProps}
                    >
                        <p className="text-sm lg:text-base font-bold leading-relaxed whitespace-pre-wrap">{decrypted}</p>
                    </motion.div>
                )}

                {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                    <div className={`flex flex-wrap gap-1 mt-1.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        {Object.entries(msg.reactions).map(([emoji, users]) => (
                            <motion.button
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                whileHover={{ scale: 1.1 }}
                                key={emoji}
                                onClick={() => {
                                    onSelect(msg);
                                    onReact(emoji);
                                }}
                                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs border transition-all shadow-sm ${(users as string[]).includes(user.id)
                                    ? 'bg-slate-900 border-slate-900 text-white'
                                    : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300'
                                    }`}
                            >
                                <span className="text-sm">{emoji}</span>
                                <span className="font-black text-[10px]">{(users as string[]).length}</span>
                            </motion.button>
                        ))}
                    </div>
                )}

                {isLastInGroup && (
                    <span className="text-[9px] font-black text-slate-300 mt-2 ml-1 uppercase tracking-widest opacity-60">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                )}
            </div>
        </motion.div>
    );
};
