import { colors, radii, spacing } from "@/theme/tokens";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary";
};

export function PrimaryButton({ title, onPress, loading, disabled, variant = "primary" }: Props) {
  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [styles.base, variant === "secondary" ? styles.secondary : styles.primary, pressed && styles.pressed, (disabled || loading) && styles.disabled]}
    >
      {loading ? <ActivityIndicator color={variant === "secondary" ? colors.primary : colors.white} /> : <Text style={[styles.text, variant === "secondary" && styles.secondaryText]}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surfaceMuted,
  },
  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "800",
  },
  secondaryText: {
    color: colors.primary,
  },
  pressed: {
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.6,
  },
});
