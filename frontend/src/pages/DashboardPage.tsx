import { useEffect, useMemo, Fragment, memo } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchPortfolio, fetchSectors } from '@/store/slices/portfolioSlice'
import { useInterval } from '@/hooks/useInterval'
import { formatCurrency, formatPercent, exchangeLabel } from '@/utils/format'
import type { Holding, SectorSummary } from '@/types/portfolio'

const REFRESH_MS = 15000

const HoldingsTable = memo(function HoldingsTable({ holdings }: { holdings: Holding[] }) {
  const bySector = useMemo(() => {
    const map = new Map<string, Holding[]>()
    for (const h of holdings) {
      const list = map.get(h.sector) ?? []
      list.push(h)
      map.set(h.sector, list)
    }
    return map
  }, [holdings])

  const sectorOrder = useMemo(() => Array.from(bySector.keys()), [bySector])

  return (
    <div className="overflow-x-auto rounded-none border border-gray-200 dark:border-gray-700 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="sticky left-0 z-10 min-w-[220px] w-[220px] px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_6px_-2px_rgba(0,0,0,0.2)]">
              Particulars
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Purchase
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Qty
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Investment
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Portfolio %
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              NSE/BSE
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              CMP
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Present Value
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Gain/Loss
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              P/E Ratio
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Latest Earnings
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
          {sectorOrder.map((sector) => (
            <Fragment key={sector}>
              <tr className="bg-gray-50 dark:bg-gray-800/80">
                <td className="sticky left-0 z-10 min-w-[220px] w-[220px] px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/80 border-r border-gray-200 dark:border-gray-700 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_6px_-2px_rgba(0,0,0,0.2)]">
                  {sector}
                </td>
                <td colSpan={10} />
              </tr>
              {(bySector.get(sector) ?? []).map((h) => (
                <tr key={h.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
                  <td className="sticky left-0 z-10 min-w-[220px] w-[220px] px-4 py-2 text-sm font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_6px_-2px_rgba(0,0,0,0.2)] hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
                    {h.particulars}
                  </td>
                  <td className="px-4 py-2 text-sm text-right tabular-nums text-gray-700 dark:text-gray-300">
                    {formatCurrency(h.purchasePrice)}
                  </td>
                  <td className="px-4 py-2 text-sm text-right tabular-nums text-gray-700 dark:text-gray-300">
                    {h.quantity}
                  </td>
                  <td className="px-4 py-2 text-sm text-right tabular-nums text-gray-700 dark:text-gray-300">
                    {formatCurrency(h.investment)}
                  </td>
                  <td className="px-4 py-2 text-sm text-right tabular-nums text-gray-700 dark:text-gray-300">
                    {formatPercent(h.portfolioPercent)}
                  </td>
                  <td className="px-4 py-2 text-sm text-center text-gray-600 dark:text-gray-400">
                    {exchangeLabel(h.nseBse)}
                  </td>
                  <td className="px-4 py-2 text-sm text-right tabular-nums text-gray-700 dark:text-gray-300">
                    {formatCurrency(h.cmp)}
                  </td>
                  <td className="px-4 py-2 text-sm text-right tabular-nums text-gray-700 dark:text-gray-300">
                    {formatCurrency(h.presentValue)}
                  </td>
                  <td
                    className={`px-4 py-2 text-sm text-right tabular-nums font-medium ${
                      h.gainLoss >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {formatCurrency(h.gainLoss)}
                  </td>
                  <td className="px-4 py-2 text-sm text-right tabular-nums text-gray-700 dark:text-gray-300">
                    {h.peRatio != null ? String(h.peRatio) : '—'}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                    {h.latestEarnings ?? '—'}
                  </td>
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
})

const SectorCards = memo(function SectorCards({ sectors }: { sectors: SectorSummary[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sectors.map((s) => (
        <div
          key={s.sector}
          className="rounded-none border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 shadow-sm"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{s.sector}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Investment: {formatCurrency(s.totalInvestment)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Present: {formatCurrency(s.totalPresentValue)}
          </p>
          <p
            className={`text-sm font-medium mt-1 ${
              s.gainLoss >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}
          >
            Gain/Loss: {formatCurrency(s.gainLoss)}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {s.holdingsCount} holding{s.holdingsCount !== 1 ? 's' : ''}
          </p>
        </div>
      ))}
    </div>
  )
})

export function DashboardPage() {
  const dispatch = useAppDispatch()
  const { holdings, sectors, loading, error } = useAppSelector((s) => s.portfolio)

  const load = () => {
    void dispatch(fetchPortfolio())
    void dispatch(fetchSectors())
  }

  useEffect(() => {
    load()
  }, [dispatch])

  useInterval(load, REFRESH_MS)

  if (loading && holdings.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-none border-2 border-gray-300 border-t-gray-600 dark:border-gray-600 dark:border-t-gray-300" />
          <p className="mt-2 text-gray-500 dark:text-gray-400">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-none bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-red-700 dark:text-red-300">
        <p className="font-medium">Error loading portfolio</p>
        <p className="text-sm mt-1">{error}</p>
        <button
          type="button"
          onClick={() => load()}
          className="mt-3 px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900/40 rounded-none hover:bg-red-200 dark:hover:bg-red-900/60"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Portfolio Dashboard
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          CMP & values refresh every 15s
        </p>
      </div>

      {sectors.length > 0 && (
        <>
          <section>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Sector Summary
            </h3>
            <SectorCards sectors={sectors} />
          </section>
        </>
      )}

      <section>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
          Holdings by Sector
        </h3>
        {holdings.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No holdings yet.</p>
        ) : (
          <HoldingsTable holdings={holdings} />
        )}
      </section>
    </div>
  )
}
