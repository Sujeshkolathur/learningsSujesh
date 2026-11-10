import { motion } from 'framer-motion';
import { FINAL } from '../data/story';
import FloatingParticles from './ui/FloatingParticles';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function FinalSection() {
  const reduced = useReducedMotion();

  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-charcoal via-wine-deep to-black px-5 py-20 text-center text-ivory">
      <FloatingParticles count={20} variant="stars" />

      <motion.div
        className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-wine/30 blur-3xl"
        animate={reduced ? {} : { scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 5, repeat: Infinity }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-lg space-y-12">
        {FINAL.sequence.map((item, i) => (
          <motion.div
            key={item.main}
            initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 1.1, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.p
              className="font-sans mb-2 text-sm uppercase tracking-[0.25em] text-blush/60"
              initial={{ letterSpacing: '0.4em', opacity: 0 }}
              whileInView={{ letterSpacing: '0.25em', opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: i * 0.15 }}
            >
              {item.prefix}
            </motion.p>
            <motion.p
              className="font-serif text-3xl font-semibold text-blush sm:text-4xl"
              initial={{ scale: 0.92 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200, damping: 18, delay: i * 0.15 + 0.2 }}
            >
              {item.main}
            </motion.p>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-serif mb-6 text-4xl font-semibold text-gold-light sm:text-5xl">
            {FINAL.closing}
          </h2>
          <p className="font-sans whitespace-pre-line text-sm leading-relaxed text-blush/70 sm:text-base">
            {FINAL.footer}
          </p>
        </motion.div>

        <motion.span
          className="inline-block text-4xl"
          animate={reduced ? {} : { scale: [1, 1.2, 1], rotate: [0, 4, -4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          ❤️
        </motion.span>
      </div>
    </section>
  );
}
