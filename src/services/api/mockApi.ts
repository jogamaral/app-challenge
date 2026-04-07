import { buildDashboardSummary, buildUpcomingEvents, getMaintenanceForecast } from "@/lib/forecast";
import { AlertSettings, AnnualExpense, DashboardSummary, Expense, ExpenseCategory, MaintenanceItem, UpcomingEvent, User, Vehicle } from "@/types/models";

const wait = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms));

const db: {
  user: User;
  vehicle: Vehicle | null;
  alertSettings: AlertSettings;
  annualExpenses: AnnualExpense[];
  expenses: Expense[];
  maintenance: MaintenanceItem[];
} = {
  user: { id: "u1", name: "Joana Costa", email: "joana@autoplano.app" },
  vehicle: {
    id: "v1",
    brand: "Honda",
    model: "City",
    year: 2020,
    version: "EX",
    currentKm: 58400,
    monthlyKm: 1250,
  },
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
  maintenance: [
    { id: "m1", type: "Troca de óleo", intervalKm: 10000, intervalMonths: 6, lastKm: 52000, lastDate: "2025-11-20", estimatedCost: 320, status: "upcoming" },
    { id: "m2", type: "Filtros", intervalKm: 10000, intervalMonths: 6, lastKm: 52000, lastDate: "2025-11-20", estimatedCost: 180, status: "upcoming" },
    { id: "m3", type: "Freios", intervalKm: 20000, intervalMonths: 12, lastKm: 42000, lastDate: "2025-05-14", estimatedCost: 760, status: "warning" },
    { id: "m4", type: "Pneus", intervalKm: 40000, intervalMonths: 24, lastKm: 24000, lastDate: "2024-06-05", estimatedCost: 2400, status: "upcoming" },
    { id: "m5", type: "Bateria", intervalMonths: 36, lastKm: 31000, lastDate: "2023-09-08", estimatedCost: 620, status: "warning" },
  ],
};

export const mockApi = {
  async login(payload: { name: string; email: string }) {
    await wait();
    db.user.name = payload.name;
    db.user.email = payload.email;
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
    return db.vehicle;
  },

  async getDashboard(): Promise<DashboardSummary> {
    await wait();
    if (!db.vehicle) {
      throw new Error("Veículo não cadastrado");
    }
    return buildDashboardSummary(db.expenses, db.annualExpenses, db.maintenance, db.vehicle);
  },

  async getExpenses() {
    await wait();
    return [...db.expenses].sort((a, b) => b.date.localeCompare(a.date));
  },

  async createExpense(payload: { category: ExpenseCategory; amount: number; date: string; note?: string }) {
    await wait();
    const expense: Expense = { id: `e${Date.now()}`, ...payload };
    db.expenses.unshift(expense);
    return expense;
  },

  async getUpcomingEvents(): Promise<UpcomingEvent[]> {
    await wait();
    if (!db.vehicle) {
      return [];
    }
    return buildUpcomingEvents(db.annualExpenses, db.maintenance, db.vehicle);
  },

  async getMaintenance() {
    await wait();
    if (!db.vehicle) {
      return [];
    }
    return db.maintenance.map((item) => ({ ...item, forecast: getMaintenanceForecast(item, db.vehicle!) }));
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
    db.expenses.unshift({
      id: `e${Date.now()}`,
      category: "Manutenção",
      amount: item.estimatedCost,
      date: "2026-03-19",
      note: `${item.type} realizada`,
    });
    return item;
  },

  async getAlertSettings() {
    await wait();
    return db.alertSettings;
  },

  async saveAlertSettings(payload: AlertSettings) {
    await wait();
    db.alertSettings = payload;
    return db.alertSettings;
  },

  async getAnnualExpenses() {
    await wait();
    return db.annualExpenses;
  },
};
