import "@testing-library/jest-native/extend-expect";
import React from "react";
import { Text as mockText } from "react-native";

// The Jest mock factory is hoisted; variables referenced inside need safe names.
const mockReact = React;

// Safe areas are device-dependent; for tests we force deterministic values.
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock("expo-status-bar", () => {
  return { StatusBar: () => null };
});

jest.mock("@expo/vector-icons", () => {
  return {
    Ionicons: ({ name }) =>
      mockReact.createElement(mockText, { testID: `icon-${name}` }, name),
  };
});

jest.mock("@react-native-async-storage/async-storage", () => {
  let store = {};
  const asyncStorage = {
    getItem: jest.fn(async (key) => store[key] ?? null),
    setItem: jest.fn(async (key, value) => {
      store[key] = value;
    }),
    removeItem: jest.fn(async (key) => {
      delete store[key];
    }),
    clear: jest.fn(async () => {
      store = {};
    }),
  };
  return { __esModule: true, default: asyncStorage };
});

// Note: we intentionally do NOT mock `react-native` wholesale because it can
// interfere with the Jest preset internals. If a specific module needs stubbing,
// we prefer mocking smaller pieces only.

