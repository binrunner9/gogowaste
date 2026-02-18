export type LatLng = { lat: number; lng: number };

export type DisposalSite = {
  id: string;
  serviceAreaId: string;
  name: string;
  address?: string;
  location: LatLng;
  isDefault?: boolean;
};

// Service distance = pickup -> disposal/transfer site.
// Day-1 configurability: start with config; later this should be stored in DB (disposal_sites table).
export const DISPOSAL_SITES: DisposalSite[] = [
  {
    id: "accra-default",
    serviceAreaId: "accra",
    name: "Default disposal site (configure me)",
    address: "Accra, Ghana",
    location: { lat: 5.6037, lng: -0.187 },
    isDefault: true,
  },
];

export function getDefaultDisposalSite(serviceAreaId: string): DisposalSite {
  const site = DISPOSAL_SITES.find(
    (s) => s.serviceAreaId === serviceAreaId && s.isDefault,
  );
  if (!site)
    throw new Error(
      `No default disposal site configured for service area: ${serviceAreaId}`,
    );
  return site;
}
