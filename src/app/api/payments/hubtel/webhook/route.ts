import { NextResponse } from "next/server";

// TODO:
// - Verify Hubtel signature / authenticity (per the specific Hubtel product you use)
// - Look up payment status using Hubtel APIs if needed
// - Persist event + update payment + pickup_request state

export async function POST(req: Request) {
  const body = await req.text();
  // eslint-disable-next-line no-console
  console.log("Hubtel webhook received:", body);

  return NextResponse.json({ ok: true });
}
