import { StyleSheet } from "react-native";

/** Warm zen palette (matches web globals.css). */
export const colors = {
  paper: "#f7f3ee",
  paperElevated: "#f0ebe3",
  stone: "#3d3832",
  stoneMuted: "#6b645c",
  accent: "#c17f6a",
  accentHover: "#a86b58",
  accentSoft: "#e8d4cc",
  sage: "#8fa396",
  sageSoft: "#d8e3dc",
  warmGold: "#d4a574",
  crisisLink: "#8b4a4a",
  crisisBg: "#f3e8e8",
  white: "#fffdf9",
};

/** 8px base grid */
export const space = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

export const radii = { sm: 12, md: 20, lg: 28, full: 9999 };

/** iOS HIG friendly minimum */
export const touchTarget = { minHeight: 48, minWidth: 44 };

export const measure = {
  /** ~65ch feel on typical phone width */
  readableMaxWidth: 360,
};

/**
 * Base typography (system / Nunito when loaded).
 * Use `typographyDisplay` from fonts.ts after useFonts for serif headlines.
 */
export const typography = {
  display: {
    fontSize: 28,
    fontWeight: "600" as const,
    color: colors.stone,
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  headline: {
    fontSize: 22,
    fontWeight: "600" as const,
    color: colors.stone,
    lineHeight: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: "600" as const,
    color: colors.stone,
    lineHeight: 32,
  },
  body: {
    fontSize: 16,
    color: colors.stone,
    lineHeight: 24,
  },
  small: {
    fontSize: 14,
    color: colors.stoneMuted,
    lineHeight: 21,
  },
  label: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: colors.sage,
    letterSpacing: 0.8,
    textTransform: "uppercase" as const,
  },
  caption: {
    fontSize: 12,
    color: colors.stoneMuted,
    lineHeight: 17,
  },
  legal: {
    fontSize: 12,
    color: colors.stoneMuted,
    lineHeight: 18,
  },
};

export const layout = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
    paddingHorizontal: space.md + 4,
    paddingTop: space.sm,
  },
  card: {
    backgroundColor: colors.paperElevated,
    borderRadius: radii.lg,
    padding: space.md + 4,
    shadowColor: "#3d3832",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  primaryButton: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    paddingHorizontal: space.lg,
    minHeight: touchTarget.minHeight,
    borderRadius: radii.full,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600" as const,
  },
  ghostButton: {
    paddingVertical: 14,
    paddingHorizontal: space.md,
    minHeight: touchTarget.minHeight,
    borderRadius: radii.full,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    minHeight: touchTarget.minWidth,
    borderRadius: radii.full,
    backgroundColor: colors.paperElevated,
    marginRight: space.sm,
    marginBottom: space.sm,
    justifyContent: "center" as const,
  },
  chipActive: {
    backgroundColor: colors.sageSoft,
  },
});
