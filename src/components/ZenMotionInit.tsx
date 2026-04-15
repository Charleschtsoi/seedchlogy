"use client";

import { useLayoutEffect } from "react";
import {
  FORCE_REDUCED_MOTION_KEY,
  REDUCED_MOTION_SYNC_EVENT,
} from "@/lib/reduced-motion-preference";

function applyDataset() {
  try {
    if (localStorage.getItem(FORCE_REDUCED_MOTION_KEY) === "1") {
      document.documentElement.dataset.zenReducedMotion = "1";
    } else {
      delete document.documentElement.dataset.zenReducedMotion;
    }
  } catch {
    /* ignore */
  }
}

/** Applies stored reduced-motion preference to the document before paint. */
export function ZenMotionInit() {
  useLayoutEffect(() => {
    applyDataset();
    const onSync = () => applyDataset();
    window.addEventListener(REDUCED_MOTION_SYNC_EVENT, onSync);
    return () => window.removeEventListener(REDUCED_MOTION_SYNC_EVENT, onSync);
  }, []);

  return null;
}
