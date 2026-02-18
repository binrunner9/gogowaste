import { DISPOSAL_SITES } from "@/config/disposalSites";

export default function DisposalSitesAdminPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Admin · Disposal sites</h1>
          <a className="text-sm underline" href="/">
            Home
          </a>
        </header>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-zinc-600">
            MVP: disposal sites are configured in <code>src/config/disposalSites.ts</code>.
            The database schema includes a <code>disposal_sites</code> table so we can
            switch to DB-backed CRUD next.
          </p>

          <ul className="mt-6 grid gap-3">
            {DISPOSAL_SITES.map((s) => (
              <li key={s.id} className="rounded-xl border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium">
                      {s.name} {s.isDefault ? "(default)" : ""}
                    </div>
                    <div className="text-sm text-zinc-600">{s.serviceAreaId}</div>
                    <div className="text-xs text-zinc-500">
                      {s.location.lat}, {s.location.lng}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
