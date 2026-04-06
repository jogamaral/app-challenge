import { colors, radii, spacing } from "@/theme/tokens";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export function LoadingState({ message = "Carregando..." }: { message?: string }) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator color={colors.primary} />
      <Text style={styles.text}>{message}</Text>
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
  text: {
    color: colors.textMuted,
    fontSize: 14,
  },
});
