import { motion } from 'framer-motion';
import { fadeUp } from './motionVariants';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface StaggerLinesProps {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
}

export default function StaggerLines({
  lines,
  className = '',
  lineClassName = '',
  delay = 0,
}: StaggerLinesProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className={className}>
        {lines.map((line) => (
          <p key={line} className={lineClassName}>
            {line}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      {lines.map((line, i) => (
        <motion.p
          key={line}
          className={lineClassName}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-30px' }}
          custom={delay + i * 0.15}
        >
          {line}
        </motion.p>
      ))}
    </div>
  );
}
