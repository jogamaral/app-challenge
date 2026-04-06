import { colors, spacing } from "@/theme/tokens";
import { ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
};

export function Screen({ children, scroll = true, padded = true }: Props) {
  const insets = useSafeAreaInsets();
  const content = <View style={[styles.content, !padded && styles.contentNoPad]}>{children}</View>;

  return (
    <View style={styles.root}>
      <View style={[styles.statusBarFill, { height: insets.top }]} />
      <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
        {scroll ? <ScrollView contentContainerStyle={styles.scroll}>{content}</ScrollView> : content}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.text,
  },
  statusBarFill: {
    backgroundColor: colors.text,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingBottom: spacing.xxl,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  contentNoPad: {
    paddingHorizontal: 0,
  },
});
