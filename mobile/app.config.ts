import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "Seedchlogy",
  slug: "seedchlogy",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  newArchEnabled: true,
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#f7f3ee",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.seedchlogy.app",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#f7f3ee",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: "com.seedchlogy.app",
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  extra: {
    apiBaseUrl:
      process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ??
      "http://localhost:3000",
  },
};

export default config;
