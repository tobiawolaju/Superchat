import React, { useState, useEffect } from 'react';
import { UserProfile, Contact, View } from './types';
import { generatePublicAddress } from './services/crypto';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import Dashboard from './components/Dashboard';
import AddFriend from './components/AddFriend';
import { AvatarDisplay } from './components/Avatar';
import './App.css';

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
      <div className="splash-screen animate-out fade-out">
        <h1 className="splash-title animate-in zoom-in">
          SUPER CHAT
        </h1>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="app-container animate-in fade-in">
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <button onClick={() => setView('HOME')} className="sidebar-brand">
            Super Chat
          </button>
        </div>

        <div className="sidebar-content">
          <ChatList
            contacts={contacts}
            onChatClick={openChat}
            activeContactId={activeContact?.id}
            isMobile={false}
          />
        </div>

        <div className="sidebar-footer">
          <button
            onClick={() => setView('DASHBOARD')}
            className={`settings-button ${view === 'DASHBOARD' ? 'settings-button-active' : ''}`}
          >
            <AvatarDisplay id={user.id} username={user.username} className="w-10 h-10" />
            <div className="settings-info">
              <p className="settings-name">{user.username}</p>
              <p className={`settings-label ${view === 'DASHBOARD' ? 'label-active' : 'label-inactive'}`}>Settings</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Mobile / Shared Header */}
        <header className="top-header" style={{ display: view === 'HOME' ? 'none' : 'flex' }}>
          <div className="header-left">
            {view !== 'HOME' && (
              <button
                onClick={() => setView('HOME')}
                className="header-back-button"
                aria-label="Back"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div>
              {view === 'HOME' && <h1 className="header-brand-mobile">Super Chat</h1>}
              {view === 'CHAT' && activeContact && (
                <div className="chat-header-info">
                  <AvatarDisplay id={activeContact.id} username={activeContact.username} className="w-8 h-8" />
                  <div>
                    <h3 className="chat-header-name">{activeContact.username}</h3>
                    <p className="chat-header-status">Hashed Active</p>
                  </div>
                </div>
              )}
              {view === 'DASHBOARD' && <h1 className="settings-label" style={{ fontSize: '14px', color: 'var(--slate-800)' }}>Profile Settings</h1>}
              {view === 'ADD_CONTACT' && <h1 className="settings-label" style={{ fontSize: '14px', color: 'var(--slate-800)' }}>Connect with Hash</h1>}
            </div>
          </div>
          <div className="header-right">
            {view === 'HOME' && (
              <button
                onClick={() => setView('DASHBOARD')}
                className="lg-hidden-only"
              >
                <AvatarDisplay id={user.id} username={user.username} className="w-10 h-10" />
              </button>
            )}
          </div>
        </header>

        {/* Mobile Home Header (only visible on mobile HOME view) */}
        {view === 'HOME' && (
          <header className="top-header lg:hidden">
            <div className="header-left">
              <h1 className="header-brand-mobile">Super Chat</h1>
            </div>
            <div className="header-right">
              <button onClick={() => setView('DASHBOARD')}>
                <AvatarDisplay id={user.id} username={user.username} className="w-10 h-10" />
              </button>
            </div>
          </header>
        )}

        <div className="view-container">
          {view === 'HOME' && (
            <div className="home-view">
              <div className="chat-list-mobile-scroll">
                <ChatList
                  contacts={contacts}
                  onChatClick={openChat}
                  activeContactId={activeContact?.id}
                  isMobile={true}
                />
              </div>
              <div className="empty-state">
                <div className="empty-state-icon-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" className="empty-state-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h2 className="empty-state-title">Ready for lift off?</h2>
                <p className="empty-state-subtitle">Fast, Hashed, and Minimalist.</p>
                <button
                  onClick={() => setView('ADD_CONTACT')}
                  className="add-someone-button"
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
            className="fab"
          >
            <span className="fab-icon">+</span>
            <span className="fab-text">New</span>
          </button>
        )}
      </main>
    </div>
  );
};

export default App;
