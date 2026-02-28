/** OpenAPI 3.0 document for Swagger UI */
export const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Portfolio Dashboard API',
    description: 'API for portfolio holdings and sector summaries. Used by the React dashboard.',
    version: '1.0.0',
    contact: {
      name: 'API Support',
    },
  },
  servers: [
    {
      url: 'http://localhost:5001',
      description: 'Development server',
    },
  ],
  tags: [
    { name: 'Portfolio', description: 'Holdings and sector data' },
    { name: 'Health', description: 'Service health' },
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        description: 'Returns service health status and timestamp.',
        responses: {
          '200': {
            description: 'Service is healthy',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HealthResponse' },
                example: {
                  status: 'ok',
                  timestamp: '2025-02-28T10:00:00.000Z',
                },
              },
            },
          },
        },
      },
    },
    '/api/portfolio': {
      get: {
        tags: ['Portfolio'],
        summary: 'Get portfolio holdings',
        description: 'Returns all portfolio holdings with CMP, present value, gain/loss, P/E ratio, and latest earnings.',
        parameters: [
          {
            name: 'sector',
            in: 'query',
            required: false,
            description: 'Filter by sector (e.g. Technology, Energy)',
            schema: { type: 'string', example: 'Technology' },
          },
        ],
        responses: {
          '200': {
            description: 'List of holdings',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PortfolioResponse' },
                example: {
                  success: true,
                  data: {
                    holdings: [
                      {
                        id: '1',
                        particulars: 'Reliance Industries',
                        purchasePrice: 2400,
                        quantity: 10,
                        investment: 24000,
                        portfolioPercent: 15,
                        nseBse: 'NSE',
                        cmp: 2450,
                        presentValue: 24500,
                        gainLoss: 500,
                        peRatio: 22.5,
                        latestEarnings: 'Q3 FY25',
                        sector: 'Energy',
                      },
                      {
                        id: '2',
                        particulars: 'TCS',
                        purchasePrice: 3500,
                        quantity: 5,
                        investment: 17500,
                        portfolioPercent: 11,
                        nseBse: 'NSE',
                        cmp: 3620,
                        presentValue: 18100,
                        gainLoss: 600,
                        peRatio: 28.0,
                        latestEarnings: 'Q3 FY25',
                        sector: 'Technology',
                      },
                    ],
                  },
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  message: 'Internal server error',
                },
              },
            },
          },
        },
      },
    },
    '/api/portfolio/sectors': {
      get: {
        tags: ['Portfolio'],
        summary: 'Get sector summary',
        description: 'Returns sector-wise totals: total investment, present value, and gain/loss.',
        responses: {
          '200': {
            description: 'Sector summaries',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SectorsResponse' },
                example: {
                  success: true,
                  data: {
                    sectors: [
                      {
                        sector: 'Energy',
                        totalInvestment: 24000,
                        totalPresentValue: 24500,
                        gainLoss: 500,
                        holdingsCount: 1,
                      },
                      {
                        sector: 'Technology',
                        totalInvestment: 17500,
                        totalPresentValue: 18100,
                        gainLoss: 600,
                        holdingsCount: 1,
                      },
                    ],
                  },
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  message: 'Internal server error',
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      HealthResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'ok' },
          timestamp: { type: 'string', format: 'date-time', example: '2025-02-28T10:00:00.000Z' },
        },
      },
      Holding: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '1' },
          particulars: { type: 'string', example: 'Reliance Industries' },
          purchasePrice: { type: 'number', example: 2400 },
          quantity: { type: 'number', example: 10 },
          investment: { type: 'number', example: 24000 },
          portfolioPercent: { type: 'number', example: 15 },
          nseBse: { type: 'string', example: 'NSE' },
          cmp: { type: 'number', example: 2450 },
          presentValue: { type: 'number', example: 24500 },
          gainLoss: { type: 'number', example: 500 },
          peRatio: { type: 'number', nullable: true, example: 22.5 },
          latestEarnings: { type: 'string', nullable: true, example: 'Q3 FY25' },
          sector: { type: 'string', example: 'Energy' },
        },
      },
      SectorSummary: {
        type: 'object',
        properties: {
          sector: { type: 'string', example: 'Technology' },
          totalInvestment: { type: 'number', example: 17500 },
          totalPresentValue: { type: 'number', example: 18100 },
          gainLoss: { type: 'number', example: 600 },
          gainLossPercent: { type: 'number', example: 3.43 },
          holdingsCount: { type: 'number', example: 1 },
        },
      },
      PortfolioResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            properties: {
              holdings: {
                type: 'array',
                items: { $ref: '#/components/schemas/Holding' },
              },
            },
          },
        },
      },
      SectorsResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'object',
            properties: {
              sectors: {
                type: 'array',
                items: { $ref: '#/components/schemas/SectorSummary' },
              },
            },
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Error message' },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string' },
                message: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
};
