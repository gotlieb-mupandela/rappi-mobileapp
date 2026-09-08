/** Format a retail unit price as whole Namibian dollars (matches web storefront). */
export function formatPrice(value: number): string {
  const n = new Intl.NumberFormat('en-NA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(Number(value) || 0));
  return `N$${n}`;
}

export function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
      hour12: false,
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
