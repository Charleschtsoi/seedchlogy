"use client";

import type { SessionSnapshot } from "@seedchlogy/shared";
import { useSyncExternalStore } from "react";

const PREFIX = "seedchlogy:zen:";
export const SESSION_SYNC_EVENT = "seedchlogy-session";

export type { SessionSnapshot };

let sessionCache: SessionSnapshot | null = null;
let sessionRawCache: string | null = null;

export function loadSession(): SessionSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${PREFIX}session`);
    if (!raw) return null;
    return JSON.parse(raw) as SessionSnapshot;
  } catch {
    return null;
  }
}

export function getSessionSnapshot(): SessionSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${PREFIX}session`);
    if (raw === sessionRawCache) return sessionCache;
    sessionRawCache = raw;
    sessionCache = raw ? (JSON.parse(raw) as SessionSnapshot) : null;
    return sessionCache;
  } catch {
    sessionRawCache = null;
    sessionCache = null;
    return null;
  }
}

export function subscribeSession(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const onStorage = (e: StorageEvent) => {
    if (e.key === `${PREFIX}session` || e.key === null) onChange();
  };
  const onCustom = () => onChange();
  window.addEventListener("storage", onStorage);
  window.addEventListener(SESSION_SYNC_EVENT, onCustom);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(SESSION_SYNC_EVENT, onCustom);
  };
}

export function saveSession(partial: Partial<SessionSnapshot>) {
  if (typeof window === "undefined") return;
  const prev = loadSession();
  const next: SessionSnapshot = {
    lastPath: partial.lastPath ?? prev?.lastPath ?? "/",
    breatheInProgress: partial.breatheInProgress ?? prev?.breatheInProgress,
    updatedAt: Date.now(),
  };
  localStorage.setItem(`${PREFIX}session`, JSON.stringify(next));
  window.dispatchEvent(new Event(SESSION_SYNC_EVENT));
}

export function clearBreatheProgress() {
  const prev = loadSession();
  if (!prev) return;
  saveSession({ ...prev, breatheInProgress: false });
}

export function useSessionSnapshot() {
  return useSyncExternalStore(
    subscribeSession,
    getSessionSnapshot,
    () => null,
  );
}
