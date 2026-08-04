import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  id?: string;
  /** Adds the hover-lift elevation (L3 → L4). */
  interactive?: boolean;
};

/** Raised neumorphic surface. Lifts on hover when `interactive`. */
export function Card({ children, className, id, interactive }: Props) {
  const cn = [
    "sfc-card",
    interactive && "sfc-card--interactive",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={cn} id={id}>
      {children}
    </div>
  );
}

export function CardIcon({ children }: { children: ReactNode }) {
  return (
    <span className="sfc-card__icon" aria-hidden="true">
      {children}
    </span>
  );
}
