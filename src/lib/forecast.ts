import { AnnualExpense, DashboardSummary, Expense, MaintenanceItem, ProtectionLevel, ProtectionReserveInput, ProtectionReserveSummary, UpcomingEvent, Vehicle } from "@/types/models";

const TODAY = new Date("2026-03-19T12:00:00");

const addMonths = (date: Date, amount: number) => {
  const next = new Date(date);
  next.setMonth(next.getMonth() + amount);
  return next;
};

export const getMaintenanceForecast = (item: MaintenanceItem, vehicle: Vehicle) => {
  const nextKm = item.intervalKm ? item.lastKm + item.intervalKm : undefined;
  const kmRemaining = nextKm ? Math.max(0, nextKm - vehicle.currentKm) : undefined;
  const monthsByKm =
    kmRemaining === 0
      ? 0
      : kmRemaining !== undefined && vehicle.monthlyKm > 0
        ? Math.ceil(kmRemaining / vehicle.monthlyKm)
        : undefined;
  const dateByKm = monthsByKm !== undefined ? addMonths(TODAY, monthsByKm) : undefined;
  const dateByTime = item.intervalMonths ? addMonths(new Date(`${item.lastDate}T12:00:00`), item.intervalMonths) : undefined;
  const nextDate = [dateByKm, dateByTime].filter(Boolean).sort((a, b) => Number(a) - Number(b))[0] ?? TODAY;

  return {
    nextKm,
    kmRemaining,
    nextDate,
  };
};

export const buildUpcomingEvents = (
  annualExpenses: AnnualExpense[],
  maintenance: MaintenanceItem[],
  vehicle: Vehicle
): UpcomingEvent[] => {
  const annualEvents = annualExpenses.map((item) => ({
    id: item.id,
    title: item.type,
    subtitle: "Obrigação anual",
    amount: item.value,
    date: item.dueDate,
    type: "annual" as const,
    urgency: new Date(`${item.dueDate}T12:00:00`) <= addMonths(TODAY, 1) ? "high" as const : "normal" as const,
  }));

  const maintenanceEvents = maintenance.map((item) => {
    const forecast = getMaintenanceForecast(item, vehicle);
    return {
      id: item.id,
      title: item.type,
      subtitle: forecast.kmRemaining !== undefined ? `${forecast.kmRemaining} km restantes` : "Controle por tempo",
      amount: item.estimatedCost,
      date: forecast.nextDate.toISOString().slice(0, 10),
      type: "maintenance" as const,
      urgency: item.status === "warning" ? "warning" as const : "normal" as const,
    };
  });

  return [...annualEvents, ...maintenanceEvents].sort((a, b) => a.date.localeCompare(b.date));
};

export const buildProtectionReserveSummary = ({ insuranceDeductible, savedReserve }: ProtectionReserveInput): ProtectionReserveSummary => {
  const hasValidValues = Number.isFinite(insuranceDeductible) && insuranceDeductible > 0 && Number.isFinite(savedReserve) && savedReserve >= 0;
  const coveragePercent = hasValidValues ? Math.floor((savedReserve / insuranceDeductible) * 100) : 0;
  let level: ProtectionLevel = "none";

  if (coveragePercent >= 100) {
    level = "gold";
  } else if (coveragePercent >= 50) {
    level = "silver";
  } else if (coveragePercent >= 30) {
    level = "bronze";
  }

  return {
    insuranceDeductible: hasValidValues ? insuranceDeductible : 0,
    savedReserve: hasValidValues ? savedReserve : 0,
    coveragePercent,
    level,
  };
};

export const buildDashboardSummary = (
  expenses: Expense[],
  annualExpenses: AnnualExpense[],
  maintenance: MaintenanceItem[],
  vehicle: Vehicle,
  protectionReserve: ProtectionReserveInput
): DashboardSummary => {
  const monthKey = TODAY.toISOString().slice(0, 7);
  const monthSpend = expenses.filter((item) => item.date.startsWith(monthKey)).reduce((sum, item) => sum + item.amount, 0);
  const yearSpend = expenses.reduce((sum, item) => sum + item.amount, 0);
  const upcoming = buildUpcomingEvents(annualExpenses, maintenance, vehicle);
  const annualTotal = annualExpenses.reduce((sum, item) => sum + item.value, 0);
  const maintenanceTotal = maintenance.reduce((sum, item) => sum + item.estimatedCost, 0);
  const reserveSuggestion = Math.round((annualTotal + maintenanceTotal) / 12 + vehicle.monthlyKm * 0.19);

  return {
    monthSpend,
    yearSpend,
    reserveSuggestion,
    reserveCoverage: 72,
    protectionReserve: buildProtectionReserveSummary(protectionReserve),
    nextEvents: upcoming.slice(0, 4),
  };
};
