import { useEffect, useState } from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getCalmMotionEnabled } from "../../storage/reducedMotion";
import { colors, radii, space, typography } from "../../theme";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  title: string;
  summary?: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
};

export function ExpandableSection({
  title,
  summary,
  defaultExpanded = false,
  children,
}: Props) {
  const [open, setOpen] = useState(defaultExpanded);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    void getCalmMotionEnabled().then(setReduceMotion);
  }, []);

  const toggle = () => {
    if (!reduceMotion) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    setOpen((o) => !o);
  };

  return (
    <View style={styles.wrap}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityHint={open ? "Collapses section" : "Expands section"}
        onPress={toggle}
        style={({ pressed }) => [
          styles.header,
          pressed && { opacity: 0.92 },
        ]}
      >
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          {summary && !open ? (
            <Text style={styles.summary} numberOfLines={2}>
              {summary}
            </Text>
          ) : null}
        </View>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={22}
          color={colors.stoneMuted}
          accessibilityElementsHidden
          importantForAccessibility="no"
        />
      </Pressable>
      {open ? <View style={styles.body}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radii.md,
    backgroundColor: colors.paperElevated,
    overflow: "hidden",
    marginTop: space.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: space.md,
    paddingHorizontal: space.md,
    minHeight: 48,
  },
  headerText: { flex: 1, paddingRight: space.sm },
  title: {
    ...typography.body,
    fontWeight: "600",
    color: colors.stone,
  },
  summary: {
    ...typography.caption,
    marginTop: space.xs,
  },
  body: {
    paddingHorizontal: space.md,
    paddingBottom: space.md,
  },
});
