import { readJson, writeJson } from "@/lib/persistence";
import { buildMaintenanceFromPlan, getMaintenancePlanForVehicle } from "@/data/maintenancePlans";
import { buildDashboardSummary, buildUpcomingEvents, getMaintenanceForecast } from "@/lib/forecast";
import { AlertSettings, AnnualExpense, CreateMaintenanceItemInput, DashboardSummary, Expense, ExpenseCategory, MaintenanceItem, ProtectionReserveInput, UpcomingEvent, UpdateMaintenanceItemInput, User, Vehicle } from "@/types/models";

const wait = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms));
const MOCK_DB_STORAGE_KEY = "autoplano.mock-db";

type MockDb = {
  user: User;
  vehicle: Vehicle | null;
  alertSettings: AlertSettings;
  annualExpenses: AnnualExpense[];
  expenses: Expense[];
  maintenance: MaintenanceItem[];
  protectionReserve: ProtectionReserveInput;
};

const initialDb: MockDb = {
  user: { id: "u1", name: "Joana Costa", email: "joana@autoplano.app" },
  vehicle: null,
  alertSettings: {
    leadDays: 7,
    annualReminders: true,
    maintenanceReminders: true,
    emailEnabled: true,
  },
  annualExpenses: [
    { id: "a1", type: "Licenciamento", value: 180, dueDate: "2026-04-09" },
    { id: "a2", type: "Seguro", value: 3200, dueDate: "2026-07-22" },
    { id: "a3", type: "Assistência 24h", value: 390, dueDate: "2026-08-10" },
    { id: "a4", type: "IPVA", value: 2350, dueDate: "2027-01-18" },
  ],
  expenses: [],
  protectionReserve: {
    insuranceDeductible: 0,
    savedReserve: 0,
  },
  maintenance: [
    { id: "m1", type: "Troca de óleo", intervalKm: 10000, intervalMonths: 6, lastKm: 52000, lastDate: "2025-11-20", estimatedCost: 320, status: "upcoming", source: "generic" },
    { id: "m2", type: "Filtros", intervalKm: 10000, intervalMonths: 6, lastKm: 52000, lastDate: "2025-11-20", estimatedCost: 180, status: "upcoming", source: "generic" },
    { id: "m3", type: "Freios", intervalKm: 20000, intervalMonths: 12, lastKm: 42000, lastDate: "2025-05-14", estimatedCost: 760, status: "warning", source: "generic" },
    { id: "m4", type: "Pneus", intervalKm: 40000, intervalMonths: 24, lastKm: 24000, lastDate: "2024-06-05", estimatedCost: 2400, status: "upcoming", source: "generic" },
    { id: "m5", type: "Bateria", intervalMonths: 36, lastKm: 31000, lastDate: "2023-09-08", estimatedCost: 620, status: "warning", source: "generic" },
  ],
};

const persistedDb = readJson<Partial<MockDb> | null>(MOCK_DB_STORAGE_KEY, null);

const db: MockDb = {
  ...initialDb,
  ...persistedDb,
  user: persistedDb?.user ?? initialDb.user,
  vehicle: persistedDb?.vehicle ?? initialDb.vehicle,
  alertSettings: persistedDb?.alertSettings ?? initialDb.alertSettings,
  annualExpenses: persistedDb?.annualExpenses ?? initialDb.annualExpenses,
  expenses: persistedDb?.expenses ?? initialDb.expenses,
  maintenance: persistedDb?.maintenance ?? initialDb.maintenance,
  protectionReserve: persistedDb?.protectionReserve ?? initialDb.protectionReserve,
};

const persistDb = () => writeJson(MOCK_DB_STORAGE_KEY, db);

