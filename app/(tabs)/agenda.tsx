import { AppHeader } from "@/components/ui/AppHeader";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Screen } from "@/components/ui/Screen";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { queryClient } from "@/providers/AppProvider";
import { currency, shortDate } from "@/lib/format";
import { mockApi } from "@/services/api/mockApi";
import { colors, radii, spacing } from "@/theme/tokens";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function AgendaScreen() {
  const maintenance = useQuery({ queryKey: ["maintenance"], queryFn: mockApi.getMaintenance });
  const [activeMaintenanceId, setActiveMaintenanceId] = useState<string | null>(null);
  const complete = useMutation({
    mutationFn: mockApi.completeMaintenance,
    onSuccess: async () => {
      await queryClient.invalidateQueries();
    },
    onSettled: () => {
      setActiveMaintenanceId(null);
    },
  });

  return (
    <Screen>
      <AppHeader eyebrow="Manutenção" title="Agenda preventiva" subtitle="Previsões por tempo e quilometragem, com regras transparentes." />
      <Card>
        <SectionHeader title="Itens previstos" subtitle="Marque como feito quando concluir" />
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
            <Text style={styles.itemText}>{item.forecast.kmRemaining !== undefined ? `${item.forecast.kmRemaining} km restantes` : `Até ${shortDate(item.forecast.nextDate.toISOString().slice(0, 10))}`}</Text>
            <Text style={styles.itemText}>Custo estimado {currency(item.estimatedCost)}</Text>
            <Text style={styles.itemText}>Última realização em {shortDate(item.lastDate)}</Text>
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
