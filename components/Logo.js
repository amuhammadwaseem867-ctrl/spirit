import {
  LOGO_VIEWBOX,
  MARK_VIEWBOX,
  WORD_VIEWBOX,
  MARK_PATHS,
  WORD_PATH,
} from "@/lib/logo";

/**
 * SPIRIT logo, drawn from the brand SVG.
 *
 * variant: "full" (monogram over wordmark) | "mark" | "word"
 * Colour follows `currentColor`, so it adapts to light and dark
 * surfaces. Pass `title` when the logo is the only content of a
 * link; otherwise it is decorative.
 */
export default function Logo({
  variant = "full",
  title,
  className = "",
  ...props
}) {
  const viewBox =
    variant === "mark"
      ? MARK_VIEWBOX
      : variant === "word"
        ? WORD_VIEWBOX
        : LOGO_VIEWBOX;

  return (
    <svg
      viewBox={viewBox}
      fill="currentColor"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
      {...props}
    >
      {variant !== "word" &&
        MARK_PATHS.map((d) => <path key={d.slice(0, 16)} d={d} />)}

      {variant !== "mark" && <path d={WORD_PATH} />}
    </svg>
  );
}