const normalizeMaintenanceInput = (payload: UpdateMaintenanceItemInput) => {
  const type = payload.type.trim();
  const intervalKm = payload.intervalKm && payload.intervalKm > 0 ? payload.intervalKm : undefined;
  const intervalMonths = payload.intervalMonths && payload.intervalMonths > 0 ? payload.intervalMonths : undefined;

  if (!type) {
    throw new Error("Nome da manutenção inválido");
  }

  if (!Number.isFinite(payload.estimatedCost) || payload.estimatedCost < 0) {
    throw new Error("Custo estimado inválido");
  }

  if (!Number.isFinite(payload.lastKm) || payload.lastKm < 0) {
    throw new Error("Quilometragem inválida");
  }

  if (!payload.lastDate) {
    throw new Error("Data inválida");
  }

  if (!intervalKm && !intervalMonths) {
    throw new Error("Informe um intervalo");
  }

  return {
    type,
    estimatedCost: payload.estimatedCost,
    lastKm: payload.lastKm,
    lastDate: payload.lastDate,
    intervalKm,
    intervalMonths,
  };
};

const syncMaintenanceForVehicle = (vehicle: Vehicle) => {
  const manualItems = db.maintenance.filter((item) => item.source === "manual");
  const maintenancePlan = getMaintenancePlanForVehicle(vehicle);
  if (!maintenancePlan) {
    if (db.maintenance.every((item) => item.source === "manufacturer_manual" || item.source === "manual")) {
      db.maintenance = [...initialDb.maintenance.map((item) => ({ ...item })), ...manualItems];
    }
    return;
  }

  const nextMaintenance = buildMaintenanceFromPlan(vehicle, maintenancePlan).map((nextItem) => {
    const currentItem = db.maintenance.find((item) => item.id === nextItem.id);
    return currentItem
      ? {
          ...nextItem,
          type: currentItem.type,
          estimatedCost: currentItem.estimatedCost,
          intervalKm: currentItem.intervalKm,
          intervalMonths: currentItem.intervalMonths,
          lastKm: currentItem.lastKm,
          lastDate: currentItem.lastDate,
          status: currentItem.status,
          isEstimatedFromCurrentKm: currentItem.isEstimatedFromCurrentKm,
        }
      : nextItem;
  });

  const nextItems = [...nextMaintenance, ...manualItems];
  const hasSameItems =
    db.maintenance.length === nextItems.length &&
    nextItems.every((nextItem) => db.maintenance.some((item) => item.id === nextItem.id));

  if (!hasSameItems) {
    db.maintenance = nextItems;
    persistDb();
  }
};

