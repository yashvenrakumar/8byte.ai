export interface GetPortfolioQuery {
  sector?: string;
  refresh?: string;
}

export function validateGetPortfolioQuery(query: Record<string, unknown>): GetPortfolioQuery {
  return {
    sector: typeof query.sector === 'string' ? query.sector : undefined,
    refresh: typeof query.refresh === 'string' ? query.refresh : undefined,
  };
}
