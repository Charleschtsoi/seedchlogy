import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { settingsCopy } from "@seedchlogy/shared";
import type { MoreStackParamList } from "../navigation/types";
import { FORCE_REDUCED_MOTION_KEY, setForceReducedMotion } from "../storage/reducedMotion";
import { colors, measure, space, typography } from "../theme";

export function SettingsScreen({
  navigation,
}: NativeStackScreenProps<MoreStackParamList, "Settings">) {
  const insets = useSafeAreaInsets();
  const [forceReduced, setForceReduced] = useState(false);

  useFocusEffect(
    useCallback(() => {
      void (async () => {
        try {
          const v = await AsyncStorage.getItem(FORCE_REDUCED_MOTION_KEY);
          setForceReduced(v === "1");
        } catch {
          setForceReduced(false);
        }
      })();
    }, []),
  );

  const toggle = async (value: boolean) => {
    setForceReduced(value);
    await setForceReducedMotion(value);
  };

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
        <Text style={typography.title}>{settingsCopy.title}</Text>
        <Text style={[typography.small, { marginTop: space.md }]}>
          {settingsCopy.soundNote}
        </Text>

        <View style={styles.card}>
          <View style={styles.switchRow}>
            <View style={styles.switchCopy}>
              <Text style={[typography.body, { fontWeight: "600" }]}>
                Reduced motion
              </Text>
              <Text style={[typography.small, { marginTop: space.xs }]}>
                {settingsCopy.reducedMotion}
              </Text>
            </View>
            <Switch
              value={forceReduced}
              onValueChange={toggle}
              accessibilityLabel={settingsCopy.reducedMotion}
            />
          </View>
        </View>

        <Text style={[typography.caption, { marginTop: space.md }]}>
          Forced reduced motion is stored only on this device.
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
  card: {
    marginTop: space.lg,
    padding: space.md,
    borderRadius: 12,
    backgroundColor: colors.paperElevated,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: space.md,
  },
  switchCopy: { flex: 1, paddingRight: space.sm },
});
