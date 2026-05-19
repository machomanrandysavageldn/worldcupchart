import clsx from "clsx";

export function Section({
  title,
  kicker,
  className,
  children,
}: {
  title: string;
  kicker?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={clsx("mx-auto max-w-7xl px-4 py-7 md:py-10", className)}>
      {kicker && <div className="text-xs uppercase tracking-widest font-bold text-wc-magenta mb-1">{kicker}</div>}
      <h2 className="font-display text-3xl md:text-5xl mb-5 md:mb-6">
        <span className="scribble-underline">{title}</span>
      </h2>
      {children}
    </section>
  );
}
