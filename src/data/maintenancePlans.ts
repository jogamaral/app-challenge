import { MaintenanceItem, MaintenancePlan, MaintenanceReviewAction, Vehicle } from "@/types/models";

const TODAY_ISO = "2026-03-19";

const reviewSchedule = (...entries: Array<[number, MaintenanceReviewAction]>) =>
  Object.fromEntries(entries) as Partial<Record<number, MaintenanceReviewAction>>;

const allReviews = (action: MaintenanceReviewAction) =>
  reviewSchedule([1, action], [2, action], [3, action], [4, action], [5, action], [6, action], [7, action], [8, action], [9, action], [10, action]);

const evenReviews = (action: MaintenanceReviewAction) => reviewSchedule([2, action], [4, action], [6, action], [8, action], [10, action]);

const allReviews20 = (action: MaintenanceReviewAction) =>
  reviewSchedule(
    [1, action], [2, action], [3, action], [4, action], [5, action], [6, action], [7, action], [8, action], [9, action], [10, action],
    [11, action], [12, action], [13, action], [14, action], [15, action], [16, action], [17, action], [18, action], [19, action], [20, action]
  );

const evenReviews20 = (action: MaintenanceReviewAction) =>
  reviewSchedule([2, action], [4, action], [6, action], [8, action], [10, action], [12, action], [14, action], [16, action], [18, action], [20, action]);

const everyFifthReview = (action: MaintenanceReviewAction) => reviewSchedule([5, action], [10, action], [15, action], [20, action]);

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
        id: "engine-oil-filter",
        type: "Óleo e Filtro de Óleo",
        category: "Motor",
        intervalKm: 10000,
        intervalMonths: 12,
        estimatedCost: 0,
        action: "replace",
        reviewSchedule: allReviews20("replace"),
      },
      {
        id: "engine-coolant",
        type: "Fluido de Arrefecimento do Motor",
        category: "Motor",
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: evenReviews20("inspect"),
      },
      {
        id: "engine-air-filter",
        type: "Filtro de Ar do Motor",
        category: "Motor",
        intervalKm: 10000,
        intervalMonths: 12,
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: reviewSchedule([1, "inspect"], [2, "replace"], [3, "inspect"], [4, "replace"], [5, "inspect"], [6, "replace"], [7, "inspect"], [8, "replace"], [9, "inspect"], [10, "replace"], [11, "inspect"], [12, "replace"], [13, "inspect"], [14, "replace"], [15, "inspect"], [16, "replace"], [17, "inspect"], [18, "replace"], [19, "inspect"], [20, "replace"]),
      },
      {
        id: "spark-plugs",
        type: "Velas de Ignição",
        category: "Motor",
        estimatedCost: 0,
        action: "replace",
        reviewSchedule: reviewSchedule([5, "replace"], [20, "replace"]),
      },
      {
        id: "drive-belt",
        type: "Correia de Acionamento",
        category: "Motor",
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: evenReviews20("inspect"),
      },
      {
        id: "radiator-evaporator-hoses",
        type: "Radiador, Evaporador e Mangueiras",
        category: "Motor",
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: evenReviews20("inspect"),
      },
      {
        id: "hybrid-inverter-coolant",
        type: "Fluido Arrefecimento Inversor",
        category: "Sistema Híbrido",
        estimatedCost: 0,
        action: "inspect",
        hybridOnly: true,
        reviewSchedule: evenReviews20("inspect"),
      },
      {
        id: "hybrid-battery-air-filter",
        type: "Filtro Ar Bateria Híbrida",
        category: "Sistema Híbrido",
        estimatedCost: 0,
        action: "lubricate",
        hybridOnly: true,
        reviewSchedule: reviewSchedule([1, "lubricate"], [2, "lubricate"], [3, "replace"], [4, "lubricate"], [5, "lubricate"], [6, "replace"], [7, "lubricate"], [8, "lubricate"], [9, "replace"], [10, "lubricate"], [11, "lubricate"], [12, "replace"], [13, "lubricate"], [14, "lubricate"], [15, "replace"], [16, "lubricate"], [17, "lubricate"], [18, "replace"], [19, "lubricate"], [20, "lubricate"]),
      },
      {
        id: "cvt-transmission-fluid",
        type: "Fluido Transmissão CVT",
        category: "Transmissão",
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: evenReviews20("inspect"),
      },
      {
        id: "drive-shaft-boots",
        type: "Eixo de Tração e Coifas",
        category: "Transmissão",
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: evenReviews20("inspect"),
      },
      {
        id: "brake-pads-discs",
        type: "Pastilha e Disco de Freio",
        category: "Freio",
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: allReviews20("inspect"),
      },
      {
        id: "brake-fluid",
        type: "Fluido de Freio",
        category: "Freio",
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: reviewSchedule([1, "inspect"], [2, "inspect"], [3, "replace"], [4, "inspect"], [5, "inspect"], [6, "replace"], [7, "inspect"], [8, "inspect"], [9, "replace"], [10, "inspect"], [11, "inspect"], [12, "replace"], [13, "inspect"], [14, "inspect"], [15, "replace"], [16, "inspect"], [17, "inspect"], [18, "replace"], [19, "inspect"], [20, "inspect"]),
      },
      {
        id: "brake-pedal-parking",
        type: "Pedal de Freio / Estacionamento",
        category: "Freio",
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: allReviews20("inspect"),
      },
      {
        id: "brake-vacuum-pump",
        type: "Bomba de Vácuo",
        category: "Freio",
        estimatedCost: 0,
        action: "replace",
      },
      {
        id: "brake-tubes-hoses",
        type: "Tubos e Mangueiras de Freio",
        category: "Freio",
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: evenReviews20("inspect"),
      },
      {
        id: "steering-box",
        type: "Direção e Caixa de Direção",
        category: "Suspensão",
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: evenReviews20("inspect"),
      },
      {
        id: "ball-joints-boots",
        type: "Juntas Esféricas e Coifas",
        category: "Suspensão",
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: evenReviews20("inspect"),
      },
      {
        id: "tires",
        type: "Pneus",
        category: "Suspensão",
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: allReviews20("inspect"),
      },
      {
        id: "front-rear-suspension",
        type: "Suspensão Dianteira/Traseira",
        category: "Suspensão",
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: evenReviews20("inspect"),
      },
      {
        id: "battery-12v",
        type: "Bateria 12V",
        category: "Elétrica",
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: evenReviews20("inspect"),
      },
      {
        id: "lights-horn",
        type: "Luzes e buzina",
        category: "Elétrica",
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: allReviews20("inspect"),
      },
      {
        id: "wipers-washers",
        type: "Limpadores/lavadores",
        category: "Elétrica",
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: allReviews20("inspect"),
      },
      {
        id: "fuel-tank-filter",
        type: "Filtro combustível tanque",
        category: "Combustível",
        estimatedCost: 0,
        action: "replace",
        reviewSchedule: everyFifthReview("replace"),
      },
      {
        id: "fuel-line-filter",
        type: "Filtro combustível linha",
        category: "Combustível",
        intervalKm: 10000,
        intervalMonths: 12,
        estimatedCost: 0,
        action: "replace",
        reviewSchedule: allReviews20("replace"),
      },
      {
        id: "fuel-system-lines",
        type: "Sistema combustível (linhas)",
        category: "Combustível",
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: evenReviews20("inspect"),
      },
      {
        id: "canister",
        type: "Cânister",
        category: "Emissões",
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: evenReviews20("inspect"),
      },
      {
        id: "exhaust",
        type: "Escapamento",
        category: "Emissões",
        estimatedCost: 0,
        action: "inspect",
        reviewSchedule: evenReviews20("inspect"),
      },
      {
        id: "ac-filter",
        type: "Filtro ar condicionado",
        category: "Ar-condicionado",
        estimatedCost: 0,
        action: "replace",
        reviewSchedule: allReviews20("replace"),
      },
      {
        id: "hybrid-transmission-fluid",
        type: "Fluido Transmissão Híbrida",
        category: "Sistema Híbrido",
        estimatedCost: 0,
        action: "inspect",
        hybridOnly: true,
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

  return Array.from({ length: 20 }, (_, index) => index + 1).find((reviewNumber) => {
    const reviewKm = reviewNumber * 10000;
    return reviewKm > currentKm && Boolean(reviewSchedule[reviewNumber]);
  });
};

