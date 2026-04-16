import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { layout } from "../../theme";

export function MutedCard({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[layout.card, style]}>{children}</View>;
}
