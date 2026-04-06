import { colors, radii, spacing } from "@/theme/tokens";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function ErrorState({ title, description, onRetry }: { title: string; description: string; onRetry?: () => void }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {onRetry ? (
        <Pressable onPress={onRetry} style={styles.button}>
          <Text style={styles.buttonText}>Tentar novamente</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    borderColor: "#FFD2B0",
    borderRadius: radii.lg,
    padding: spacing.xl,
    backgroundColor: "#FFF4EB",
    gap: spacing.sm,
  },
  title: {
    color: colors.danger,
    fontSize: 17,
    fontWeight: "800",
  },
  description: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: colors.danger,
  },
  buttonText: {
    color: colors.white,
    fontWeight: "700",
  },
});
