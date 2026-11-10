import { useEffect, useState } from 'react';
import { PHOTO_PATHS } from '../data/story';
import ScrollReveal from './ui/ScrollReveal';
import SectionWrapper from './ui/SectionWrapper';

interface ValidPhoto {
  src: string;
  caption: string;
}

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<ValidPhoto[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      const valid: ValidPhoto[] = [];
      await Promise.all(
        PHOTO_PATHS.map(
          (p) =>
            new Promise<void>((resolve) => {
              const img = new Image();
              img.onload = () => {
                if (!cancelled) valid.push({ src: p.src, caption: p.caption });
                resolve();
              };
              img.onerror = () => resolve();
              img.src = p.src;
            })
        )
      );
      if (!cancelled) setPhotos(valid);
    }

    check();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!photos.length) return null;

  return (
    <SectionWrapper className="bg-ivory">
      <ScrollReveal>
        <h2 className="font-serif mb-10 text-center text-3xl font-semibold text-wine sm:text-4xl">
          Us
        </h2>
      </ScrollReveal>

      <div className="grid gap-6 sm:grid-cols-2">
        {photos.map((photo, i) => (
          <ScrollReveal key={photo.src} delay={i * 0.1}>
            <figure className="group relative rotate-[-1deg] transition hover:rotate-0 even:rotate-[1deg]">
              <div className="overflow-hidden rounded-sm bg-white p-3 pb-12 shadow-xl shadow-wine/10">
                <img
                  src={photo.src}
                  alt={photo.caption}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover"
                />
                <figcaption className="font-script absolute bottom-4 left-0 right-0 text-center text-lg text-wine/70">
                  {photo.caption}
                </figcaption>
              </div>
            </figure>
          </ScrollReveal>
        ))}
      </div>
    </SectionWrapper>
  );
}
