import { AppHeader } from "@/components/ui/AppHeader";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Screen } from "@/components/ui/Screen";
import { queryClient, useApp } from "@/providers/AppProvider";
import { mockApi } from "@/services/api/mockApi";
import { router } from "expo-router";
import { useState } from "react";

export default function VehicleScreen() {
  const { setVehicle } = useApp();
  const [brand, setBrand] = useState("Honda");
  const [model, setModel] = useState("City");
  const [year, setYear] = useState("2020");
  const [version, setVersion] = useState("EX");
  const [currentKm, setCurrentKm] = useState("58400");
  const [monthlyKm, setMonthlyKm] = useState("1250");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const vehicle = await mockApi.saveVehicle({
        brand,
        model,
        year: Number(year),
        version,
        currentKm: Number(currentKm),
        monthlyKm: Number(monthlyKm),
      });
      setVehicle(vehicle);
      await queryClient.invalidateQueries();
      router.replace("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <AppHeader eyebrow="Veículo" title="Cadastre seu carro" subtitle="Esses dados ajudam o app a prever manutenções e sugerir uma reserva mensal." />
      <Card>
        <FormField label="Marca" value={brand} onChangeText={setBrand} />
        <FormField label="Modelo" value={model} onChangeText={setModel} />
        <FormField label="Ano" keyboardType="number-pad" value={year} onChangeText={setYear} />
        <FormField label="Versão" value={version} onChangeText={setVersion} />
        <FormField label="Quilometragem atual" keyboardType="number-pad" value={currentKm} onChangeText={setCurrentKm} />
        <FormField label="Média de km por mês" keyboardType="number-pad" value={monthlyKm} onChangeText={setMonthlyKm} />
      </Card>
      <PrimaryButton title="Salvar e abrir painel" onPress={handleSave} loading={loading} />
    </Screen>
  );
}
