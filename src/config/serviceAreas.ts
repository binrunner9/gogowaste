export type ServiceArea = {
  id: string;
  name: string;
  countryCode: string;
  timezone: string;
};

// Day-1 configurability: this starts as code-config, and can later be replaced with DB-backed admin CRUD.
export const SERVICE_AREAS: ServiceArea[] = [
  {
    id: "accra",
    name: "Accra",
    countryCode: "GH",
    timezone: "Africa/Accra",
  },
  // Kumasi.
];

export function getServiceArea(id: string): ServiceArea {
  const area = SERVICE_AREAS.find((a) => a.id === id);
  if (!area) throw new Error(`Unknown service area: ${id}`);
  return area;
}
