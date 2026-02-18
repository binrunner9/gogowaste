import type { WasteCategoryCode } from "@/config/wasteCategories";
import { getPricingRule, timeOfOrderMultiplier } from "@/config/pricingRules";
import { roundMoney } from "@/lib/money";

export type PayMode = "upfront" | "deposit";

export type QuoteInput = {
  wasteCategory: WasteCategoryCode;
  distanceKm: number;
  orderedAt: Date;
  // If undefined/null, customer is unsure and we charge a deposit now.
  weightKg?: number | null;
};

export type QuoteBreakdown = {
  currency: "GHS";
  wasteCategory: WasteCategoryCode;
  distanceKm: number;
  weightKg?: number;

  baseFee: number;
  distanceFee: number;
  weightFee: number;
  subtotal: number;

  multiplier: number;
  total: number;

  payMode: PayMode;
  depositDueNow: number;
  finalDueLater: number;
};

export function calculateQuote(input: QuoteInput): QuoteBreakdown {
  if (!Number.isFinite(input.distanceKm) || input.distanceKm < 0) {
    throw new Error("distanceKm must be a non-negative number");
  }

  const rule = getPricingRule(input.wasteCategory);
  const multiplier = timeOfOrderMultiplier(input.orderedAt);

  const baseFee = rule.baseFeeGhs;
  const distanceFee = rule.perKmGhs * input.distanceKm;

  const weightKg = input.weightKg ?? undefined;
  const weightFee = weightKg === undefined ? 0 : rule.perKgGhs * weightKg;

  const subtotal = baseFee + distanceFee + weightFee;
  const total = roundMoney(subtotal * multiplier);

  const payMode: PayMode = weightKg === undefined ? "deposit" : "upfront";

  const depositSubtotal = baseFee + distanceFee;
  const depositDueNow =
    payMode === "deposit" ? roundMoney(depositSubtotal * multiplier) : total;

  const finalDueLater = payMode === "deposit" ? 0 : 0;

  return {
    currency: "GHS",
    wasteCategory: input.wasteCategory,
    distanceKm: roundMoney(input.distanceKm),
    weightKg,

    baseFee: roundMoney(baseFee),
    distanceFee: roundMoney(distanceFee),
    weightFee: roundMoney(weightFee),
    subtotal: roundMoney(subtotal),

    multiplier: roundMoney(multiplier),
    total,

    payMode,
    depositDueNow,
    finalDueLater,
  };
}
