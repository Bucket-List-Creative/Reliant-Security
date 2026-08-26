"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

type Tab = {
  id: string;
  label: ReactNode;
  content: ReactNode;
};

/**
 * Accessible tabs with a roving tabindex.
 *
 * The roving tabindex only does its job alongside arrow-key handling: it
 * removes every inactive tab from the tab order, so without the key handler
 * below a keyboard user could reach the tablist but never move within it.
 * Arrow keys move and activate; Home/End jump to the ends.
 */
export function Tabs({ tabs, className }: { tabs: Tab[]; className?: string }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const baseId = useId();
  const listRef = useRef<HTMLDivElement>(null);

  function focusTab(index: number) {
    const wrapped = (index + tabs.length) % tabs.length;
    const tab = tabs[wrapped];
    if (!tab) return;
    setActive(tab.id);
    listRef.current
      ?.querySelector<HTMLButtonElement>(`#${CSS.escape(`${baseId}-tab-${tab.id}`)}`)
      ?.focus();
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const current = tabs.findIndex((t) => t.id === active);
    const keys: Record<string, number> = {
      ArrowRight: current + 1,
      ArrowLeft: current - 1,
      Home: 0,
      End: tabs.length - 1,
    };
    const next = keys[e.key];
    if (next === undefined) return;
    e.preventDefault();
    focusTab(next);
  }

  if (!tabs.length) return null;

  return (
    <div className={className}>
      <div
        ref={listRef}
        className="sfc-tabs__list"
        role="tablist"
        onKeyDown={onKeyDown}
      >
        {tabs.map((tab) => {
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              className={["sfc-tab", selected && "is-active"]
                .filter(Boolean)
                .join(" ")}
              onClick={() => setActive(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-panel-${tab.id}`}
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          hidden={tab.id !== active}
          className="mt-8"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
