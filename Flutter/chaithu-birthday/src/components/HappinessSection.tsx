import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HAPPINESS } from '../data/story';
import ScrollReveal from './ui/ScrollReveal';
import SectionWrapper from './ui/SectionWrapper';
import StaggerText from './ui/StaggerText';

export default function HappinessSection() {
  const [step, setStep] = useState(0);
  const allRevealed = step >= HAPPINESS.reveals.length;

  return (
    <SectionWrapper className="bg-wine text-ivory">
      <ScrollReveal direction="scale">
        <StaggerText
          as="h2"
          text={HAPPINESS.heading}
          className="font-serif mb-10 text-center text-3xl font-semibold sm:text-4xl"
        />
      </ScrollReveal>

      <div className="mb-8 min-h-[160px] space-y-4">
        <AnimatePresence mode="popLayout">
          {HAPPINESS.reveals.slice(0, step).map((line) => (
            <motion.p
              key={line}
              className="font-serif text-center text-xl italic text-blush sm:text-2xl"
              initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              {line}
            </motion.p>
          ))}
        </AnimatePresence>
      </div>

      {!allRevealed && (
        <motion.div
          className="text-center"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            className="rounded-full border border-gold/50 px-8 py-3 font-sans text-sm uppercase tracking-widest text-gold-light transition hover:bg-gold/10"
          >
            {step === 0 ? 'Tap to reveal' : 'Continue'}
          </button>
        </motion.div>
      )}

      {allRevealed && (
        <>
          <ScrollReveal>
            <motion.p
              className="font-serif mt-8 text-center text-xl text-gold-light sm:text-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9 }}
            >
              {HAPPINESS.closing}
            </motion.p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="font-sans mt-8 text-center text-base leading-relaxed text-blush/90 sm:text-lg">
              {HAPPINESS.gratitude}
            </p>
          </ScrollReveal>
        </>
      )}
    </SectionWrapper>
  );
}
