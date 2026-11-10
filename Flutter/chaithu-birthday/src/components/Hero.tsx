import { motion } from 'framer-motion';
import { useState } from 'react';
import { HERO, HERO_BACKGROUND } from '../data/story';
import FloatingParticles from './ui/FloatingParticles';
import { ParallaxBg } from './ui/ScrollReveal';
import StaggerText from './ui/StaggerText';
import StaggerLines from './ui/StaggerLines';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function Hero() {
  const reduced = useReducedMotion();
  const [revealed, setRevealed] = useState(false);

  function scrollToStory() {
    document.getElementById('first-hello')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-5 text-center text-ivory">
      <div className="absolute inset-0" aria-hidden="true">
        <ParallaxBg className="absolute inset-0 h-[115%] w-full">
          <motion.img
            src={HERO_BACKGROUND}
            alt=""
            className="h-full w-full object-cover object-[center_35%] sm:object-center"
            animate={reduced ? {} : { scale: [1, 1.06, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
        </ParallaxBg>
        <div className="absolute inset-0 bg-gradient-to-b from-wine-deep/88 via-wine/78 to-charcoal/92" />
        <div className="absolute inset-0 bg-charcoal/25" />
      </div>

      <FloatingParticles count={28} variant="stars" />

      <motion.div
        className="absolute left-1/2 top-1/3 h-48 w-48 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl"
        animate={reduced ? {} : { scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-lg drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]"
      >
        <motion.p
          className="font-script mb-4 text-2xl text-gold-light sm:text-3xl"
          initial={{ opacity: 0, letterSpacing: '0.3em' }}
          animate={{ opacity: 1, letterSpacing: '0.05em' }}
          transition={{ duration: 1.4, delay: 0.3 }}
        >
          It all started with a Hello
        </motion.p>

        <StaggerText
          as="h1"
          text={HERO.title}
          className="font-serif mb-8 text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl"
          delay={0.5}
        />

        <StaggerLines
          lines={HERO.lines}
          className="space-y-2"
          lineClassName="font-sans text-base font-light leading-relaxed text-blush sm:text-lg"
          delay={1.2}
        />

        {!revealed ? (
          <motion.button
            type="button"
            onClick={() => setRevealed(true)}
            className="mt-10 rounded-full border border-gold/40 bg-gold/10 px-8 py-3 font-sans text-sm uppercase tracking-[0.2em] text-gold-light backdrop-blur-sm transition hover:bg-gold/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.2 }}
            whileHover={{ scale: 1.04, boxShadow: '0 0 24px rgba(201,169,98,0.25)' }}
            whileTap={{ scale: 0.97 }}
          >
            Continue
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-8 space-y-3"
          >
            {HERO.reveal.map((line, i) => (
              <motion.p
                key={line}
                className="font-serif text-xl italic text-blush-soft sm:text-2xl"
                initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: i * 0.5, duration: 0.9 }}
              >
                {line}
              </motion.p>
            ))}
            <motion.button
              type="button"
              onClick={scrollToStory}
              className="mt-8 rounded-full bg-gold px-10 py-3.5 font-sans text-sm font-medium uppercase tracking-[0.15em] text-charcoal transition hover:bg-gold-light"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {HERO.cta}
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      <motion.span
        className="absolute bottom-8 z-10 text-blush/40"
        animate={reduced ? {} : { y: [0, 8, 0], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        aria-hidden="true"
      >
        ↓
      </motion.span>
    </section>
  );
}
