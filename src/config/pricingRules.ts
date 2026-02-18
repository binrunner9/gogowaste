import type { WasteCategoryCode } from "@/config/wasteCategories";

export type PricingRule = {
  wasteCategory: WasteCategoryCode;
  baseFeeGhs: number;
  perKmGhs: number;
  perKgGhs: number;
};

// MVP defaults — tune these for your business.
// Later, store in DB (pricing_rules) and manage via admin UI.
export const PRICING_RULES: PricingRule[] = [
  { wasteCategory: "general", baseFeeGhs: 30, perKmGhs: 6, perKgGhs: 0.6 },
  { wasteCategory: "recycling", baseFeeGhs: 25, perKmGhs: 5, perKgGhs: 0.4 },
  { wasteCategory: "bulk", baseFeeGhs: 50, perKmGhs: 8, perKgGhs: 1.0 },
  { wasteCategory: "yard", baseFeeGhs: 35, perKmGhs: 6.5, perKgGhs: 0.7 },
  { wasteCategory: "ewaste", baseFeeGhs: 40, perKmGhs: 7, perKgGhs: 0.9 },
];

export function getPricingRule(wasteCategory: WasteCategoryCode): PricingRule {
  const rule = PRICING_RULES.find((r) => r.wasteCategory === wasteCategory);
  if (!rule) throw new Error(`No pricing rule for category: ${wasteCategory}`);
  return rule;
}

export function timeOfOrderMultiplier(_when: Date): number {
  // TODO: Replace with your real peak/off-peak rules.
  // For now we keep it neutral.
  return 1;
}
