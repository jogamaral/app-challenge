import { colors, radii, spacing } from "@/theme/tokens";
import { currency } from "@/lib/format";
import { StyleSheet, Text, View } from "react-native";

export function HeroReserveCard({ reserve, monthSpend, yearSpend }: { reserve: number; monthSpend: number; yearSpend: number }) {
  return (
    <View style={styles.hero}>
      <Text style={styles.eyebrow}>Reserva sugerida</Text>
      <Text style={styles.value}>{currency(reserve)}</Text>
      <Text style={styles.description}>Guarde esse valor por mês para cobrir gastos previstos e manutenções.</Text>
      <View style={styles.metricsRow}>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Gasto do mês</Text>
          <Text style={styles.metricValue}>{currency(monthSpend)}</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Acumulado do ano</Text>
          <Text style={styles.metricValue}>{currency(yearSpend)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.4,
    fontWeight: "700",
  },
  value: {
    color: colors.text,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "900",
  },
  description: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  metricsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  metricBox: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.md,
    padding: spacing.sm,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricLabel: {
    color: colors.textMuted,
    fontSize: 12,
  },
  metricValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
});
