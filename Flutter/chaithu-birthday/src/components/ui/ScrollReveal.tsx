import { motion, useScroll, useTransform } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'scale';
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: ScrollRevealProps) {
  const reduced = useReducedMotion();

  const hidden =
    direction === 'left'
      ? { opacity: 0, x: -36 }
      : direction === 'right'
        ? { opacity: 0, x: 36 }
        : direction === 'scale'
          ? { opacity: 0, scale: 0.94 }
          : { opacity: 0, y: 32 };

  const visible = { opacity: 1, x: 0, y: 0, scale: 1 };

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={hidden}
      whileInView={visible}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Subtle parallax wrapper for background images */
export function ParallaxBg({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, reduced ? 0 : 120]);
  const scale = useTransform(scrollY, [0, 600], [1, reduced ? 1 : 1.08]);

  return (
    <motion.div className={className} style={{ y, scale }}>
      {children}
    </motion.div>
  );
}
