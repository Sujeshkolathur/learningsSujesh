import { motion } from 'framer-motion';
import { FUTURE } from '../data/story';
import FloatingParticles from './ui/FloatingParticles';
import ScrollReveal from './ui/ScrollReveal';
import SectionWrapper from './ui/SectionWrapper';
import StaggerText from './ui/StaggerText';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function FutureSection() {
  const reduced = useReducedMotion();

  return (
    <SectionWrapper dark className="overflow-hidden bg-charcoal">
      <FloatingParticles count={14} variant="hearts" />

      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-wine/20 blur-3xl"
        animate={reduced ? {} : { scale: [1, 1.25, 1], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />

      <ScrollReveal direction="scale">
        <StaggerText
          as="h2"
          text={FUTURE.heading}
          className="font-serif relative z-10 mb-10 text-center text-3xl font-semibold text-blush sm:text-4xl"
        />
      </ScrollReveal>

      <div className="relative z-10 space-y-6">
        {FUTURE.lines.map((line, i) => (
          <ScrollReveal key={i} delay={i * 0.12} direction="up">
            <motion.p
              className="font-sans text-center text-lg leading-relaxed text-ivory/85 sm:text-xl"
              initial={{ opacity: 0, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: i * 0.1 }}
            >
              {line}
            </motion.p>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={0.3}>
        <motion.p
          className="font-serif relative z-10 mt-12 whitespace-pre-line text-center text-xl italic text-gold-light sm:text-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          {FUTURE.closing}
        </motion.p>
      </ScrollReveal>
    </SectionWrapper>
  );
}
