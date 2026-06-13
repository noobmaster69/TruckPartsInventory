// Money is stored as integer CENTS everywhere; format/parse at the UI edge only.
export function formatMoney(cents: number): string {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

export function parseMoney(dollars: string): number {
  const n = parseFloat(dollars)
  return Number.isFinite(n) ? Math.round(n * 100) : 0
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
}
