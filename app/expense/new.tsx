import { AppHeader } from "@/components/ui/AppHeader";
import { Card } from "@/components/ui/Card";
import { DateField } from "@/components/ui/DateField";
import { FormField } from "@/components/ui/FormField";
import { HeaderBackButton } from "@/components/ui/HeaderBackButton";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Screen } from "@/components/ui/Screen";
import { queryClient } from "@/providers/AppProvider";
import { mockApi } from "@/services/api/mockApi";
import { colors, radii, spacing } from "@/theme/tokens";
import { ExpenseCategory } from "@/types/models";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const categories: ExpenseCategory[] = ["Combustível", "Manutenção", "Documentação", "Seguro", "Estacionamento/Pedágio", "Lavagem", "Outros"];

const sanitizeAmountInput = (value: string) => {
  const normalized = value.replace(/,/g, ".").replace(/[^0-9.]/g, "");
  const [integerPart = "", ...decimalParts] = normalized.split(".");
  const decimals = decimalParts.join("").slice(0, 2);

  if (normalized.startsWith(".")) {
    return decimals ? `0.${decimals}` : "0.";
  }

  if (normalized.includes(".")) {
    return `${integerPart}.${decimals}`;
  }

  return integerPart;
};

export default function NewExpenseScreen() {
  const [category, setCategory] = useState<ExpenseCategory>("Combustível");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("2026-03-19");
  const [note, setNote] = useState("");
  const parsedAmount = Number(amount);
  const isAmountValid = Number.isFinite(parsedAmount) && parsedAmount > 0;

  const createMutation = useMutation({
    mutationFn: mockApi.createExpense,
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      router.back();
    },
  });

  return (
    <Screen>
      <HeaderBackButton label="Novo gasto" />
      <AppHeader title="Registrar despesa" subtitle="Preencha somente o essencial para não perder o hábito." />
      <Card>
        <Text style={styles.label}>Categoria</Text>
        <View style={styles.chipsWrap}>
          {categories.map((item) => (
            <Pressable key={item} onPress={() => setCategory(item)} style={[styles.chip, category === item && styles.chipActive]}>
              <Text style={[styles.chipText, category === item && styles.chipTextActive]}>{item}</Text>
            </Pressable>
          ))}
        </View>
        <FormField
          label="Valor"
          keyboardType="decimal-pad"
          inputMode="decimal"
          value={amount}
          onChangeText={(value) => setAmount(sanitizeAmountInput(value))}
          placeholder="Ex.: 120.50"
          help="Aceita apenas valores positivos."
        />
        <DateField label="Data" value={date} onChange={setDate} help="Toque para escolher no calendário" />
        <FormField label="Observação" value={note} onChangeText={setNote} />
      </Card>
      <PrimaryButton
        title="Salvar gasto"
        loading={createMutation.isPending}
        disabled={!isAmountValid}
        onPress={() => createMutation.mutate({ category, amount: parsedAmount, date, note })}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  chipTextActive: {
    color: colors.white,
  },
});
