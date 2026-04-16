/**
 * Design tokens — programmatic values. Web uses globals.css; mobile uses theme.ts.
 */
export const tokens = {
  motion: {
    breatheEaseMs: 1200,
    breatheBarMs: 1000,
    fadeMs: 400,
    focusRingWidth: 2,
  },
  radii: {
    sm: 12,
    md: 20,
    lg: 28,
    full: 9999,
  },
  layout: {
    maxContentWidth: 640,
    chatMaxWidth: 560,
  },
} as const;
