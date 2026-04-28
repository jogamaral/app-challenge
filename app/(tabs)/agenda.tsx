import { AppHeader } from "@/components/ui/AppHeader";
import { Card } from "@/components/ui/Card";
import { DateField } from "@/components/ui/DateField";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { FormField } from "@/components/ui/FormField";
import { LoadingState } from "@/components/ui/LoadingState";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Screen } from "@/components/ui/Screen";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { queryClient, useApp } from "@/providers/AppProvider";
import { currency, shortDate } from "@/lib/format";
import { mockApi } from "@/services/api/mockApi";
import { colors, radii, spacing } from "@/theme/tokens";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const actionLabels = {
  replace: "Troca",
  inspect: "Inspeção",
  adjust: "Ajuste",
};

const TODAY = "2026-03-19";

const sanitizeIntegerInput = (value: string) => value.replace(/[^0-9]/g, "");

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

export default function AgendaScreen() {
  const { vehicle } = useApp();
  const maintenance = useQuery({ queryKey: ["maintenance"], queryFn: mockApi.getMaintenance });
  const [activeMaintenanceId, setActiveMaintenanceId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [manualType, setManualType] = useState("");
  const [manualEstimatedCost, setManualEstimatedCost] = useState("");
  const [manualLastDate, setManualLastDate] = useState(TODAY);
  const [manualLastKm, setManualLastKm] = useState(vehicle?.currentKm ? String(vehicle.currentKm) : "");
  const [manualIntervalKm, setManualIntervalKm] = useState("");
  const [manualIntervalMonths, setManualIntervalMonths] = useState("");
  const parsedEstimatedCost = Number(manualEstimatedCost);
  const parsedLastKm = Number(manualLastKm);
  const parsedIntervalKm = manualIntervalKm ? Number(manualIntervalKm) : undefined;
  const parsedIntervalMonths = manualIntervalMonths ? Number(manualIntervalMonths) : undefined;
  const hasValidInterval = Boolean((parsedIntervalKm && parsedIntervalKm > 0) || (parsedIntervalMonths && parsedIntervalMonths > 0));
  const canSaveManualItem =
    Boolean(manualType.trim()) &&
    Number.isFinite(parsedEstimatedCost) &&
    parsedEstimatedCost > 0 &&
    Boolean(manualLastDate) &&
    Number.isFinite(parsedLastKm) &&
    parsedLastKm >= 0 &&
    hasValidInterval;

  const resetManualForm = () => {
    setManualType("");
    setManualEstimatedCost("");
    setManualLastDate(TODAY);
    setManualLastKm(vehicle?.currentKm ? String(vehicle.currentKm) : "");
    setManualIntervalKm("");
    setManualIntervalMonths("");
  };

  const complete = useMutation({
    mutationFn: mockApi.completeMaintenance,
    onSuccess: async () => {
      await queryClient.invalidateQueries();
    },
    onSettled: () => {
      setActiveMaintenanceId(null);
    },
  });
  const createManualItem = useMutation({
    mutationFn: mockApi.createMaintenanceItem,
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      resetManualForm();
      setIsAdding(false);
    },
  });

  const handleCancelManualItem = () => {
    resetManualForm();
    setIsAdding(false);
  };

  return (
    <Screen>
      <AppHeader eyebrow="Manutenção" title="Agenda preventiva" subtitle="Previsões por tempo e quilometragem, com regras transparentes." />
      {!isAdding ? <PrimaryButton title="Novo item" onPress={() => setIsAdding(true)} /> : null}
      <Card>
        <SectionHeader title="Itens previstos" subtitle="Marque como feito quando concluir" />
        {isAdding ? (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Novo item manual</Text>
            <FormField label="Nome do item" value={manualType} onChangeText={setManualType} placeholder="Ex.: Alinhamento e balanceamento" />
            <FormField
              label="Custo estimado"
              keyboardType="decimal-pad"
              inputMode="decimal"
              value={manualEstimatedCost}
              onChangeText={(value) => setManualEstimatedCost(sanitizeAmountInput(value))}
              placeholder="Ex.: 180.00"
            />
            <DateField label="Última realização" value={manualLastDate} onChange={setManualLastDate} />
            <FormField
              label="Km da última realização"
              keyboardType="number-pad"
              inputMode="numeric"
              value={manualLastKm}
              onChangeText={(value) => setManualLastKm(sanitizeIntegerInput(value))}
              placeholder="Ex.: 58400"
            />
            <View style={styles.intervalRow}>
              <View style={styles.intervalField}>
                <FormField
                  label="Intervalo em km"
                  keyboardType="number-pad"
                  inputMode="numeric"
                  value={manualIntervalKm}
                  onChangeText={(value) => setManualIntervalKm(sanitizeIntegerInput(value))}
                  placeholder="Ex.: 10000"
                />
              </View>
              <View style={styles.intervalField}>
                <FormField
                  label="Intervalo em meses"
                  keyboardType="number-pad"
                  inputMode="numeric"
                  value={manualIntervalMonths}
                  onChangeText={(value) => setManualIntervalMonths(sanitizeIntegerInput(value))}
                  placeholder="Ex.: 6"
                />
              </View>
            </View>
            <Text style={styles.formHelp}>Informe intervalo em km, em meses ou ambos.</Text>
            <View style={styles.actionsRow}>
              <View style={styles.actionButton}>
                <PrimaryButton title="Cancelar" variant="secondary" onPress={handleCancelManualItem} disabled={createManualItem.isPending} />
              </View>
              <View style={styles.actionButton}>
                <PrimaryButton
                  title="Salvar item"
                  loading={createManualItem.isPending}
                  disabled={!canSaveManualItem}
                  onPress={() =>
                    createManualItem.mutate({
                      type: manualType,
                      estimatedCost: parsedEstimatedCost,
                      lastDate: manualLastDate,
                      lastKm: parsedLastKm,
                      intervalKm: parsedIntervalKm,
                      intervalMonths: parsedIntervalMonths,
                    })
                  }
                />
              </View>
            </View>
          </View>
        ) : null}
        {maintenance.isLoading ? <LoadingState message="Calculando próximas manutenções..." /> : null}
        {maintenance.isError ? <ErrorState title="Erro ao carregar agenda" description="Não conseguimos montar o plano preventivo." onRetry={() => maintenance.refetch()} /> : null}
        {maintenance.data && maintenance.data.length === 0 ? <EmptyState title="Sem manutenções previstas" description="Seu plano ainda não possui itens cadastrados." /> : null}
        {maintenance.data?.map((item) => (
          <View key={item.id} style={styles.item}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>{item.type}</Text>
              <View style={[styles.status, item.status === "warning" ? styles.warning : styles.normal]}>
                <Text style={styles.statusText}>{item.status === "warning" ? "Atenção" : "Próximo"}</Text>
              </View>
            </View>
            {item.source === "manufacturer_manual" ? <Text style={styles.sourceText}>{item.sourceLabel ?? "Plano do manual do fabricante"}</Text> : null}
            {item.source === "manual" ? <Text style={styles.sourceText}>Criado por você</Text> : null}
            {item.category ? <Text style={styles.categoryText}>{item.category}</Text> : null}
            {item.isEstimatedFromCurrentKm ? <Text style={styles.estimateText}>Previsão inicial baseada na quilometragem atual.</Text> : null}
            {item.action ? <Text style={styles.actionText}>{actionLabels[item.action]}</Text> : null}
            {item.observation ? <Text style={styles.itemText}>Observação: {item.observation}</Text> : null}
            {item.description ? <Text style={styles.itemText}>{item.description}</Text> : null}
            <Text style={styles.itemText}>{item.forecast.kmRemaining !== undefined ? `${item.forecast.kmRemaining} km restantes` : `Até ${shortDate(item.forecast.nextDate.toISOString().slice(0, 10))}`}</Text>
            <Text style={styles.itemText}>Custo estimado {currency(item.estimatedCost)}</Text>
            <Text style={styles.itemText}>Última realização em {shortDate(item.lastDate)}</Text>
            {item.checklistItems?.length ? (
              <View style={styles.checklist}>
                <Text style={styles.checklistTitle}>Itens verificados na revisão</Text>
                {item.checklistItems.map((checklistItem) => (
                  <Text key={checklistItem} style={styles.checklistText}>• {checklistItem}</Text>
                ))}
              </View>
            ) : null}
            {item.manualReference ? <Text style={styles.referenceText}>{item.manualReference}</Text> : null}
            <PrimaryButton
              title="Marcar como realizada"
              variant="secondary"
              loading={activeMaintenanceId === item.id && complete.isPending}
              disabled={complete.isPending}
              onPress={() => {
                setActiveMaintenanceId(item.id);
                complete.mutate(item.id);
              }}
            />
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  formCard: {
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceMuted,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  formHelp: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  intervalRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  intervalField: {
    flex: 1,
  },
  actionsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
  item: {
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  itemTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  itemText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  sourceText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800",
  },
  categoryText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
  },
  estimateText: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  actionText: {
    alignSelf: "flex-start",
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceMuted,
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  checklist: {
    borderRadius: radii.md,
    backgroundColor: colors.surfaceMuted,
    padding: spacing.sm,
    gap: 6,
  },
  checklistTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
  },
  checklistText: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  referenceText: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
  },
  status: {
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "800",
  },
  warning: {
    backgroundColor: "#FFE3CC",
  },
  normal: {
    backgroundColor: "#EEF2F6",
  },
});
