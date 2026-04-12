import { Vehicle } from "@/types/models";

export type SelectOption = {
  label: string;
  value: string;
};

type VehicleYearCatalog = {
  year: number;
  versions: string[];
};

type VehicleModelCatalog = {
  model: string;
  years: VehicleYearCatalog[];
};

type VehicleBrandCatalog = {
  brand: string;
  models: VehicleModelCatalog[];
};

export const vehicleCatalog: VehicleBrandCatalog[] = [
  {
    brand: "Chevrolet",
    models: [
      {
        model: "Onix",
        years: [
          { year: 2024, versions: ["1.0", "LT", "LTZ", "Premier"] },
          { year: 2023, versions: ["1.0", "LT", "LTZ", "RS"] },
          { year: 2022, versions: ["1.0", "LT", "LTZ"] },
        ],
      },
      {
        model: "Tracker",
        years: [
          { year: 2024, versions: ["AT", "LT", "LTZ", "Premier"] },
          { year: 2023, versions: ["AT", "LT", "LTZ", "RS"] },
          { year: 2022, versions: ["Turbo AT", "LT", "Premier"] },
        ],
      },
    ],
  },
  {
    brand: "Fiat",
    models: [
      {
        model: "Argo",
        years: [
          { year: 2024, versions: ["1.0", "Drive 1.0", "Trekking 1.3"] },
          { year: 2023, versions: ["1.0", "Drive 1.0", "Drive 1.3"] },
          { year: 2022, versions: ["1.0", "Drive 1.3", "Trekking"] },
        ],
      },
      {
        model: "Pulse",
        years: [
          { year: 2024, versions: ["Drive", "Audace", "Impetus"] },
          { year: 2023, versions: ["Drive", "Audace", "Abarth"] },
          { year: 2022, versions: ["Drive", "Audace", "Impetus Turbo"] },
        ],
      },
    ],
  },
  {
    brand: "Honda",
    models: [
      {
        model: "City",
        years: [
          { year: 2024, versions: ["EX", "EXL", "Touring"] },
          { year: 2023, versions: ["EX", "EXL", "Touring"] },
          { year: 2022, versions: ["LX", "EX", "EXL"] },
        ],
      },
      {
        model: "HR-V",
        years: [
          { year: 2024, versions: ["EX", "EXL", "Advance", "Touring"] },
          { year: 2023, versions: ["EX", "EXL", "Advance", "Touring"] },
          { year: 2022, versions: ["EX", "EXL", "Touring"] },
        ],
      },
    ],
  },
  {
    brand: "Hyundai",
    models: [
      {
        model: "HB20",
        years: [
          { year: 2024, versions: ["Comfort", "Limited", "Platinum"] },
          { year: 2023, versions: ["Sense", "Comfort", "Platinum"] },
          { year: 2022, versions: ["Sense", "Vision", "Platinum"] },
        ],
      },
      {
        model: "Creta",
        years: [
          { year: 2024, versions: ["Comfort", "Limited", "Platinum", "N Line"] },
          { year: 2023, versions: ["Comfort", "Limited", "Platinum"] },
          { year: 2022, versions: ["Action", "Limited", "Platinum"] },
        ],
      },
    ],
  },
  {
    brand: "Toyota",
    models: [
      {
        model: "Corolla",
        years: [
          { year: 2024, versions: ["GLi", "XEi", "Altis Premium"] },
          { year: 2023, versions: ["GLi", "XEi", "Altis Hybrid"] },
          { year: 2022, versions: ["GLi", "XEi", "Altis"] },
        ],
      },
      {
        model: "Yaris",
        years: [
          { year: 2024, versions: ["XL", "XS", "XLS"] },
          { year: 2023, versions: ["XL", "XS", "XLS"] },
          { year: 2022, versions: ["XL Live", "XS", "X-Way"] },
        ],
      },
    ],
  },
  {
    brand: "Volkswagen",
    models: [
      {
        model: "Polo",
        years: [
          { year: 2024, versions: ["Track", "MPI", "TSI", "Highline"] },
          { year: 2023, versions: ["Track", "TSI", "Comfortline", "Highline"] },
          { year: 2022, versions: ["MPI", "TSI", "GTS"] },
        ],
      },
      {
        model: "T-Cross",
        years: [
          { year: 2024, versions: ["Sense", "200 TSI", "Comfortline", "Highline"] },
          { year: 2023, versions: ["Sense", "200 TSI", "Comfortline", "Highline"] },
          { year: 2022, versions: ["200 TSI", "Comfortline", "Highline"] },
        ],
      },
    ],
  },
];

