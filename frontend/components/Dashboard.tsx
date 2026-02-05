
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { AvatarDisplay } from './Avatar';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';

interface DashboardProps {
  user: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
  onBack: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onUpdate, onBack }) => {
  const [copied, setCopied] = useState(false);

  const copyProfileLink = () => {
    const link = `${window.location.origin}?user=${user.id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full bg-white flex flex-col overflow-y-auto animate-in fade-in slide-in-from-bottom duration-500">
      <div className="w-full max-w-2xl mx-auto px-6 py-10 lg:py-16 pb-[calc(2.5rem+env(safe-area-inset-bottom))] lg:pb-16 flex-1 flex flex-col">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Account</h2>
          <p className="text-sm text-slate-400 font-bold mt-1">Manage your identity.</p>
        </div>

        <div className="space-y-10 flex-1">
          <section className="flex flex-col sm:flex-row items-center gap-8 p-6 lg:p-8 bg-slate-100 rounded-none border-none">
            <div className="relative group shrink-0">
              <AvatarDisplay id={user.id} username={user.username} className="w-24 h-24 text-4xl" />
            </div>

            <div className="flex-1 text-center sm:text-left min-w-0">
              <h4 className="font-black text-slate-800 text-xl mb-1 truncate">{user.username}</h4>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Permanent Identity Image</p>
              <p className="mt-2 text-[10px] text-slate-400 font-medium">Profile pictures are automatically generated from your Public Key.</p>
            </div>
          </section>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Display Alias</label>
              <input
                type="text"
                value={user.username}
                onChange={(e) => onUpdate({ username: e.target.value })}
                className="w-full bg-slate-100 border-none p-4 rounded-none outline-none font-bold text-base text-slate-700 focus:bg-slate-200"
              />
            </div>
          </div>

          <div className="p-8 bg-slate-100 rounded-none border-none overflow-hidden">
            <div className="flex flex-col gap-5">
              <div className="min-w-0">
                <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block mb-2">Public Key</label>
                <code className="text-[11px] font-mono text-slate-900 font-black break-all block bg-white p-3 rounded-none border-none">
                  {user.id}
                </code>
              </div>
            </div>
          </div>

          <button
            onClick={() => signOut(auth)}
            className="w-full bg-red-50 hover:bg-red-100 text-red-500 font-black py-4 rounded-full transition-all active:scale-[0.98] uppercase tracking-widest text-xs border-none mt-4"
          >
            Logout session
          </button>
        </div>

        {/* Bottom Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={onBack}
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
  );
};

export default Dashboard;
