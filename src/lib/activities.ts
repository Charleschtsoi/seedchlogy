export type ActivitySlug =
  | "grounding-54321"
  | "pmr-lite"
  | "gentle-stretch"
  | "extended-exhale-breath"
  | "nature-visualization";

export type Activity = {
  slug: ActivitySlug;
  title: string;
  duration: string;
  steps: string[];
};

export const ACTIVITIES: Record<ActivitySlug, Activity> = {
  "grounding-54321": {
    slug: "grounding-54321",
    title: "5-4-3-2-1 grounding",
    duration: "About 3 minutes",
    steps: [
      "Name 5 things you can see—slowly, without judging them.",
      "Notice 4 things you can touch; feel fabric, air, or weight under you.",
      "Listen for 3 sounds, near or far.",
      "Find 2 things you can smell, or two scents you like to imagine.",
      "Name 1 slow breath, in and out, as you finish.",
    ],
  },
  "pmr-lite": {
    slug: "pmr-lite",
    title: "Soft tension release",
    duration: "About 4 minutes",
    steps: [
      "Let shoulders rise on a breath in; let them drop on the out-breath. Twice.",
      "Gently squeeze hands into fists; release on the exhale. Repeat once.",
      "Press feet into the floor; notice support; soften toes on the out-breath.",
      "Unclench jaw; let teeth part slightly; rest tongue on the roof of the mouth, easy.",
      "Take three slower exhales, a little longer than your inhales.",
    ],
  },
  "gentle-stretch": {
    slug: "gentle-stretch",
    title: "Gentle upper-body ease",
    duration: "About 3 minutes",
    steps: [
      "Roll shoulders backward in slow circles, four times.",
      "Reach arms overhead on an inhale; soften elbows as you breathe out.",
      "Interlace fingers behind you or at your low back; open chest gently; breathe.",
      "Tip ear toward shoulder—each side—without forcing; small movements.",
      "Return to neutral; one long exhale through the nose or pursed lips.",
    ],
  },
  "extended-exhale-breath": {
    slug: "extended-exhale-breath",
    title: "Extended exhale breathing",
    duration: "About 2 minutes",
    steps: [
      "Sit or lie in a way your belly can move a little.",
      "Inhale for a count of 4, easy, through the nose if that feels okay.",
      "Exhale for a count of 6—longer than the inhale, without strain.",
      "Repeat 6–8 cycles; if lightheaded, return to normal breathing.",
      "Notice the space at the end of each out-breath before the next in-breath.",
    ],
  },
  "nature-visualization": {
    slug: "nature-visualization",
    title: "Quiet nature picture",
    duration: "About 3 minutes",
    steps: [
      "Picture a place outdoors that feels safe or neutral—a path, water, or trees.",
      "Notice one color there; let your eyes rest on it in your mind.",
      "Imagine temperature on skin—sun, breeze, or cool shade.",
      "Hear one gentle sound: leaves, distant water, or birds.",
      "Stay three slow breaths; when you’re ready, open eyes if they were closed.",
    ],
  },
};

export const ACTIVITY_IDS = Object.keys(ACTIVITIES) as ActivitySlug[];

export function getActivity(slug: string): Activity | undefined {
  return ACTIVITIES[slug as ActivitySlug];
}
