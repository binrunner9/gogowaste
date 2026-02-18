"use client";

import { useMemo, useState } from "react";

import { SERVICE_AREAS } from "@/config/serviceAreas";
import { WASTE_CATEGORIES } from "@/config/wasteCategories";
import { formatMoney } from "@/lib/money";

type QuoteResponse = {
  quote: {
    currency: "GHS";
    wasteCategory: string;
    distanceKm: number;
    weightKg?: number;
    baseFee: number;
    distanceFee: number;
    weightFee: number;
    subtotal: number;
    multiplier: number;
    total: number;
    payMode: "upfront" | "deposit";
    depositDueNow: number;
    finalDueLater: number;
  };
  disposalSite: { id: string; name: string; serviceAreaId: string };
  distance: { method: string; km: number };
};

export default function RequestPage() {
  const [serviceAreaId, setServiceAreaId] = useState("accra");
  const [wasteCategory, setWasteCategory] = useState("general");

  // MVP: user can type lat/lng directly (you'll replace with map pin + geocoding).
  const [lat, setLat] = useState("5.6037");
  const [lng, setLng] = useState("-0.1870");

  const [weightKnown, setWeightKnown] = useState(false);
  const [weightKg, setWeightKg] = useState("");

  const [quoteResp, setQuoteResp] = useState<QuoteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canQuote = useMemo(() => {
    const latNum = Number(lat);
    const lngNum = Number(lng);
    if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) return false;
    if (!serviceAreaId || !wasteCategory) return false;
    if (weightKnown) {
      const w = Number(weightKg);
      if (!Number.isFinite(w) || w <= 0) return false;
    }
    return true;
  }, [lat, lng, serviceAreaId, wasteCategory, weightKnown, weightKg]);

  async function onGetQuote() {
    setLoading(true);
    setError(null);
    setQuoteResp(null);

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceAreaId,
          pickup: { lat: Number(lat), lng: Number(lng) },
          wasteCategory,
          weightKg: weightKnown ? Number(weightKg) : null,
          orderedAt: new Date().toISOString(),
        }),
      });

      const json = (await res.json()) as QuoteResponse | { error: string };
      if (!res.ok) {
        throw new Error("error" in json ? json.error : "Failed to quote");
      }

      setQuoteResp(json as QuoteResponse);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">BinrunnerGO</h1>
          <a className="text-sm underline" href="/">
            Home
          </a>
        </header>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Request a pickup</h2>
          <p className="mt-1 text-sm text-zinc-600">
            MVP quoting uses straight-line distance to the configured disposal site.
            Replace with map routing later.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-sm font-medium">Service area</span>
              <select
                className="h-10 rounded-md border px-3"
                value={serviceAreaId}
                onChange={(e) => setServiceAreaId(e.target.value)}
              >
                {SERVICE_AREAS.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-medium">Waste category</span>
              <select
                className="h-10 rounded-md border px-3"
                value={wasteCategory}
                onChange={(e) => setWasteCategory(e.target.value)}
              >
                {WASTE_CATEGORIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-medium">Pickup latitude</span>
              <input
                className="h-10 rounded-md border px-3"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                inputMode="decimal"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-medium">Pickup longitude</span>
              <input
                className="h-10 rounded-md border px-3"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                inputMode="decimal"
              />
            </label>
          </div>

          <div className="mt-6 rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Do you know the weight?</div>
                <div className="text-xs text-zinc-600">
                  If not, you pay a deposit now and adjust after collection.
                </div>
              </div>
              <input
                type="checkbox"
                checked={weightKnown}
                onChange={(e) => setWeightKnown(e.target.checked)}
              />
            </div>

            {weightKnown ? (
              <div className="mt-4 grid gap-1">
                <span className="text-sm font-medium">Estimated weight (kg)</span>
                <input
                  className="h-10 rounded-md border px-3"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  inputMode="decimal"
                  placeholder="e.g. 25"
                />
              </div>
            ) : null}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              className="h-10 rounded-md bg-black px-4 text-white disabled:opacity-40"
              disabled={!canQuote || loading}
              onClick={onGetQuote}
            >
              {loading ? "Quoting…" : "Get quote"}
            </button>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
          </div>

          {quoteResp ? (
            <div className="mt-6 rounded-xl bg-zinc-50 p-4">
              <div className="text-sm text-zinc-700">
                Disposal site: <b>{quoteResp.disposalSite.name}</b>
              </div>

              <div className="mt-4 grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Base fee</span>
                  <span>{formatMoney(quoteResp.quote.baseFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Distance fee</span>
                  <span>{formatMoney(quoteResp.quote.distanceFee)}</span>
                </div>
                {quoteResp.quote.weightKg ? (
                  <div className="flex justify-between">
                    <span>Weight fee</span>
                    <span>{formatMoney(quoteResp.quote.weightFee)}</span>
                  </div>
                ) : (
                  <div className="text-xs text-zinc-600">
                    Weight unknown: final amount will be adjusted after collection.
                  </div>
                )}
                <div className="mt-2 flex justify-between text-base font-semibold">
                  <span>Due now</span>
                  <span>{formatMoney(quoteResp.quote.depositDueNow)}</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-600">
                  <span>Pricing distance</span>
                  <span>
                    {quoteResp.distance.km} km ({quoteResp.distance.method})
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-6 text-sm text-zinc-600">
          Next steps: connect this flow to your database + Hubtel checkout.
        </div>
      </div>
    </div>
  );
}
