"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * hCaptcha widget, rendered explicitly so it lives inside the form's own
 * layout rather than wherever a global script scan happens to place it.
 *
 * Deliberately not `@hcaptcha/react-hcaptcha`: the wrapper is a dependency for
 * what amounts to one `render()` call, and it re-renders the widget on prop
 * identity changes, which resets a challenge the visitor may have already
 * solved.
 */

type HCaptchaApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
};

declare global {
  interface Window {
    hcaptcha?: HCaptchaApi;
    __hcaptchaOnLoad?: () => void;
  }
}

/**
 * One loader shared by every instance. The script must be injected once per
 * document; a second copy re-registers the global and orphans live widgets.
 */
let loader: Promise<void> | null = null;

function loadHCaptcha(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.hcaptcha) return Promise.resolve();
  if (loader) return loader;

  loader = new Promise<void>((resolve, reject) => {
    window.__hcaptchaOnLoad = resolve;
    const script = document.createElement("script");
    // `render=explicit` stops hCaptcha auto-scanning the DOM, so the widget
    // appears only where this component mounts it.
    script.src =
      "https://js.hcaptcha.com/1/api.js?render=explicit&onload=__hcaptchaOnLoad";
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      // Let a later mount retry rather than caching the failure forever.
      loader = null;
      reject(new Error("hCaptcha script failed to load"));
    };
    document.head.appendChild(script);
  });

  return loader;
}

export function HCaptchaField({
  sitekey,
  onChange,
  resetSignal = 0,
}: {
  sitekey: string;
  /** Called with a token when solved, and with null when cleared or expired. */
  onChange: (token: string | null) => void;
  /** Increment to clear a spent token — hCaptcha tokens are single-use. */
  resetSignal?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  // Held in a ref so the effect below doesn't depend on callback identity —
  // an inline arrow from the parent would otherwise tear down and re-render
  // the widget on every parent render, wiping a solved challenge.
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const emit = useCallback((token: string | null) => {
    onChangeRef.current(token);
  }, []);

  useEffect(() => {
    let cancelled = false;

    loadHCaptcha()
      .then(() => {
        if (cancelled || widgetId.current !== null) return;
        if (!containerRef.current || !window.hcaptcha) return;

        widgetId.current = window.hcaptcha.render(containerRef.current, {
          sitekey,
          callback: (token: string) => emit(token),
          "expired-callback": () => emit(null),
          "chalexpired-callback": () => emit(null),
          "error-callback": () => emit(null),
        });
      })
      .catch(() => {
        if (!cancelled) setUnavailable(true);
      });

    return () => {
      cancelled = true;
    };
  }, [sitekey, emit]);

  useEffect(() => {
    if (resetSignal === 0 || widgetId.current === null) return;
    window.hcaptcha?.reset(widgetId.current);
    emit(null);
  }, [resetSignal, emit]);

  return (
    <div>
      <span className="sfc-label">Verification</span>
      {/* hCaptcha renders an iframe, so its interior can't be themed. It is
          given the form's own spacing and label treatment instead, which is
          what keeps it from reading as a bolted-on third-party block. */}
      <div ref={containerRef} className="mt-2" />
      {unavailable && (
        <p role="alert" className="mt-2 text-sm text-n-700">
          The verification widget could not load. Check your connection or any
          content blocker, then reload the page.
        </p>
      )}
    </div>
  );
}
