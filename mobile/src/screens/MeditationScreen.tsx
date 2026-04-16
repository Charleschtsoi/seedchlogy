import { useEffect, useMemo, useState } from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { meditationCopy } from "@seedchlogy/shared";
import meditationCalmImage from "../../assets/meditation-calm.png";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { SecondaryButton } from "../components/ui/SecondaryButton";
import type { RootStackScreenProps } from "../navigation/types";
import { colors, radii, space, typography } from "../theme";

const PRESETS = [5, 10, 15] as const;

function formatRemaining(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  return `${mm}:${ss}`;
}

type SessionState = "setup" | "running" | "paused" | "done";

export function MeditationScreen({ navigation }: RootStackScreenProps<"Meditation">) {
  const insets = useSafeAreaInsets();
  const [minutes, setMinutes] = useState<(typeof PRESETS)[number]>(10);
  const [remainingSec, setRemainingSec] = useState(minutes * 60);
  const [state, setState] = useState<SessionState>("setup");

  useEffect(() => {
    if (state !== "running") return;
    const timer = setInterval(() => {
      setRemainingSec((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setState("done");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [state]);

  const primaryTitle = useMemo(() => {
    if (state === "running") return meditationCopy.pause;
    if (state === "paused") return meditationCopy.resume;
    return meditationCopy.begin;
  }, [state]);

  const begin = () => {
    setRemainingSec(minutes * 60);
    setState("running");
  };

  const onPrimary = () => {
    if (state === "setup") {
      begin();
      return;
    }
    if (state === "running") {
      setState("paused");
      return;
    }
    if (state === "paused") {
      setState("running");
    }
  };

  const onEnd = () => {
    setState("done");
    setRemainingSec(0);
  };

  return (
    <ImageBackground
      source={meditationCalmImage}
      style={styles.flex}
      resizeMode="cover"
    >
      <StatusBar style="light" />
      <View style={styles.overlayBase} />
      <View style={styles.overlayTop} />

      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + space.lg,
            paddingBottom: Math.max(insets.bottom, space.md) + space.md,
          },
        ]}
      >
        <View>
          <Text style={[typography.label, styles.kicker]}>
            {meditationCopy.stillnessTitle}
          </Text>
          <Text style={[typography.display, styles.title]}>
            {state === "done"
              ? meditationCopy.completeTitle
              : formatRemaining(remainingSec)}
          </Text>
          <Text style={[typography.body, styles.helper]}>
            {state === "done" ? meditationCopy.completeBody : meditationCopy.helper}
          </Text>
        </View>

        {state === "setup" ? (
          <View style={styles.controls}>
            <Text style={styles.lengthLabel}>{meditationCopy.lengthLabel}</Text>
            <View style={styles.row}>
              {PRESETS.map((m) => (
                <Pressable
                  key={m}
                  onPress={() => {
                    setMinutes(m);
                    setRemainingSec(m * 60);
                  }}
                  accessibilityRole="button"
                  accessibilityState={{ selected: minutes === m }}
                  accessibilityLabel={`${m} minutes`}
                  style={({ pressed }) => [
                    styles.chip,
                    minutes === m && styles.chipActive,
                    pressed && { opacity: 0.88 },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      minutes === m && styles.chipTextActive,
                    ]}
                  >
                    {m}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.actions}>
          {state === "done" ? (
            <PrimaryButton title={meditationCopy.done} onPress={() => navigation.goBack()} />
          ) : (
            <>
              <PrimaryButton title={primaryTitle} onPress={onPrimary} />
              {state !== "setup" ? (
                <SecondaryButton
                  title={meditationCopy.endSession}
                  onPress={onEnd}
                  style={{ marginTop: space.sm }}
                  textStyle={{ color: colors.white }}
                />
              ) : null}
            </>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.stone },
  overlayBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(33, 36, 29, 0.45)",
  },
  overlayTop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(12, 16, 18, 0.16)",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: space.lg,
  },
  kicker: {
    color: "rgba(247, 243, 238, 0.88)",
    marginBottom: space.sm,
  },
  title: {
    color: colors.white,
    fontVariant: ["tabular-nums"],
  },
  helper: {
    color: "rgba(247, 243, 238, 0.92)",
    marginTop: space.md,
    maxWidth: 360,
  },
  controls: {
    marginTop: space.lg,
    padding: space.md,
    borderRadius: radii.md,
    backgroundColor: "rgba(18, 23, 20, 0.35)",
  },
  lengthLabel: {
    ...typography.caption,
    color: "rgba(247, 243, 238, 0.85)",
    marginBottom: space.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
  },
  chip: {
    minHeight: 48,
    minWidth: 58,
    paddingHorizontal: space.md,
    borderRadius: radii.full,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(247, 243, 238, 0.45)",
    backgroundColor: "rgba(247, 243, 238, 0.08)",
  },
  chipActive: {
    backgroundColor: "rgba(247, 243, 238, 0.92)",
    borderColor: "rgba(247, 243, 238, 0.92)",
  },
  chipText: {
    ...typography.body,
    color: "rgba(247, 243, 238, 0.94)",
    fontWeight: "600",
  },
  chipTextActive: {
    color: colors.stone,
  },
  actions: {
    marginTop: space.lg,
  },
});
