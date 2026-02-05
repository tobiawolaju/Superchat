
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
  const [permissionError, setPermissionError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [foundUser, setFoundUser] = useState<{ username: string, avatar: string, id: string } | null>(null);

  const handleLookup = async (id: string) => {
    if (id.length < 5) return;
    setIsSearching(true);
    setFoundUser(null);
    setPermissionError(false);

    try {
      const userData = await rtdb.get(`users/${id}`);
      if (userData) {
        setFoundUser({
          username: userData.username,
          avatar: userData.avatar,
          id: userData.id
        });
      }
    } catch (error: any) {
      console.error("User lookup failed", error);
      if (error.code === 'PERMISSION_DENIED') {
        setPermissionError(true);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAddress(val);
    if (val.length >= 10) {
      handleLookup(val);
    } else {
      setFoundUser(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foundUser) return;

    // Use contact's ID as the hashing key seed for now as requested (constant)
    // In a real app, this should be a Diffie-Hellman derivation or similar.
    const derivedKey = `shared_hash_${foundUser.id}`;

    const newContact: Contact = {
      id: foundUser.id,
      username: foundUser.username,
      hashingKey: derivedKey,
      avatar: foundUser.avatar
    };

    onAdd(newContact);
  };

  return (
    <div className="h-full bg-white flex flex-col overflow-y-auto animate-in fade-in slide-in-from-bottom duration-500">
      <div className="w-full max-w-2xl mx-auto px-6 py-10 lg:py-16">
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Add Friend</h2>
          </div>
          <p className="text-sm text-slate-400 font-bold mt-1">Connect with their identity key to start chatting.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <section className="flex flex-col sm:flex-row items-center gap-8 p-6 lg:p-8 bg-slate-100 rounded-none border-none transition-all duration-300">
            <div className="shrink-0">
              <AvatarDisplay id={foundUser?.id || address || 'temp'} username={foundUser?.username || '?'} className="w-24 h-24 text-4xl" />
            </div>

            <div className="flex-1 text-center sm:text-left min-w-0">
              {isSearching ? (
                <h4 className="font-black text-slate-400 text-xl mb-1 truncate animate-pulse">Searching...</h4>
              ) : (
                <h4 className="font-black text-slate-800 text-xl mb-1 truncate">{foundUser ? foundUser.username : 'Unknown User'}</h4>
              )}

              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{foundUser ? 'User Found' : 'Enter a valid ID'}</p>
            </div>
          </section>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                Public Identity Key
              </label>
              <input
                type="text"
                value={address}
                onChange={handleAddressChange}
                placeholder="Paste UID or Identity Key"
                className="w-full bg-slate-100 border-none p-4 rounded-none outline-none font-mono text-sm text-slate-900 font-bold"
              />
              {permissionError && (
                <p className="text-xs text-red-500 font-bold px-1">
                  Could not find user. The ID might be incorrect.
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={!foundUser}
            className="w-full bg-slate-900 hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed text-white font-black py-4 rounded-full transition-all active:scale-[0.98] uppercase tracking-widest text-xs border-none shadow-none"
          >
            Start Hashed Chat
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFriend;
