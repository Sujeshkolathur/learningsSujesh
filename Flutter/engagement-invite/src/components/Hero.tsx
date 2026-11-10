import { motion } from 'framer-motion';
import { BRIDE, EVENT, FLORAL, GROOM, INVITATION, OUTFITS } from '../data/invitation';
import FloralBackground, { FloralCorner } from './FloralBackground';

export default function Hero() {
  return (
    <header className="relative overflow-hidden px-5 pb-16 pt-14 text-center sm:pb-20 sm:pt-20">
      <FloralBackground image={FLORAL.hero} overlay="light" />
      <FloralCorner src={FLORAL.cornerLeft} position="top-left" />
      <FloralCorner src={FLORAL.cornerRight} position="top-right" />

      <motion.div
        className="relative z-10 mx-auto max-w-2xl"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="font-sans mb-4 text-xs uppercase tracking-[0.35em] text-lavender-deep">
          {INVITATION.heroLine}
        </p>

        <p className="font-sans mb-6 text-sm leading-relaxed text-navy/80 sm:text-base">
          {INVITATION.inviteLine}
        </p>

        <h1 className="font-script mb-2 text-5xl text-lavender-deep drop-shadow-sm sm:text-7xl">{BRIDE}</h1>
        <p className="font-serif my-3 text-2xl italic text-navy/60 sm:text-3xl">&</p>
        <h1 className="font-script mb-8 text-5xl text-navy drop-shadow-sm sm:text-7xl">{GROOM}</h1>

        <div className="mx-auto mb-8 flex max-w-xs justify-center gap-6">
          <div className="text-center">
            <span className="mx-auto mb-1 block h-3 w-3 rounded-full bg-lavender" />
            <span className="font-sans text-xs text-navy/70">{OUTFITS.bride.color}</span>
          </div>
          <div className="text-center">
            <span className="mx-auto mb-1 block h-3 w-3 rounded-full bg-navy" />
            <span className="font-sans text-xs text-navy/70">{OUTFITS.groom.color}</span>
          </div>
        </div>

        <motion.div
          className="inline-block rounded-2xl border border-lavender/30 bg-white/75 px-8 py-3 shadow-lg shadow-lavender/10 backdrop-blur-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="font-serif text-lg font-semibold text-navy sm:text-xl">{EVENT.title}</p>
          <p className="font-sans mt-1 text-sm text-lavender-deep">{EVENT.dateDisplay}</p>
          <p className="font-sans text-sm text-navy/70">{EVENT.time}</p>
        </motion.div>
      </motion.div>

      <motion.div
        className="relative z-10 mx-auto mt-10 h-px w-48 bg-gradient-to-r from-transparent via-lavender to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      />
    </header>
  );
}
