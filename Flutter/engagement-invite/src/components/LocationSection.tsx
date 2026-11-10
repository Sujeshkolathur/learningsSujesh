import { motion } from 'framer-motion';
import { EVENT, FLORAL, VENUE } from '../data/invitation';
import FloralBackground from './FloralBackground';

export default function LocationSection() {
  return (
    <section className="relative overflow-hidden px-5 py-16 sm:py-20">
      <FloralBackground image={FLORAL.location} overlay="medium" />

      <div className="relative z-10 mx-auto max-w-lg text-center">
        <motion.h2
          className="font-serif mb-8 text-2xl font-semibold text-navy sm:text-3xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Venue
        </motion.h2>

        <motion.div
          className="rounded-2xl border border-lavender/25 bg-white/80 p-6 shadow-lg shadow-lavender/10 sm:p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <p className="font-serif text-xl font-semibold text-navy">{VENUE.name}</p>
          {VENUE.hall && <p className="font-sans mt-1 text-sm text-lavender-deep">{VENUE.hall}</p>}
          <p className="font-sans mt-4 leading-relaxed text-navy/75">{VENUE.address}</p>
          {VENUE.landmark && (
            <p className="font-sans mt-2 text-sm text-navy/50">{VENUE.landmark}</p>
          )}

          <div className="mt-4 flex items-center justify-center gap-2 font-sans text-sm text-navy/60">
            <span>📅 {EVENT.dateDisplay}</span>
          </div>
          <p className="font-sans mt-1 text-sm text-navy/60">🕐 {EVENT.time}</p>

          <motion.a
            href={VENUE.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-navy px-8 py-3.5 font-sans text-sm font-medium uppercase tracking-wider text-white transition hover:bg-navy-light"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            {VENUE.mapLabel}
          </motion.a>
        </motion.div>

        <motion.div
          className="mt-8 overflow-hidden rounded-2xl border border-lavender/20 shadow-md"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <iframe
            title="Venue map"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(VENUE.address)}&output=embed`}
            className="h-56 w-full border-0 sm:h-64"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </div>
    </section>
  );
}
