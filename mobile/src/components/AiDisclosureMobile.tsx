import { StyleSheet, Text, View } from "react-native";
import { positioning } from "@seedchlogy/shared";
import { typography } from "../theme";

export function AiDisclosureMobile({ usedAi }: { usedAi?: boolean }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>{positioning.aiNotice}</Text>
      {usedAi !== undefined ? (
        <Text style={styles.text}>
          {usedAi
            ? "This reply used an AI model."
            : "This reply used our offline guide (set EXPO_PUBLIC_API_BASE_URL to your deployed site for AI)."}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 8 },
  text: {
    ...typography.caption,
    textAlign: "center",
    lineHeight: 16,
  },
});
