import { AppHeader } from "@/components/ui/AppHeader";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { HeroReserveCard } from "@/components/ui/StatCard";
import { LoadingState } from "@/components/ui/LoadingState";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Screen } from "@/components/ui/Screen";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { UpcomingEventItem } from "@/components/ui/ListItems";
import { useApp } from "@/providers/AppProvider";
import { mockApi } from "@/services/api/mockApi";
import { colors } from "@/theme/tokens";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

export default function DashboardScreen() {
  const { user, vehicle } = useApp();
  const dashboard = useQuery({ queryKey: ["dashboard"], queryFn: mockApi.getDashboard });
  const alertSettings = useQuery({ queryKey: ["alert-settings"], queryFn: mockApi.getAlertSettings });

  return (
    <Screen>
      <AppHeader
        eyebrow="Dashboard"
        title={`Oi, ${user?.name?.split(" ")[0] ?? "motorista"}`}
        subtitle="Entenda seu custo total do carro de forma rápida e sem complicação."
        right={
          <Pressable onPress={() => router.push("/(tabs)/settings")} style={styles.alertBadge}>
            <Text style={styles.alertBadgeText}>{alertSettings.data?.leadDays ?? 7}d</Text>
          </Pressable>
        }
      />
      {dashboard.isLoading ? <LoadingState message="Montando seu painel financeiro..." /> : null}
       {dashboard.isError ? <ErrorState title="Não foi possível carregar o painel" description="Verifique sua conexão e tente de novo." onRetry={() => dashboard.refetch()} /> : null}
      {dashboard.data ? (
        <>
          <HeroReserveCard reserve={dashboard.data.reserveSuggestion} monthSpend={dashboard.data.monthSpend} yearSpend={dashboard.data.yearSpend} />
          <Card>
            <SectionHeader
              title="Seu veículo"
              subtitle="Base usada para as previsões"
              right={
                <Pressable onPress={() => router.push("/(auth)/vehicle")} style={styles.editVehicleButton}>
                  <Text style={styles.editVehicleText}>Editar</Text>
                </Pressable>
              }
            />
            <Text style={styles.vehicleTitle}>{vehicle?.brand} {vehicle?.model} {vehicle?.version} {vehicle?.year}</Text>
            <Text style={styles.vehicleMeta}>{vehicle?.currentKm.toLocaleString("pt-BR")} km atuais · {vehicle?.monthlyKm.toLocaleString("pt-BR")} km por mês</Text>
            <Text style={styles.protection}>Planejamento anual protegido em {dashboard.data.reserveCoverage}%</Text>
          </Card>
          <Card>
            <SectionHeader title="Próximos gastos" subtitle="O que está vindo primeiro" right={<PrimaryButton title="Ver lista" variant="secondary" onPress={() => router.push("/upcoming")} />} />
            {dashboard.data.nextEvents.map((item) => <UpcomingEventItem key={item.id} item={item} onPress={() => router.push("/upcoming")} />)}
          </Card>
          <Card>
            <SectionHeader title="Ações rápidas" subtitle="Atalhos para tarefas do dia a dia" />
            <PrimaryButton title="Registrar gasto" onPress={() => router.push("/expense/new")} />
            <PrimaryButton title="Ver manutenção preventiva" variant="secondary" onPress={() => router.push("/(tabs)/agenda")} />
          </Card>
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  alertBadge: {
    minWidth: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  alertBadgeText: {
    color: colors.primary,
    fontWeight: "900",
  },
  vehicleTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  vehicleMeta: {
    color: colors.textMuted,
    fontSize: 14,
  },
  editVehicleButton: {
    minHeight: 34,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  editVehicleText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800",
  },
  protection: {
    color: colors.success,
    fontSize: 14,
    fontWeight: "700",
  },
});
