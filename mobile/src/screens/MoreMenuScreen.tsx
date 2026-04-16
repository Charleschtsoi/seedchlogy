import { Pressable, StyleSheet, Text, View } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { mobileMore, moodCopy } from "@seedchlogy/shared";
import type { MoreStackParamList } from "../navigation/types";
import type { RootStackParamList } from "../navigation/types";
import { colors, space, typography } from "../theme";

export function MoreMenuScreen({
  navigation,
}: NativeStackScreenProps<MoreStackParamList, "MoreMenu">) {
  const insets = useSafeAreaInsets();
  const openMeditation = () => {
    const directRoot = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
    const parentTab = navigation.getParent();
    const nestedRoot = parentTab?.getParent<NativeStackNavigationProp<RootStackParamList>>();
    const targetNav = directRoot ?? nestedRoot;
    targetNav?.navigate("Meditation");
  };
  const openMoodCheckIn = () => {
    const directRoot = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
    const parentTab = navigation.getParent();
    const nestedRoot = parentTab?.getParent<NativeStackNavigationProp<RootStackParamList>>();
    const targetNav = directRoot ?? nestedRoot;
    targetNav?.navigate("MoodCheckIn");
  };
  return (
    <View style={[styles.wrap, { paddingTop: insets.top + 16 }]}>
      <Text style={typography.title}>More</Text>
      <Text style={[typography.small, { marginTop: 8 }]}>
        Safety, preferences, and scope.
      </Text>
      <Pressable
        style={styles.row}
        onPress={() => navigation.navigate("Safety")}
      >
        <View style={styles.rowLabels}>
          <Text style={styles.rowText}>Safety & scope</Text>
          <Text style={styles.rowSub}>{mobileMore.safetySubtitle}</Text>
        </View>
        <Text style={styles.chev}>›</Text>
      </Pressable>
      <Pressable
        style={styles.row}
        onPress={() => navigation.navigate("Settings")}
      >
        <View style={styles.rowLabels}>
          <Text style={styles.rowText}>Preferences</Text>
          <Text style={styles.rowSub}>{mobileMore.settingsSubtitle}</Text>
        </View>
        <Text style={styles.chev}>›</Text>
      </Pressable>
      <Pressable
        style={styles.row}
        onPress={openMeditation}
      >
        <View style={styles.rowLabels}>
          <Text style={styles.rowText}>Stillness</Text>
          <Text style={styles.rowSub}>{mobileMore.meditationSubtitle}</Text>
        </View>
        <Text style={styles.chev}>›</Text>
      </Pressable>
      <Pressable
        style={styles.row}
        onPress={openMoodCheckIn}
      >
        <View style={styles.rowLabels}>
          <Text style={styles.rowText}>{moodCopy.title}</Text>
          <Text style={styles.rowSub}>{moodCopy.prompt}</Text>
        </View>
        <Text style={styles.chev}>›</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.paper, paddingHorizontal: 20 },
  row: {
    marginTop: space.md,
    paddingVertical: space.md,
    paddingHorizontal: space.md,
    borderRadius: 12,
    backgroundColor: colors.paperElevated,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowLabels: { flex: 1, paddingRight: space.sm },
  rowText: { fontSize: 16, color: colors.stone, fontWeight: "500" },
  rowSub: {
    ...typography.caption,
    marginTop: space.xs,
    lineHeight: 17,
  },
  chev: { fontSize: 22, color: colors.stoneMuted },
});
