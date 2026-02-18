export const CURRENCY = "GHS" as const;

export function formatMoney(amount: number, currency: string = CURRENCY): string {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function roundMoney(amount: number): number {
  // Keep it simple for MVP.
  return Math.round(amount * 100) / 100;
}
