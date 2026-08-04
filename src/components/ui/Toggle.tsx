"use client";

import { useState } from "react";

type Props = {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label: string;
  className?: string;
};

/**
 * Neumorphic switch. Controlled when `checked` is provided, otherwise
 * uncontrolled. The track goes inset with a green ring when on.
 */
export function Toggle({
  checked,
  defaultChecked = false,
  onChange,
  label,
  className,
}: Props) {
  const [internal, setInternal] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const on = isControlled ? checked : internal;

  function toggle() {
    const next = !on;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={["sfc-toggle", className].filter(Boolean).join(" ")}
      onClick={toggle}
    >
      <span className="sfc-toggle__thumb" />
    </button>
  );
}
