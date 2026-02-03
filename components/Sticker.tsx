import React, { useState, useEffect } from 'react';
import './Sticker.css';

interface StickerProps {
  index: number;
  className?: string;
}

export const Sticker: React.FC<StickerProps> = ({ index, className = '' }) => {
  // Default to the requested format
  const [src, setSrc] = useState(`/emojis/emoji_${index}.png`);
  const [hasError, setHasError] = useState(false);

  // Reset state when index changes
  useEffect(() => {
    setSrc(`/emojis/emoji_${index}.png`);
    setHasError(false);
  }, [index]);

  const handleError = () => {
    // Basic fallback chain: emoji_1.png -> emoji1.png -> 1.png
    if (src.endsWith(`emoji_${index}.png`)) {
      setSrc(`/emojis/emoji${index}.png`);
    } else if (src.endsWith(`emoji${index}.png`)) {
      setSrc(`/emojis/${index}.png`);
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <div className={`sticker-error ${className}`} title={`Missing sticker: ${index}`}>
        <span className="sticker-error-icon font-chewy">?</span>
      </div>
    );
  }

  return (
    <div className={`sticker-container ${className}`}>
      <img
        src={src}
        alt={`Sticker ${index}`}
        className="sticker-image"
        loading="lazy"
        onError={handleError}
      />
    </div>
  );
};
