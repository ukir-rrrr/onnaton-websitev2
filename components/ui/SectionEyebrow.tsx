interface SectionEyebrowProps {
  eyebrow: string;
  heading: string;
  align?: "center" | "left";
  className?: string;
  /** Render as h1 on standalone pages (e.g. /course). */
  as?: "h1" | "h2";
  /** Use light text when placed over a dark photo overlay. */
  tone?: "default" | "onDark";
}

/** Eyebrow + gold rule + display heading — matches「OUR COMMITMENT / 当店のこだわり」. */
export function SectionEyebrow({
  eyebrow,
  heading,
  align = "center",
  className = "",
  as = "h2",
  tone = "default",
}: SectionEyebrowProps) {
  const HeadingTag = as;
  const centered = align === "center";
  const headingColor = tone === "onDark" ? "text-on-dark" : "text-cream";

  return (
    <div className={`${centered ? "text-center" : ""} ${className}`}>
      <p className="mb-4 text-[11px] tracking-[0.2em] text-gold sm:text-[15px] sm:tracking-[0.38em]">
        {eyebrow}
      </p>
      <div
        className={`mb-6 h-px w-12 bg-gold/55 ${centered ? "mx-auto" : ""}`}
      />
      <HeadingTag
        className={`font-display-jp max-w-full break-words text-[22px] font-medium tracking-[0.06em] ${headingColor} sm:text-[34px] sm:tracking-[0.14em] xl:text-[38px]`}
      >
        {heading}
      </HeadingTag>
    </div>
  );
}
