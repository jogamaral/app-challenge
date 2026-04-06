import { colors, radii, spacing } from "@/theme/tokens";
import { currency } from "@/lib/format";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

export function HeroReserveCard({ reserve, monthSpend, yearSpend }: { reserve: number; monthSpend: number; yearSpend: number }) {
  return (
    <LinearGradient colors={["#FF7300", "#FF9A4D", "#0F2747"]} style={styles.hero}>
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  eyebrow: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.4,
    fontWeight: "700",
  },
  value: {
    color: colors.white,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "900",
  },
  description: {
    color: "rgba(255,255,255,0.82)",
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
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: radii.md,
    padding: spacing.sm,
    gap: 4,
  },
  metricLabel: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 12,
  },
  metricValue: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "800",
  },
});
