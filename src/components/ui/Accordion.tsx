import type { ReactNode } from "react";
import { IconChevronDown } from "@tabler/icons-react";

type Item = {
  id: string;
  question: ReactNode;
  answer: ReactNode;
};

/**
 * Accordion built on native <details>/<summary> — keyboard accessible and
 * fully functional without JavaScript. `name` groups items so only one is
 * open at a time (native single-open behavior).
 */
export function Accordion({
  items,
  single = true,
  name = "sfc-accordion",
}: {
  items: Item[];
  single?: boolean;
  name?: string;
}) {
  return (
    <div>
      {items.map((item) => (
        <details
          key={item.id}
          className="sfc-accordion"
          name={single ? name : undefined}
        >
          <summary className="sfc-accordion__summary">
            <span>{item.question}</span>
            <IconChevronDown
              className="sfc-accordion__chevron"
              size={20}
              stroke={2.5}
              aria-hidden
            />
          </summary>
          <div className="sfc-accordion__body">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}
