import { Text, type StyleProp, type TextStyle } from "react-native";
import { colors, space, typography } from "../../theme";

export function SectionLabel({
  children,
  style,
}: {
  children: string;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <Text
      accessibilityRole="header"
      style={[
        typography.label,
        { marginTop: space.lg, marginBottom: space.sm, color: colors.sage },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
