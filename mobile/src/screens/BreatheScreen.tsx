import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  breathingCopy,
  mobileHome,
  positioning,
  type Pace,
} from "@seedchlogy/shared";
import { BreathingSession, type VisualStyle } from "../components/BreathingSession";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { SecondaryButton } from "../components/ui/SecondaryButton";
import { SectionLabel } from "../components/ui/SectionLabel";
import type { MainTabScreenProps } from "../navigation/types";
import { fontFamily } from "../fonts";
import { useFontsLoaded } from "../FontProvider";
import { colors, layout, radii, space, touchTarget, typography } from "../theme";

type Step = "setup" | "session" | "done";

export function BreatheScreen({ navigation }: MainTabScreenProps<"Breathe">) {
  const insets = useSafeAreaInsets();
  const fontsLoaded = useFontsLoaded();
  const [step, setStep] = useState<Step>("setup");
  const [pace, setPace] = useState<Pace>("slow");
  const [visual, setVisual] = useState<VisualStyle>("orb");
  const [posture, setPosture] = useState<"sitting" | "lying">("sitting");
  const [cycles, setCycles] = useState(4);

  const setupSummary = useMemo(() => {
    const postureLabel =
      posture === "sitting"
        ? breathingCopy.postureSitting
        : breathingCopy.postureLying;
    const paceLabel =
      pace === "slow" ? breathingCopy.paceSlow : breathingCopy.paceMedium;
    const visualLabel =
      visual === "orb"
        ? breathingCopy.visualOrb
        : visual === "bar"
          ? breathingCopy.visualBar
          : breathingCopy.visualText;
    return `${mobileHome.setupSummaryPrefix} ${postureLabel.toLowerCase()} · ${paceLabel.toLowerCase()} · ${visualLabel.toLowerCase()} · ${cycles} cycles`;
  }, [posture, pace, visual, cycles]);

  if (step === "session") {
    return (
      <View style={[styles.flex, { paddingTop: insets.top + 8 }]}>
        <BreathingSession
          pace={pace}
          visual={visual}
          totalCycles={cycles}
          onComplete={() => setStep("done")}
          onEndEarly={() => navigation.navigate("Guide")}
        />
      </View>
    );
  }

  if (step === "done") {
    return (
      <View
        style={[
          layout.screen,
          styles.centered,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 },
        ]}
      >
        <Text
          style={[
            typography.title,
            styles.centerText,
            fontsLoaded && { fontFamily: fontFamily.displaySemiBold },
          ]}
        >
          {breathingCopy.completeTitle}
        </Text>
        <Text style={[typography.small, styles.centerText, { marginTop: space.md }]}>
          {positioning.reassurance}
        </Text>
        <PrimaryButton
          title={breathingCopy.continueToChat}
          onPress={() => navigation.navigate("Guide")}
          style={{ marginTop: space.lg, maxWidth: 320, alignSelf: "center" }}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={[layout.screen, { paddingTop: insets.top + 8 }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
    >
      <Text
        style={[
          typography.title,
          fontsLoaded && { fontFamily: fontFamily.displaySemiBold },
        ]}
      >
        {breathingCopy.setupTitle}
      </Text>
      <Text style={[typography.small, { marginTop: space.sm }]}>
        Defaults are gentle—you can start in one tap or adjust first.
      </Text>

      <SectionLabel style={{ marginTop: space.md }}>How you’re resting</SectionLabel>
      <View style={styles.row}>
        <Chip
          label={breathingCopy.postureSitting}
          active={posture === "sitting"}
          onPress={() => setPosture("sitting")}
        />
        <Chip
          label={breathingCopy.postureLying}
          active={posture === "lying"}
          onPress={() => setPosture("lying")}
        />
      </View>

      <SectionLabel>Pace</SectionLabel>
      <View style={styles.row}>
        <Chip
          label={breathingCopy.paceSlow}
          active={pace === "slow"}
          onPress={() => setPace("slow")}
        />
        <Chip
          label={breathingCopy.paceMedium}
          active={pace === "medium"}
          onPress={() => setPace("medium")}
        />
      </View>

      <SectionLabel>{breathingCopy.customize}</SectionLabel>
      <View style={styles.row}>
        {(
          [
            ["orb", breathingCopy.visualOrb],
            ["bar", breathingCopy.visualBar],
            ["text", breathingCopy.visualText],
          ] as const
        ).map(([key, label]) => (
          <Chip
            key={key}
            label={label}
            active={visual === key}
            onPress={() => setVisual(key)}
            variant="accent"
          />
        ))}
      </View>

      <SectionLabel>Cycles (about a minute on slow with 4)</SectionLabel>
      <View style={styles.row}>
        {[4, 6, 8].map((n) => (
          <Chip
            key={n}
            label={String(n)}
            active={cycles === n}
            onPress={() => setCycles(n)}
            variant="gold"
          />
        ))}
      </View>

      <Text
        style={[
          typography.small,
          { marginTop: space.lg, textAlign: "center", color: colors.stone },
        ]}
      >
        {setupSummary}
      </Text>

      <PrimaryButton
        title={breathingCopy.start}
        onPress={() => setStep("session")}
        style={{ marginTop: space.md }}
      />

      <SecondaryButton
        title={breathingCopy.skipSetup}
        onPress={() => {
          setPosture("sitting");
          setPace("slow");
          setVisual("orb");
          setCycles(4);
          setStep("session");
        }}
        style={{ marginTop: space.sm }}
      />
    </ScrollView>
  );
}

function Chip({
  label,
  active,
  onPress,
  variant = "sage",
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  variant?: "sage" | "accent" | "gold";
}) {
  const bg =
    variant === "accent"
      ? active
        ? colors.accentSoft
        : colors.paperElevated
      : variant === "gold"
        ? active
          ? "rgba(212, 165, 116, 0.35)"
          : colors.paperElevated
        : active
          ? colors.sageSoft
          : colors.paperElevated;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          minHeight: touchTarget.minHeight,
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: radii.full,
          backgroundColor: bg,
          marginRight: space.sm,
          marginBottom: space.sm,
          justifyContent: "center",
        },
        pressed && { opacity: 0.88 },
      ]}
    >
      <Text
        style={{
          ...typography.small,
          color: active ? colors.stone : colors.stoneMuted,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.paper },
  centered: { flex: 1, justifyContent: "center" },
  centerText: { textAlign: "center" },
  row: { flexDirection: "row", flexWrap: "wrap" },
});
