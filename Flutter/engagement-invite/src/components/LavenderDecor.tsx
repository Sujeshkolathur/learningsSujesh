import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function LavenderDecor() {
  const reduced = useReducedMotion();
  if (reduced) return null;

  const sprigs = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: `${(i * 13 + 5) % 92}%`,
    top: `${(i * 19 + 8) % 85}%`,
    rotate: -15 + (i % 5) * 8,
    delay: i * 0.5,
    duration: 5 + (i % 3),
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {sprigs.map((s) => (
        <motion.svg
          key={s.id}
          viewBox="0 0 48 96"
          className="absolute h-16 w-8 opacity-20 sm:h-24 sm:w-12"
          style={{ left: s.left, top: s.top, rotate: s.rotate }}
          animate={{ y: [0, -10, 0], opacity: [0.15, 0.28, 0.15] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M24 92 Q22 50 24 20" stroke="#6b8f5e" strokeWidth="2" fill="none" />
          {[30, 42, 54, 66].map((y) => (
            <g key={y} transform={`translate(24, ${y})`}>
              <ellipse cx="-7" cy="0" rx="5" ry="7" fill="#9b8ab8" />
              <ellipse cx="7" cy="0" rx="5" ry="7" fill="#c4b8dc" />
            </g>
          ))}
        </motion.svg>
      ))}
    </div>
  );
}
