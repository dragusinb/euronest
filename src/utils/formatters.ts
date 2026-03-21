const eurFormatter = new Intl.NumberFormat('en-EU', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const eurDetailFormatter = new Intl.NumberFormat('en-EU', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 2,
});

export function formatPrice(amount: number): string {
  return eurFormatter.format(amount);
}

export function formatPriceDetailed(amount: number): string {
  return eurDetailFormatter.format(amount);
}

export function formatYield(pct: number): string {
  return `${pct.toFixed(1)}%`;
}

export function formatArea(sqm: number): string {
  return `${sqm} m\u00B2`;
}

export function yieldClass(grossYield: number): string {
  if (grossYield >= 6) return 'yield-high';
  if (grossYield >= 4) return 'yield-medium';
  return 'yield-low';
}

export function yieldColor(grossYield: number): string {
  if (grossYield >= 6) return '#059669';
  if (grossYield >= 4) return '#d97706';
  return '#dc2626';
}

export function severityColor(severity?: string): string {
  switch (severity) {
    case 'favorable': return 'text-green-700 bg-green-50 border-green-200';
    case 'restrictive': return 'text-red-700 bg-red-50 border-red-200';
    default: return 'text-amber-700 bg-amber-50 border-amber-200';
  }
}

export function severityLabel(severity?: string): string {
  switch (severity) {
    case 'favorable': return 'Favorable';
    case 'restrictive': return 'Restrictive';
    default: return 'Neutral';
  }
}

export function demandColor(level: string): string {
  switch (level) {
    case 'very-high': return 'bg-green-100 text-green-800';
    case 'high': return 'bg-blue-100 text-blue-800';
    case 'medium': return 'bg-amber-100 text-amber-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}
