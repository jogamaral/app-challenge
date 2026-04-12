import { AppHeader } from "@/components/ui/AppHeader";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SearchableSelectField } from "@/components/ui/SearchableSelectField";
import { Screen } from "@/components/ui/Screen";
import { ensureVehicleInCatalog, getBrandOptions, getModelOptions, getVersionOptions, getYearOptions, vehicleCatalog } from "@/data/vehicleCatalog";
import { queryClient, useApp } from "@/providers/AppProvider";
import { mockApi } from "@/services/api/mockApi";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";

const sanitizeKmInput = (value: string) => value.replace(/[^0-9]/g, "");

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
  const catalog = useMemo(() => ensureVehicleInCatalog(vehicleCatalog, vehicle), [vehicle]);
  const brandOptions = useMemo(() => getBrandOptions(catalog), [catalog]);
  const modelOptions = useMemo(() => getModelOptions(catalog, brand), [catalog, brand]);
  const yearOptions = useMemo(() => getYearOptions(catalog, brand, model), [catalog, brand, model]);
  const versionOptions = useMemo(() => getVersionOptions(catalog, brand, model, year), [catalog, brand, model, year]);

  useEffect(() => {
    setBrand(vehicle?.brand ?? "");
    setModel(vehicle?.model ?? "");
    setYear(vehicle?.year ? String(vehicle.year) : "");
    setVersion(vehicle?.version ?? "");
    setCurrentKm(vehicle?.currentKm ? String(vehicle.currentKm) : "");
    setMonthlyKm(vehicle?.monthlyKm ? String(vehicle.monthlyKm) : "");
  }, [vehicle]);

  const handleSave = async () => {
    const parsedCurrentKm = Number(currentKm);
    const parsedMonthlyKm = Number(monthlyKm);

    if (parsedCurrentKm < 0 || parsedMonthlyKm < 0) {
      return;
    }

    setLoading(true);
    try {
      const vehicle = await mockApi.saveVehicle({
        brand: brand.trim(),
        model: model.trim(),
        year: Number(year),
        version: version.trim(),
        currentKm: parsedCurrentKm,
        monthlyKm: parsedMonthlyKm,
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

  const handleBrandChange = (nextBrand: string) => {
    if (nextBrand === brand) {
      return;
    }

    setBrand(nextBrand);
    setModel("");
    setYear("");
    setVersion("");
  };

  const handleModelChange = (nextModel: string) => {
    if (nextModel === model) {
      return;
    }

    setModel(nextModel);
    setYear("");
    setVersion("");
  };

  const handleYearChange = (nextYear: string) => {
    if (nextYear === year) {
      return;
    }

    setYear(nextYear);
    setVersion("");
  };

  const isDisabled = !brand.trim() || !model.trim() || !year.trim() || !version.trim() || !currentKm.trim() || !monthlyKm.trim();

  return (
    <Screen>
      <AppHeader
        eyebrow={isEditing ? "Veículo" : "Etapa 2 de 2"}
        title={isEditing ? "Edite seu veículo" : "Cadastre seu carro"}
        subtitle={isEditing ? "Atualize os dados usados para previsões, agenda e reserva mensal." : "Esses dados ajudam o app a prever manutenções e sugerir uma reserva mensal."}
      />
      <Card>
        <SearchableSelectField
          label="Marca"
          value={brand}
          options={brandOptions}
          onChange={handleBrandChange}
          placeholder="Selecione a marca"
          help="Escolha a fabricante do seu veículo."
          searchPlaceholder="Busque pela marca"
          emptyText="Nenhuma marca encontrada."
        />
        <SearchableSelectField
          label="Modelo"
          value={model}
          options={modelOptions}
          onChange={handleModelChange}
          placeholder="Selecione o modelo"
          help={brand ? "Mostrando modelos compatíveis com a marca selecionada." : "Selecione a marca para liberar os modelos."}
          disabled={!brand}
          searchPlaceholder="Busque pelo modelo"
          emptyText="Nenhum modelo encontrado para essa marca."
        />
        <SearchableSelectField
          label="Ano"
          value={year}
          options={yearOptions}
          onChange={handleYearChange}
          placeholder="Selecione o ano"
          help={model ? "Escolha o ano exato da versão do seu carro." : "Selecione o modelo para liberar os anos."}
          disabled={!model}
          searchPlaceholder="Busque pelo ano"
          emptyText="Nenhum ano encontrado para esse modelo."
        />
        <SearchableSelectField
          label="Versão"
          value={version}
          options={versionOptions}
          onChange={setVersion}
          placeholder="Selecione a versão"
          help={year ? "Mostrando as versões disponíveis para o ano selecionado." : "Selecione o ano para liberar as versões."}
          disabled={!year}
          searchPlaceholder="Busque pela versão"
          emptyText="Nenhuma versão encontrada para esse ano."
        />
        <FormField
          label="Quilometragem atual"
          keyboardType="number-pad"
          inputMode="numeric"
          value={currentKm}
          onChangeText={(value) => setCurrentKm(sanitizeKmInput(value))}
          placeholder="Ex.: 58400"
          help="Aceita apenas valores inteiros e positivos."
        />
        <FormField
          label="Média de km por mês"
          keyboardType="number-pad"
          inputMode="numeric"
          value={monthlyKm}
          onChangeText={(value) => setMonthlyKm(sanitizeKmInput(value))}
          placeholder="Ex.: 1250"
          help="Aceita apenas valores inteiros e positivos."
        />
      </Card>
      <PrimaryButton title={isEditing ? "Salvar alterações" : "Salvar e abrir painel"} onPress={handleSave} loading={loading} disabled={isDisabled} />
    </Screen>
  );
}
