import AsyncStorage from "@react-native-async-storage/async-storage";
import type { SessionSnapshot } from "@seedchlogy/shared";

const KEY = "seedchlogy:zen:session";

export async function loadSession(): Promise<SessionSnapshot | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionSnapshot;
  } catch {
    return null;
  }
}

export async function saveSession(
  partial: Partial<SessionSnapshot>,
): Promise<void> {
  const prev = await loadSession();
  const next: SessionSnapshot = {
    lastPath: partial.lastPath ?? prev?.lastPath ?? "/",
    breatheInProgress: partial.breatheInProgress ?? prev?.breatheInProgress,
    updatedAt: Date.now(),
  };
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
}
