import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  loadMemoryJars,
  saveMemoryJar,
} from "../memoryJar";

describe("memory jar storage", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it("stores memory entries with optional mood label", async () => {
    await saveMemoryJar({
      moodLabel: "Hopeful",
      notice: "Notice: my shoulders dropped.",
      nextMoment: "Next: take a slow sip of water.",
      kindAction: "Kind action: stretch gently.",
    });
    await saveMemoryJar({
      moodLabel: null,
      notice: "Notice: I felt a little safer.",
      nextMoment: "Next: breathe once on purpose.",
      kindAction: "Kind action: unclench jaw.",
    });

    const all = await loadMemoryJars();
    expect(all).toHaveLength(2);
    expect(all[0].moodLabel).toBeNull();
    expect(all[0].notice).toBe("Notice: I felt a little safer.");
    expect(all[1].moodLabel).toBe("Hopeful");
  });
});

