import { motion, AnimatePresence } from 'framer-motion';
import { COUNTDOWN } from '../data/story';
import { useCountdown } from '../hooks/useCountdown';
import ScrollReveal from './ui/ScrollReveal';
import SectionWrapper from './ui/SectionWrapper';
import StaggerText from './ui/StaggerText';
import { flipNumber } from './ui/motionVariants';
import { useReducedMotion } from '../hooks/useReducedMotion';

const UNITS = ['Days', 'Hours', 'Minutes', 'Seconds'] as const;

function FlipDigit({ value }: { value: number }) {
  const reduced = useReducedMotion();
  const text = String(value).padStart(2, '0');

  if (reduced) {
    return <span className="font-serif block text-3xl font-bold text-wine sm:text-5xl">{text}</span>;
  }

  return (
    <span className="relative inline-block overflow-hidden" style={{ perspective: 400 }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={text}
          className="font-serif block text-3xl font-bold text-wine sm:text-5xl"
          variants={flipNumber}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function EngagementCountdown() {
  const { days, hours, minutes, seconds, finished } = useCountdown();
  const values = [days, hours, minutes, seconds];

  return (
    <SectionWrapper className="bg-gradient-to-b from-blush-soft/50 to-ivory">
      <ScrollReveal direction="scale">
        <StaggerText
          as="h2"
          text={COUNTDOWN.heading}
          className="font-serif mb-6 text-center text-3xl font-semibold text-wine sm:text-4xl"
        />
      </ScrollReveal>

      <div className="mb-12 space-y-3">
        {COUNTDOWN.lines.map((line, i) => (
          <ScrollReveal key={line} delay={i * 0.1} direction={i % 2 === 0 ? 'left' : 'right'}>
            <p className="font-sans text-center text-base text-charcoal/80 sm:text-lg">{line}</p>
          </ScrollReveal>
        ))}
      </div>

      {finished ? (
        <ScrollReveal>
          <motion.p
            className="font-serif text-center text-2xl italic text-wine"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Our forever begins. ❤️
          </motion.p>
        </ScrollReveal>
      ) : (
        <ScrollReveal delay={0.2}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {values.map((val, i) => (
              <motion.div
                key={UNITS[i]}
                className="countdown-card rounded-2xl border border-wine/15 bg-white/70 p-4 text-center backdrop-blur-sm sm:p-6"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7 }}
                whileHover={{ y: -3 }}
              >
                <FlipDigit value={val} />
                <span className="font-sans mt-1 block text-xs uppercase tracking-widest text-charcoal/50 sm:text-sm">
                  {UNITS[i]}
                </span>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      )}
    </SectionWrapper>
  );
}
