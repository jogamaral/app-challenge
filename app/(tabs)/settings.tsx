import { AppHeader } from "@/components/ui/AppHeader";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Screen } from "@/components/ui/Screen";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { queryClient } from "@/providers/AppProvider";
import { mockApi } from "@/services/api/mockApi";
import { colors, radii, spacing } from "@/theme/tokens";
import { AlertSettings } from "@/types/models";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

const leadOptions = [3, 7, 15];

export default function SettingsScreen() {
  const settings = useQuery({ queryKey: ["alert-settings"], queryFn: mockApi.getAlertSettings });
  const [localState, setLocalState] = useState<AlertSettings | null>(null);

  useEffect(() => {
    if (settings.data) {
      setLocalState(settings.data);
    }
  }, [settings.data]);

  const saveMutation = useMutation({
    mutationFn: mockApi.saveAlertSettings,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["alert-settings"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
      ]);
    },
  });

  if (settings.isLoading || !localState) {
    return <Screen><LoadingState message="Carregando configurações..." /></Screen>;
  }

  if (settings.isError) {
    return <Screen><ErrorState title="Falha ao carregar alertas" description="Não foi possível abrir as configurações agora." onRetry={() => settings.refetch()} /></Screen>;
  }

  return (
    <Screen>
      <AppHeader eyebrow="Alertas" title="Configure seus lembretes" subtitle="Escolha como e quando o app deve avisar sobre custos importantes." />
      <Card>
        <SectionHeader title="Antecedência" subtitle="Prazo usado para despesas anuais e manutenções" />
        <View style={styles.rowWrap}>
          {leadOptions.map((days) => (
            <Pressable key={days} onPress={() => setLocalState({ ...localState, leadDays: days })} style={[styles.option, localState.leadDays === days && styles.optionActive]}>
              <Text style={[styles.optionText, localState.leadDays === days && styles.optionTextActive]}>{days} dias</Text>
            </Pressable>
          ))}
        </View>
      </Card>
      <Card>
        <SectionHeader title="Tipos de alerta" subtitle="Ative apenas o que fizer sentido para você" />
        <SwitchRow label="Despesas anuais" value={localState.annualReminders} onValueChange={(value) => setLocalState({ ...localState, annualReminders: value })} />
        <SwitchRow label="Manutenção preventiva" value={localState.maintenanceReminders} onValueChange={(value) => setLocalState({ ...localState, maintenanceReminders: value })} />
        <SwitchRow label="Enviar por e-mail" value={localState.emailEnabled} onValueChange={(value) => setLocalState({ ...localState, emailEnabled: value })} />
      </Card>
      <PrimaryButton title="Salvar configurações" loading={saveMutation.isPending} onPress={() => saveMutation.mutate(localState)} />
    </Screen>
  );
}

function SwitchRow({ label, value, onValueChange }: { label: string; value: boolean; onValueChange: (value: boolean) => void }) {
  return (
    <View style={styles.switchRow}>
      <Text style={styles.switchLabel}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ false: colors.border, true: "#FFD2B0" }} thumbColor={value ? colors.primary : colors.white} />
    </View>
  );
}

const styles = StyleSheet.create({
  rowWrap: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  option: {
    flex: 1,
    minHeight: 48,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  optionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    color: colors.text,
    fontWeight: "800",
  },
  optionTextActive: {
    color: colors.white,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  switchLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
});
