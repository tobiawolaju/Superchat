import React from 'react';

interface MessageOptionsMenuProps {
    onReact: (emoji: string) => void;
    onDelete: () => void;
    onClose: () => void;
    isMe: boolean;
}

const REACTION_EMOJIS = ['❤️', '👍', '🔥', '😂', '😮', '😢'];

export const MessageOptionsMenu: React.FC<MessageOptionsMenuProps> = ({
    onReact,
    onDelete,
    onClose,
    isMe
}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-xs animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                <div className="space-y-6">
                    <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">React</p>
                        <div className="grid grid-cols-6 gap-2">
                            {REACTION_EMOJIS.map(emoji => (
                                <button
                                    key={emoji}
                                    onClick={() => onReact(emoji)}
                                    className="text-2xl hover:scale-125 transition-transform active:scale-95 p-1"
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    <div className="space-y-2">
                        <button
                            onClick={onDelete}
                            className={`w-full py-4 px-4 rounded-2xl flex items-center justify-center gap-2 font-black text-sm uppercase tracking-widest transition-colors ${isMe ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-slate-50 text-slate-400 cursor-not-allowed opacity-50'
                                }`}
                            disabled={!isMe}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete Message
                        </button>
                        {!isMe && <p className="text-[9px] text-center text-slate-400 font-bold italic">Only your own messages can be deleted</p>}
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-3 text-slate-500 font-bold text-sm hover:text-slate-900 transition-colors uppercase tracking-widest"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};
