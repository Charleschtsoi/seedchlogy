export type Pace = "slow" | "medium";

/** Phase durations in seconds. Pattern: inhale → hold in → exhale → hold out (4-4-6-0 style for slow exhale emphasis on slow pace). */
export const PACE_PRESETS: Record<
  Pace,
  { inhale: number; holdIn: number; exhale: number; holdOut: number }
> = {
  slow: { inhale: 4, holdIn: 4, exhale: 6, holdOut: 0 },
  medium: { inhale: 4, holdIn: 1, exhale: 4, holdOut: 1 },
};

export type BreathPhase = "inhale" | "holdIn" | "exhale" | "holdOut";

export const PHASE_ORDER: BreathPhase[] = [
  "inhale",
  "holdIn",
  "exhale",
  "holdOut",
];

export function cycleDurationSeconds(pace: Pace): number {
  const p = PACE_PRESETS[pace];
  return p.inhale + p.holdIn + p.exhale + p.holdOut;
}

export function phasesForPace(
  pace: Pace,
): { phase: BreathPhase; seconds: number }[] {
  const p = PACE_PRESETS[pace];
  return [
    { phase: "inhale", seconds: p.inhale },
    { phase: "holdIn", seconds: p.holdIn },
    { phase: "exhale", seconds: p.exhale },
    { phase: "holdOut", seconds: p.holdOut },
  ];
}
