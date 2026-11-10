import { motion } from 'framer-motion';
import { JOURNEY } from '../data/story';
import ScrollReveal from './ui/ScrollReveal';
import SectionWrapper from './ui/SectionWrapper';
import StaggerText from './ui/StaggerText';
import { lineDraw } from './ui/motionVariants';

export default function JourneyTimeline() {
  return (
    <SectionWrapper className="bg-gradient-to-b from-ivory to-blush-soft/40">
      <ScrollReveal direction="scale">
        <StaggerText
          as="h2"
          text="Our Journey"
          className="font-serif mb-14 text-center text-3xl font-semibold text-wine sm:text-4xl"
        />
      </ScrollReveal>

      <div className="relative">
        <motion.div
          className="absolute bottom-0 left-4 top-0 w-px origin-top bg-gradient-to-b from-gold/60 via-wine/30 to-gold/60 sm:left-1/2 sm:-translate-x-px"
          variants={lineDraw}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          aria-hidden="true"
        />

        {JOURNEY.map((item, i) => (
          <ScrollReveal key={item.title} delay={i * 0.08}>
            <motion.div
              className={`relative mb-10 flex flex-col pl-10 sm:mb-12 sm:w-1/2 sm:pl-0 ${
                i % 2 === 0 ? 'sm:mr-auto sm:pr-10 sm:text-right' : 'sm:ml-auto sm:pl-10 sm:text-left'
              }`}
              initial={{ opacity: 0, x: i % 2 === 0 ? -32 : 32, y: 16 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.span
                className={`absolute top-1 h-3 w-3 rounded-full border-2 border-gold bg-ivory left-[11px] sm:top-2 ${
                  i % 2 === 0 ? 'sm:left-auto sm:right-[-6px]' : 'sm:left-[-6px]'
                }`}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 + 0.2, type: 'spring', stiffness: 300 }}
              />
              <motion.div
                className="rounded-2xl border border-wine/10 bg-white/60 p-5 backdrop-blur-sm sm:p-6"
                whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(92,26,46,0.08)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              >
                <h3 className="font-serif mb-2 text-lg font-semibold text-wine">{item.title}</h3>
                <p className="font-sans text-sm leading-relaxed text-charcoal/75 sm:text-base">{item.text}</p>
              </motion.div>
            </motion.div>
          </ScrollReveal>
        ))}
      </div>
    </SectionWrapper>
  );
}
