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
import { meditationCopy, memoryJarCopy } from "@seedchlogy/shared";
import { ExpandableSection } from "../components/ui/ExpandableSection";
import { MutedCard } from "../components/ui/MutedCard";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import type { RootStackScreenProps } from "../navigation/types";
import {
  colors,
  layout,
  radii,
  space,
  typography,
} from "../theme";
import meditationCalmImage from "../../assets/meditation-calm.png";
import {
  getLastMoodCheckIn,
} from "../storage/mood";
import {
  loadMemoryJars,
  saveMemoryJar,
  type MemoryJarEntry,
} from "../storage/memoryJar";

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
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export function MemoryJarScreen({
  navigation,
}: RootStackScreenProps<"MemoryJar">) {
  const insets = useSafeAreaInsets();

  const [loaded, setLoaded] = useState(false);
  const [moodLabel, setMoodLabel] = useState<string | null>(null);
  const [memories, setMemories] = useState<MemoryJarEntry[]>([]);

  const [notice, setNotice] = useState("");
  const [nextMoment, setNextMoment] = useState("");
  const [kindAction, setKindAction] = useState("");

  const [saved, setSaved] = useState(false);

  const [expandedMemoryId, setExpandedMemoryId] = useState<
    string | null
  >(null);

  const openSafety = useCallback(() => {
    // Root stack -> Main (tabs) -> More (stack) -> Safety
    const nav = navigation as unknown as {
      navigate: (name: string, params?: unknown) => void;
    };
    nav.navigate("Main", {
      screen: "More",
      params: { screen: "Safety" },
    });
  }, [navigation]);

  useEffect(() => {
    let alive = true;
    void (async () => {
      const lastMood = await getLastMoodCheckIn();
      const lastMemories = await loadMemoryJars();
      if (!alive) return;
      setMoodLabel(lastMood?.mood ?? null);
      setMemories(lastMemories);
      setLoaded(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const dangerFound = useMemo(() => {
    return (
      looksLikeDanger(notice) ||
      looksLikeDanger(nextMoment) ||
      looksLikeDanger(kindAction)
    );
  }, [kindAction, nextMoment, notice]);

  const canSave = useMemo(() => {
    return (
      !saved &&
      (notice.trim().length > 0 ||
        nextMoment.trim().length > 0 ||
        kindAction.trim().length > 0)
    );
  }, [kindAction, nextMoment, notice, saved]);

  const save = useCallback(async () => {
    if (!canSave) return;
    await saveMemoryJar({
      moodLabel,
      notice: notice.trim(),
      nextMoment: nextMoment.trim(),
      kindAction: kindAction.trim(),
    });

    const nextMemories = await loadMemoryJars();
    setMemories(nextMemories);
    setSaved(true);
  }, [canSave, kindAction, moodLabel, nextMoment, notice]);

  const recentToShow = useMemo(() => memories.slice(0, 3), [memories]);

  if (!loaded) {
    return (
      <View style={[layout.screen, { paddingTop: insets.top }]}>
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
            {memoryJarCopy.title}
          </Text>

          <Text style={[typography.display, styles.title]}>
            {saved ? memoryJarCopy.completionTitle : memoryJarCopy.title}
          </Text>

          <Text style={[typography.body, styles.helper]}>
            {saved ? memoryJarCopy.completionBody : memoryJarCopy.helper}
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
            {moodLabel ? (
              <MutedCard style={styles.moodCard}>
                <Text style={[typography.caption, { color: colors.white }]}>
                  Mood: {moodLabel}
                </Text>
              </MutedCard>
            ) : null}

            <ExpandableSection
              title={memoryJarCopy.sectionNotice}
              defaultExpanded={false}
            >
              <TextInput
                style={styles.input}
                multiline
                placeholder={memoryJarCopy.placeholderNotice}
                placeholderTextColor="rgba(247, 243, 238, 0.55)"
                value={notice}
                onChangeText={setNotice}
                editable={!saved}
              />
            </ExpandableSection>

            <ExpandableSection
              title={memoryJarCopy.sectionNextMoment}
              defaultExpanded={false}
            >
              <TextInput
                style={styles.input}
                multiline
                placeholder={memoryJarCopy.placeholderNextMoment}
                placeholderTextColor="rgba(247, 243, 238, 0.55)"
                value={nextMoment}
                onChangeText={setNextMoment}
                editable={!saved}
              />
            </ExpandableSection>

            <ExpandableSection
              title={memoryJarCopy.sectionKindAction}
              defaultExpanded={false}
            >
              <TextInput
                style={styles.input}
                multiline
                placeholder={memoryJarCopy.placeholderKindAction}
                placeholderTextColor="rgba(247, 243, 238, 0.55)"
                value={kindAction}
                onChangeText={setKindAction}
                editable={!saved}
              />
            </ExpandableSection>

            <View style={styles.actions}>
              <PrimaryButton
                title={memoryJarCopy.saveMemory}
                onPress={() => void save()}
                disabled={!canSave}
                accessibilityLabel={memoryJarCopy.saveMemory}
              />
            </View>
          </View>
        ) : (
          <View style={styles.actions}>
            <PrimaryButton
              title={meditationCopy.done}
              onPress={() => navigation.goBack()}
            />
          </View>
        )}

        <View style={{ marginTop: space.xl }}>
          <Text style={[typography.headline, styles.sectionTitle]}>
            {memoryJarCopy.recentMemories}
          </Text>

          {recentToShow.length === 0 ? (
            <Text style={[typography.small, styles.recentEmpty]}>
              {memoryJarCopy.noMemories}
            </Text>
          ) : (
            recentToShow.map((m) => {
              const expanded = expandedMemoryId === m.id;
              return (
                <View key={m.id} style={{ marginTop: space.sm }}>
                  <Pressable
                    onPress={() =>
                      setExpandedMemoryId((prev) =>
                        prev === m.id ? null : m.id,
                      )
                    }
                    accessibilityRole="button"
                    accessibilityState={{ expanded }}
                    style={({ pressed }) => [
                      styles.memoryRow,
                      expanded && styles.memoryRowExpanded,
                      pressed && { opacity: 0.92 },
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={[typography.body, styles.memoryDate]}>
                        {formatDate(m.createdAt)}
                        {m.moodLabel ? ` · ${m.moodLabel}` : ""}
                      </Text>
                      <Text
                        style={[typography.small, styles.memorySnippet]}
                        numberOfLines={expanded ? 10 : 2}
                      >
                        {expanded
                          ? [m.notice, m.nextMoment, m.kindAction]
                              .filter(Boolean)
                              .join("\n\n")
                          : m.notice || m.nextMoment || m.kindAction}
                      </Text>
                    </View>
                    <Text style={styles.chev}>
                      {expanded ? "˄" : "˅"}
                    </Text>
                  </Pressable>
                </View>
              );
            })
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
    marginBottom: space.sm,
  },
  helper: {
    color: "rgba(247, 243, 238, 0.92)",
    maxWidth: 420,
  },
  input: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: "rgba(247, 243, 238, 0.35)",
    backgroundColor: "rgba(247, 243, 238, 0.08)",
    color: colors.white,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    minHeight: 92,
    marginTop: space.xs,
  },
  actions: { marginTop: space.lg },
  overlaySafeInset: { flex: 1 },
  sectionTitle: { color: colors.white, marginBottom: space.sm },
  recentEmpty: { color: "rgba(247, 243, 238, 0.75)" },
  moodCard: {
    backgroundColor: "rgba(18, 23, 20, 0.35)",
    padding: space.md,
    borderRadius: radii.md,
  },
  dangerLink: {
    marginTop: space.md,
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
  memoryRow: {
    padding: space.md,
    borderRadius: radii.md,
    backgroundColor: "rgba(18, 23, 20, 0.35)",
    borderWidth: 1,
    borderColor: "rgba(247, 243, 238, 0.18)",
  },
  memoryRowExpanded: {
    backgroundColor: "rgba(18, 23, 20, 0.48)",
  },
  memoryDate: { color: "rgba(247, 243, 238, 0.92)", marginBottom: space.xs },
  memorySnippet: { color: "rgba(247, 243, 238, 0.9)" },
  chev: { color: "rgba(247, 243, 238, 0.8)", fontSize: 18, marginLeft: space.sm },
});

