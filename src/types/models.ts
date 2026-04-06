export type ExpenseCategory =
  | "Combustível"
  | "Manutenção"
  | "Documentação"
  | "Seguro"
  | "Estacionamento/Pedágio"
  | "Lavagem"
  | "Outros";

export type UpcomingType = "annual" | "maintenance";

export type User = {
  id: string;
  name: string;
  email: string;
};

export type Vehicle = {
  id: string;
  brand: string;
  model: string;
  year: number;
  version?: string;
  currentKm: number;
  monthlyKm: number;
};

export type Expense = {
  id: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  note?: string;
};

export type AnnualExpense = {
  id: string;
  type: string;
  value: number;
  dueDate: string;
};

export type MaintenanceItem = {
  id: string;
  type: string;
  intervalKm?: number;
  intervalMonths?: number;
  lastKm: number;
  lastDate: string;
  estimatedCost: number;
  status: "upcoming" | "warning" | "done";
};

export type AlertSettings = {
  leadDays: number;
  annualReminders: boolean;
  maintenanceReminders: boolean;
  emailEnabled: boolean;
};

export type UpcomingEvent = {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  date: string;
  type: UpcomingType;
  urgency: "normal" | "warning" | "high";
};

export type DashboardSummary = {
  monthSpend: number;
  yearSpend: number;
  reserveSuggestion: number;
  reserveCoverage: number;
  nextEvents: UpcomingEvent[];
};
