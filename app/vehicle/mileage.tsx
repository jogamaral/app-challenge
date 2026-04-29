import { AppHeader } from "@/components/ui/AppHeader";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { FormField } from "@/components/ui/FormField";
import { HeaderBackButton } from "@/components/ui/HeaderBackButton";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Screen } from "@/components/ui/Screen";
import { queryClient, useApp } from "@/providers/AppProvider";
import { mockApi } from "@/services/api/mockApi";
import { colors, radii, spacing } from "@/theme/tokens";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const sanitizeKmInput = (value: string) => value.replace(/[^0-9]/g, "");

export default function MileageScreen() {
  const { setVehicle, vehicle } = useApp();
  const [km, setKm] = useState("");
  const parsedKm = Number(km);
  const isValid = Boolean(km) && Number.isFinite(parsedKm) && parsedKm > 0;
  const nextKm = vehicle ? vehicle.currentKm + (isValid ? parsedKm : 0) : 0;

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!vehicle || !isValid) {
        throw new Error("Quilometragem inválida");
      }

      return mockApi.saveVehicle({
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        version: vehicle.version,
        currentKm: vehicle.currentKm + parsedKm,
        monthlyKm: vehicle.monthlyKm,
      });
    },
    onSuccess: async (updatedVehicle) => {
      setVehicle(updatedVehicle);
      await queryClient.invalidateQueries();
      router.back();
    },
  });

  if (!vehicle) {
    return (
      <Screen>
        <HeaderBackButton label="Quilometragem" />
        <ErrorState title="Veículo não encontrado" description="Cadastre um veículo antes de adicionar quilometragem." onRetry={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen>
      <HeaderBackButton label="Quilometragem" />
      <AppHeader title="Adicionar quilometragem" subtitle="Registre o quanto você rodou sem editar todo o cadastro do veículo." />
      <Card>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Quilometragem atual</Text>
          <Text style={styles.summaryValue}>{vehicle.currentKm.toLocaleString("pt-BR")} km</Text>
        </View>
        <FormField
          label="Km percorridos"
          keyboardType="number-pad"
          inputMode="numeric"
          value={km}
          onChangeText={(value) => setKm(sanitizeKmInput(value))}
          placeholder="Ex.: 350"
          help="Informe apenas os quilômetros rodados desde a última atualização."
        />
        <View style={styles.previewBox}>
          <Text style={styles.previewLabel}>Nova quilometragem</Text>
          <Text style={styles.previewValue}>{nextKm.toLocaleString("pt-BR")} km</Text>
        </View>
      </Card>
      <PrimaryButton
        title="Salvar quilometragem"
        loading={saveMutation.isPending}
        disabled={!isValid}
        onPress={() => saveMutation.mutate()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  summaryBox: {
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
  },
  summaryValue: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
  },
  previewBox: {
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: "#FFF7EF",
    borderWidth: 1,
    borderColor: "#FFD2B0",
    gap: 4,
  },
  previewLabel: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: "800",
  },
  previewValue: {
    color: colors.primaryDark,
    fontSize: 20,
    fontWeight: "900",
  },
});
