import React, { useState } from 'react';
import { UserProfile } from '../types';
import { AvatarDisplay } from './Avatar';
import './Dashboard.css';

interface DashboardProps {
  user: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
  onBack: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onUpdate, onBack }) => {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(user.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="dashboard-container animate-in fade-in slide-in-from-bottom">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Account</h2>
          <p className="dashboard-subtitle">Manage your identity and encryption keys.</p>
        </div>

        <div className="dashboard-stack">
          <section className="profile-section">
            <div className="profile-avatar">
              <AvatarDisplay id={user.id} username={user.username} className="w-24 h-24 text-4xl" />
            </div>

            <div className="profile-info">
              <h4 className="profile-name">{user.username}</h4>
              <p className="profile-label">Permanent Identity Image</p>
              <p className="profile-desc">Profile pictures are automatically generated from your Public Key.</p>
            </div>
          </section>

          <div className="settings-grid">
            <div className="input-group">
              <label className="input-label">Display Alias</label>
              <input
                type="text"
                value={user.username}
                onChange={(e) => onUpdate({ username: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="input-group">
              <label className="input-label">Master Hash Key</label>
              <input
                type="password"
                value={user.hashingKey}
                onChange={(e) => onUpdate({ hashingKey: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div className="key-section">
            <div className="key-stack">
              <div>
                <label className="profile-label" style={{ color: 'var(--slate-900)', marginBottom: '0.5rem', display: 'block' }}>Public Key</label>
                <code className="key-display">
                  {user.id}
                </code>
              </div>
              <button
                onClick={copyAddress}
                className={`copy-button ${copied ? 'copy-button-success' : ''}`}
              >
                {copied ? 'Copied' : 'Copy Key'}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              </button>
            </div>
          </div>

          <button
            onClick={onBack}
            className="confirm-button"
          >
            Confirm Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
