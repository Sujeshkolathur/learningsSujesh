import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SECRET } from '../data/story';

export default function SecretMessage() {
  const [open, setOpen] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);

  function handleOpen() {
    setOpen(true);
    setTimeout(() => setEnvelopeOpen(true), 600);
  }

  return (
    <>
      <div className="py-12 text-center">
        <button
          type="button"
          onClick={handleOpen}
          className="rounded-full border border-gold/50 bg-transparent px-8 py-3 font-sans text-sm uppercase tracking-widest text-gold transition hover:bg-gold/10"
        >
          {SECRET.button}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/95 p-5 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="relative max-w-md text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {!envelopeOpen ? (
                <motion.div
                  className="mx-auto w-48 cursor-pointer sm:w-56"
                  animate={{ rotate: [0, -2, 2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  onClick={() => setEnvelopeOpen(true)}
                >
                  <div className="relative h-32 rounded-t-lg bg-blush shadow-2xl sm:h-36">
                    <div className="absolute inset-x-0 top-0 h-16 origin-top bg-wine/90" style={{ clipPath: 'polygon(0 0, 50% 100%, 100% 0)' }} />
                    <div className="absolute inset-0 flex items-center justify-center pt-8">
                      <span className="font-script text-2xl text-wine">❤</span>
                    </div>
                  </div>
                  <div className="h-24 rounded-b-lg bg-blush-soft shadow-inner sm:h-28" />
                  <p className="mt-4 font-sans text-sm text-blush/70">Tap to open</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="rounded-2xl border border-gold/30 bg-gradient-to-b from-wine to-wine-deep p-8 shadow-2xl sm:p-10"
                >
                  <p className="font-script mb-4 text-2xl text-gold-light">{SECRET.title},</p>
                  <p className="font-sans whitespace-pre-line text-base leading-relaxed text-blush sm:text-lg">
                    {SECRET.body}
                  </p>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="mt-8 font-sans text-sm uppercase tracking-widest text-gold/70 hover:text-gold"
                  >
                    Close
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
