import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { RootStackScreenProps } from "../../navigation/types";
import { MemoryJarScreen } from "../MemoryJarScreen";
import { memoryJarCopy } from "@seedchlogy/shared";

const navigation = {
  goBack: jest.fn(),
  navigate: jest.fn(),
} as unknown as RootStackScreenProps<"MemoryJar">["navigation"];

describe("MemoryJarScreen", () => {
  beforeEach(async () => {
    // @ts-expect-error mocked AsyncStorage
    await AsyncStorage.clear();
  });

  it("lets the user type and save a memory", async () => {
    const { findByText, getByPlaceholderText, getByText, queryByText } =
      render(<MemoryJarScreen navigation={navigation} />);

    // Expand the first reflection section.
    const noticeHeader = await findByText(memoryJarCopy.sectionNotice);
    fireEvent.press(noticeHeader);

    const noticeInput = await getByPlaceholderText(
      memoryJarCopy.placeholderNotice,
    );
    fireEvent.changeText(noticeInput, "I noticed my shoulders relaxed.");

    const saveBtn = await findByText(memoryJarCopy.saveMemory);
    fireEvent.press(saveBtn);

    await waitFor(() => {
      expect(getByText(memoryJarCopy.completionTitle)).toBeTruthy();
    });

    // Should now show completion UI, not the save button.
    expect(queryByText(memoryJarCopy.saveMemory)).toBeNull();
    expect(navigation.goBack).not.toHaveBeenCalled();
  });
});

