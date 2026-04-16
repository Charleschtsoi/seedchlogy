import Constants from "expo-constants";

export function getApiBaseUrl(): string {
  const extra = Constants.expoConfig?.extra as
    | { apiBaseUrl?: string }
    | undefined;
  const raw = extra?.apiBaseUrl ?? "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}
