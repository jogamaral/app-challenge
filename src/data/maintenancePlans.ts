import { MaintenanceItem, MaintenancePlan, MaintenanceReviewAction, Vehicle } from "@/types/models";

const TODAY_ISO = "2026-03-19";

const reviewSchedule = (...entries: Array<[number, MaintenanceReviewAction]>) =>
  Object.fromEntries(entries) as Partial<Record<number, MaintenanceReviewAction>>;

const allReviews = (action: MaintenanceReviewAction) =>
  reviewSchedule([1, action], [2, action], [3, action], [4, action], [5, action], [6, action], [7, action], [8, action], [9, action], [10, action]);

const evenReviews = (action: MaintenanceReviewAction) => reviewSchedule([2, action], [4, action], [6, action], [8, action], [10, action]);

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
        id: "engine-transmission-leaks",
        type: "Verificar vazamentos",
        category: "Motor/Transmissão",
        intervalKm: 10000,
        intervalMonths: 12,
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: allReviews("inspect"),
      },
      {
        id: "spark-plugs",
        type: "Velas",
        category: "Motor/Transmissão",
        intervalKm: 100000,
        estimatedCost: 0,
        action: "replace",
        reviewSchedule: reviewSchedule([10, "replace"]),
      },
      {
        id: "timing-belt-tensioner",
        type: "Correia sincronizadora e tensor",
        category: "Motor/Transmissão",
        intervalKm: 240000,
        intervalMonths: 180,
        estimatedCost: 0,
        action: "replace",
      },
      {
        id: "accessory-belt",
        type: "Correia de acessórios",
        category: "Motor/Transmissão",
        intervalKm: 120000,
        intervalMonths: 60,
        estimatedCost: 0,
        action: "replace",
      },
      {
        id: "oil-pump-belt",
        type: "Correia bomba de óleo",
        category: "Motor/Transmissão",
        intervalKm: 240000,
        intervalMonths: 180,
        estimatedCost: 0,
        action: "replace",
      },
      {
        id: "engine-oil",
        type: "Óleo do motor",
        category: "Motor",
        intervalKm: 10000,
        intervalMonths: 12,
        estimatedCost: 0,
        action: "replace",
        observation: "Sistema de vida útil",
        reviewSchedule: allReviews("replace"),
      },
      {
        id: "oil-filter",
        type: "Filtro de óleo",
        category: "Motor",
        intervalKm: 10000,
        intervalMonths: 12,
        estimatedCost: 0,
        action: "replace",
        observation: "Junto com óleo",
        reviewSchedule: allReviews("replace"),
      },
      {
        id: "manual-transmission-oil-level",
        type: "Óleo (nível/completar)",
        category: "Transmissão manual",
        intervalKm: 10000,
        intervalMonths: 12,
        estimatedCost: 0,
        action: "inspect",
        observation: "Remover bujão",
        reviewSchedule: reviewSchedule([1, "inspect"]),
      },
      {
        id: "manual-transmission-leaks",
        type: "Vazamentos",
        category: "Transmissão manual",
        intervalKm: 10000,
        intervalMonths: 12,
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: allReviews("inspect"),
      },
      {
        id: "automatic-transmission-level-leaks",
        type: "Nível/vazamentos",
        category: "Transmissão automática",
        intervalKm: 10000,
        intervalMonths: 12,
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: allReviews("inspect"),
      },
      {
        id: "automatic-transmission-oil",
        type: "Óleo transmissão automática",
        category: "Transmissão automática",
        intervalKm: 80000,
        estimatedCost: 0,
        action: "replace",
        observation: "Uso severo",
      },
      {
        id: "half-shaft-leaks",
        type: "Vazamentos semi-eixo",
        category: "Eixo/Admissão",
        intervalKm: 10000,
        intervalMonths: 12,
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: allReviews("inspect"),
      },
      {
        id: "engine-air-filter",
        type: "Filtro de ar",
        category: "Motor",
        intervalKm: 10000,
        intervalMonths: 12,
        estimatedCost: 0,
        action: "inspect",
        observation: "Conforme uso",
        reviewSchedule: reviewSchedule([1, "inspect"], [2, "inspect"], [3, "replace"], [4, "inspect"], [5, "inspect"], [6, "replace"], [7, "inspect"], [8, "inspect"], [9, "replace"], [10, "inspect"]),
      },
      {
        id: "coolant",
        type: "Fluido arrefecimento",
        category: "Arrefecimento",
        intervalKm: 150000,
        intervalMonths: 60,
        estimatedCost: 0,
        action: "replace",
      },
      {
        id: "cooling-system-leaks",
        type: "Vazamentos",
        category: "Arrefecimento",
        intervalKm: 10000,
        intervalMonths: 12,
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: allReviews("inspect"),
      },
      {
        id: "ac-system",
        type: "Sistema AC",
        category: "Ar-condicionado",
        intervalKm: 10000,
        intervalMonths: 12,
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: allReviews("inspect"),
      },
      {
        id: "cabin-filter",
        type: "Filtro cabine",
        category: "Ar-condicionado",
        intervalKm: 10000,
        intervalMonths: 12,
        estimatedCost: 0,
        action: "inspect",
        observation: "Se equipado",
        reviewSchedule: reviewSchedule([1, "inspect"], [2, "replace"], [3, "inspect"], [4, "replace"], [5, "inspect"], [6, "replace"], [7, "inspect"], [8, "replace"], [9, "inspect"], [10, "replace"]),
      },
      {
        id: "brake-discs-pads",
        type: "Discos e pastilhas",
        category: "Freios",
        intervalKm: 10000,
        intervalMonths: 12,
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: allReviews("inspect"),
      },
      {
        id: "brake-drums-linings",
        type: "Tambores/revestimentos",
        category: "Freios",
        intervalKm: 10000,
        intervalMonths: 12,
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: evenReviews("inspect"),
      },
      {
        id: "brake-lines-hoses",
        type: "Tubulações/mangueiras",
        category: "Freios",
        intervalKm: 10000,
        intervalMonths: 12,
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: evenReviews("inspect"),
      },
      {
        id: "parking-brake",
        type: "Freio estacionamento",
        category: "Freios",
        intervalKm: 10000,
        intervalMonths: 12,
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: allReviews("inspect"),
      },
      {
        id: "brake-fluid-level",
        type: "Fluido (nível)",
        category: "Freios",
        intervalKm: 10000,
        intervalMonths: 12,
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: allReviews("inspect"),
      },
      {
        id: "brake-fluid",
        type: "Fluido freio",
        category: "Freios",
        intervalMonths: 24,
        estimatedCost: 0,
        action: "replace",
        reviewSchedule: reviewSchedule([3, "replace"], [6, "replace"], [9, "replace"]),
      },
      {
        id: "shock-absorbers",
        type: "Amortecedores",
        category: "Suspensão/Direção",
        intervalKm: 10000,
        intervalMonths: 12,
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: allReviews("inspect"),
      },
      {
        id: "steering-system",
        type: "Sistema direção",
        category: "Suspensão/Direção",
        intervalKm: 10000,
        intervalMonths: 12,
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: evenReviews("inspect"),
      },
      {
        id: "boots-seals",
        type: "Coifas/guarnições",
        category: "Suspensão/Direção",
        intervalKm: 10000,
        intervalMonths: 12,
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: allReviews("inspect"),
      },
      {
        id: "tire-wear-rotation",
        type: "Desgaste/rodízio",
        category: "Pneus",
        intervalKm: 10000,
        intervalMonths: 12,
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: allReviews("inspect"),
      },
      {
        id: "wheel-tightening",
        type: "Aperto rodas",
        category: "Pneus",
        intervalKm: 10000,
        intervalMonths: 12,
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: allReviews("inspect"),
      },
      {
        id: "paint-rust",
        type: "Pintura/ferrugem",
        category: "Carroceria",
        intervalKm: 10000,
        intervalMonths: 12,
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: evenReviews("inspect"),
      },
      {
        id: "seat-belts",
        type: "Cintos segurança",
        category: "Carroceria",
        intervalKm: 10000,
        intervalMonths: 12,
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: allReviews("inspect"),
      },
      {
        id: "electronic-diagnosis",
        type: "Diagnóstico eletrônico",
        category: "Elétrico",
        intervalKm: 10000,
        intervalMonths: 12,
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: allReviews("inspect"),
      },
      {
        id: "lighting",
        type: "Iluminação",
        category: "Elétrico",
        intervalKm: 10000,
        intervalMonths: 12,
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: allReviews("inspect"),
      },
      {
        id: "wipers-washers",
        type: "Palhetas/lavadores",
        category: "Limpadores",
        intervalKm: 10000,
        intervalMonths: 12,
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: allReviews("inspect"),
      },
      {
        id: "headlight-aim",
        type: "Regulagem faróis",
        category: "Iluminação",
        intervalKm: 10000,
        intervalMonths: 12,
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: evenReviews("inspect"),
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
        kind: "service",
        action: "inspect",
        description: "Serviço de revisão periódica Toyota a cada 12 meses ou 10.000 km.",
      },
      {
        id: "engine-oil",
        type: "Óleo do motor",
        intervalKm: 10000,
        intervalMonths: 12,
        estimatedCost: 300,
        kind: "service",
        action: "replace",
        description: "Troca do óleo do motor prevista nas revisões periódicas.",
      },
      {
        id: "oil-filter",
        type: "Filtro de óleo",
        intervalKm: 10000,
        intervalMonths: 12,
        estimatedCost: 110,
        kind: "service",
        action: "replace",
        description: "Substituição do filtro de óleo junto da revisão.",
      },
      {
        id: "cabin-filter",
        type: "Filtro do ar-condicionado",
        intervalKm: 20000,
        intervalMonths: 24,
        estimatedCost: 160,
        kind: "service",
        action: "replace",
        description: "Substituição periódica do filtro de cabine/ar-condicionado.",
      },
      {
        id: "brakes",
        type: "Freios",
        estimatedCost: 0,
        kind: "inspection",
        action: "inspect",
        includedInReviewId: "periodic-review",
        description: "Pastilhas, discos, pedal, freio de estacionamento, tubos e mangueiras.",
      },
      {
        id: "tires-steering-suspension",
        type: "Pneus, direção e suspensão",
        estimatedCost: 0,
        kind: "inspection",
        action: "inspect",
        includedInReviewId: "periodic-review",
        description: "Calibragem/desgaste dos pneus, direção, articulações e suspensão.",
      },
      {
        id: "fluids-belts-lights",
        type: "Fluidos, correias e iluminação",
        estimatedCost: 0,
        kind: "inspection",
        action: "inspect",
        includedInReviewId: "periodic-review",
        description: "Níveis de fluidos, correias, luzes, bateria e itens de segurança.",
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

const getNextScheduledReview = (currentKm: number, reviewSchedule?: Partial<Record<number, MaintenanceReviewAction>>) => {
  if (!reviewSchedule) {
    return undefined;
  }

  return Array.from({ length: 10 }, (_, index) => index + 1).find((reviewNumber) => {
    const reviewKm = reviewNumber * 10000;
    return reviewKm > currentKm && Boolean(reviewSchedule[reviewNumber]);
  });
};

const getEstimatedLastKmForItem = (vehicle: Vehicle, item: MaintenancePlan["items"][number]) => {
  const nextScheduledReview = getNextScheduledReview(vehicle.currentKm, item.reviewSchedule);
  if (!nextScheduledReview || !item.intervalKm) {
    return getEstimatedLastKm(vehicle.currentKm, item.intervalKm);
  }

  return Math.max(0, nextScheduledReview * 10000 - item.intervalKm);
};

export const buildMaintenanceFromPlan = (vehicle: Vehicle, plan: MaintenancePlan): MaintenanceItem[] =>
  plan.items.filter((item) => item.kind !== "inspection").map((item) => {
    const lastKm = getEstimatedLastKmForItem(vehicle, item);
    const nextScheduledReview = getNextScheduledReview(vehicle.currentKm, item.reviewSchedule);
    const legacyChecklistItems = plan.items
      .filter((checklistItem) => checklistItem.kind === "inspection" && checklistItem.includedInReviewId === item.id)
      .map((checklistItem) => checklistItem.description ?? checklistItem.type);

    return {
      id: `${plan.id}-${item.id}`,
      type: item.type,
      intervalKm: item.intervalKm,
      intervalMonths: item.intervalMonths,
      lastKm,
      lastDate: TODAY_ISO,
      estimatedCost: item.estimatedCost,
      status: "upcoming",
      source: plan.source,
      sourceLabel: plan.sourceLabel,
      isEstimatedFromCurrentKm: true,
      manualReference: plan.manualReference,
      sourceUrl: plan.sourceUrl,
      kind: item.kind ?? "service",
      action: nextScheduledReview ? item.reviewSchedule?.[nextScheduledReview] ?? item.action : item.action,
      category: item.category,
      observation: item.observation,
      description: item.description,
      includedInReviewId: item.includedInReviewId,
      checklistItems: legacyChecklistItems,
    };
  });
