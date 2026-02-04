
import React from 'react';

export const EMOJI_COUNT = 40;

export const AvatarDisplay: React.FC<{ id: string; username: string; avatar?: string; className?: string }> = ({ id, username, className = "" }) => {
  // Directly use the provided ID for the RoboHash image as requested.
  // This ensures profile pictures are deterministic and uneditable.
  const roboHashUrl = `https://robohash.org/k${id}`;

  return (
    <div className={`shrink-0 overflow-hidden bg-slate-50 flex items-center justify-center rounded-full border-2 border-slate-100 ${className}`}>
      <img
        src={roboHashUrl}
        alt={username}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={(e) => {
          // Final fallback to initials if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const initials = username.substring(0, 1).toUpperCase();
          target.parentElement!.innerHTML = `<span class="font-black text-slate-400 uppercase">${initials}</span>`;
        }}
      />
    </div>
  );
};
