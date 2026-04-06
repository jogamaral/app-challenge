import { AppHeader } from "@/components/ui/AppHeader";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
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

export default function NewExpenseScreen() {
  const [category, setCategory] = useState<ExpenseCategory>("Combustível");
  const [amount, setAmount] = useState("0");
  const [date, setDate] = useState("2026-03-19");
  const [note, setNote] = useState("");

  const createMutation = useMutation({
    mutationFn: mockApi.createExpense,
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      router.back();
    },
  });

  return (
    <Screen>
      <AppHeader eyebrow="Novo gasto" title="Registrar despesa" subtitle="Preencha somente o essencial para não perder o hábito." />
      <Card>
        <Text style={styles.label}>Categoria</Text>
        <View style={styles.chipsWrap}>
          {categories.map((item) => (
            <Pressable key={item} onPress={() => setCategory(item)} style={[styles.chip, category === item && styles.chipActive]}>
              <Text style={[styles.chipText, category === item && styles.chipTextActive]}>{item}</Text>
            </Pressable>
          ))}
        </View>
        <FormField label="Valor" keyboardType="decimal-pad" value={amount} onChangeText={setAmount} />
        <FormField label="Data" value={date} onChangeText={setDate} help="Use o formato AAAA-MM-DD" />
        <FormField label="Observação" value={note} onChangeText={setNote} />
      </Card>
      <PrimaryButton title="Salvar gasto" loading={createMutation.isPending} onPress={() => createMutation.mutate({ category, amount: Number(amount), date, note })} />
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
