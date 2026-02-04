
import React from 'react';

interface SpriteEmojiProps {
  index: number;
  size?: string;
  className?: string;
}

/**
 * 8 Columns (Left to Right)
 * 5 Rows (Top to Bottom)
 * Total 40 Emojis
 * Logic based on standard CSS background-position: (col / (total_cols - 1)) * 100
 */
export const SpriteEmoji: React.FC<SpriteEmojiProps> = ({ index, size = '100%', className = '' }) => {
  const COLS = 8;
  const ROWS = 5;
  
  // Clamping to [0, 39]
  const safeIndex = Math.max(0, Math.min(index, 39));
  
  const col = safeIndex % COLS;
  const row = Math.floor(safeIndex / COLS);
  
  const posX = (col / (COLS - 1)) * 100;
  const posY = (row / (ROWS - 1)) * 100;

  return (
    <div 
      className={`block shrink-0 overflow-hidden bg-transparent ${className}`}
      style={{
        width: size,
        height: size,
        backgroundImage: "url('sheet.png')",
        backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
        backgroundPosition: `${posX}% ${posY}%`,
        backgroundRepeat: 'no-repeat',
        imageRendering: 'auto'
      }}
      aria-label={`Sticker ${safeIndex}`}
    />
  );
};
