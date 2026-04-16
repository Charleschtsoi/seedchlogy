import AsyncStorage from "@react-native-async-storage/async-storage";

export type MemoryJarEntry = {
  id: string;
  createdAt: number;
  moodLabel: string | null;
  notice: string;
  nextMoment: string;
  kindAction: string;
};

const KEY = "seedchlogy:zen:memoryJar";

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export async function loadMemoryJars(): Promise<MemoryJarEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as MemoryJarEntry[];
  } catch {
    return [];
  }
}

export async function saveMemoryJar(input: {
  moodLabel?: string | null;
  notice: string;
  nextMoment: string;
  kindAction: string;
}): Promise<void> {
  const entry: MemoryJarEntry = {
    id: createId(),
    createdAt: Date.now(),
    moodLabel: input.moodLabel ?? null,
    notice: input.notice,
    nextMoment: input.nextMoment,
    kindAction: input.kindAction,
  };

  const prev = await loadMemoryJars();
  const next = [entry, ...prev].slice(0, 200);
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
}

export async function getLastMemoryJarEntry(): Promise<
  MemoryJarEntry | null
> {
  const all = await loadMemoryJars();
  return all[0] ?? null;
}

