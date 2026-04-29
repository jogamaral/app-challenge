import { AdBanner } from "@/components/ui/AdBanner";
import { AppHeader } from "@/components/ui/AppHeader";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { FormField } from "@/components/ui/FormField";
import { HeroReserveCard } from "@/components/ui/StatCard";
import { LoadingState } from "@/components/ui/LoadingState";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Screen } from "@/components/ui/Screen";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { UpcomingEventItem } from "@/components/ui/ListItems";
import { queryClient, useApp } from "@/providers/AppProvider";
import { mockApi } from "@/services/api/mockApi";
import { mockAds } from "@/services/ads/mockAds";
import { currency } from "@/lib/format";
import { colors, radii, spacing } from "@/theme/tokens";
import { ProtectionLevel, ProtectionReserveSummary } from "@/types/models";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

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

const levelLabels: Record<ProtectionLevel, string> = {
  none: "Sem nível",
  bronze: "Bronze",
  silver: "Prata",
  gold: "Ouro",
};

const levelStyles: Record<ProtectionLevel, { backgroundColor: string; color: string }> = {
  none: { backgroundColor: colors.surfaceMuted, color: colors.textMuted },
  bronze: { backgroundColor: "#F6D6C2", color: "#7C2D12" },
  silver: { backgroundColor: "#E2E8F0", color: colors.accent },
  gold: { backgroundColor: "#FFE8A3", color: "#854D0E" },
};

export default function DashboardScreen() {
  const { user, vehicle } = useApp();
  const dashboard = useQuery({ queryKey: ["dashboard"], queryFn: mockApi.getDashboard });
  const alertSettings = useQuery({ queryKey: ["alert-settings"], queryFn: mockApi.getAlertSettings });
  const dashboardAd = useQuery({
    queryKey: ["ads", "dashboard_banner"],
    queryFn: () => mockAds.getAd("dashboard_banner"),
    enabled: mockAds.isEnabled(),
  });
  const handleAdPress = () => {
    if (!dashboardAd.data) {
      return;
    }

    const href = mockAds.getClickHref(dashboardAd.data);
    if (href.startsWith("/")) {
      router.push(href);
      return;
    }

    Linking.openURL(href);
  };

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
      {dashboardAd.data ? <AdBanner ad={dashboardAd.data} onPress={handleAdPress} /> : null}
      {dashboard.isLoading ? <LoadingState message="Montando seu painel financeiro..." /> : null}
       {dashboard.isError ? <ErrorState title="Não foi possível carregar o painel" description="Verifique sua conexão e tente de novo." onRetry={() => dashboard.refetch()} /> : null}
      {dashboard.data ? (
        <>
          <HeroReserveCard reserve={dashboard.data.reserveSuggestion} monthSpend={dashboard.data.monthSpend} yearSpend={dashboard.data.yearSpend} />
          <ProtectionReserveCard protectionReserve={dashboard.data.protectionReserve} />
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
            <PrimaryButton title="Adicionar km" onPress={() => router.push("/vehicle/mileage")} />
            <PrimaryButton title="Novo gasto" onPress={() => router.push("/expense/new")} />
            <PrimaryButton title="Ver manutenção preventiva" variant="secondary" onPress={() => router.push("/(tabs)/agenda")} />
          </Card>
        </>
      ) : null}
    </Screen>
  );
}

