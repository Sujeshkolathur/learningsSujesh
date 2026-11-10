import { motion, AnimatePresence } from 'framer-motion';
import { useCountdown } from '../hooks/useCountdown';
import CoupleFigures from './CoupleFigures';
import { ENGAGEMENT_DATE, EVENT, FLORAL } from '../data/invitation';
import FloralBackground, { FloralCorner } from './FloralBackground';

const UNITS = ['Days', 'Hours', 'Minutes', 'Seconds'] as const;

function FlipUnit({ value, label, index }: { value: number; label: string; index: number }) {
  const text = String(value).padStart(2, '0');

  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <div
        className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-lavender/30 bg-white/90 shadow-md shadow-lavender/10 sm:h-20 sm:w-20"
        style={{ perspective: 400 }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            className="font-serif text-2xl font-bold text-navy sm:text-4xl"
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 90, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-2 font-sans text-[10px] uppercase tracking-[0.2em] text-lavender-deep sm:text-xs">
        {label}
      </span>
    </motion.div>
  );
}

export default function CountdownSection() {
  const countdown = useCountdown();
  const values = [countdown.days, countdown.hours, countdown.minutes, countdown.seconds];

  return (
    <section className="relative overflow-hidden px-5 py-16 sm:py-20">
      <FloralBackground image={FLORAL.countdown} overlay="medium" />
      <FloralCorner src={FLORAL.cornerLeft} position="bottom-left" />
      <FloralCorner src={FLORAL.cornerRight} position="bottom-right" />

      <motion.h2
        className="relative z-10 font-serif mb-2 text-center text-2xl font-semibold text-navy sm:text-3xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Counting down to forever
      </motion.h2>
      <p className="relative z-10 font-sans mb-10 text-center text-sm text-navy/70 sm:text-base">
        {new Date(ENGAGEMENT_DATE).toLocaleDateString('en-IN', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </p>

      <div className="relative z-10">
        <CoupleFigures proximity={countdown.progress} />
      </div>

      <p className="relative z-10 font-sans mb-8 mt-6 text-center text-xs uppercase tracking-widest text-lavender-deep/80">
        With every moment, we grow closer
      </p>

      {countdown.finished ? (
        <motion.p
          className="relative z-10 font-script text-center text-4xl text-lavender-deep sm:text-5xl"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Today is the day! 💍
        </motion.p>
      ) : (
        <div className="relative z-10 mx-auto grid max-w-sm grid-cols-2 gap-4 sm:max-w-lg sm:grid-cols-4 sm:gap-5">
          {values.map((val, i) => (
            <FlipUnit key={UNITS[i]} value={val} label={UNITS[i]} index={i} />
          ))}
        </div>
      )}

      <p className="relative z-10 font-sans mt-10 text-center text-sm italic text-navy/60">{EVENT.tagline}</p>
    </section>
  );
}
