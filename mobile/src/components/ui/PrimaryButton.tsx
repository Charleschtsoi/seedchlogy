import { Pressable, Text, type StyleProp, type ViewStyle } from "react-native";
import { layout } from "../../theme";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export function PrimaryButton({
  title,
  onPress,
  disabled,
  style,
  accessibilityLabel,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        layout.primaryButton,
        { width: "100%" },
        pressed && !disabled && { opacity: 0.92 },
        disabled && { opacity: 0.55 },
        style,
      ]}
    >
      <Text style={layout.primaryButtonText}>{title}</Text>
    </Pressable>
  );
}
