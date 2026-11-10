interface SectionWrapperProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}

export default function SectionWrapper({
  id,
  children,
  className = '',
  dark = false,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`relative px-5 py-20 sm:px-8 sm:py-28 md:py-32 ${
        dark ? 'bg-charcoal text-ivory' : 'bg-ivory text-charcoal'
      } ${className}`}
    >
      <div className="mx-auto max-w-2xl">{children}</div>
    </section>
  );
}
