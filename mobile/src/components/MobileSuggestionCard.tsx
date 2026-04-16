import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { chatCopy, type EnrichedSuggestion } from "@seedchlogy/shared";
import { colors, layout, radii, typography } from "../theme";

type Props = {
  item: EnrichedSuggestion;
  onNotForMe: () => void;
  onStart: (slug: string) => void;
};

export function MobileSuggestionCard({
  item,
  onNotForMe,
  onStart,
}: Props) {
  const [showWhy, setShowWhy] = useState(false);
  const [more, setMore] = useState(false);
  const steps = more ? item.activity.steps : item.activity.steps.slice(0, 3);

  return (
    <View style={[layout.card, styles.card]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.activity.title}</Text>
          <Text style={typography.caption}>{item.activity.duration}</Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            layout.primaryButton,
            styles.startBtn,
            pressed && { opacity: 0.9 },
          ]}
          onPress={() => onStart(item.activity.slug)}
        >
          <Text style={styles.startBtnText}>{chatCopy.startActivity}</Text>
        </Pressable>
      </View>
      {steps.map((s, i) => (
        <Text key={i} style={[typography.small, styles.bullet]}>
          • {s}
        </Text>
      ))}
      <Pressable onPress={() => setMore((m) => !m)}>
        <Text style={styles.link}>
          {more ? "Less detail" : chatCopy.moreDetail}
        </Text>
      </Pressable>
      <Pressable onPress={() => setShowWhy((w) => !w)}>
        <Text style={styles.why}>{chatCopy.whyThis}</Text>
      </Pressable>
      {showWhy ? (
        <View style={styles.whyBox}>
          <Text style={typography.caption}>{item.rationale}</Text>
        </View>
      ) : null}
      <Pressable onPress={onNotForMe}>
        <Text style={styles.notForMe}>{chatCopy.notForMe}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: 12 },
  header: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.stone,
  },
  startBtn: { paddingVertical: 10, paddingHorizontal: 14 },
  startBtnText: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 13,
  },
  bullet: { marginTop: 6 },
  link: {
    marginTop: 10,
    fontSize: 12,
    color: colors.accent,
  },
  why: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
    color: colors.stoneMuted,
  },
  whyBox: {
    marginTop: 8,
    padding: 12,
    borderRadius: radii.sm,
    backgroundColor: colors.paper,
  },
  notForMe: {
    marginTop: 14,
    fontSize: 12,
    color: colors.stoneMuted,
    textDecorationLine: "underline",
  },
});
