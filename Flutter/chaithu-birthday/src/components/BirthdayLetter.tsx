import { motion } from 'framer-motion';
import { LOVE_LETTER } from '../data/story';
import ScrollReveal from './ui/ScrollReveal';
import SectionWrapper from './ui/SectionWrapper';
import StaggerText from './ui/StaggerText';
import { fadeUp } from './ui/motionVariants';

export default function BirthdayLetter() {
  const paragraphs = LOVE_LETTER.body.split('\n\n').filter(Boolean);

  return (
    <SectionWrapper className="bg-[#fdf8f4]">
      <ScrollReveal direction="scale">
        <StaggerText
          as="h2"
          text={LOVE_LETTER.heading}
          className="font-serif mb-10 text-center text-3xl font-semibold text-wine sm:text-4xl"
        />
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <motion.div
          className="relative rounded-sm border border-wine/10 bg-[#fffef9] p-6 shadow-lg shadow-wine/5 sm:p-10"
          initial={{ opacity: 0, y: 40, rotateX: 8 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformPerspective: 800 }}
        >
          <div className="pointer-events-none absolute left-6 top-0 h-full w-px bg-wine/10 sm:left-10" />
          <div className="space-y-5 pl-4 sm:pl-6">
            {paragraphs.map((para, i) => (
              <motion.p
                key={i}
                className="font-sans text-sm leading-[1.9] text-charcoal/85 sm:text-base"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-20px' }}
                custom={i * 0.08}
              >
                {para}
              </motion.p>
            ))}
          </div>
        </motion.div>
      </ScrollReveal>
    </SectionWrapper>
  );
}
