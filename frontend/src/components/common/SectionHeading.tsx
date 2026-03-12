interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl space-y-4">
      <span className="inline-flex rounded-full border border-cyan/30 bg-cyan/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan">
        {eyebrow}
      </span>
      <h2 className="font-display text-3xl text-white sm:text-4xl lg:text-5xl dark:text-white light:text-slate-950">
        {title}
      </h2>
      <p className="text-base leading-7 text-slate-300 dark:text-slate-300 light:text-slate-700">
        {description}
      </p>
    </div>
  );
}
