import { NextResponse } from "next/server";
import { z } from "zod";

import { hubtelRequestMoney } from "@/lib/hubtel";

const Schema = z.object({
  mobileNumber: z.string().min(8),
  amount: z.number().positive(),
  title: z.string().min(1).default("BinrunnerGO pickup"),
  description: z.string().optional(),
  clientReference: z.string().min(1).optional(),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = Schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { mobileNumber, amount, title, description, clientReference } =
    parsed.data;

  const origin = new URL(req.url).origin;
  const reference = clientReference ?? crypto.randomUUID();

  const result = await hubtelRequestMoney({
    mobileNumber,
    payload: {
      amount,
      title,
      description,
      clientReference: reference,
      callbackUrl: `${origin}/api/payments/hubtel/webhook`,
      returnUrl: `${origin}/request/success?ref=${encodeURIComponent(reference)}`,
      cancellationUrl: `${origin}/request/canceled?ref=${encodeURIComponent(reference)}`,
    },
  });

  return NextResponse.json({ reference, result });
}