export const mockApi = {
  async login(payload: { name: string; email: string }) {
    await wait();
    db.user.name = payload.name;
    db.user.email = payload.email;
    persistDb();
    return db.user;
  },

  async getCurrentUser() {
    await wait(250);
    return db.user;
  },

  async getVehicle() {
    await wait();
    return db.vehicle;
  },

  async saveVehicle(payload: Omit<Vehicle, "id">) {
    await wait();
    db.vehicle = { id: db.vehicle?.id ?? "v1", ...payload };
    syncMaintenanceForVehicle(db.vehicle);
    persistDb();
    return db.vehicle;
  },

  async getDashboard(): Promise<DashboardSummary> {
    await wait();
    if (!db.vehicle) {
      throw new Error("Veículo não cadastrado");
    }
    syncMaintenanceForVehicle(db.vehicle);
    return buildDashboardSummary(db.expenses, db.annualExpenses, db.maintenance, db.vehicle, db.protectionReserve);
  },

  async saveProtectionReserve(payload: ProtectionReserveInput) {
    await wait();
    const insuranceDeductible = Number.isFinite(payload.insuranceDeductible) && payload.insuranceDeductible > 0 ? payload.insuranceDeductible : 0;
    const savedReserve = Number.isFinite(payload.savedReserve) && payload.savedReserve >= 0 ? payload.savedReserve : 0;
    db.protectionReserve = {
      insuranceDeductible,
      savedReserve,
    };
    persistDb();
    return db.protectionReserve;
  },

  async getExpenses() {
    await wait();
    return [...db.expenses].sort((a, b) => b.date.localeCompare(a.date));
  },

  async createExpense(payload: { category: ExpenseCategory; amount: number; date: string; note?: string }) {
    await wait();
    if (!Number.isFinite(payload.amount) || payload.amount <= 0) {
      throw new Error("Valor da despesa invalido");
    }

    const expense: Expense = { id: `e${Date.now()}`, ...payload };
    db.expenses.unshift(expense);
    persistDb();
    return expense;
  },

  async getAnnualExpense(id: string) {
    await wait();
    const item = db.annualExpenses.find((entry) => entry.id === id);
    if (!item) {
      throw new Error("Despesa anual não encontrada");
    }
    return item;
  },

  async updateAnnualExpense(id: string, payload: Omit<AnnualExpense, "id">) {
    await wait();
    const item = db.annualExpenses.find((entry) => entry.id === id);
    if (!item) {
      throw new Error("Despesa anual não encontrada");
    }

    const type = payload.type.trim();
    if (!type) {
      throw new Error("Nome da despesa inválido");
    }

    if (!Number.isFinite(payload.value) || payload.value <= 0) {
      throw new Error("Valor da despesa inválido");
    }

    if (!payload.dueDate) {
      throw new Error("Data de vencimento inválida");
    }

    item.type = type;
    item.value = payload.value;
    item.dueDate = payload.dueDate;
    persistDb();
    return item;
  },

  async getUpcomingEvents(): Promise<UpcomingEvent[]> {
    await wait();
    if (!db.vehicle) {
      return [];
    }
    syncMaintenanceForVehicle(db.vehicle);
    return buildUpcomingEvents(db.annualExpenses, db.maintenance, db.vehicle);
  },

  async getMaintenance() {
    await wait();
    if (!db.vehicle) {
      return [];
    }
    syncMaintenanceForVehicle(db.vehicle);
    return db.maintenance.map((item) => ({ ...item, forecast: getMaintenanceForecast(item, db.vehicle!) }));
  },

  async getMaintenanceItem(id: string) {
    await wait();
    if (db.vehicle) {
      syncMaintenanceForVehicle(db.vehicle);
    }
    const item = db.maintenance.find((entry) => entry.id === id);
    if (!item) {
      throw new Error("Manutenção não encontrada");
    }
    return item;
  },

  async createMaintenanceItem(payload: CreateMaintenanceItemInput) {
    await wait();
    const input = normalizeMaintenanceInput(payload);

    if (input.estimatedCost <= 0) {
      throw new Error("Custo estimado inválido");
    }

    const item: MaintenanceItem = {
      id: `manual-${Date.now()}`,
      ...input,
      status: "upcoming",
      source: "manual",
    };

    db.maintenance.push(item);
    persistDb();
    return item;
  },

  async updateMaintenanceItem(id: string, payload: UpdateMaintenanceItemInput) {
    await wait();
    const item = db.maintenance.find((entry) => entry.id === id);
    if (!item) {
      throw new Error("Manutenção não encontrada");
    }

    const input = normalizeMaintenanceInput(payload);
    item.type = input.type;
    item.estimatedCost = input.estimatedCost;
    item.lastKm = input.lastKm;
    item.lastDate = input.lastDate;
    item.intervalKm = input.intervalKm;
    item.intervalMonths = input.intervalMonths;
    item.isEstimatedFromCurrentKm = false;
    persistDb();
    return item;
  },

  async completeMaintenance(id: string) {
    await wait();
    if (!db.vehicle) {
      throw new Error("Veículo não encontrado");
    }
    const item = db.maintenance.find((entry) => entry.id === id);
    if (!item) {
      throw new Error("Manutenção não encontrada");
    }
    item.lastDate = "2026-03-19";
    item.lastKm = db.vehicle.currentKm;
    item.status = "upcoming";
    item.isEstimatedFromCurrentKm = false;
    db.expenses.unshift({
      id: `e${Date.now()}`,
      category: "Manutenção",
      amount: item.estimatedCost,
      date: "2026-03-19",
      note: `${item.type} realizada`,
    });
    persistDb();
    return item;
  },

  async getAlertSettings() {
    await wait();
    return db.alertSettings;
  },

  async saveAlertSettings(payload: AlertSettings) {
    await wait();
    db.alertSettings = payload;
    persistDb();
    return db.alertSettings;
  },

  async getAnnualExpenses() {
    await wait();
    return db.annualExpenses;
  },
};
