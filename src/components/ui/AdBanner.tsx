import { Card } from "@/components/ui/Card";
import { MockAd } from "@/types/models";
import { colors, radii, spacing } from "@/theme/tokens";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  ad: MockAd;
  onPress: () => void;
};

export function AdBanner({ ad, onPress }: Props) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${ad.title}. ${ad.cta}`} onPress={onPress} style={({ pressed }) => [styles.wrapper, pressed && styles.pressed]}>
      <Card style={styles.card}>
        <View style={styles.highlightBar} />
        <View style={styles.topRow}>
          <Text style={styles.badge}>Publicidade</Text>
          <Text style={styles.sponsor}>{ad.sponsor}</Text>
        </View>
        <Text style={styles.title}>{ad.title}</Text>
        <Text style={styles.description}>{ad.description}</Text>
        <View style={styles.ctaRow}>
          <Text style={styles.cta}>{ad.cta}</Text>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radii.lg,
  },
  card: {
    backgroundColor: colors.backgroundStrong,
    borderColor: "#C9D1DB",
    gap: spacing.sm,
  },
  pressed: {
    opacity: 0.94,
  },
  highlightBar: {
    height: 6,
    marginHorizontal: -spacing.md,
    marginTop: -spacing.md,
    marginBottom: spacing.xs,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    backgroundColor: colors.primary,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  badge: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  sponsor: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    lineHeight: 24,
  },
  description: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  ctaRow: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceMuted,
  },
  cta: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800",
  },
});
