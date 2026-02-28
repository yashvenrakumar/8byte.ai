import { useEffect, useMemo, Fragment, memo, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchPortfolio, fetchSectors } from '@/store/slices/portfolioSlice'
import { useInterval } from '@/hooks/useInterval'
import { formatCurrency, formatCurrencyCompact, formatPercent, exchangeLabel } from '@/utils/format'
import type { Holding, SectorSummary } from '@/types/portfolio'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'

const REFRESH_MS = 15000
const REFRESH_SEC = REFRESH_MS / 1000

/** Gain/Loss % as in Excel: (Gain/Loss / Investment) × 100 */
function gainLossPercent(h: Holding): number {
  return h.investment ? (h.gainLoss / h.investment) * 100 : 0
}

type SortKey =
  | 'particulars'
  | 'purchasePrice'
  | 'quantity'
  | 'investment'
  | 'portfolioPercent'
  | 'nseBse'
  | 'cmp'
  | 'presentValue'
  | 'gainLoss'
  | 'gainLossPercent'
  | 'peRatio'
  | 'latestEarnings'
  | 'sector'

function compareHoldings(a: Holding, b: Holding, key: SortKey, dir: 'asc' | 'desc'): number {
  let cmp = 0
  switch (key) {
    case 'particulars':
    case 'nseBse':
    case 'latestEarnings':
      cmp = (a[key] ?? '').toString().localeCompare((b[key] ?? '').toString(), undefined, { sensitivity: 'base' })
      break
    case 'sector':
      cmp = a.sector.localeCompare(b.sector, undefined, { sensitivity: 'base' })
      break
    case 'quantity':
      cmp = a.quantity - b.quantity
      break
    case 'gainLossPercent':
      cmp = gainLossPercent(a) - gainLossPercent(b)
      break
    case 'peRatio': {
      const va = a.peRatio ?? -Infinity
      const vb = b.peRatio ?? -Infinity
      cmp = va - vb
      break
    }
    default:
      cmp = (a[key] as number) - (b[key] as number)
  }
  return dir === 'asc' ? cmp : -cmp
}

