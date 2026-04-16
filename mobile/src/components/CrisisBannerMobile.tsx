import { Pressable, StyleSheet, Text, View } from "react-native";
import { chatCopy } from "@seedchlogy/shared";
import { colors, radii } from "../theme";

export function CrisisBannerMobile({
  onOpenSafety,
}: {
  onOpenSafety: () => void;
}) {
  return (
    <View style={styles.box}>
      <Text style={styles.text}>{chatCopy.crisisBanner}</Text>
      <Pressable onPress={onOpenSafety}>
        <Text style={styles.link}>Open safety resources</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.crisisLink + "40",
    backgroundColor: colors.crisisBg,
    padding: 14,
  },
  text: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.stone,
  },
  link: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "600",
    color: colors.crisisLink,
    textDecorationLine: "underline",
  },
});
