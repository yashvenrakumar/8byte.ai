const ONE_CRORE = 1_00_00_000

/**
 * Format amount in crores (Cr) when >= 1 Cr for compact, readable display.
 * e.g. 1,00,00,000 → "1 Cr", 10,50,00,000 → "10.5 Cr", 2,35,00,000 → "2.35 Cr"
 */
export function formatCurrencyCompact(value: number): string {
  const abs = Math.abs(value)
  if (abs >= ONE_CRORE) {
    const cr = value / ONE_CRORE
    const absCr = Math.abs(cr)
    const numStr =
      absCr % 1 === 0 ? absCr.toFixed(0) : String(parseFloat(absCr.toFixed(2)))
    const sign = value < 0 ? '−' : ''
    return `${sign}${numStr} Cr`
  }
  return formatCurrency(value)
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(value)
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`
}

export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0,
  }).format(value)
}

/** Display exchange: NSE or BSE from symbol (numeric = BSE). */
export function exchangeLabel(nseBse: string): string {
  return /^\d+$/.test(nseBse) ? 'BSE' : 'NSE'
}
