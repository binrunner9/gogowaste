import { NextResponse } from "next/server";
import { z } from "zod";

import { getDefaultDisposalSite } from "@/config/disposalSites";
import type { WasteCategoryCode } from "@/config/wasteCategories";
import { calculateQuote } from "@/lib/pricing";
import { haversineKm } from "@/lib/haversine";

const QuoteRequestSchema = z.object({
  serviceAreaId: z.string().min(1),
  pickup: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  wasteCategory: z.custom<WasteCategoryCode>(),
  orderedAt: z.string().datetime().optional(),
  weightKg: z.number().positive().optional().nullable(),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = QuoteRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { serviceAreaId, pickup, wasteCategory, orderedAt, weightKg } =
    parsed.data;

  const disposalSite = getDefaultDisposalSite(serviceAreaId);
  const distanceKm = haversineKm(pickup, disposalSite.location);

  const quote = calculateQuote({
    wasteCategory,
    distanceKm,
    orderedAt: orderedAt ? new Date(orderedAt) : new Date(),
    weightKg,
  });

  return NextResponse.json({
    quote,
    distance: {
      method: "haversine_km",
      km: quote.distanceKm,
      from: pickup,
      to: disposalSite.location,
    },
    disposalSite: {
      id: disposalSite.id,
      name: disposalSite.name,
      serviceAreaId: disposalSite.serviceAreaId,
    },
  });
}
