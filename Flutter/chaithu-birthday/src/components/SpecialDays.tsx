import { motion } from 'framer-motion';
import { SPECIAL_DAYS } from '../data/story';
import ScrollReveal from './ui/ScrollReveal';
import SectionWrapper from './ui/SectionWrapper';
import StaggerText from './ui/StaggerText';
import { dotPulse, fadeUp, staggerContainer } from './ui/motionVariants';

function formatDay(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').getDate();
}

function formatMonth(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
}

export default function SpecialDays() {
  return (
    <SectionWrapper className="bg-gradient-to-b from-ivory via-blush-soft/30 to-ivory">
      <ScrollReveal direction="scale">
        <StaggerText
          as="h2"
          text={SPECIAL_DAYS.heading}
          className="font-serif mb-4 text-center text-3xl font-semibold text-wine sm:text-4xl"
        />
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <p className="font-sans mb-12 text-center text-base text-charcoal/70 sm:text-lg">
          {SPECIAL_DAYS.intro}
        </p>
      </ScrollReveal>

      <motion.div
        className="grid gap-6 sm:grid-cols-2 sm:gap-8"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        {SPECIAL_DAYS.days.map((day, i) => (
          <motion.article
            key={day.date}
            variants={fadeUp}
            custom={i * 0.15}
            className="group relative overflow-hidden rounded-2xl border border-wine/15 bg-white/70 p-6 backdrop-blur-sm sm:p-8"
            whileHover={{ y: -6, boxShadow: '0 16px 48px rgba(92,26,46,0.1)' }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          >
            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gold/10 blur-2xl transition group-hover:bg-gold/20" />

            <div className="relative flex gap-5">
              <motion.div
                className="flex shrink-0 flex-col items-center justify-center rounded-xl border border-gold/30 bg-gradient-to-b from-wine/5 to-blush-soft/40 px-4 py-3"
                variants={dotPulse}
                custom={i * 0.2 + 0.3}
              >
                <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-wine/60">
                  {formatMonth(day.date)}
                </span>
                <span className="font-serif text-4xl font-bold leading-none text-wine sm:text-5xl">
                  {formatDay(day.date)}
                </span>
              </motion.div>

              <div className="min-w-0 flex-1 pt-1">
                <p className="font-script mb-1 text-lg text-gold">{day.display}</p>
                <h3 className="font-serif mb-2 text-xl font-semibold text-wine sm:text-2xl">
                  {day.title}
                </h3>
                <p className="font-sans text-sm leading-relaxed text-charcoal/75 sm:text-base">
                  {day.message}
                </p>
              </div>
            </div>

            <motion.span
              className="absolute bottom-4 right-5 text-lg text-blush/40"
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
              aria-hidden="true"
            >
              ♥
            </motion.span>
          </motion.article>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
