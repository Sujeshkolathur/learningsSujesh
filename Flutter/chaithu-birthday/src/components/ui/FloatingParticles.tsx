import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface FloatingParticlesProps {
  count?: number;
  variant?: 'stars' | 'hearts';
}

export default function FloatingParticles({ count = 20, variant = 'stars' }: FloatingParticlesProps) {
  const reduced = useReducedMotion();
  if (reduced) return null;

  const items = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${(i * 17 + 7) % 100}%`,
    top: `${(i * 23 + 11) % 100}%`,
    size: variant === 'stars' ? 2 + (i % 3) : 8 + (i % 4),
    delay: (i % 5) * 0.8,
    duration: 4 + (i % 4),
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {items.map((p) => (
        <motion.span
          key={p.id}
          className={`absolute ${variant === 'stars' ? 'rounded-full bg-gold/50' : 'text-blush/25'}`}
          style={{
            left: p.left,
            top: p.top,
            width: variant === 'stars' ? p.size : undefined,
            height: variant === 'stars' ? p.size : undefined,
            fontSize: variant === 'hearts' ? p.size : undefined,
          }}
          animate={{
            y: [0, -14, 0],
            opacity: variant === 'stars' ? [0.2, 0.9, 0.2] : [0.15, 0.45, 0.15],
            scale: variant === 'stars' ? [1, 1.3, 1] : [1, 1.1, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {variant === 'hearts' ? '♥' : null}
        </motion.span>
      ))}
    </div>
  );
}
