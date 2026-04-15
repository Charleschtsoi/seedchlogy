"use client";

import { useCallback, useSyncExternalStore } from "react";

export const FORCE_REDUCED_MOTION_KEY = "seedchlogy:zen:forceReducedMotion";
export const REDUCED_MOTION_SYNC_EVENT = "seedchlogy-reduced-motion";

export function getForceReducedSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(FORCE_REDUCED_MOTION_KEY) === "1";
  } catch {
    return false;
  }
}

export function subscribeForceReduced(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const fn = () => onChange();
  window.addEventListener(REDUCED_MOTION_SYNC_EVENT, fn);
  window.addEventListener("storage", fn);
  return () => {
    window.removeEventListener(REDUCED_MOTION_SYNC_EVENT, fn);
    window.removeEventListener("storage", fn);
  };
}

export function setForceReducedPreference(value: boolean) {
  if (typeof window === "undefined") return;
  try {
    if (value) {
      localStorage.setItem(FORCE_REDUCED_MOTION_KEY, "1");
      document.documentElement.dataset.zenReducedMotion = "1";
    } else {
      localStorage.removeItem(FORCE_REDUCED_MOTION_KEY);
      delete document.documentElement.dataset.zenReducedMotion;
    }
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(REDUCED_MOTION_SYNC_EVENT));
}

export function useForceReducedMotion() {
  const value = useSyncExternalStore(
    subscribeForceReduced,
    getForceReducedSnapshot,
    () => false,
  );
  const setValue = useCallback((next: boolean) => {
    setForceReducedPreference(next);
  }, []);
  return [value, setValue] as const;
}
