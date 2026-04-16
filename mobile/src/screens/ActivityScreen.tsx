import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { activityCopy, getActivity } from "@seedchlogy/shared";
import type { RootStackScreenProps } from "../navigation/types";
import { colors, layout, space, typography } from "../theme";

export function ActivityScreen({
  route,
  navigation,
}: RootStackScreenProps<"Activity">) {
  const insets = useSafeAreaInsets();
  const { slug } = route.params;
  const activity = getActivity(slug);
  const [step, setStep] = useState(0);

  if (!activity) {
    return (
      <View style={[layout.screen, { paddingTop: insets.top }]}>
        <Text style={typography.body}>Activity not found.</Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.accent, marginTop: 16 }}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const isLast = step >= activity.steps.length - 1;

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + space.sm,
            paddingHorizontal: space.md + 4,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          style={styles.exitTop}
          onPress={() => navigation.goBack()}
          hitSlop={12}
        >
          <Text style={styles.exitText}>{activityCopy.exit}</Text>
        </Pressable>

        <Text style={[typography.caption, styles.stepBadge]}>
          Step {step + 1} of {activity.steps.length}
        </Text>
        <Text style={[typography.title, styles.title]}>{activity.title}</Text>
        <Text style={[typography.caption, styles.duration]}>{activity.duration}</Text>

        <View style={[layout.card, styles.card]}>
          <Text style={typography.body}>{activity.steps[step]}</Text>
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: Math.max(insets.bottom, space.md),
            paddingHorizontal: space.md + 4,
          },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.ghost,
            step === 0 && styles.ghostDisabled,
            pressed && step !== 0 && { opacity: 0.85 },
          ]}
          disabled={step === 0}
          onPress={() => setStep((s) => Math.max(0, s - 1))}
        >
          <Text
            style={[
              styles.ghostText,
              step === 0 && { color: "rgba(107, 100, 92, 0.45)" },
            ]}
          >
            {activityCopy.back}
          </Text>
        </Pressable>
        {!isLast ? (
          <Pressable
            style={({ pressed }) => [
              layout.primaryButton,
              { minWidth: 140 },
              pressed && { opacity: 0.92 },
            ]}
            onPress={() => setStep((s) => s + 1)}
          >
            <Text style={layout.primaryButtonText}>{activityCopy.next}</Text>
          </Pressable>
        ) : (
          <Pressable
            style={({ pressed }) => [
              layout.primaryButton,
              { minWidth: 140 },
              pressed && { opacity: 0.92 },
            ]}
            onPress={() => navigation.goBack()}
          >
            <Text style={layout.primaryButtonText}>{activityCopy.done}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingBottom: space.lg,
  },
  exitTop: {
    alignSelf: "flex-end",
    paddingVertical: space.sm,
    marginBottom: space.xs,
  },
  exitText: { fontSize: 15, color: colors.stoneMuted },
  stepBadge: { textAlign: "center" },
  title: { textAlign: "center", marginTop: space.sm },
  duration: { textAlign: "center", marginTop: space.xs },
  card: {
    marginTop: space.lg,
    minHeight: 120,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: space.md,
    borderTopWidth: 1,
    borderTopColor: colors.accentSoft + "55",
    backgroundColor: colors.paper,
  },
  ghost: {
    paddingVertical: space.sm + 4,
    paddingHorizontal: space.sm,
    minHeight: 48,
    justifyContent: "center",
  },
  ghostDisabled: {},
  ghostText: { fontSize: 15, color: colors.stoneMuted },
});
