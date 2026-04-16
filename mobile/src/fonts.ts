import { Fraunces_600SemiBold } from "@expo-google-fonts/fraunces";
import {
  NunitoSans_400Regular,
  NunitoSans_500Medium,
  NunitoSans_600SemiBold,
} from "@expo-google-fonts/nunito-sans";
import { useFonts } from "expo-font";

export function useAppFonts() {
  const [loaded, error] = useFonts({
    Fraunces_600SemiBold,
    NunitoSans_400Regular,
    NunitoSans_500Medium,
    NunitoSans_600SemiBold,
  });
  if (error) {
    console.warn("Font load error", error);
  }
  return Boolean(loaded);
}

/** Post-load font family names for StyleSheet / Text */
export const fontFamily = {
  sansRegular: "NunitoSans_400Regular",
  sansMedium: "NunitoSans_500Medium",
  sansSemiBold: "NunitoSans_600SemiBold",
  displaySemiBold: "Fraunces_600SemiBold",
};
