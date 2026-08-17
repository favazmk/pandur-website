"use client";

import { useCallback, useSyncExternalStore } from "react";

/** Capabilities never change, so nothing ever needs to notify us. */
const noopSubscribe = () => () => {};

/**
 * Read a client-only value without a setState-in-effect.
 * useSyncExternalStore gives React an explicit server snapshot, so there is no
 * hydration mismatch and no cascading render on mount.
 */
export function useClientValue<T>(getClient: () => T, serverValue: T): T {
  return useSyncExternalStore(noopSubscribe, getClient, () => serverValue);
}

function useMediaQuery(query: string, serverFallback = false) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverFallback
  );
}

/** True when the visitor has asked the OS to reduce motion. */
export const usePrefersReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)");

/** Below the 768px breakpoint the pinned horizontal scenes become stacks. */
export const useIsMobile = () => useMediaQuery("(max-width: 767px)");

/** Coarse pointer — no hover, no cursor effects, no magnetic CTAs. */
export const useIsTouch = () => useMediaQuery("(pointer: coarse)");
