import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from './motionVariants';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface StaggerTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'p' | 'span';
  delay?: number;
}

export default function StaggerText({
  text,
  className = '',
  as: Tag = 'span',
  delay = 0,
}: StaggerTextProps) {
  const reduced = useReducedMotion();
  const words = text.split(' ');

  if (reduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  const MotionTag = motion[Tag] as typeof motion.span;

  return (
    <MotionTag
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      custom={delay}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={fadeUp}
          custom={delay + i * 0.06}
          className="mr-[0.28em] inline-block"
        >
          {word}
        </motion.span>
      ))}
    </MotionTag>
  );
}
