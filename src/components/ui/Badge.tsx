import type { ReactNode } from "react";

/** Small inset pill for labels and eyebrows. */
export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={["sfc-badge", className].filter(Boolean).join(" ")}>
      {children}
    </span>
  );
}
