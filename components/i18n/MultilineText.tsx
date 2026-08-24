import { Fragment } from "react";

type MultilineTextProps = {
  text: string;
  /** Prevent mid-word wraps in Japanese (default: true). */
  keepAll?: boolean;
  /** Keep the last `\n`-split line on one row. */
  nowrapLastLine?: boolean;
};

/** Renders copy with intentional `\n` as line breaks (not width-based wrapping). */
export function MultilineText({
  text,
  keepAll = true,
  nowrapLastLine = false,
}: MultilineTextProps) {
  const lines = text.split("\n");
  const keepClass = keepAll ? "break-keep" : "";

  if (lines.length === 1) {
    return keepAll ? <span className={keepClass}>{text}</span> : text;
  }

  return (
    <>
      {lines.map((line, i) => {
        const isLast = i === lines.length - 1;
        const className = [
          keepClass,
          nowrapLastLine && isLast ? "whitespace-nowrap" : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <Fragment key={i}>
            {i > 0 ? <br /> : null}
            <span className={className || undefined}>{line}</span>
          </Fragment>
        );
      })}
    </>
  );
}
