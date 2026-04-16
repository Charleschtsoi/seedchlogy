import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  chatCopy,
  positioning,
  postChat,
  type ChatMessage,
  type EnrichedSuggestion,
} from "@seedchlogy/shared";
import { getApiBaseUrl } from "../config";
import { MobileSuggestionCard } from "../components/MobileSuggestionCard";
import { CrisisBannerMobile } from "../components/CrisisBannerMobile";
import { AiDisclosureMobile } from "../components/AiDisclosureMobile";
import { saveSession } from "../storage/session";
import type { MainTabScreenProps } from "../navigation/types";
import type { RootStackParamList } from "../navigation/types";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors, layout, radii, space, typography } from "../theme";

const OPENING: ChatMessage[] = [
  {
    role: "assistant",
    content:
      "Hi—I’m here to help you find something small and kind for your body and attention. No pressure to explain perfectly.",
  },
  {
    role: "assistant",
    content:
      "If you’d like, tap a chip or write a few words about how things feel right now.",
  },
];

const WELCOME_ROTATION = [
  "Welcome back. There’s no rush here.",
  "Hello again. However you arrived is okay.",
  "Good to see you. Let’s keep things gentle.",
];

export function ChatScreen({ navigation }: MainTabScreenProps<"Guide">) {
  const insets = useSafeAreaInsets();
  const tabNav = navigation.getParent();
  const rootNav = tabNav?.getParent<NativeStackNavigationProp<RootStackParamList>>();
  const [messages, setMessages] = useState<ChatMessage[]>(OPENING);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [crisis, setCrisis] = useState(false);
  const [suggestions, setSuggestions] = useState<EnrichedSuggestion[]>([]);
  const [usedAi, setUsedAi] = useState<boolean | undefined>(undefined);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    void saveSession({ lastPath: "/chat", breatheInProgress: false });
  }, []);

  const welcomeExtra = useMemo(() => {
    const d = new Date();
    return WELCOME_ROTATION[(d.getDate() + d.getMonth()) % WELCOME_ROTATION.length];
  }, []);

  const navigateActivity = useCallback(
    (slug: string) => {
      rootNav?.navigate("Activity", { slug });
    },
    [rootNav],
  );

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const nextMessages: ChatMessage[] = [
        ...messages,
        { role: "user", content: trimmed },
      ];
      setMessages(nextMessages);
      setInput("");
      setLoading(true);
      setSuggestions([]);

      try {
        const data = await postChat(getApiBaseUrl(), nextMessages);
        setUsedAi(data.usedAi);
        setCrisis(Boolean(data.crisis));
        setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
        const followUp = data.followUpQuestion;
        if (followUp && followUp.trim()) {
          setMessages((m) => [
            ...m,
            { role: "assistant", content: followUp },
          ]);
        }
        setSuggestions(data.suggestions ?? []);
      } catch {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content:
              "I couldn’t reach the guide just now. If you can, try again in a moment—or open Breathe for a quiet rhythm.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, messages],
  );

  const onNotForMe = () => {
    void send(
      "That suggestion wasn’t a fit for me—could you offer another gentle option?",
    );
  };

  const dataForList = useMemo(() => {
    type Row =
      | { type: "header" }
      | { type: "msg"; item: ChatMessage; index: number }
      | { type: "typing" }
      | { type: "suggest"; item: EnrichedSuggestion };
    const rows: Row[] = [{ type: "header" }];
    messages.forEach((item, index) => {
      rows.push({ type: "msg", item, index });
    });
    if (loading) rows.push({ type: "typing" });
    suggestions.forEach((item) => rows.push({ type: "suggest", item }));
    return rows;
  }, [loading, messages, suggestions]);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={insets.top + 48}
    >
      <FlatList
        ref={listRef}
        data={dataForList}
        keyExtractor={(row, i) =>
          row.type === "msg"
            ? `m-${row.index}`
            : row.type === "suggest"
              ? `s-${row.item.activityId}`
              : `${row.type}-${i}`
        }
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: insets.top + 8,
          paddingBottom: 120 + insets.bottom,
        }}
        onContentSizeChange={() =>
          listRef.current?.scrollToEnd({ animated: true })
        }
        renderItem={({ item: row }) => {
          if (row.type === "header") {
            return (
              <View>
                <Text style={[typography.caption, styles.center]}>
                  {welcomeExtra}
                </Text>
                <Text style={[typography.caption, styles.center, { marginTop: 8 }]}>
                  {positioning.wellnessOnly}
                </Text>
                {crisis ? (
                  <View style={{ marginTop: 12 }}>
                    <CrisisBannerMobile
                      onOpenSafety={() =>
                        navigation.navigate("More", {
                          screen: "Safety",
                        } as never)
                      }
                    />
                  </View>
                ) : null}
              </View>
            );
          }
          if (row.type === "msg") {
            const m = row.item;
            const isUser = m.role === "user";
            return (
              <View
                style={[
                  styles.bubbleRow,
                  isUser ? styles.bubbleRowUser : styles.bubbleRowBot,
                ]}
              >
                <View
                  style={[
                    styles.bubble,
                    isUser ? styles.bubbleUser : styles.bubbleBot,
                  ]}
                >
                  {m.role === "assistant" ? (
                    <Text style={styles.badge}>{chatCopy.aiBadge}</Text>
                  ) : null}
                  <Text
                    style={[
                      typography.small,
                      { color: colors.stone },
                    ]}
                  >
                    {m.content}
                  </Text>
                </View>
              </View>
            );
          }
          if (row.type === "typing") {
            return (
              <View style={[styles.bubbleRow, styles.bubbleRowBot]}>
                <View style={[styles.bubble, styles.bubbleBot, styles.typingBubble]}>
                  <ActivityIndicator color={colors.sage} />
                  <Text style={[typography.caption, { marginTop: 8 }]}>
                    {chatCopy.typing}
                  </Text>
                </View>
              </View>
            );
          }
          return (
            <MobileSuggestionCard
              item={row.item}
              onNotForMe={onNotForMe}
              onStart={navigateActivity}
            />
          );
        }}
      />

      <View
        style={[
          styles.composer,
          {
            paddingBottom: Math.max(insets.bottom, 12),
            paddingTop: 12,
          },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={styles.chipsScrollContent}
        >
          {chatCopy.chips.map((c) => (
            <Pressable
              key={c}
              style={({ pressed }) => [
                layout.chip,
                styles.chipInRow,
                pressed && { opacity: 0.88 },
              ]}
              disabled={loading}
              onPress={() => void send(c)}
            >
              <Text style={{ fontSize: 13, color: colors.stone }}>{c}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder={chatCopy.inputPlaceholder}
            placeholderTextColor={colors.stoneMuted}
            value={input}
            onChangeText={setInput}
            editable={!loading}
            multiline
            onSubmitEditing={() => void send(input)}
          />
          <Pressable
            style={({ pressed }) => [
              layout.primaryButton,
              styles.sendBtn,
              pressed && { opacity: 0.9 },
            ]}
            disabled={loading || !input.trim()}
            onPress={() => void send(input)}
          >
            <Text style={layout.primaryButtonText}>{chatCopy.send}</Text>
          </Pressable>
        </View>
        <AiDisclosureMobile usedAi={usedAi} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.paper },
  center: { textAlign: "center" },
  bubbleRow: { marginTop: 14, flexDirection: "row" },
  bubbleRowUser: { justifyContent: "flex-end" },
  bubbleRowBot: { justifyContent: "flex-start" },
  bubble: {
    maxWidth: "88%",
    borderRadius: radii.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  bubbleUser: { backgroundColor: colors.accentSoft },
  bubbleBot: { backgroundColor: colors.paperElevated },
  badge: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.sage,
    letterSpacing: 0.5,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  composer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.paper,
    borderTopWidth: 1,
    borderTopColor: colors.accentSoft + "55",
    paddingHorizontal: 16,
  },
  chipsScroll: { marginBottom: space.sm, flexGrow: 0 },
  chipsScrollContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    paddingRight: space.md,
  },
  chipInRow: { marginRight: 0, marginBottom: 0 },
  typingBubble: { minHeight: 72, justifyContent: "center" },
  inputRow: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.accentSoft,
    backgroundColor: colors.paperElevated,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.stone,
  },
  sendBtn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    minHeight: 48,
    justifyContent: "center",
  },
});
