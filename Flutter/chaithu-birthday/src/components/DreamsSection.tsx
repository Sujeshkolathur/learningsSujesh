import { motion } from 'framer-motion';
import { DREAMS } from '../data/story';
import FloatingParticles from './ui/FloatingParticles';
import ScrollReveal from './ui/ScrollReveal';
import SectionWrapper from './ui/SectionWrapper';
import StaggerText from './ui/StaggerText';
import { fadeUp, staggerContainer } from './ui/motionVariants';

export default function DreamsSection() {
  return (
    <SectionWrapper dark className="overflow-hidden bg-gradient-to-b from-charcoal via-[#1f1418] to-wine-deep">
      <FloatingParticles count={36} variant="stars" />

      <ScrollReveal direction="scale">
        <StaggerText
          as="h2"
          text={DREAMS.heading}
          className="font-serif relative z-10 mb-12 text-center text-3xl font-semibold text-blush sm:text-4xl"
        />
      </ScrollReveal>

      <motion.div
        className="relative z-10 space-y-5"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        {DREAMS.lines.map((line, i) => (
          <motion.p
            key={line}
            className="font-sans text-center text-base leading-relaxed text-ivory/80 sm:text-lg"
            variants={fadeUp}
            custom={i * 0.08}
          >
            {line}
          </motion.p>
        ))}
      </motion.div>

      <ScrollReveal delay={0.3}>
        <motion.p
          className="font-serif relative z-10 mt-12 whitespace-pre-line text-center text-xl italic text-gold-light sm:text-2xl"
          initial={{ opacity: 0, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
        >
          {DREAMS.closing}
        </motion.p>
      </ScrollReveal>
    </SectionWrapper>
  );
}
