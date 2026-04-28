export type ExpenseCategory =
  | "Combustível"
  | "Manutenção"
  | "Documentação"
  | "Seguro"
  | "Estacionamento/Pedágio"
  | "Lavagem"
  | "Outros";

export type UpcomingType = "annual" | "maintenance";

export type AdPlacement = "dashboard_banner" | "expenses_inline";

export type MaintenanceSource = "manufacturer_manual" | "generic" | "manual";
export type MaintenanceKind = "service" | "inspection";
export type MaintenanceAction = "replace" | "inspect" | "adjust";
export type MaintenanceReviewAction = "inspect" | "replace";

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
  kind?: MaintenanceKind;
  action?: MaintenanceAction;
  category?: string;
  observation?: string;
  description?: string;
  includedInReviewId?: string;
  checklistItems?: string[];
};

export type CreateMaintenanceItemInput = {
  type: string;
  estimatedCost: number;
  lastKm: number;
  lastDate: string;
  intervalKm?: number;
  intervalMonths?: number;
};

export type MaintenancePlanItem = {
  id: string;
  type: string;
  category?: string;
  intervalKm?: number;
  intervalMonths?: number;
  estimatedCost: number;
  kind?: MaintenanceKind;
  action?: MaintenanceAction;
  description?: string;
  observation?: string;
  reviewSchedule?: Partial<Record<number, MaintenanceReviewAction>>;
  includedInReviewId?: string;
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

export type ProtectionLevel = "none" | "bronze" | "silver" | "gold";

export type ProtectionReserveInput = {
  insuranceDeductible: number;
  savedReserve: number;
};

export type ProtectionReserveSummary = ProtectionReserveInput & {
  coveragePercent: number;
  level: ProtectionLevel;
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
  protectionReserve: ProtectionReserveSummary;
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
