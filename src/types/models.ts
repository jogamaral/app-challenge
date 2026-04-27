export type ExpenseCategory =
  | "Combustível"
  | "Manutenção"
  | "Documentação"
  | "Seguro"
  | "Estacionamento/Pedágio"
  | "Lavagem"
  | "Outros";

export type UpcomingType = "annual" | "maintenance";

export type AdPlacement = "auth_banner" | "dashboard_banner" | "expenses_inline";

export type MaintenanceSource = "manufacturer_manual" | "generic";

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
  source?: MaintenanceSource;
  sourceLabel?: string;
  isEstimatedFromCurrentKm?: boolean;
  manualReference?: string;
  sourceUrl?: string;
};

export type MaintenancePlanItem = {
  id: string;
  type: string;
  intervalKm?: number;
  intervalMonths?: number;
  estimatedCost: number;
};

export type MaintenancePlan = {
  id: string;
  brand: string;
  model: string;
  year: number;
  source: "manufacturer_manual";
  sourceLabel: string;
  manualReference: string;
  sourceUrl: string;
  extractedAt: string;
  items: MaintenancePlanItem[];
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

export type MockAd = {
  id: string;
  placement: AdPlacement;
  title: string;
  description: string;
  cta: string;
  sponsor: string;
  actionSlug: string;
  externalUrl: string;
  actionUrl?: string;
  variant: "banner" | "card";
};

export type MockAdLandingPage = {
  slug: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  sponsor: string;
  offerLabel: string;
  primaryCta: string;
  secondaryCta: string;
  heroDescription: string;
  benefits: string[];
  steps: string[];
  disclaimer: string;
};
