
import React, { useState } from 'react';
import { Contact } from '../types';
import { AvatarDisplay } from './Avatar';

interface ContactProfileProps {
    contact: Contact;
    onBack: () => void;
    onRemove: () => void;
}

const ContactProfile: React.FC<ContactProfileProps> = ({ contact, onBack, onRemove }) => {
    const [copied, setCopied] = useState(false);

    const copyAddress = () => {
        navigator.clipboard.writeText(contact.id);
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

                    <div className="w-full space-y-8">
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Identity Key</label>
                            <code className="text-[11px] font-mono text-slate-700 font-bold break-all block leading-relaxed">
                                {contact.id}
                            </code>
                            <button
                                onClick={copyAddress}
                                className="mt-4 flex items-center gap-2 text-xs font-black text-slate-900 hover:text-slate-600 transition-colors"
                            >
                                {copied ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Copied</span>
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                        </svg>
                                        <span>Copy Key</span>
                                    </>
                                )}
                            </button>
                        </div>

                        <button
                            onClick={onRemove}
                            className="w-full py-4 text-red-500 font-black uppercase tracking-widest text-xs hover:bg-red-50 rounded-2xl transition-colors"
                        >
                            Remove Contact
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactProfile;
