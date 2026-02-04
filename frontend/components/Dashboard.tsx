
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

  const shareProfile = () => {
    // Generate shareable link
    const shareUrl = `${window.location.origin}?chat=${user.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full bg-white flex flex-col overflow-y-auto animate-in fade-in slide-in-from-bottom duration-500">
      <div className="w-full max-w-2xl mx-auto px-6 py-10 lg:py-16 pb-[calc(2.5rem+env(safe-area-inset-bottom))] lg:pb-16">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Profile</h2>
          <p className="text-sm text-slate-400 font-bold mt-1">Manage your identity.</p>
        </div>

        <div className="space-y-10">
          <section className="flex flex-col sm:flex-row items-center gap-8 p-6 lg:p-8 bg-slate-100 rounded-none border-none">
            <div className="relative group shrink-0">
              <AvatarDisplay id={user.id} username={user.username} className="w-24 h-24 text-4xl" />
            </div>

            <div className="flex-1 text-center sm:text-left min-w-0">
              <h4 className="font-black text-slate-800 text-xl mb-1 truncate">{user.username}</h4>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Public Identity</p>
            </div>
          </section>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">User Name</label>
              <input
                type="text"
                value={user.username}
                onChange={(e) => onUpdate({ username: e.target.value })}
                className="w-full bg-slate-100 border-none p-4 rounded-none outline-none font-bold text-base text-slate-700 focus:bg-slate-200"
              />
            </div>

            <div className="p-8 bg-slate-100 rounded-none border-none overflow-hidden">
              <div className="flex flex-col gap-5">
                <div className="min-w-0">
                  <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block mb-2">Public Address</label>
                  <code className="text-[11px] font-mono text-slate-900 font-black break-all block bg-white p-3 rounded-none border-none">
                    {user.id}
                  </code>
                </div>
                <button
                  onClick={shareProfile}
                  className={`w-full lg:w-max px-8 py-3 rounded-full font-black transition-all flex items-center justify-center gap-3 text-sm border-none ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-black shadow-none'}`}
                >
                  {copied ? 'Link Copied!' : 'Share Profile'}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={onBack}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-black py-4 rounded-full transition-all active:scale-[0.98] uppercase tracking-widest text-xs border-none"
          >
            Done
          </button>

          <button
            onClick={() => signOut(auth)}
            className="w-full bg-red-50 hover:bg-red-100 text-red-500 font-black py-4 rounded-full transition-all active:scale-[0.98] uppercase tracking-widest text-xs border-none mt-4"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
