import { apiClient } from './client'
import type { ApiResponse, Holding, SectorSummary } from '@/types/portfolio'

export const portfolioApi = {
  getHoldings: () =>
    apiClient<ApiResponse<{ holdings: Holding[] }>>('/portfolio'),

  getSectors: () =>
    apiClient<ApiResponse<{ sectors: SectorSummary[] }>>('/portfolio/sectors'),
}
