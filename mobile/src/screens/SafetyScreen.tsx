import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { crisis, positioning, SITE_NAME } from "@seedchlogy/shared";
import type { MoreStackParamList } from "../navigation/types";
import { colors, measure, space, typography } from "../theme";

export function SafetyScreen({
  navigation,
}: NativeStackScreenProps<MoreStackParamList, "Safety">) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.paper }}
      contentContainerStyle={{
        paddingHorizontal: space.md + 4,
        paddingTop: insets.top + space.sm + 4,
        paddingBottom: space.xxl,
      }}
    >
      <View style={styles.measure}>
        <Text style={typography.title}>Safety &amp; scope</Text>
        <Text style={[typography.body, { marginTop: space.md }]}>
          {SITE_NAME} is a calm space for breathing and light wellness ideas. It is{" "}
          <Text style={{ fontWeight: "600" }}>not</Text> a substitute for therapy,
          diagnosis, or crisis services.
        </Text>
        <Text style={[typography.small, { marginTop: space.md }]}>
          {positioning.wellnessOnly}
        </Text>
        <Text style={[typography.small, { marginTop: space.sm }]}>
          {positioning.aiNotice}
        </Text>

        <Text style={[typography.headline, styles.sectionTitle]}>
          If you might be in danger
        </Text>
        <Text style={[typography.body, { marginTop: space.sm }]}>{crisis.leadIn}</Text>
        {crisis.lines.map((l) => (
          <Pressable
            key={l.href}
            style={styles.linkRow}
            onPress={() => Linking.openURL(l.href)}
          >
            <Text style={styles.link}>{l.label}</Text>
            {"phone" in l && l.phone ? (
              <Text style={typography.caption}> — {l.phone}</Text>
            ) : null}
          </Pressable>
        ))}

        <Text style={[typography.headline, styles.sectionTitle]}>Privacy (short)</Text>
        <Text style={[typography.legal, { marginTop: space.sm }]}>
          Chat messages are sent to your configured server to call the AI when enabled.
          This app does not sell your data. Add a full privacy policy before wide release.
        </Text>

        <Pressable
          style={{ marginTop: space.lg, paddingVertical: space.sm }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: colors.accent, fontWeight: "600" }}>Back</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  measure: {
    maxWidth: measure.readableMaxWidth,
    width: "100%",
    alignSelf: "center",
  },
  sectionTitle: { marginTop: space.xl },
  linkRow: { marginTop: space.md },
  link: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.crisisLink,
    textDecorationLine: "underline",
  },
});
