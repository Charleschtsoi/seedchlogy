import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getLastMoodCheckIn,
  loadMoodCheckIns,
  saveMoodCheckIn,
} from "../mood";

describe("mood storage", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it("stores mood check-ins and returns latest first", async () => {
    await saveMoodCheckIn({ mood: "Steady", note: "It’s calm." });
    await saveMoodCheckIn({ mood: "Anxious" });

    const last = await getLastMoodCheckIn();
    expect(last?.mood).toBe("Anxious");
    expect(last?.note).toBeNull();

    const all = await loadMoodCheckIns();
    expect(all).toHaveLength(2);
    expect(all[0].mood).toBe("Anxious");
    expect(all[1].mood).toBe("Steady");
    expect(all[1].note).toBe("It’s calm.");
  });
});

