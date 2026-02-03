
import React, { useState, useEffect } from 'react';

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
      <div className={`inline-flex items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl ${className}`} title={`Missing sticker: ${index}`}>
        <span className="text-slate-300 font-chewy text-xl select-none">?</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center justify-center overflow-hidden ${className}`}>
      <img
        src={src}
        alt={`Sticker ${index}`}
        className="w-full h-full object-contain drop-shadow-md hover:scale-110 transition-transform duration-200"
        loading="lazy"
        onError={handleError}
      />
    </div>
  );
};