function ProtectionReserveCard({ protectionReserve }: { protectionReserve: ProtectionReserveSummary }) {
  const [isEditing, setIsEditing] = useState(protectionReserve.insuranceDeductible <= 0);
  const [insuranceDeductible, setInsuranceDeductible] = useState(protectionReserve.insuranceDeductible ? String(protectionReserve.insuranceDeductible) : "");
  const [savedReserve, setSavedReserve] = useState(protectionReserve.savedReserve ? String(protectionReserve.savedReserve) : "");
  const parsedInsuranceDeductible = Number(insuranceDeductible);
  const parsedSavedReserve = Number(savedReserve || "0");
  const isValid =
    Number.isFinite(parsedInsuranceDeductible) &&
    parsedInsuranceDeductible > 0 &&
    Number.isFinite(parsedSavedReserve) &&
    parsedSavedReserve >= 0;
  const cappedCoverage = Math.min(protectionReserve.coveragePercent, 100);
  const levelStyle = levelStyles[protectionReserve.level];

  useEffect(() => {
    if (isEditing) {
      return;
    }

    setInsuranceDeductible(protectionReserve.insuranceDeductible ? String(protectionReserve.insuranceDeductible) : "");
    setSavedReserve(protectionReserve.savedReserve ? String(protectionReserve.savedReserve) : "");
  }, [isEditing, protectionReserve.insuranceDeductible, protectionReserve.savedReserve]);

  const saveMutation = useMutation({
    mutationFn: mockApi.saveProtectionReserve,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setIsEditing(false);
    },
  });

  const handleCancel = () => {
    setInsuranceDeductible(protectionReserve.insuranceDeductible ? String(protectionReserve.insuranceDeductible) : "");
    setSavedReserve(protectionReserve.savedReserve ? String(protectionReserve.savedReserve) : "");
    setIsEditing(false);
  };

  return (
    <Card>
      <SectionHeader
        title="Proteção do seguro"
        subtitle="Nível calculado pela reserva para cobrir a franquia"
        right={
          !isEditing ? (
            <Pressable onPress={() => setIsEditing(true)} style={styles.editVehicleButton}>
              <Text style={styles.editVehicleText}>Atualizar</Text>
            </Pressable>
          ) : undefined
        }
      />
      <View style={styles.protectionHeader}>
        <View style={[styles.levelBadge, { backgroundColor: levelStyle.backgroundColor }]}>
          <Text style={[styles.levelBadgeText, { color: levelStyle.color }]}>{levelLabels[protectionReserve.level]}</Text>
        </View>
        <Text style={styles.coverageText}>{protectionReserve.coveragePercent}% da franquia</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${cappedCoverage}%` }]} />
      </View>
      <Text style={styles.protectionDescription}>
        {protectionReserve.level === "none"
          ? "Você ainda não atingiu o nível bronze."
          : `Você está no nível ${levelLabels[protectionReserve.level].toLowerCase()} de proteção.`}
      </Text>
      {isEditing ? (
        <>
          <FormField
            label="Franquia do seguro"
            keyboardType="decimal-pad"
            inputMode="decimal"
            value={insuranceDeductible}
            onChangeText={(value) => setInsuranceDeductible(sanitizeAmountInput(value))}
            placeholder="Ex.: 3000"
            help="Valor que você pagaria em caso de sinistro coberto."
          />
          <FormField
            label="Reserva guardada"
            keyboardType="decimal-pad"
            inputMode="decimal"
            value={savedReserve}
            onChangeText={(value) => setSavedReserve(sanitizeAmountInput(value))}
            placeholder="Ex.: 1500"
            help="Quanto já está separado para essa franquia."
          />
          <View style={styles.actionsRow}>
            <View style={styles.actionButton}>
              <PrimaryButton title="Cancelar" variant="secondary" onPress={handleCancel} disabled={saveMutation.isPending} />
            </View>
            <View style={styles.actionButton}>
              <PrimaryButton
                title="Salvar"
                loading={saveMutation.isPending}
                disabled={!isValid}
                onPress={() => saveMutation.mutate({ insuranceDeductible: parsedInsuranceDeductible, savedReserve: parsedSavedReserve })}
              />
            </View>
          </View>
        </>
      ) : (
        <View style={styles.metricsRow}>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Franquia</Text>
            <Text style={styles.metricValue}>{currency(protectionReserve.insuranceDeductible)}</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Guardado</Text>
            <Text style={styles.metricValue}>{currency(protectionReserve.savedReserve)}</Text>
          </View>
        </View>
      )}
    </Card>
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
  protectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  levelBadge: {
    minHeight: 32,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  levelBadgeText: {
    fontSize: 13,
    fontWeight: "900",
  },
  coverageText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },
  progressTrack: {
    height: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceMuted,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
  },
  protectionDescription: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  metricsRow: {
    flexDirection: "row",
    gap: spacing.sm,
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
  actionsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});
