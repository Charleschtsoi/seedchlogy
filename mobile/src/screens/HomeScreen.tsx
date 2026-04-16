import { useCallback, useMemo, useState } from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  crisis,
  landing,
  mobileHome,
  positioning,
  SITE_NAME,
} from "@seedchlogy/shared";
import { ExpandableSection } from "../components/ui/ExpandableSection";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { SecondaryButton } from "../components/ui/SecondaryButton";
import { loadSession } from "../storage/session";
import type { MainTabScreenProps } from "../navigation/types";
import { fontFamily } from "../fonts";
import { useFontsLoaded } from "../FontProvider";
import { colors, measure, space, typography } from "../theme";

const ROTATING = [
  "You don’t have to earn rest.",
  "However today feels, you can move at a softer pace here.",
  "Nothing here asks you to perform—only to arrive.",
];

export function HomeScreen({ navigation }: MainTabScreenProps<"Home">) {
  const insets = useSafeAreaInsets();
  const fontsLoaded = useFontsLoaded();
  const [session, setSession] = useState<Awaited<
    ReturnType<typeof loadSession>
  > | null>(null);

  useFocusEffect(
    useCallback(() => {
      void loadSession().then(setSession);
    }, []),
  );

  const line = useMemo(() => {
    const d = new Date();
    return ROTATING[(d.getDate() + d.getHours()) % ROTATING.length];
  }, []);

  const displayFont = fontsLoaded
    ? { fontFamily: fontFamily.displaySemiBold }
    : undefined;
  const bodyFont = fontsLoaded
    ? { fontFamily: fontFamily.sansRegular }
    : undefined;
  const bodyMedium = fontsLoaded
    ? { fontFamily: fontFamily.sansMedium }
    : undefined;

  const resumeBreathing = session?.breatheInProgress;
  const resumeChat =
    !resumeBreathing &&
    session?.lastPath === "/chat";

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.paper }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: Math.max(insets.top, space.md) + space.sm,
          paddingBottom: insets.bottom + space.xxl,
          paddingHorizontal: space.md + 4,
        },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.brand, bodyMedium]}>{SITE_NAME}</Text>

      <Text style={[typography.small, bodyFont, styles.supportLine]}>
        {line}
      </Text>

      <Text
        style={[
          typography.display,
          displayFont,
          styles.tagline,
          { maxWidth: measure.readableMaxWidth },
        ]}
      >
        {positioning.tagline}
      </Text>

      <Text style={[typography.small, bodyFont, styles.reassure]}>
        {positioning.reassurance}
      </Text>

      <View style={styles.actions}>
        {resumeBreathing ? (
          <View style={styles.resumeBlock}>
            <Text style={[typography.caption, styles.microLabel, bodyMedium]}>
              {mobileHome.continueMicroLabel}
            </Text>
            <PrimaryButton
              title={landing.resumeBreathing}
              onPress={() => navigation.navigate("Breathe")}
              accessibilityLabel={landing.resumeBreathing}
            />
          </View>
        ) : null}

        {resumeChat ? (
          <View style={[styles.resumeBlock, resumeBreathing && { marginTop: space.md }]}>
            <Text style={[typography.caption, styles.microLabel, bodyMedium]}>
              {mobileHome.continueMicroLabel}
            </Text>
            <SecondaryButton
              variant="outline"
              title={landing.resumeChat}
              onPress={() => navigation.navigate("Guide")}
            />
          </View>
        ) : null}

        <View style={{ marginTop: resumeBreathing || resumeChat ? space.lg : space.xl }}>
          <PrimaryButton
            title={landing.primaryCta}
            onPress={() => navigation.navigate("Breathe")}
          />
        </View>

        <SecondaryButton
          title={landing.secondaryCta}
          onPress={() => navigation.navigate("Guide")}
          style={{ marginTop: space.sm }}
        />
        <SecondaryButton
          title={mobileHome.meditationCta}
          onPress={() => navigation.navigate("Meditation")}
          style={{ marginTop: space.xs }}
          textStyle={{ textDecorationLine: "underline" }}
          accessibilityLabel={mobileHome.meditationCta}
        />
      </View>

      <ExpandableSection
        title={mobileHome.ifYouNeedUrgentHelp}
        summary={mobileHome.crisisPeek}
        defaultExpanded={false}
      >
        <Text style={[typography.body, bodyFont, styles.crisisLead]}>
          {crisis.leadIn}
        </Text>
        {crisis.lines.map((l) => (
          <Pressable
            key={l.href}
            onPress={() => Linking.openURL(l.href)}
            style={styles.crisisRow}
            accessibilityRole="link"
          >
            <Text style={[typography.small, { color: colors.crisisLink }]}>
              {l.label}
              {"phone" in l && l.phone ? ` — ${l.phone}` : ""}
            </Text>
          </Pressable>
        ))}
        <Pressable
          onPress={() =>
            navigation.navigate("More", { screen: "Safety" } as never)
          }
          style={styles.inlineLinkWrap}
        >
          <Text style={styles.inlineLink}>{mobileHome.safetyFullPage}</Text>
        </Pressable>
      </ExpandableSection>

      <ExpandableSection
        title={mobileHome.aboutThisApp}
        summary={`${positioning.aiNotice.slice(0, 72)}…`}
        defaultExpanded={false}
      >
        <Text style={[typography.legal, bodyFont]}>{positioning.aiNotice}</Text>
        <Text style={[typography.legal, bodyFont, { marginTop: space.sm }]}>
          {positioning.wellnessOnly}
        </Text>
      </ExpandableSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: {},
  brand: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.2,
    color: colors.sage,
    textTransform: "uppercase",
    marginBottom: space.sm,
  },
  supportLine: { marginBottom: space.md },
  tagline: { marginBottom: space.md },
  reassure: { marginBottom: space.sm },
  actions: { marginTop: space.sm },
  resumeBlock: { gap: space.xs },
  microLabel: { color: colors.stoneMuted, marginBottom: space.xs },
  crisisLead: {
    fontWeight: "600",
    color: colors.crisisLink,
    marginBottom: space.sm,
  },
  crisisRow: {
    paddingVertical: space.sm,
    minHeight: 44,
    justifyContent: "center",
  },
  inlineLinkWrap: { marginTop: space.md },
  inlineLink: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.stone,
    textDecorationLine: "underline",
  },
});
