
import React, { useState } from 'react';
import { Contact } from '../types';
import { AvatarDisplay } from './Avatar';
import { rtdb } from '../services/db';

interface AddFriendProps {
  onAdd: (contact: Contact) => void;
  onBack: () => void;
}

const AddFriend: React.FC<AddFriendProps> = ({ onAdd, onBack }) => {
  const [address, setAddress] = useState('');
  const [username, setUsername] = useState('');
  const [hashingKey, setHashingKey] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleLookup = async (id: string) => {
    if (id.length < 5) return;
    setIsSearching(true);
    try {
      const userData = await rtdb.get(`users/${id}`);
      if (userData) {
        setUsername(userData.username);
      }
    } catch (error) {
      console.error("User lookup failed", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAddress(val);
    if (val.length >= 10) {
      handleLookup(val);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !username || !hashingKey) return;

    const newContact: Contact = {
      id: address.trim(),
      username: username.trim(),
      hashingKey: hashingKey.trim(),
      avatar: 'robohash'
    };

    onAdd(newContact);
  };

  return (
    <div className="h-full bg-white flex flex-col overflow-y-auto animate-in fade-in slide-in-from-bottom duration-500">
      <div className="w-full max-w-2xl mx-auto px-6 py-10 lg:py-16">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Add Friend</h2>
          <p className="text-sm text-slate-400 font-bold mt-1">Connect with their identity key to start chatting.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <section className="flex flex-col sm:flex-row items-center gap-8 p-6 lg:p-8 bg-slate-100 rounded-none border-none">
            <div className="shrink-0">
              <AvatarDisplay id={address || 'temp'} username={username || '?'} className="w-24 h-24 text-4xl" />
            </div>

            <div className="flex-1 text-center sm:text-left min-w-0">
              <h4 className="font-black text-slate-800 text-xl mb-1 truncate">{username || 'Friend Alias'}</h4>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Deterministic Profile Icon</p>
            </div>
          </section>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                Public Identity Key {isSearching && <span className="animate-pulse ml-2 text-slate-300">Searching...</span>}
              </label>
              <input
                type="text"
                value={address}
                onChange={handleAddressChange}
                placeholder="Paste UID or Identity Key"
                className="w-full bg-slate-100 border-none p-4 rounded-none outline-none font-mono text-sm text-slate-900 font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Local Alias</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Name your friend"
                className="w-full bg-slate-100 border-none p-4 rounded-none outline-none font-bold text-base text-slate-700"
              />
            </div>

            <div className="bg-slate-100 p-8 rounded-none border-none space-y-4">
              <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block px-1">Shared Chat Secret</label>
              <input
                type="password"
                value={hashingKey}
                onChange={(e) => setHashingKey(e.target.value)}
                placeholder="Hash Pin"
                className="w-full bg-white border-none p-4 rounded-none outline-none font-bold text-base text-slate-700"
              />
              <p className="text-[9px] text-slate-400 font-black text-center uppercase tracking-widest opacity-70">
                Required for end-to-end decryption
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={!address || !username || !hashingKey}
            className="w-full bg-slate-900 hover:bg-black disabled:opacity-30 text-white font-black py-4 rounded-full transition-all active:scale-[0.98] uppercase tracking-widest text-xs border-none shadow-none"
          >
            Start Hashed Chat
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFriend;
