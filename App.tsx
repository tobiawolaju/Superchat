
import React, { useState, useEffect } from 'react';
import { UserProfile, Contact, View } from './types';
import { generatePublicAddress } from './services/crypto';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import Dashboard from './components/Dashboard';
import AddFriend from './components/AddFriend';
import { AvatarDisplay } from './components/Avatar';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [view, setView] = useState<View>('HOME');
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashVisible(false);
    }, 2000);

    const savedUser = localStorage.getItem('super_chat_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      const newUser: UserProfile = {
        id: generatePublicAddress(),
        username: `User_${Math.floor(Math.random() * 1000)}`,
        avatar: 'robohash',
        hashingKey: 'master_key_' + Math.random().toString(36).substring(7)
      };
      localStorage.setItem('super_chat_user', JSON.stringify(newUser));
      setUser(newUser);
    }

    const savedContacts = localStorage.getItem('super_chat_contacts');
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }

    return () => clearTimeout(timer);
  }, []);

  const saveContacts = (newContacts: Contact[]) => {
    setContacts(newContacts);
    localStorage.setItem('super_chat_contacts', JSON.stringify(newContacts));
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('super_chat_user', JSON.stringify(updatedUser));
  };

  const handleAddContact = (contact: Contact) => {
    const exists = contacts.find(c => c.id === contact.id);
    if (!exists) {
      saveContacts([...contacts, contact]);
    }
    setView('HOME');
  };

  const openChat = (contact: Contact) => {
    setActiveContact(contact);
    setView('CHAT');
  };

  if (isSplashVisible) {
    return (
      <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-white animate-out fade-out duration-700 fill-mode-forwards">
        <h1 className="text-7xl font-chewy font-black text-slate-900 tracking-tight animate-in zoom-in-75 duration-500 uppercase">
          SUPER CHAT
        </h1>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-[100dvh] w-full bg-white overflow-hidden text-slate-900 animate-in fade-in duration-500">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-80 bg-slate-50 flex-col shrink-0 border-r border-slate-100">
        <div className="h-16 flex items-center px-6">
          <button onClick={() => setView('HOME')} className="font-chewy text-2xl text-slate-900 tracking-wide">
            Super Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <ChatList
            contacts={contacts}
            onChatClick={openChat}
            activeContactId={activeContact?.id}
            isMobile={false}
          />
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={() => setView('DASHBOARD')}
            className={`flex items-center gap-3 w-full p-3 rounded-2xl transition-all group border-none ${view === 'DASHBOARD' ? 'bg-slate-900 text-white' : 'hover:bg-white text-slate-700 hover:shadow-sm'}`}
          >
            <AvatarDisplay id={user.id} username={user.username} className="w-10 h-10" />
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-black truncate">{user.username}</p>
              <p className={`text-[10px] font-black uppercase tracking-widest ${view === 'DASHBOARD' ? 'text-white/50' : 'text-slate-400'}`}>Settings</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative bg-white min-w-0 overflow-hidden">
        {/* Mobile / Shared Header */}
        <header className={`h-16 flex items-center justify-between px-6 bg-white border-b border-slate-50 sticky top-0 z-20 shrink-0 ${view === 'HOME' && 'lg:hidden'}`}>
          <div className="flex items-center gap-3">
            {view !== 'HOME' && (
              <button
                onClick={() => setView('HOME')}
                className="p-2 -ml-2 rounded-full text-slate-400 transition-colors hover:bg-slate-100"
                aria-label="Back"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div>
              {view === 'HOME' && <h1 className="font-chewy text-2xl text-slate-900">Super Chat</h1>}
              {view === 'CHAT' && activeContact && (
                <div className="flex items-center gap-3">
                  <AvatarDisplay id={activeContact.id} username={activeContact.username} className="w-8 h-8" />
                  <div>
                    <h3 className="font-black text-slate-900 text-sm leading-none">{activeContact.username}</h3>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">Hashed Active</p>
                  </div>
                </div>
              )}
              {view === 'DASHBOARD' && <h1 className="font-black text-slate-800 tracking-widest uppercase text-sm">Profile Settings</h1>}
              {view === 'ADD_CONTACT' && <h1 className="font-black text-slate-800 tracking-widest uppercase text-sm">Connect with Hash</h1>}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {view === 'HOME' && (
              <button
                onClick={() => setView('DASHBOARD')}
                className="lg:hidden"
              >
                <AvatarDisplay id={user.id} username={user.username} className="w-10 h-10" />
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-hidden relative">
          {view === 'HOME' && (
            <div className="h-full flex flex-col">
              <div className="lg:hidden flex-1 overflow-y-auto">
                <ChatList
                  contacts={contacts}
                  onChatClick={openChat}
                  activeContactId={activeContact?.id}
                  isMobile={true}
                />
              </div>
              <div className="hidden lg:flex h-full flex-col items-center justify-center p-12 text-center">
                <div className="w-24 h-24 bg-slate-50 flex items-center justify-center mb-8 rounded-3xl border border-slate-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h2 className="text-4xl font-chewy text-slate-800 mb-2 tracking-wide">Ready for lift off?</h2>
                <p className="text-slate-400 text-lg max-w-xs mb-10 font-medium">Fast, Hashed, and Minimalist.</p>
                <button
                  onClick={() => setView('ADD_CONTACT')}
                  className="bg-slate-900 hover:bg-black text-white font-chewy text-xl py-4 px-12 rounded-full transition-all active:scale-95 flex items-center gap-3 border-none"
                >
                  + Add Someone
                </button>
              </div>
            </div>
          )}

          {view === 'CHAT' && activeContact && (
            <ChatWindow
              contact={activeContact}
              user={user}
              onBack={() => setView('HOME')}
              hideHeader={true}
            />
          )}

          {view === 'DASHBOARD' && (
            <Dashboard
              user={user}
              onUpdate={updateProfile}
              onBack={() => setView('HOME')}
            />
          )}

          {view === 'ADD_CONTACT' && (
            <AddFriend
              onAdd={handleAddContact}
              onBack={() => setView('HOME')}
            />
          )}
        </div>

        {/* FAB (Floating Action Button) */}
        {view === 'HOME' && (
          <button
            onClick={() => setView('ADD_CONTACT')}
            className="absolute bottom-[calc(2rem+env(safe-area-inset-bottom))] right-8 h-16 px-6 bg-slate-900 rounded-full flex items-center justify-center text-white active:scale-90 z-20 transition-all duration-300 hover:scale-105 hover:bg-black shadow-xl border-none"
          >
            <span className="font-chewy text-2xl mr-2">+</span>
            <span className="font-chewy text-xl uppercase tracking-wider">New</span>
          </button>
        )}
      </main>
    </div>
  );
};

export default App;
