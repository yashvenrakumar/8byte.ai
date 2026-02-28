import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { portfolioApi } from '@/services/api/portfolio.api'
import type { Holding, SectorSummary } from '@/types/portfolio'

interface PortfolioState {
  holdings: Holding[]
  sectors: SectorSummary[]
  loading: boolean
  error: string | null
}

const initialState: PortfolioState = {
  holdings: [],
  sectors: [],
  loading: false,
  error: null,
}

export const fetchPortfolio = createAsyncThunk(
  'portfolio/fetchPortfolio',
  async (_, { rejectWithValue }) => {
    try {
      const res = await portfolioApi.getHoldings()
      if (!res.success || !res.data) throw new Error(res.message ?? 'Failed to fetch')
      return res.data.holdings
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : 'Unknown error')
    }
  }
)

export const fetchSectors = createAsyncThunk(
  'portfolio/fetchSectors',
  async (_, { rejectWithValue }) => {
    try {
      const res = await portfolioApi.getSectors()
      if (!res.success || !res.data) throw new Error(res.message ?? 'Failed to fetch')
      return res.data.sectors
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : 'Unknown error')
    }
  }
)

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolio.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.holdings = action.payload
        state.loading = false
        state.error = null
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchSectors.pending, (state) => {
        state.error = null
      })
      .addCase(fetchSectors.fulfilled, (state, action) => {
        state.sectors = action.payload
      })
      .addCase(fetchSectors.rejected, (state, action) => {
        state.error = action.payload as string
      })
  },
})

export const { clearError } = portfolioSlice.actions
export default portfolioSlice.reducer
