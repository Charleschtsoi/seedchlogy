import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import type { RootStackScreenProps } from "../../navigation/types";
import { MoodCheckInScreen } from "../MoodCheckInScreen";
import { moodCopy } from "@seedchlogy/shared";
import AsyncStorage from "@react-native-async-storage/async-storage";

const navigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
} as unknown as RootStackScreenProps<"MoodCheckIn">["navigation"];

describe("MoodCheckInScreen", () => {
  beforeEach(async () => {
    // @ts-expect-error mocked AsyncStorage
    await AsyncStorage.clear();
  });

  it("selects a mood and lets the user save a check-in", async () => {
    const { findByText, getByText } = render(
      <MoodCheckInScreen navigation={navigation} />,
    );

    await findByText(moodCopy.labelPickMood);

    const steady = await findByText("Steady");
    fireEvent.press(steady);

    const save = getByText(moodCopy.saveCheckIn);
    fireEvent.press(save);

    await waitFor(() => {
      expect(getByText(moodCopy.nextSaveMemory)).toBeTruthy();
    });
    // Should not still be in setup mode.
    expect(getByText(moodCopy.nextSaveMemory)).toBeTruthy();
  });
});

