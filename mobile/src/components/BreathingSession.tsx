import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  breathingCopy,
  phasesForPace,
  type BreathPhase,
  type Pace,
} from "@seedchlogy/shared";
import { saveSession } from "../storage/session";
import {
  getCalmMotionEnabled,
  subscribeReduceMotionChanged,
} from "../storage/reducedMotion";
import { colors, radii as themeRadii, typography } from "../theme";

export type VisualStyle = "orb" | "bar" | "text";

type Props = {
  pace: Pace;
  visual: VisualStyle;
  totalCycles: number;
  onComplete: () => void;
  onEndEarly: () => void;
};

function phaseLabel(phase: BreathPhase): string {
  switch (phase) {
    case "inhale":
      return breathingCopy.phaseInhale;
    case "holdIn":
      return breathingCopy.phaseHoldIn;
    case "exhale":
      return breathingCopy.phaseExhale;
    case "holdOut":
      return breathingCopy.phaseHoldOut;
  }
}

export function BreathingSession({
  pace,
  visual,
  totalCycles,
  onComplete,
  onEndEarly,
}: Props) {
  const insets = useSafeAreaInsets();
  const [reducedMotion, setReducedMotion] = useState(false);
  const phaseList = useMemo(
    () => phasesForPace(pace).filter((p) => p.seconds > 0),
    [pace],
  );
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [secondInPhase, setSecondInPhase] = useState(0);
  const [cycle, setCycle] = useState(1);
  const [paused, setPaused] = useState(false);
  const completedRef = useRef(false);
  const scale = useMemo(() => new Animated.Value(1), []);

  useEffect(() => {
    void (async () => {
      setReducedMotion(await getCalmMotionEnabled());
    })();
    const unsub = subscribeReduceMotionChanged(() => {
      void getCalmMotionEnabled().then(setReducedMotion);
    });
    return () => {
      unsub();
    };
  }, []);

  const current = phaseList[phaseIdx] ?? phaseList[0];
  const currentPhase = current.phase;
  const currentDuration = Math.max(1, current.seconds);

  const inhaleExpand =
    currentPhase === "inhale" || currentPhase === "holdIn";

  useEffect(() => {
    if (reducedMotion || visual !== "orb") return;
    Animated.timing(scale, {
      toValue: inhaleExpand ? 1.12 : 0.92,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, [inhaleExpand, reducedMotion, scale, visual]);

  useEffect(() => {
    void saveSession({ lastPath: "/breathe", breatheInProgress: true });
  }, []);

  const finishSession = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    void saveSession({ lastPath: "/breathe", breatheInProgress: false });
    onComplete();
  }, [onComplete]);

  const tickPhase = useCallback(() => {
    if (completedRef.current) return;
    setPhaseIdx((pi) => {
      const atLast = pi >= phaseList.length - 1;
      if (!atLast) {
        return pi + 1;
      }
      setCycle((c) => {
        if (c >= totalCycles) {
          finishSession();
          return c;
        }
        return c + 1;
      });
      return 0;
    });
    setSecondInPhase(0);
  }, [finishSession, phaseList.length, totalCycles]);

  useEffect(() => {
    if (paused) return;
    if (completedRef.current) return;
    const t = setInterval(() => {
      setSecondInPhase((s) => {
        if (s + 1 >= currentDuration) {
          tickPhase();
          return 0;
        }
        return s + 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [currentDuration, paused, tickPhase]);

  const orbScale = inhaleExpand ? 1.12 : 0.92;
  const barFrac = inhaleExpand ? 0.85 : 0.35;
  const secondsLeft = Math.max(1, currentDuration - secondInPhase);

  const handleEndEarly = () => {
    void saveSession({ lastPath: "/chat", breatheInProgress: false });
    onEndEarly();
  };

  return (
    <View style={styles.wrap}>
      <Text accessibilityLiveRegion="polite" style={styles.a11yHidden}>
        {phaseLabel(currentPhase)}, {secondsLeft} seconds
      </Text>

      <Text style={[typography.headline, styles.center]}>
        {phaseLabel(currentPhase)}
      </Text>
      <Text style={styles.count}>{secondsLeft}</Text>
      <Text style={[typography.caption, styles.center]}>
        {breathingCopy.cyclesProgress(Math.min(cycle, totalCycles), totalCycles)}
      </Text>

      {visual === "orb" && (
        <View style={styles.orbWrap}>
          {reducedMotion ? (
            <>
              <View
                style={[
                  styles.orbOuter,
                  { transform: [{ scale: orbScale }] },
                ]}
              />
              <View
                style={[
                  styles.orbInner,
                  { transform: [{ scale: orbScale }] },
                ]}
              />
            </>
          ) : (
            <>
              <Animated.View
                style={[
                  styles.orbOuter,
                  { transform: [{ scale }] },
                ]}
              />
              <Animated.View
                style={[
                  styles.orbInner,
                  { transform: [{ scale }] },
                ]}
              />
            </>
          )}
        </View>
      )}

      {visual === "bar" && (
        <View style={styles.barTrack}>
          <View
            style={[
              styles.barFill,
              {
                width: `${reducedMotion ? 50 : barFrac * 100}%`,
              },
            ]}
          />
        </View>
      )}

      {visual === "text" && (
        <Text style={[typography.small, styles.hint]}>
          Follow the words and numbers. Inhale and exhale at your own comfort—nothing
          should feel strained.
        </Text>
      )}

      <View style={[styles.row, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Pressable
          style={({ pressed }) => [
            styles.primaryBtn,
            pressed && { opacity: 0.9 },
          ]}
          onPress={() => setPaused((p) => !p)}
        >
          <Text style={styles.primaryBtnText}>
            {paused ? breathingCopy.resume : breathingCopy.pause}
          </Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.ghostBtn, pressed && { opacity: 0.8 }]}
          onPress={handleEndEarly}
        >
          <Text style={styles.ghostText}>{breathingCopy.endEarly}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  a11yHidden: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
  center: { textAlign: "center" },
  count: {
    fontSize: 44,
    fontVariant: ["tabular-nums"],
    color: colors.accent,
    marginTop: 8,
  },
  orbWrap: {
    width: 220,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 28,
  },
  orbOuter: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.sageSoft,
    opacity: 0.85,
  },
  orbInner: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: colors.sage,
    backgroundColor: "transparent",
  },
  barTrack: {
    width: 280,
    height: 14,
    borderRadius: themeRadii.full,
    backgroundColor: colors.paperElevated,
    marginVertical: 28,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: themeRadii.full,
    backgroundColor: colors.sage,
  },
  hint: {
    textAlign: "center",
    maxWidth: 300,
    marginVertical: 24,
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginTop: 16,
  },
  primaryBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 22,
    minHeight: 48,
    justifyContent: "center",
    borderRadius: themeRadii.full,
  },
  primaryBtnText: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 15,
  },
  ghostBtn: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    minHeight: 48,
    justifyContent: "center",
    borderRadius: themeRadii.full,
  },
  ghostText: {
    color: colors.stoneMuted,
    fontSize: 15,
  },
});
