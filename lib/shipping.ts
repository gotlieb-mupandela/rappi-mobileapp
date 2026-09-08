export type ShippingMethod = {
  id: string;
  name: string;
  detail: string;
  cost: number;
};

/** Source of truth for storefront shipping rates (NAD) — mirrors rappi-webapp. */
export const SHIPPING_METHODS: ShippingMethod[] = [
  { id: 'standard', name: 'Standard', detail: '5–8 days', cost: 100 },
  { id: 'express', name: 'Express', detail: '2–3 days', cost: 150 },
  { id: 'pickup', name: 'Hub pickup', detail: 'Collect free at a Rappi hub', cost: 0 },
];

export function shippingCostById(id: string): number {
  return SHIPPING_METHODS.find((m) => m.id === id)?.cost ?? 0;
}

export function shippingLabelById(id: string): string {
  const m = SHIPPING_METHODS.find((x) => x.id === id);
  return m ? `${m.name} (${m.detail})` : id;
}
