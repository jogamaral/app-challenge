import { AppHeader } from "@/components/ui/AppHeader";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Screen } from "@/components/ui/Screen";
import { queryClient, useApp } from "@/providers/AppProvider";
import { mockApi } from "@/services/api/mockApi";
import { router } from "expo-router";
import { useEffect, useState } from "react";

export default function VehicleScreen() {
  const { setVehicle, vehicle } = useApp();
  const isEditing = Boolean(vehicle);
  const [brand, setBrand] = useState(vehicle?.brand ?? "");
  const [model, setModel] = useState(vehicle?.model ?? "");
  const [year, setYear] = useState(vehicle?.year ? String(vehicle.year) : "");
  const [version, setVersion] = useState(vehicle?.version ?? "");
  const [currentKm, setCurrentKm] = useState(vehicle?.currentKm ? String(vehicle.currentKm) : "");
  const [monthlyKm, setMonthlyKm] = useState(vehicle?.monthlyKm ? String(vehicle.monthlyKm) : "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setBrand(vehicle?.brand ?? "");
    setModel(vehicle?.model ?? "");
    setYear(vehicle?.year ? String(vehicle.year) : "");
    setVersion(vehicle?.version ?? "");
    setCurrentKm(vehicle?.currentKm ? String(vehicle.currentKm) : "");
    setMonthlyKm(vehicle?.monthlyKm ? String(vehicle.monthlyKm) : "");
  }, [vehicle]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const vehicle = await mockApi.saveVehicle({
        brand: brand.trim(),
        model: model.trim(),
        year: Number(year),
        version: version.trim(),
        currentKm: Number(currentKm),
        monthlyKm: Number(monthlyKm),
      });
      setVehicle(vehicle);
      await queryClient.invalidateQueries();
      if (isEditing) {
        router.back();
        return;
      }

      router.replace("/");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = !brand.trim() || !model.trim() || !year.trim() || !currentKm.trim() || !monthlyKm.trim();

  return (
    <Screen>
      <AppHeader
        eyebrow={isEditing ? "Veículo" : "Etapa 2 de 2"}
        title={isEditing ? "Edite seu veículo" : "Cadastre seu carro"}
        subtitle={isEditing ? "Atualize os dados usados para previsões, agenda e reserva mensal." : "Esses dados ajudam o app a prever manutenções e sugerir uma reserva mensal."}
      />
      <Card>
        <FormField label="Marca" value={brand} onChangeText={setBrand} placeholder="Ex.: Honda" />
        <FormField label="Modelo" value={model} onChangeText={setModel} placeholder="Ex.: City" />
        <FormField label="Ano" keyboardType="number-pad" value={year} onChangeText={setYear} placeholder="Ex.: 2020" />
        <FormField label="Versão" value={version} onChangeText={setVersion} placeholder="Ex.: EX" />
        <FormField label="Quilometragem atual" keyboardType="number-pad" value={currentKm} onChangeText={setCurrentKm} placeholder="Ex.: 58400" />
        <FormField label="Média de km por mês" keyboardType="number-pad" value={monthlyKm} onChangeText={setMonthlyKm} placeholder="Ex.: 1250" />
      </Card>
      <PrimaryButton title={isEditing ? "Salvar alterações" : "Salvar e abrir painel"} onPress={handleSave} loading={loading} disabled={isDisabled} />
    </Screen>
  );
}
