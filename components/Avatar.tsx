import './Avatar.css';

export const EMOJI_COUNT = 40;

export const AvatarDisplay: React.FC<{ id: string; username: string; avatar?: string; className?: string }> = ({ id, username, className = "" }) => {
  // Directly use the provided ID for the RoboHash image as requested.
  // This ensures profile pictures are deterministic and uneditable.
  const roboHashUrl = `https://robohash.org/${id}`;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Final fallback to initials if image fails to load
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    const initials = username.substring(0, 1).toUpperCase();
    const initialsSpan = document.createElement('span');
    initialsSpan.className = 'avatar-initials';
    initialsSpan.innerText = initials;
    target.parentElement?.appendChild(initialsSpan);
  };

  return (
    <div className={`avatar-container ${className}`}>
      <img
        src={roboHashUrl}
        alt={username}
        className="avatar-image"
        loading="lazy"
        onError={handleImageError}
      />
    </div>
  );
};
