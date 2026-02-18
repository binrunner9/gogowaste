export type WasteCategoryCode =
  | "general"
  | "recycling"
  | "bulk"
  | "yard"
  | "ewaste";

export type WasteCategory = {
  code: WasteCategoryCode;
  label: string;
};

export const WASTE_CATEGORIES: WasteCategory[] = [
  { code: "general", label: "General trash" },
  { code: "recycling", label: "Recycling" },
  { code: "bulk", label: "Bulk items" },
  { code: "yard", label: "Yard waste" },
  { code: "ewaste", label: "E-waste" },
];
