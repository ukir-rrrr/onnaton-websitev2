interface SectionEyebrowProps {
  eyebrow: string;
  heading: string;
  align?: "center" | "left";
  className?: string;
  /** Render as h1 on standalone pages (e.g. /course). */
  as?: "h1" | "h2";
}

/** Eyebrow + gold rule + serif heading — matches「OUR COMMITMENT / 当店のこだわり」. */
export function SectionEyebrow({
  eyebrow,
  heading,
  align = "center",
  className = "",
  as = "h2",
}: SectionEyebrowProps) {
  const HeadingTag = as;
  const centered = align === "center";

  return (
    <div className={`${centered ? "text-center" : ""} ${className}`}>
      <p className="mb-4 text-xs tracking-[0.38em] text-gold sm:text-[15px]">
        {eyebrow}
      </p>
      <div
        className={`mb-6 h-px w-12 bg-gold/55 ${centered ? "mx-auto" : ""}`}
      />
      <HeadingTag className="font-serif-jp text-[26px] font-normal tracking-[0.18em] text-cream sm:text-[34px] lg:text-[38px]">
        {heading}
      </HeadingTag>
    </div>
  );
}