const getEstimatedLastKmForItem = (vehicle: Vehicle, item: MaintenancePlan["items"][number]) => {
  const nextScheduledReview = getNextScheduledReview(vehicle.currentKm, item.reviewSchedule);
  if (nextScheduledReview && !item.intervalKm) {
    return Math.max(0, nextScheduledReview * 10000 - 10000);
  }

  if (!nextScheduledReview || !item.intervalKm) {
    return getEstimatedLastKm(vehicle.currentKm, item.intervalKm);
  }

  return Math.max(0, nextScheduledReview * 10000 - item.intervalKm);
};

export const buildMaintenanceFromPlan = (vehicle: Vehicle, plan: MaintenancePlan): MaintenanceItem[] =>
  plan.items.filter((item) => item.kind !== "inspection" && (item.intervalKm || item.intervalMonths || item.reviewSchedule) && (!item.hybridOnly || vehicle.version?.toLocaleLowerCase("pt-BR").includes("hybrid"))).map((item) => {
    const lastKm = getEstimatedLastKmForItem(vehicle, item);
    const nextScheduledReview = getNextScheduledReview(vehicle.currentKm, item.reviewSchedule);
    const legacyChecklistItems = plan.items
      .filter((checklistItem) => checklistItem.kind === "inspection" && checklistItem.includedInReviewId === item.id)
      .map((checklistItem) => checklistItem.description ?? checklistItem.type);

    return {
      id: `${plan.id}-${item.id}`,
      type: item.type,
      intervalKm: item.intervalKm ?? (item.reviewSchedule ? 10000 : undefined),
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
