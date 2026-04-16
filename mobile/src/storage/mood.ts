import AsyncStorage from "@react-native-async-storage/async-storage";

export type MoodCheckInEntry = {
  id: string;
  createdAt: number;
  mood: string;
  note: string | null;
};

const KEY = "seedchlogy:zen:moodCheckIns";

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export async function loadMoodCheckIns(): Promise<MoodCheckInEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as MoodCheckInEntry[];
  } catch {
    return [];
  }
}

export async function saveMoodCheckIn(input: {
  mood: string;
  note?: string | null;
}): Promise<void> {
  const entry: MoodCheckInEntry = {
    id: createId(),
    createdAt: Date.now(),
    mood: input.mood,
    note: input.note ?? null,
  };

  const prev = await loadMoodCheckIns();
  const next = [entry, ...prev].slice(0, 200);
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
}

export async function getLastMoodCheckIn(): Promise<MoodCheckInEntry | null> {
  const all = await loadMoodCheckIns();
  return all[0] ?? null;
}

