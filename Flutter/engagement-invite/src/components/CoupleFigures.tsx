import { motion } from 'framer-motion';
import { BRIDE, GROOM, OUTFITS } from '../data/invitation';

interface CoupleFiguresProps {
  /** 0 = far apart, 1 = together at center */
  proximity: number;
}

function PersonFigure({
  side,
  color,
  name,
}: {
  side: 'left' | 'right';
  color: string;
  name: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 80 120" className="h-24 w-16 sm:h-32 sm:w-20" aria-hidden="true">
        <circle cx="40" cy="18" r="12" fill={color} opacity="0.9" />
        <path
          d="M40 32 C28 32 18 48 16 72 L16 110 L32 110 L34 78 L46 78 L48 110 L64 110 L64 72 C62 48 52 32 40 32Z"
          fill={color}
          opacity="0.85"
        />
        {side === 'left' && (
          <path d="M48 50 L58 62 L52 66 L44 56Z" fill={color} opacity="0.6" />
        )}
        {side === 'right' && (
          <path d="M32 50 L22 62 L28 66 L36 56Z" fill={color} opacity="0.6" />
        )}
      </svg>
      <span className="font-serif text-sm font-medium text-navy/80 sm:text-base">{name}</span>
    </div>
  );
}

export default function CoupleFigures({ proximity }: CoupleFiguresProps) {
  const clamped = Math.min(Math.max(proximity, 0), 1);
  const leftX = 8 + clamped * 32;
  const rightX = 92 - clamped * 32;

  return (
    <div className="relative mx-auto h-40 w-full max-w-md sm:h-48">
      <motion.div
        className="absolute bottom-0 -translate-x-1/2"
        animate={{ left: `${leftX}%` }}
        transition={{ type: 'spring', stiffness: 90, damping: 20 }}
      >
        <PersonFigure side="left" color={OUTFITS.bride.hex} name={BRIDE} />
      </motion.div>

      <motion.div
        className="absolute bottom-0 -translate-x-1/2"
        animate={{ left: `${rightX}%` }}
        transition={{ type: 'spring', stiffness: 90, damping: 20 }}
      >
        <PersonFigure side="right" color={OUTFITS.groom.hex} name={GROOM} />
      </motion.div>

      {clamped > 0.85 && (
        <motion.div
          className="absolute left-1/2 top-4 -translate-x-1/2 text-2xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          aria-hidden="true"
        >
          💍
        </motion.div>
      )}

      <div className="absolute bottom-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-lavender/40 to-transparent" />
    </div>
  );
}
