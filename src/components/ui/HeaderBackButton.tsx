import { colors, spacing } from "@/theme/tokens";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  label: string;
};

export function HeaderBackButton({ label }: Props) {
  return (
    <Pressable accessibilityLabel="Voltar para a página anterior" accessibilityRole="button" onPress={() => router.back()} style={styles.button}>
      <Ionicons name="chevron-back" size={18} color={colors.textMuted} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginBottom: spacing.xs,
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
});
