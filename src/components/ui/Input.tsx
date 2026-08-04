import type { ComponentPropsWithoutRef, ReactNode } from "react";

type FieldWrapperProps = {
  label?: ReactNode;
  id?: string;
  hint?: ReactNode;
  children: ReactNode;
};

function FieldWrapper({ label, id, hint, children }: FieldWrapperProps) {
  return (
    <div>
      {label && (
        <label className="sfc-label" htmlFor={id}>
          {label}
        </label>
      )}
      {children}
      {hint && (
        <p className="mt-1.5 text-sm text-n-500" id={id ? `${id}-hint` : undefined}>
          {hint}
        </p>
      )}
    </div>
  );
}

type InputProps = Omit<ComponentPropsWithoutRef<"input">, "className"> & {
  label?: ReactNode;
  hint?: ReactNode;
  className?: string;
};

/** Inset input well; focus deepens the inset and adds the green ring. */
export function Input({ label, hint, id, name, className, ...rest }: InputProps) {
  const fieldId = id ?? name;
  return (
    <FieldWrapper label={label} id={fieldId} hint={hint}>
      <input
        id={fieldId}
        name={name}
        className={["sfc-input", className].filter(Boolean).join(" ")}
        {...rest}
      />
    </FieldWrapper>
  );
}

type TextareaProps = Omit<ComponentPropsWithoutRef<"textarea">, "className"> & {
  label?: ReactNode;
  hint?: ReactNode;
  className?: string;
};

export function Textarea({
  label,
  hint,
  id,
  name,
  className,
  ...rest
}: TextareaProps) {
  const fieldId = id ?? name;
  return (
    <FieldWrapper label={label} id={fieldId} hint={hint}>
      <textarea
        id={fieldId}
        name={name}
        className={["sfc-textarea", className].filter(Boolean).join(" ")}
        {...rest}
      />
    </FieldWrapper>
  );
}
