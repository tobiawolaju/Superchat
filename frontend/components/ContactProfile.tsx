
import React, { useState } from 'react';
import { Contact } from '../types';
import { AvatarDisplay } from './Avatar';

interface ContactProfileProps {
    contact: Contact;
    onBack: () => void;
    onRemove: () => void;
    onChat: () => void;
}

const ContactProfile: React.FC<ContactProfileProps> = ({ contact, onBack, onRemove, onChat }) => {
    const [copied, setCopied] = useState(false);

    const copyProfileLink = () => {
        const link = `${window.location.origin}?user=${contact.id}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="h-full bg-white flex flex-col overflow-y-auto animate-in fade-in slide-in-from-bottom duration-500">
            <div className="w-full max-w-2xl mx-auto px-6 py-10 lg:py-16 pb-[calc(2.5rem+env(safe-area-inset-bottom))] lg:pb-16 flex-1 flex flex-col">
                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Contact Info</h2>
                </div>

                <div className="flex-1 flex flex-col items-center">
                    <div className="w-32 h-32 mb-6">
                        <AvatarDisplay id={contact.id} username={contact.username} className="w-full h-full text-5xl shadow-2xl" />
                    </div>

                    <h1 className="text-3xl font-black text-slate-900 text-center mb-2">{contact.username}</h1>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-10">Encrypted Chat Contact</p>

                    <div className="w-full space-y-8 flex-1">
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Identity Key</label>
                            <code className="text-[11px] font-mono text-slate-700 font-bold break-all block leading-relaxed">
                                {contact.id}
                            </code>
                        </div>

                        <button
                            onClick={onRemove}
                            className="w-full py-4 text-red-500 font-black uppercase tracking-widest text-xs hover:bg-red-50 rounded-2xl transition-colors"
                        >
                            Remove Contact
                        </button>
                    </div>

                    {/* Bottom Buttons */}
                    <div className="w-full flex gap-4 mt-8">
                        <button
                            onClick={onChat}
                            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900 font-black py-4 rounded-full transition-all active:scale-[0.98] flex items-center justify-center gap-2 border-none"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Chat
                        </button>
                        <button
                            onClick={copyProfileLink}
                            className={`flex-1 font-black py-4 rounded-full transition-all active:scale-[0.98] flex items-center justify-center gap-2 border-none ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-black'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            {copied ? 'Link Copied' : 'Share Profile'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactProfile;
