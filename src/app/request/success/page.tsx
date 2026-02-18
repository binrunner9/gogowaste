export default async function SuccessPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-xl px-6 py-14">
        <h1 className="text-2xl font-semibold">Payment successful</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Thanks — your booking is being processed.
        </p>
        <a className="mt-6 inline-block text-sm underline" href="/request">
          Back to request
        </a>
      </div>
    </div>
  );
}
