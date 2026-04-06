import { currency, fullDate, shortDate } from "@/lib/format";
import { colors, radii, spacing } from "@/theme/tokens";
import { Expense, UpcomingEvent } from "@/types/models";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function UpcomingEventItem({ item, onPress }: { item: UpcomingEvent; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle} · {shortDate(item.date)}</Text>
      </View>
      <View style={styles.amountBlock}>
        <View style={[styles.badge, item.urgency === "high" ? styles.badgeHigh : item.urgency === "warning" ? styles.badgeWarning : styles.badgeNormal]}>
          <Text style={styles.badgeText}>{item.type === "annual" ? "Anual" : "Manut."}</Text>
        </View>
        <Text style={styles.amount}>{currency(item.amount)}</Text>
      </View>
    </Pressable>
  );
}

export function ExpenseItem({ item }: { item: Expense }) {
  return (
    <View style={styles.row}>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{item.category}</Text>
        <Text style={styles.subtitle}>{fullDate(item.date)}{item.note ? ` · ${item.note}` : ""}</Text>
      </View>
      <Text style={styles.amount}>{currency(item.amount)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  textBlock: {
    flex: 1,
    gap: 4,
  },
  amountBlock: {
    alignItems: "flex-end",
    gap: 6,
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  amount: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
  },
  badgeText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "800",
  },
  badgeNormal: { backgroundColor: "#EEF2F6" },
  badgeWarning: { backgroundColor: "#FFE3CC" },
  badgeHigh: { backgroundColor: "#E8EBF0" },
});
