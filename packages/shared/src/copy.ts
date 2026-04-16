/**
 * Product positioning and safety copy — wellness-only, not clinical care.
 */

export const SITE_NAME = "Seedchlogy";

export const positioning = {
  tagline: "A quiet place to settle, breathe, and choose a small next step.",
  reassurance:
    "You don’t have to fix anything here. This space is for gentle rest—not diagnosis or treatment.",
  aiNotice:
    "Suggestions come from an AI assistant. They are wellness ideas only, not medical advice.",
  wellnessOnly:
    "We don’t provide therapy or crisis care. If you’re looking for clinical support, a licensed professional is the right place.",
} as const;

export const crisis = {
  leadIn: "If you might hurt yourself or someone else, please reach out now.",
  lines: [
    {
      label: "988 Suicide & Crisis Lifeline (US)",
      href: "https://988lifeline.org/",
      phone: "988",
    },
    {
      label: "Crisis Text Line — text HOME to 741741",
      href: "https://www.crisistextline.org/",
    },
    {
      label: "International Association for Suicide Prevention",
      href: "https://www.iasp.info/resources/Crisis_Centres/",
    },
  ],
} as const;

export const landing = {
  primaryCta: "Start with about a minute of breathing",
  secondaryCta: "That’s okay—want to talk first?",
  resumeBreathing: "Continue breathing",
  resumeChat: "Pick up where we left off",
} as const;

/** Short labels for mobile progressive disclosure */
export const mobileHome = {
  continueMicroLabel: "Continue",
  ifYouNeedUrgentHelp: "If you need urgent help",
  crisisPeek:
    "988, Crisis Text Line, and international resources. Tap a link to open.",
  aboutThisApp: "About this app",
  safetyFullPage: "Open full safety & scope page",
  setupSummaryPrefix: "Your session:",
} as const;

export const mobileMore = {
  safetySubtitle: "Crisis resources, privacy note, and what we don’t do",
  settingsSubtitle: "Motion and display preferences",
} as const;

export const breathingCopy = {
  setupTitle: "Before we begin",
  postureSitting: "Sitting",
  postureLying: "Lying down",
  paceSlow: "Slow",
  paceMedium: "Medium",
  visualOrb: "Orb",
  visualBar: "Bar",
  visualText: "Text only",
  customize: "Customize",
  start: "Start",
  skipSetup: "Use defaults",
  phaseInhale: "Breathe in",
  phaseHoldIn: "Hold gently",
  phaseExhale: "Breathe out",
  phaseHoldOut: "Pause",
  pause: "Pause",
  resume: "Resume",
  endEarly: "I’m ready to stop",
  completeTitle: "Nice—that’s enough for your body to notice.",
  continueToChat: "Continue to the guide",
  cyclesProgress: (n: number, total: number) => `Cycle ${n} of ${total}`,
} as const;

export const chatCopy = {
  aiBadge: "AI guide",
  inputPlaceholder: "Share what feels true, in your own words…",
  send: "Send",
  chips: [
    "Overstimulated",
    "Can’t unwind",
    "Tight chest",
    "Just need a reset",
  ] as const,
  typing: "Listening…",
  whyThis: "Why this?",
  startActivity: "Start",
  notForMe: "Not for me—try another",
  moreDetail: "More detail",
  crisisBanner:
    "It sounds like you might be in crisis. If you’re unsafe, please use the resources on our Safety screen.",
} as const;

export const activityCopy = {
  next: "Next",
  back: "Back",
  done: "Done",
  exit: "Exit",
} as const;

export const settingsCopy = {
  title: "Preferences",
  reducedMotion: "Respect reduced motion (always on if your system prefers it)",
  soundNote: "Sound is off everywhere for now; we’ll add gentle audio only with your opt-in.",
} as const;
