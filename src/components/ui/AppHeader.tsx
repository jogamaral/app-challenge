import { colors, spacing } from "@/theme/tokens";
import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
};

export function AppHeader({ eyebrow, title, subtitle, right }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.textWrap}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  textWrap: {
    flex: 1,
    gap: 4,
  },
  eyebrow: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    color: colors.textMuted,
    fontWeight: "700",
  },
  title: {
    fontSize: 28,
    lineHeight: 32,
    color: colors.text,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
  },
});
