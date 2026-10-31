"use client";

import useInView from "@/lib/useInView";

/**
 * Sets data-in="true" on its element the first time it enters the
 * viewport. Descendants with the global `.reveal` class (and an
 * optional --rd delay) fade up in response.
 */
export default function Reveal({
  as: Tag = "div",
  children,
  className = "",
  threshold = 0.2,
  ...props
}) {
  const [ref, inView] = useInView({ threshold });

  return (
    <Tag
      ref={ref}
      className={className}
      data-in={inView ? "true" : "false"}
      {...props}
    >
      {children}
    </Tag>
  );
}
