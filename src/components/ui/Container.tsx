import type { ElementType, ReactNode } from "react";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
};

/** Centered max-width wrapper matching the brand 1200px container. */
export function Container({ as: Tag = "div", children, className }: Props) {
  return (
    <Tag className={["sfc-container", className].filter(Boolean).join(" ")}>
      {children}
    </Tag>
  );
}
