import { motion } from 'framer-motion';
import { PROMISES } from '../data/story';
import ScrollReveal from './ui/ScrollReveal';
import SectionWrapper from './ui/SectionWrapper';
import StaggerText from './ui/StaggerText';

export default function PromiseSection() {
  return (
    <SectionWrapper dark className="bg-gradient-to-b from-wine-deep to-charcoal">
      <ScrollReveal direction="scale">
        <StaggerText
          as="h2"
          text={PROMISES.heading}
          className="font-serif mb-12 text-center text-3xl font-semibold text-blush sm:text-4xl"
        />
      </ScrollReveal>

      <div className="space-y-5">
        {PROMISES.lines.map((line, i) => (
          <ScrollReveal key={i} delay={i * 0.08} direction={i % 2 === 0 ? 'left' : 'right'}>
            <motion.p
              className="font-sans text-center text-base leading-relaxed text-ivory/85 sm:text-lg"
              whileInView={{ opacity: [0.7, 1] }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {line}
            </motion.p>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={0.3}>
        <motion.p
          className="font-serif mt-12 text-center text-xl italic text-gold-light sm:text-2xl"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {PROMISES.closing}
        </motion.p>
      </ScrollReveal>
    </SectionWrapper>
  );
}
