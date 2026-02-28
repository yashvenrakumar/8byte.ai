export interface Holding {
  id: string
  particulars: string
  purchasePrice: number
  quantity: number
  investment: number
  portfolioPercent: number
  nseBse: string
  cmp: number
  presentValue: number
  gainLoss: number
  peRatio: number | null
  latestEarnings: string | null
  sector: string
}

export interface SectorSummary {
  sector: string
  totalInvestment: number
  totalPresentValue: number
  gainLoss: number
  holdingsCount: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: Array<{ field?: string; message: string }>
}
