import AsyncStorage from "@react-native-async-storage/async-storage";
import { AccessibilityInfo } from "react-native";

export const FORCE_REDUCED_MOTION_KEY = "seedchlogy:zen:forceReducedMotion";

export async function getCalmMotionEnabled(): Promise<boolean> {
  try {
    const forced = await AsyncStorage.getItem(FORCE_REDUCED_MOTION_KEY);
    const system = await AccessibilityInfo.isReduceMotionEnabled();
    return forced === "1" || system;
  } catch {
    return false;
  }
}

export async function setForceReducedMotion(value: boolean): Promise<void> {
  if (value) {
    await AsyncStorage.setItem(FORCE_REDUCED_MOTION_KEY, "1");
  } else {
    await AsyncStorage.removeItem(FORCE_REDUCED_MOTION_KEY);
  }
}

export function subscribeReduceMotionChanged(cb: () => void): () => void {
  try {
    const sub = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      cb,
    );
    return () => sub.remove();
  } catch {
    return () => {};
  }
}
