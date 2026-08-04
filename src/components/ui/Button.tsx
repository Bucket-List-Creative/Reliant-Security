import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "emergency";

const variantClass: Record<Variant, string> = {
  primary: "sfc-btn--primary",
  secondary: "sfc-btn--secondary",
  outline: "sfc-btn--outline",
  ghost: "sfc-btn--ghost",
  emergency: "sfc-btn--emergency",
};

type CommonProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

type ButtonAsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

type ButtonAsLink = CommonProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, "className" | "children"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * Neumorphic button. Presses inward on `:active` via the `sfc-btn` layer —
 * no scale transform, honoring the brand interaction spec.
 */
export function Button({
  variant = "primary",
  className,
  children,
  ...rest
}: ButtonProps) {
  const cn = ["sfc-btn", variantClass[variant], className]
    .filter(Boolean)
    .join(" ");

  if ("href" in rest && rest.href !== undefined) {
    return (
      <Link className={cn} {...(rest as ComponentPropsWithoutRef<typeof Link>)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cn} {...(rest as ComponentPropsWithoutRef<"button">)}>
      {children}
    </button>
  );
}
