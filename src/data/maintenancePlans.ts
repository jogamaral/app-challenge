import { MaintenanceItem, MaintenancePlan, Vehicle } from "@/types/models";

const TODAY_ISO = "2026-03-19";

export const maintenancePlans: MaintenancePlan[] = [
  {
    id: "chevrolet-onix-2024",
    brand: "Chevrolet",
    model: "Onix",
    year: 2024,
    source: "manufacturer_manual",
    sourceLabel: "Manual do proprietário Chevrolet Onix 2024",
    manualReference: "Chevrolet Brasil - Manual do proprietário Onix 2024. Operações de serviço anuais ou a cada 10.000 km.",
    sourceUrl: "https://www.chevrolet.com.br/servicos/manuais",
    extractedAt: "2026-04-27",
    items: [
      {
        id: "periodic-review",
        type: "Revisão periódica Chevrolet",
        intervalKm: 10000,
        intervalMonths: 12,
        estimatedCost: 520,
      },
    ],
  },
  {
    id: "toyota-corolla-2024",
    brand: "Toyota",
    model: "Corolla",
    year: 2024,
    source: "manufacturer_manual",
    sourceLabel: "Manual do proprietário Toyota Corolla 2024",
    manualReference: "Toyota Brasil - Revisões periódicas. Prazo de 12 meses ou 10.000 km, o que ocorrer primeiro.",
    sourceUrl: "https://www.toyota.com.br/meu-toyota/servicos/atendimento-ao-cliente",
    extractedAt: "2026-04-27",
    items: [
      {
        id: "periodic-review",
        type: "Revisão periódica Toyota",
        intervalKm: 10000,
        intervalMonths: 12,
        estimatedCost: 650,
      },
    ],
  },
];

const normalize = (value: string) => value.trim().toLocaleLowerCase("pt-BR");

export const getMaintenancePlanForVehicle = (vehicle: Vehicle) =>
  maintenancePlans.find(
    (plan) =>
      normalize(plan.brand) === normalize(vehicle.brand) &&
      normalize(plan.model) === normalize(vehicle.model) &&
      plan.year === vehicle.year
  );

const getEstimatedLastKm = (currentKm: number, intervalKm?: number) => {
  if (!intervalKm || intervalKm <= 0 || currentKm <= 0) {
    return 0;
  }

  return Math.max(0, Math.floor((currentKm - 1) / intervalKm) * intervalKm);
};

export const buildMaintenanceFromPlan = (vehicle: Vehicle, plan: MaintenancePlan): MaintenanceItem[] =>
  plan.items.map((item) => ({
    id: `${plan.id}-${item.id}`,
    type: item.type,
    intervalKm: item.intervalKm,
    intervalMonths: item.intervalMonths,
    lastKm: getEstimatedLastKm(vehicle.currentKm, item.intervalKm),
    lastDate: TODAY_ISO,
    estimatedCost: item.estimatedCost,
    status: "upcoming",
    source: plan.source,
    sourceLabel: plan.sourceLabel,
    isEstimatedFromCurrentKm: true,
    manualReference: plan.manualReference,
    sourceUrl: plan.sourceUrl,
  }));
