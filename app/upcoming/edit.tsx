import { AppHeader } from "@/components/ui/AppHeader";
import { Card } from "@/components/ui/Card";
import { DateField } from "@/components/ui/DateField";
import { ErrorState } from "@/components/ui/ErrorState";
import { FormField } from "@/components/ui/FormField";
import { HeaderBackButton } from "@/components/ui/HeaderBackButton";
import { LoadingState } from "@/components/ui/LoadingState";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Screen } from "@/components/ui/Screen";
import { queryClient } from "@/providers/AppProvider";
import { mockApi } from "@/services/api/mockApi";
import { spacing } from "@/theme/tokens";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

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

const sanitizeIntegerInput = (value: string) => value.replace(/[^0-9]/g, "");

const getParam = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

export default function EditUpcomingScreen() {
  const params = useLocalSearchParams();
  const id = getParam(params.id);
  const type = getParam(params.type);
  const isAnnual = type === "annual";
  const isMaintenance = type === "maintenance";
  const canLoad = Boolean(id && (isAnnual || isMaintenance));

  const annualQuery = useQuery({
    queryKey: ["annual-expense", id],
    queryFn: () => mockApi.getAnnualExpense(id!),
    enabled: canLoad && isAnnual,
  });
  const maintenanceQuery = useQuery({
    queryKey: ["maintenance-item", id],
    queryFn: () => mockApi.getMaintenanceItem(id!),
    enabled: canLoad && isMaintenance,
  });

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [lastKm, setLastKm] = useState("");
  const [intervalKm, setIntervalKm] = useState("");
  const [intervalMonths, setIntervalMonths] = useState("");

  useEffect(() => {
    if (annualQuery.data) {
      setName(annualQuery.data.type);
      setAmount(String(annualQuery.data.value));
      setDate(annualQuery.data.dueDate);
    }
  }, [annualQuery.data]);

  useEffect(() => {
    if (maintenanceQuery.data) {
      setName(maintenanceQuery.data.type);
      setAmount(String(maintenanceQuery.data.estimatedCost));
      setDate(maintenanceQuery.data.lastDate);
      setLastKm(String(maintenanceQuery.data.lastKm));
      setIntervalKm(maintenanceQuery.data.intervalKm ? String(maintenanceQuery.data.intervalKm) : "");
      setIntervalMonths(maintenanceQuery.data.intervalMonths ? String(maintenanceQuery.data.intervalMonths) : "");
    }
  }, [maintenanceQuery.data]);

  const parsedAmount = Number(amount);
  const parsedLastKm = Number(lastKm);
  const parsedIntervalKm = intervalKm ? Number(intervalKm) : undefined;
  const parsedIntervalMonths = intervalMonths ? Number(intervalMonths) : undefined;
  const hasValidMaintenanceInterval = Boolean((parsedIntervalKm && parsedIntervalKm > 0) || (parsedIntervalMonths && parsedIntervalMonths > 0));
  const canSave = useMemo(() => {
    if (!name.trim() || !date || !Number.isFinite(parsedAmount)) {
      return false;
    }

    if (isAnnual) {
      return parsedAmount > 0;
    }

    return parsedAmount >= 0 && Number.isFinite(parsedLastKm) && parsedLastKm >= 0 && hasValidMaintenanceInterval;
  }, [date, hasValidMaintenanceInterval, isAnnual, name, parsedAmount, parsedLastKm]);

  const updateAnnual = useMutation({
    mutationFn: () => mockApi.updateAnnualExpense(id!, { type: name, value: parsedAmount, dueDate: date }),
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      router.back();
    },
  });
  const updateMaintenance = useMutation({
    mutationFn: () =>
      mockApi.updateMaintenanceItem(id!, {
        type: name,
        estimatedCost: parsedAmount,
        lastDate: date,
        lastKm: parsedLastKm,
        intervalKm: parsedIntervalKm,
        intervalMonths: parsedIntervalMonths,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      router.back();
    },
  });

  const isLoading = annualQuery.isLoading || maintenanceQuery.isLoading;
  const isError = !canLoad || annualQuery.isError || maintenanceQuery.isError;
  const isSaving = updateAnnual.isPending || updateMaintenance.isPending;

  const handleSave = () => {
    if (!canSave || !id) {
      return;
    }

    if (isAnnual) {
      updateAnnual.mutate();
      return;
    }

    updateMaintenance.mutate();
  };

  return (
    <Screen>
      <HeaderBackButton label="Editar gasto" />
      <AppHeader
        title={isAnnual ? "Editar despesa anual" : "Editar manutenção"}
        subtitle={isAnnual ? "Atualize nome, valor e vencimento desse compromisso." : "Ajuste os dados usados para prever a próxima manutenção."}
      />
      {isLoading ? <LoadingState message="Carregando gasto..." /> : null}
      {isError ? (
        <ErrorState
          title="Não foi possível abrir este gasto"
          description="Volte para a lista e tente selecionar o item novamente."
          onRetry={() => {
            annualQuery.refetch();
            maintenanceQuery.refetch();
          }}
        />
      ) : null}
      {!isLoading && !isError ? (
        <>
          <Card>
            <FormField label={isAnnual ? "Nome da despesa" : "Nome da manutenção"} value={name} onChangeText={setName} placeholder={isAnnual ? "Ex.: IPVA" : "Ex.: Troca de óleo"} />
            <FormField
              label={isAnnual ? "Valor" : "Custo estimado"}
              keyboardType="decimal-pad"
              inputMode="decimal"
              value={amount}
              onChangeText={(value) => setAmount(sanitizeAmountInput(value))}
              placeholder="Ex.: 320.00"
              help={isAnnual ? "Use um valor positivo." : "Use 0 se o custo ainda não estiver definido."}
            />
            <DateField label={isAnnual ? "Vencimento" : "Última realização"} value={date} onChange={setDate} help="Toque para escolher no calendário" />
            {isMaintenance ? (
              <>
                <FormField
                  label="Km da última realização"
                  keyboardType="number-pad"
                  inputMode="numeric"
                  value={lastKm}
                  onChangeText={(value) => setLastKm(sanitizeIntegerInput(value))}
                  placeholder="Ex.: 58400"
                />
                <View style={styles.intervalRow}>
                  <View style={styles.intervalField}>
                    <FormField
                      label="Intervalo em km"
                      keyboardType="number-pad"
                      inputMode="numeric"
                      value={intervalKm}
                      onChangeText={(value) => setIntervalKm(sanitizeIntegerInput(value))}
                      placeholder="Ex.: 10000"
                    />
                  </View>
                  <View style={styles.intervalField}>
                    <FormField
                      label="Intervalo em meses"
                      keyboardType="number-pad"
                      inputMode="numeric"
                      value={intervalMonths}
                      onChangeText={(value) => setIntervalMonths(sanitizeIntegerInput(value))}
                      placeholder="Ex.: 6"
                    />
                  </View>
                </View>
              </>
            ) : null}
          </Card>
          <View style={styles.actionsRow}>
            <View style={styles.actionButton}>
              <PrimaryButton title="Cancelar" variant="secondary" disabled={isSaving} onPress={() => router.back()} />
            </View>
            <View style={styles.actionButton}>
              <PrimaryButton title="Salvar alterações" loading={isSaving} disabled={!canSave} onPress={handleSave} />
            </View>
          </View>
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
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
});
