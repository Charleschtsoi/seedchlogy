import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { moodCopy, memoryJarCopy } from "@seedchlogy/shared";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { MutedCard } from "../components/ui/MutedCard";
import { layout, radii, space, typography, colors } from "../theme";
import type { RootStackScreenProps } from "../navigation/types";
import {
  getLastMoodCheckIn,
  loadMoodCheckIns,
  saveMoodCheckIn,
  type MoodCheckInEntry,
} from "../storage/mood";
import meditationCalmImage from "../../assets/meditation-calm.png";

const DANGER_KEYWORDS = [
  "suicide",
  "kill myself",
  "hurt myself",
  "self harm",
  "harm myself",
  "danger",
  "can’t go on",
  "cant go on",
  "take my life",
] as const;

function looksLikeDanger(text: string) {
  const t = text.trim().toLowerCase();
  return DANGER_KEYWORDS.some((k) => t.includes(k));
}

function formatDate(ts: number) {
  try {
    const d = new Date(ts);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

export function MoodCheckInScreen({
  navigation,
}: RootStackScreenProps<"MoodCheckIn">) {
  const insets = useSafeAreaInsets();
  const [mood, setMood] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const [loaded, setLoaded] = useState(false);
  const [checkIns, setCheckIns] = useState<MoodCheckInEntry[]>([]);

  useEffect(() => {
    let alive = true;
    void (async () => {
      const [last, all] = await Promise.all([
        getLastMoodCheckIn(),
        loadMoodCheckIns(),
      ]);
      if (!alive) return;
      setMood(last?.mood ?? null);
      setCheckIns(all);
      setLoaded(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const dangerFound = useMemo(() => looksLikeDanger(note), [note]);

  const canSave = useMemo(() => {
    return !saved && Boolean(mood);
  }, [mood, saved]);

  const openSafety = useCallback(() => {
    const nav = navigation as unknown as {
      navigate: (name: string, params?: unknown) => void;
    };
    nav.navigate("Main", {
      screen: "More",
      params: { screen: "Safety" },
    });
  }, [navigation]);

  const save = useCallback(async () => {
    if (!mood) return;
    await saveMoodCheckIn({ mood, note: note.trim() || null });
    const next = await loadMoodCheckIns();
    setCheckIns(next);
    setSaved(true);
  }, [mood, note]);

  const recentToShow = useMemo(() => checkIns.slice(0, 5), [checkIns]);

  if (!loaded) {
    return (
      <View style={[{ flex: 1, backgroundColor: colors.paper }, { paddingTop: insets.top }]}>
        <Text style={typography.body}>Loading…</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={meditationCalmImage}
      style={styles.flex}
      resizeMode="cover"
    >
      <StatusBar style="light" />
      <View style={styles.overlayBase} />
      <View style={styles.overlayTop} />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={{
          paddingTop: insets.top + space.lg,
          paddingBottom: insets.bottom + space.xxl,
          paddingHorizontal: space.lg,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <Text style={[typography.label, styles.kicker]}>
            {moodCopy.title}
          </Text>

          <Text style={[typography.display, styles.title]}>
            {saved ? moodCopy.savedTitle : mood ? mood : moodCopy.labelPickMood}
          </Text>

          <Text style={[typography.body, styles.helper]}>
            {saved ? moodCopy.savedBody : moodCopy.prompt}
          </Text>

          {dangerFound ? (
            <Pressable
              onPress={openSafety}
              style={styles.dangerLink}
              accessibilityRole="link"
            >
              <Text style={styles.dangerLinkText}>
                {memoryJarCopy.ifDangerTitle}
              </Text>
            </Pressable>
          ) : null}
        </View>

        {!saved ? (
          <View>
            <View style={styles.moodWrap}>
              {moodCopy.moods.map((m) => {
                const active = mood === m;
                return (
                  <Pressable
                    key={m}
                    onPress={() => setMood(m)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    accessibilityLabel={`${m} mood`}
                    style={({ pressed }) => [
                      layout.chip,
                      active && layout.chipActive,
                      pressed && { opacity: 0.88 },
                    ]}
                  >
                    <Text
                      style={[
                        styles.moodChipText,
                        active && styles.moodChipTextActive,
                      ]}
                    >
                      {m}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <TextInput
              style={styles.noteInput}
              multiline
              placeholder={moodCopy.notePlaceholder}
              placeholderTextColor="rgba(247, 243, 238, 0.55)"
              value={note}
              onChangeText={setNote}
              editable={!saved}
            />

            <View style={styles.actions}>
              <PrimaryButton
                title={moodCopy.saveCheckIn}
                onPress={() => void save()}
                disabled={!canSave}
              />
            </View>
          </View>
        ) : (
          <View style={styles.actions}>
            <PrimaryButton
              title={moodCopy.nextSaveMemory}
              onPress={() => navigation.navigate("MemoryJar")}
            />
          </View>
        )}

        <View style={{ marginTop: space.xl }}>
          <Text style={[typography.headline, styles.sectionTitle]}>
            {moodCopy.lastCheckIns}
          </Text>

          {recentToShow.length === 0 ? (
            <Text style={[typography.small, styles.recentEmpty]}>
              {moodCopy.noCheckIns}
            </Text>
          ) : (
            recentToShow.map((ci) => (
              <View key={ci.id} style={{ marginTop: space.sm }}>
                <MutedCard style={styles.checkInCard}>
                  <Text style={[typography.caption, styles.checkInDate]}>
                    {formatDate(ci.createdAt)}
                    {ci.mood ? ` · ${ci.mood}` : ""}
                  </Text>
                  {ci.note ? (
                    <Text style={[typography.body, styles.checkInNote]}>
                      {ci.note}
                    </Text>
                  ) : (
                    <Text style={[typography.small, styles.checkInNoteMuted]}>
                      No note.
                    </Text>
                  )}
                </MutedCard>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  overlayBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(33, 36, 29, 0.45)",
  },
  overlayTop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(12, 16, 18, 0.16)",
  },
  kicker: {
    color: "rgba(247, 243, 238, 0.88)",
    marginBottom: space.sm,
  },
  title: {
    color: colors.white,
  },
  helper: {
    color: "rgba(247, 243, 238, 0.92)",
    marginTop: space.md,
    maxWidth: 420,
  },
  moodWrap: {
    marginTop: space.lg,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  moodChipText: {
    ...typography.small,
    color: "rgba(247, 243, 238, 0.94)",
    fontWeight: "600",
  },
  moodChipTextActive: {
    color: colors.stone,
  },
  noteInput: {
    marginTop: space.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: "rgba(247, 243, 238, 0.35)",
    backgroundColor: "rgba(247, 243, 238, 0.08)",
    color: colors.white,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    minHeight: 88,
  },
  actions: {
    marginTop: space.lg,
  },
  dangerLink: {
    marginTop: space.sm,
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
    borderRadius: radii.full,
    backgroundColor: "rgba(139, 74, 74, 0.25)",
    alignSelf: "flex-start",
  },
  dangerLinkText: {
    color: "rgba(255, 251, 248, 0.95)",
    fontWeight: "600",
  },
  sectionTitle: { color: colors.white },
  recentEmpty: { color: "rgba(247, 243, 238, 0.75)" },
  checkInCard: {
    backgroundColor: "rgba(18, 23, 20, 0.35)",
    borderRadius: radii.md,
    padding: space.md,
  },
  checkInDate: { color: "rgba(247, 243, 238, 0.92)" },
  checkInNote: { color: "rgba(247, 243, 238, 0.92)", marginTop: space.xs },
  checkInNoteMuted: { marginTop: space.xs, color: "rgba(247, 243, 238, 0.75)" },
});

