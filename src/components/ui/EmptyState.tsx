import { colors, radii, spacing } from "@/theme/tokens";
import { StyleSheet, Text, View } from "react-native";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.emoji}>:)</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.xl,
    backgroundColor: colors.card,
    alignItems: "center",
    gap: spacing.sm,
  },
  emoji: { fontSize: 26 },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
  },
  description: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
});
