import { motion } from 'framer-motion';
import { FIRST_HELLO } from '../data/story';
import ScrollReveal from './ui/ScrollReveal';
import SectionWrapper from './ui/SectionWrapper';
import StaggerText from './ui/StaggerText';
import { dotPulse, lineDraw } from './ui/motionVariants';

export default function FirstHello() {
  return (
    <SectionWrapper id="first-hello">
      <ScrollReveal direction="scale">
        <StaggerText
          as="h2"
          text={FIRST_HELLO.heading}
          className="font-serif mb-8 text-center text-3xl font-semibold text-wine sm:text-4xl"
        />
      </ScrollReveal>

      <div className="space-y-6">
        {FIRST_HELLO.paragraphs.map((p, i) => (
          <ScrollReveal key={i} delay={i * 0.1} direction={i % 2 === 0 ? 'left' : 'right'}>
            <p className="font-sans whitespace-pre-line text-center text-base leading-relaxed text-charcoal/85 sm:text-lg">
              {p}
            </p>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={0.3}>
        <motion.p
          className="font-serif mt-10 text-center text-xl italic text-wine sm:text-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          {FIRST_HELLO.highlight}
        </motion.p>
      </ScrollReveal>

      <ScrollReveal delay={0.4}>
        <div className="relative mt-14 flex flex-col gap-0 sm:gap-2">
          <motion.div
            className="absolute bottom-4 left-[5px] top-4 w-px origin-top bg-gradient-to-b from-gold/70 via-wine/40 to-gold/70"
            variants={lineDraw}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            aria-hidden="true"
          />

          {FIRST_HELLO.milestones.map((m, i) => (
            <motion.div
              key={m}
              className="relative flex items-center gap-4 py-3"
              variants={dotPulse}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i * 0.15}
            >
              <motion.span
                className="flex h-3 w-3 shrink-0 rounded-full bg-gold"
                whileInView={{ boxShadow: ['0 0 0 rgba(201,169,98,0)', '0 0 12px rgba(201,169,98,0.6)', '0 0 0 rgba(201,169,98,0)'] }}
                viewport={{ once: true }}
                transition={{ duration: 2, delay: i * 0.2, repeat: Infinity, repeatDelay: 3 }}
              />
              <motion.span
                className="font-sans text-sm uppercase tracking-wider text-wine/70 sm:text-base"
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 + 0.2, duration: 0.6 }}
              >
                {m}
              </motion.span>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>
    </SectionWrapper>
  );
}
