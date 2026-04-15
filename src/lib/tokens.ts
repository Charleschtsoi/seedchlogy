/**
 * Design tokens — programmatic values. CSS variables live in globals.css.
 * Durations in ms; radii in px.
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
