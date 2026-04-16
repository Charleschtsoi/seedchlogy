import { Pressable, Text, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import { colors, layout, radii, touchTarget } from "../../theme";

type Props = {
  title: string;
  onPress: () => void;
  variant?: "outline" | "text";
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function SecondaryButton({
  title,
  onPress,
  variant = "text",
  accessibilityLabel,
  style,
  textStyle,
}: Props) {
  if (variant === "outline") {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? title}
        onPress={onPress}
        style={({ pressed }) => [
          {
            width: "100%",
            minHeight: touchTarget.minHeight,
            paddingVertical: 14,
            paddingHorizontal: 20,
            borderRadius: radii.full,
            borderWidth: 1.5,
            borderColor: colors.accentSoft,
            backgroundColor: colors.paperElevated,
            alignItems: "center",
            justifyContent: "center",
          },
          pressed && { opacity: 0.88 },
          style,
        ]}
      >
        <Text
          style={[
            { fontSize: 16, fontWeight: "600", color: colors.stone },
            textStyle,
          ]}
        >
          {title}
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      onPress={onPress}
      style={({ pressed }) => [
        layout.ghostButton,
        { width: "100%" },
        pressed && { opacity: 0.85 },
        style,
      ]}
    >
      <Text
        style={[{ fontSize: 16, color: colors.stoneMuted }, textStyle]}
      >
        {title}
      </Text>
    </Pressable>
  );
}
