import { motion } from 'framer-motion';
import { FLORAL } from '../data/invitation';
import { useReducedMotion } from '../hooks/useReducedMotion';

type Overlay = 'light' | 'medium' | 'dark';

interface FloralBackgroundProps {
  image?: string;
  overlay?: Overlay;
  animate?: boolean;
  className?: string;
}

const overlays: Record<Overlay, string> = {
  light: 'bg-gradient-to-b from-cream/92 via-lavender-soft/88 to-white/94',
  medium: 'bg-gradient-to-b from-white/88 via-lavender-soft/82 to-cream/90',
  dark: 'bg-gradient-to-b from-navy/88 via-navy/82 to-navy-deep/92',
};

export default function FloralBackground({
  image = FLORAL.hero,
  overlay = 'light',
  animate = true,
  className = '',
}: FloralBackgroundProps) {
  const reduced = useReducedMotion();

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <motion.img
        src={image}
        alt=""
        className="h-full w-full scale-105 object-cover"
        animate={animate && !reduced ? { scale: [1.05, 1.1, 1.05] } : undefined}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        loading="eager"
      />
      <div className={`absolute inset-0 ${overlays[overlay]}`} />
    </div>
  );
}

interface FloralCornerProps {
  src: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export function FloralCorner({ src, position }: FloralCornerProps) {
  const pos =
    position === 'top-left'
      ? 'left-0 top-0 -translate-x-1/4 -translate-y-1/4'
      : position === 'top-right'
        ? 'right-0 top-0 translate-x-1/4 -translate-y-1/4'
        : position === 'bottom-left'
          ? 'bottom-0 left-0 -translate-x-1/4 translate-y-1/4'
          : 'bottom-0 right-0 translate-x-1/4 translate-y-1/4';

  return (
    <img
      src={src}
      alt=""
      className={`pointer-events-none absolute z-[1] h-36 w-36 rounded-full object-cover opacity-50 shadow-lg shadow-lavender/20 sm:h-52 sm:w-52 ${pos}`}
      loading="lazy"
    />
  );
}