const SortableTh = memo(function SortableTh({
  label,
  sortKey,
  currentKey,
  currentDir,
  onSort,
  className = '',
  align = 'right',
}: {
  label: string
  sortKey: SortKey
  currentKey: SortKey | null
  currentDir: 'asc' | 'desc'
  onSort: (key: SortKey) => void
  className?: string
  align?: 'left' | 'right' | 'center'
}) {
  const isActive = currentKey === sortKey
  const alignClass = align === 'center' ? 'text-center' : align === 'left' ? 'text-left' : 'text-right'
  return (
    <th
      role="columnheader"
      aria-sort={isActive ? (currentDir === 'asc' ? 'ascending' : 'descending') : undefined}
      className={`cursor-pointer select-none px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 ${alignClass} ${className}`}
      onClick={() => onSort(sortKey)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {isActive && (
          <span className="text-gray-500 dark:text-gray-400" aria-hidden>
            {currentDir === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </span>
    </th>
  )
})

const HoldingsTable = memo(function HoldingsTable({ holdings }: { holdings: Holding[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const filteredAndSorted = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    let list = q ? holdings.filter((h) => h.particulars.toLowerCase().includes(q)) : [...holdings]
    if (sortKey) {
      list = [...list].sort((a, b) => compareHoldings(a, b, sortKey, sortDir))
    }
    return list
  }, [holdings, searchQuery, sortKey, sortDir])

  const bySector = useMemo(() => {
    const map = new Map<string, Holding[]>()
    for (const h of filteredAndSorted) {
      const list = map.get(h.sector) ?? []
      list.push(h)
      map.set(h.sector, list)
    }
    return map
  }, [filteredAndSorted])

  const sectorOrder = useMemo(() => Array.from(bySector.keys()), [bySector])

  const handleSort = useCallback((key: SortKey) => {
    setSortKey((prev) => {
      if (prev === key) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
        return key
      }
      setSortDir('asc')
      return key
    })
  }, [])

  const exportCsv = useCallback(() => {
    const escape = (v: string) => {
      const s = String(v ?? '')
      if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
      return s
    }
    const headers = [
      'Sector',
      'Particulars',
      'Purchase',
      'Qty',
      'Investment',
      'Portfolio %',
      'NSE/BSE',
      'CMP',
      'Present Value',
      'Gain/Loss',
      'Gain/Loss (%)',
      'P/E Ratio',
      'Latest Earnings',
    ]
    const rows = filteredAndSorted.map((h) => [
      h.sector,
      h.particulars,
      formatCurrency(h.purchasePrice),
      String(h.quantity),
      formatCurrency(h.investment),
      formatPercent(h.portfolioPercent),
      exchangeLabel(h.nseBse),
      formatCurrency(h.cmp),
      formatCurrency(h.presentValue),
      formatCurrency(h.gainLoss),
      formatPercent(gainLossPercent(h)),
      h.peRatio != null ? String(h.peRatio) : '',
      (h.latestEarnings ?? '').toString(),
    ])
    const csv = [headers.map(escape).join(','), ...rows.map((r) => r.map(escape).join(','))].join('\r\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `holdings-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [filteredAndSorted])

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="holdings-search" className="sr-only">
          Search stocks
        </label>
        <input
          id="holdings-search"
          type="search"
          placeholder="Search stock (e.g. by name)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="min-w-[200px] max-w-xs rounded-none border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 dark:focus:border-gray-400 dark:focus:ring-gray-400"
          aria-label="Search stocks by name"
        />
        {searchQuery && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredAndSorted.length} of {holdings.length} holdings
          </span>
        )}
        <button
          type="button"
          onClick={exportCsv}
          className="ml-auto rounded-none border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500 dark:focus:ring-gray-400"
        >
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto rounded-none border border-gray-200 dark:border-gray-700 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th
                role="columnheader"
                aria-sort={sortKey === 'particulars' ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
                className="sticky left-0 z-10 min-w-[220px] w-[220px] cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_6px_-2px_rgba(0,0,0,0.2)]"
                onClick={() => handleSort('particulars')}
              >
                <span className="inline-flex items-center gap-1">
                  Particulars
                  {sortKey === 'particulars' && (
                    <span className="text-gray-500 dark:text-gray-400" aria-hidden>
                      {sortDir === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </span>
              </th>
              <SortableTh label="Purchase" sortKey="purchasePrice" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
              <SortableTh label="Qty" sortKey="quantity" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
              <SortableTh label="Investment" sortKey="investment" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
              <SortableTh label="Portfolio %" sortKey="portfolioPercent" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} className="whitespace-nowrap" />
              <SortableTh label="NSE/BSE" sortKey="nseBse" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} align="center" className="whitespace-nowrap" />
              <SortableTh label="CMP" sortKey="cmp" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
              <SortableTh label="Present Value" sortKey="presentValue" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
              <SortableTh label="Gain/Loss" sortKey="gainLoss" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
              <SortableTh label="Gain/Loss (%)" sortKey="gainLossPercent" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} className="whitespace-nowrap" />
              <SortableTh label="P/E Ratio" sortKey="peRatio" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
              <SortableTh label="Latest Earnings" sortKey="latestEarnings" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} className="whitespace-nowrap" align="left" />
            </tr>
          </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
          {sectorOrder.map((sector) => (
            <Fragment key={sector}>
              <tr className="bg-gray-50 dark:bg-gray-800/80">
                <td className="sticky left-0 z-10 min-w-[220px] w-[220px] px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/80 border-r border-gray-200 dark:border-gray-700 shadow-[4px_0_6px_-2px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_6px_-2px_rgba(0,0,0,0.2)]">
                  {sector}
                </td>
                <td colSpan={11} />
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
                  <td
                    className={`px-4 py-2 text-sm text-right tabular-nums font-medium ${
                      h.gainLoss >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {formatPercent(gainLossPercent(h))}
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
    </div>
  )
})

const sectorCardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.3, ease: 'easeOut' as const },
  }),
}

const SECTOR_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899',
  '#06b6d4', '#84cc16',
]

const SectorAllocationChart = memo(function SectorAllocationChart({ sectors }: { sectors: SectorSummary[] }) {
  const data = useMemo(
    () =>
      sectors.map((s) => ({
        name: s.sector,
        value: s.totalPresentValue,
        investment: s.totalInvestment,
        gainLoss: s.gainLoss,
      })),
    [sectors]
  )
  if (data.length === 0) return null
  return (
    <div className="h-[280px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="70%"
            label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={SECTOR_COLORS[i % SECTOR_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => (typeof value === 'number' ? formatCurrencyCompact(value) : String(value ?? ''))}
            contentStyle={{ backgroundColor: 'var(--tooltip-bg, #fff)', border: '1px solid #e5e7eb', borderRadius: 4 }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
})

const SectorCards = memo(function SectorCards({ sectors }: { sectors: SectorSummary[] }) {
  return (
    <motion.div
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.06 } },
      }}
    >
      {sectors.map((s, i) => (
        <motion.div
          key={s.sector}
          custom={i}
          variants={sectorCardVariants}
          whileHover={{
            y: -4,
            boxShadow: '0 12px 24px -8px rgba(0,0,0,0.12), 0 4px 8px -4px rgba(0,0,0,0.08)',
            transition: { duration: 0.2, ease: 'easeOut' },
          }}
          whileTap={{ scale: 0.99 }}
          className="rounded-none border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 shadow-sm cursor-default"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{s.sector}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 tabular-nums">
            Investment: {formatCurrencyCompact(s.totalInvestment)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 tabular-nums">
            Present: {formatCurrencyCompact(s.totalPresentValue)}
          </p>
          <p
            className={`text-sm font-medium mt-1 tabular-nums ${
              s.gainLoss >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}
          >
            Gain/Loss: {formatCurrencyCompact(s.gainLoss)}
            {typeof s.gainLossPercent === 'number' && (
              <span className="ml-1">({formatPercent(s.gainLossPercent)})</span>
            )}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {s.holdingsCount} holding{s.holdingsCount !== 1 ? 's' : ''}
          </p>
        </motion.div>
      ))}
    </motion.div>
  )
})

export function DashboardPage() {
  const dispatch = useAppDispatch()
  const { holdings, sectors, loading, error } = useAppSelector((s) => s.portfolio)
  const nextRefreshAtRef = useRef(Date.now() + REFRESH_MS)
  const [secondsLeft, setSecondsLeft] = useState(REFRESH_SEC)

  const load = useCallback(() => {
    nextRefreshAtRef.current = Date.now() + REFRESH_MS
    void dispatch(fetchPortfolio())
    void dispatch(fetchSectors())
  }, [dispatch])

  useEffect(() => {
    load()
  }, [load])

  useInterval(load, REFRESH_MS)

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft(Math.max(0, Math.ceil((nextRefreshAtRef.current - Date.now()) / 1000)))
    }, 1000)
    return () => clearInterval(id)
  }, [])

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
        <p className="text-sm text-gray-500 dark:text-gray-400 tabular-nums">
          {secondsLeft > 0 ? (
            <>
              CMP & values refresh in <span className="font-medium text-gray-700 dark:text-gray-300">{secondsLeft}s</span>
            </>
          ) : (
            <span className="font-medium text-gray-700 dark:text-gray-300">Refreshing…</span>
          )}
        </p>
      </div>

      <p className="text-xs text-amber-700 dark:text-amber-200 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-3 py-2 rounded-none" role="note">
        <strong>Data disclaimer:</strong> CMP, P/E and latest earnings are from unofficial sources (e.g. Yahoo Finance) and may vary in accuracy or delay. This dashboard is not for trading or investment decisions. Verify figures from official sources.
      </p>

      {sectors.length > 0 && (
        <>
          <section>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Sector Summary
            </h3>
            <div className="grid gap-6 lg:grid-cols-[1fr,1.2fr]">
              <div className="rounded-none border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Allocation by present value</h4>
                <SectorAllocationChart sectors={sectors} />
              </div>
              <div>
                <SectorCards sectors={sectors} />
              </div>
            </div>
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
