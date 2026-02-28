import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchPortfolio, fetchSectors } from '@/store/slices/portfolioSlice'

export function DashboardPage() {
  const dispatch = useAppDispatch()
  const { holdings, sectors, loading, error } = useAppSelector((s) => s.portfolio)

  useEffect(() => {
    void dispatch(fetchPortfolio())
    void dispatch(fetchSectors())
  }, [dispatch])

  if (loading && holdings.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Loading portfolio...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-red-700 dark:text-red-300">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Holdings
      </h2>
      {holdings.length === 0 ? (
        <p className="text-gray-500">No holdings yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  Particulars
                </th>
                <th className="px-4 py-2 text-right text-sm font-medium">Purchase</th>
                <th className="px-4 py-2 text-right text-sm font-medium">Qty</th>
                <th className="px-4 py-2 text-right text-sm font-medium">CMP</th>
                <th className="px-4 py-2 text-right text-sm font-medium">Present Value</th>
                <th className="px-4 py-2 text-right text-sm font-medium">Gain/Loss</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
              {holdings.map((h) => (
                <tr key={h.id}>
                  <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                    {h.particulars}
                  </td>
                  <td className="px-4 py-2 text-sm text-right">{h.purchasePrice}</td>
                  <td className="px-4 py-2 text-sm text-right">{h.quantity}</td>
                  <td className="px-4 py-2 text-sm text-right">{h.cmp}</td>
                  <td className="px-4 py-2 text-sm text-right">{h.presentValue}</td>
                  <td
                    className={`px-4 py-2 text-sm text-right font-medium ${
                      h.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {h.gainLoss}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {sectors.length > 0 && (
        <>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Sector Summary
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sectors.map((s) => (
              <div
                key={s.sector}
                className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800"
              >
                <h3 className="font-medium text-gray-900 dark:text-white">{s.sector}</h3>
                <p className="text-sm text-gray-500">Investment: {s.totalInvestment}</p>
                <p className="text-sm text-gray-500">Present: {s.totalPresentValue}</p>
                <p
                  className={`text-sm font-medium ${
                    s.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  Gain/Loss: {s.gainLoss}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
