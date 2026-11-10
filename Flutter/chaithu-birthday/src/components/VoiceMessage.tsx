import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { VOICE_MESSAGE } from '../data/story';
import ScrollReveal from './ui/ScrollReveal';
import SectionWrapper from './ui/SectionWrapper';
import StaggerText from './ui/StaggerText';

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function VoiceMessage() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => {
      setCurrent(audio.currentTime);
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    };
    const onMeta = () => setDuration(audio.duration);
    const onEnd = () => setPlaying(false);

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnd);

    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnd);
    };
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const pct = Number(e.target.value);
    audio.currentTime = (pct / 100) * audio.duration;
    setProgress(pct);
  }

  if (!VOICE_MESSAGE.src) return null;

  return (
    <SectionWrapper className="overflow-hidden bg-gradient-to-b from-wine/10 via-blush-soft/50 to-ivory">
      <ScrollReveal direction="scale">
        <StaggerText
          as="h2"
          text={VOICE_MESSAGE.heading}
          className="font-serif mb-4 text-center text-3xl font-semibold text-wine sm:text-4xl"
        />
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <p className="font-sans mb-10 text-center text-base text-charcoal/75 sm:text-lg">
          {VOICE_MESSAGE.subtitle}
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <div className="mx-auto max-w-sm rounded-2xl border border-wine/15 bg-white/80 p-6 shadow-lg shadow-wine/10 backdrop-blur-sm sm:p-8">
          <audio ref={audioRef} src={VOICE_MESSAGE.src} preload="metadata" />

          <div className="flex flex-col items-center gap-6">
            <motion.button
              type="button"
              onClick={toggle}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-wine to-wine-deep text-ivory shadow-lg shadow-wine/30 transition hover:from-wine-light hover:to-wine sm:h-24 sm:w-24"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              aria-label={playing ? 'Pause recording' : 'Play recording'}
            >
              {playing ? (
                <span className="font-sans text-2xl tracking-tighter sm:text-3xl">❚❚</span>
              ) : (
                <span className="ml-1 font-sans text-3xl sm:text-4xl">▶</span>
              )}
            </motion.button>

            <p className="font-script text-xl text-wine/80">
              {playing ? VOICE_MESSAGE.pauseLabel : VOICE_MESSAGE.playLabel}
            </p>

            <div className="w-full space-y-2">
              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={handleSeek}
                className="voice-progress h-1.5 w-full cursor-pointer appearance-none rounded-full bg-wine/15 accent-wine"
                aria-label="Seek voice recording"
              />
              <div className="flex justify-between font-sans text-xs text-charcoal/50">
                <span>{formatTime(current)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          {playing && (
            <motion.div
              className="mt-6 flex justify-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              aria-hidden="true"
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.span
                  key={i}
                  className="w-1 rounded-full bg-wine/60"
                  animate={{ height: [8, 24, 8] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.12 }}
                />
              ))}
            </motion.div>
          )}
        </div>
      </ScrollReveal>
    </SectionWrapper>
  );
}