const sortByLabel = (left: SelectOption, right: SelectOption) => left.label.localeCompare(right.label, "pt-BR");

const cloneCatalog = (catalog: VehicleBrandCatalog[]) =>
  catalog.map((brandEntry) => ({
    brand: brandEntry.brand,
    models: brandEntry.models.map((modelEntry) => ({
      model: modelEntry.model,
      years: modelEntry.years.map((yearEntry) => ({
        year: yearEntry.year,
        versions: [...yearEntry.versions],
      })),
    })),
  }));

export function ensureVehicleInCatalog(catalog: VehicleBrandCatalog[], vehicle?: Vehicle | null) {
  if (!vehicle) {
    return catalog;
  }

  const nextCatalog = cloneCatalog(catalog);
  let brandEntry = nextCatalog.find((entry) => entry.brand === vehicle.brand);

  if (!brandEntry) {
    brandEntry = { brand: vehicle.brand, models: [] };
    nextCatalog.push(brandEntry);
  }

  let modelEntry = brandEntry.models.find((entry) => entry.model === vehicle.model);
  if (!modelEntry) {
    modelEntry = { model: vehicle.model, years: [] };
    brandEntry.models.push(modelEntry);
  }

  let yearEntry = modelEntry.years.find((entry) => entry.year === vehicle.year);
  if (!yearEntry) {
    yearEntry = { year: vehicle.year, versions: [] };
    modelEntry.years.push(yearEntry);
  }

  if (vehicle.version && !yearEntry.versions.includes(vehicle.version)) {
    yearEntry.versions.push(vehicle.version);
  }

  nextCatalog.sort((left, right) => left.brand.localeCompare(right.brand, "pt-BR"));
  brandEntry.models.sort((left, right) => left.model.localeCompare(right.model, "pt-BR"));
  modelEntry.years.sort((left, right) => right.year - left.year);
  yearEntry.versions.sort((left, right) => left.localeCompare(right, "pt-BR"));

  return nextCatalog;
}

export function getBrandOptions(catalog: VehicleBrandCatalog[]): SelectOption[] {
  return catalog.map((entry) => ({ label: entry.brand, value: entry.brand })).sort(sortByLabel);
}

export function getModelOptions(catalog: VehicleBrandCatalog[], brand: string): SelectOption[] {
  const brandEntry = catalog.find((entry) => entry.brand === brand);
  if (!brandEntry) {
    return [];
  }

  return brandEntry.models.map((entry) => ({ label: entry.model, value: entry.model })).sort(sortByLabel);
}

export function getYearOptions(catalog: VehicleBrandCatalog[], brand: string, model: string): SelectOption[] {
  const brandEntry = catalog.find((entry) => entry.brand === brand);
  const modelEntry = brandEntry?.models.find((entry) => entry.model === model);
  if (!modelEntry) {
    return [];
  }

  return modelEntry.years
    .slice()
    .sort((left, right) => right.year - left.year)
    .map((entry) => ({ label: String(entry.year), value: String(entry.year) }));
}

export function getVersionOptions(catalog: VehicleBrandCatalog[], brand: string, model: string, year: string): SelectOption[] {
  const brandEntry = catalog.find((entry) => entry.brand === brand);
  const modelEntry = brandEntry?.models.find((entry) => entry.model === model);
  const yearEntry = modelEntry?.years.find((entry) => String(entry.year) === year);

  if (!yearEntry) {
    return [];
  }

  return yearEntry.versions.map((entry) => ({ label: entry, value: entry })).sort(sortByLabel);
}
