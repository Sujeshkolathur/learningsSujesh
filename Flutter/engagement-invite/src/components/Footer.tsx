import { motion } from 'framer-motion';
import { BRIDE, FLORAL, GROOM, INVITATION } from '../data/invitation';
import FloralBackground from './FloralBackground';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden px-5 py-14 text-center text-white">
      <FloralBackground image={FLORAL.hero} overlay="dark" animate={false} />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative z-10 mx-auto max-w-md"
      >
        <p className="font-script text-4xl text-lavender-light sm:text-5xl">
          {BRIDE} & {GROOM}
        </p>
        <p className="font-sans mt-4 text-sm leading-relaxed text-white/70">{INVITATION.closing}</p>
        <p className="font-serif mt-6 text-lg italic text-lavender-soft">{INVITATION.rsvpNote}</p>
        <p className="font-sans mt-10 text-xs uppercase tracking-[0.3em] text-white/40">September 6, 2026</p>
      </motion.div>
    </footer>
  );
}
