import React from 'react';
import './MessageOptionsMenu.css';

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
        <div className="options-menu-overlay animate-in fade-in" onClick={onClose}>
            <div
                className="options-menu-content animate-in zoom-in"
                onClick={e => e.stopPropagation()}
            >
                <div className="options-menu-stack">
                    <div className="options-menu-section">
                        <p className="options-menu-label">React</p>
                        <div className="reactions-grid">
                            {REACTION_EMOJIS.map(emoji => (
                                <button
                                    key={emoji}
                                    onClick={() => onReact(emoji)}
                                    className="reaction-button"
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="options-menu-divider" />

                    <div className="options-menu-section">
                        <button
                            onClick={onDelete}
                            className={`action-button ${isMe ? 'action-button-delete' : 'action-button-disabled'}`}
                            disabled={!isMe}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete Message
                        </button>
                        {!isMe && <p className="action-info-text">Only your own messages can be deleted</p>}
                    </div>

                    <button
                        onClick={onClose}
                        className="cancel-button"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};
