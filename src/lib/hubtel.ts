import { z } from "zod";

const HubtelEnvSchema = z.object({
  HUBTEL_API_BASE_URL: z.string().url(),
  HUBTEL_CLIENT_ID: z.string().min(1),
  HUBTEL_CLIENT_SECRET: z.string().min(1),
});

function hubtelEnv() {
  const parsed = HubtelEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(
      `Missing/invalid Hubtel env vars: ${parsed.error.issues
        .map((i) => i.path.join("."))
        .join(", ")}`,
    );
  }
  return parsed.data;
}

export type HubtelRequestMoneyPayload = {
  amount: number;
  title: string;
  description?: string;
  clientReference: string;
  callbackUrl: string;
  returnUrl: string;
  cancellationUrl: string;
};

export type HubtelRequestMoneyResponse = {
  // Different Hubtel products return slightly different response shapes.
  // Keep it loose for MVP.
  status?: string;
  message?: string;
  data?: unknown;
  paylinkUrl?: string;
  [k: string]: unknown;
};

function basicAuthHeader(clientId: string, clientSecret: string): string {
  const token = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  return `Basic ${token}`;
}

export async function hubtelRequestMoney(params: {
  mobileNumber: string;
  payload: HubtelRequestMoneyPayload;
}): Promise<HubtelRequestMoneyResponse> {
  const { HUBTEL_API_BASE_URL, HUBTEL_CLIENT_ID, HUBTEL_CLIENT_SECRET } =
    hubtelEnv();

  // NOTE: Hubtel has multiple APIs/products; keep the base URL configurable.
  // Expected endpoint shape (from Hubtel API docs): POST /request-money/{mobileNumber}
  const url = new URL(
    `/request-money/${encodeURIComponent(params.mobileNumber)}`,
    HUBTEL_API_BASE_URL,
  );

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Authorization: basicAuthHeader(HUBTEL_CLIENT_ID, HUBTEL_CLIENT_SECRET),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      amount: params.payload.amount,
      title: params.payload.title,
      description: params.payload.description,
      clientReference: params.payload.clientReference,
      callbackUrl: params.payload.callbackUrl,
      returnUrl: params.payload.returnUrl,
      cancellationUrl: params.payload.cancellationUrl,
    }),
    cache: "no-store",
  });

  const text = await res.text();
  let json: unknown;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }

  if (!res.ok) {
    throw new Error(`Hubtel request-money failed (${res.status}): ${text}`);
  }

  return json as HubtelRequestMoneyResponse;
}
