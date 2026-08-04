"use client";

import { useId, useState, type ReactNode } from "react";

type Tab = {
  id: string;
  label: ReactNode;
  content: ReactNode;
};

/** Accessible tabs with roving state. Panels keep their neumorphic frame. */
export function Tabs({ tabs, className }: { tabs: Tab[]; className?: string }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const baseId = useId();

  if (!tabs.length) return null;

  return (
    <div className={className}>
      <div className="sfc-tabs__list" role="tablist">
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
