'use client'

import { useState, useMemo } from 'react'
import { useRequireAuth } from '@/lib/admin/auth'
import type { RevenueData } from '@/lib/admin/types'
import { revenueData as mockRevenueData, getRevenueByPeriod } from '@/lib/admin/data'
import BarChart from '@/components/admin/BarChart'
import DataTable from '@/components/admin/DataTable'
import Modal from '@/components/admin/Modal'

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly'

function formatCurrency(n: number): string {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
}

export default function AdminRevenuePage() {
  useRequireAuth()

  const [periodFilter, setPeriodFilter] = useState<Period>('daily')
  const [showModal, setShowModal] = useState(false)

  const totalGross = useMemo(() => mockRevenueData.reduce((sum, r) => sum + r.gross, 0), [])
  const totalNet = useMemo(() => mockRevenueData.reduce((sum, r) => sum + r.net, 0), [])
  const totalTax = useMemo(() => mockRevenueData.reduce((sum, r) => sum + r.tax, 0), [])
  const totalDiscounts = useMemo(() => mockRevenueData.reduce((sum, r) => sum + r.discounts, 0), [])

  const avgDailyRevenue = useMemo(() => totalGross / mockRevenueData.length, [totalGross])

  const bestDay = useMemo(() => {
    let best = mockRevenueData[0]
    for (const r of mockRevenueData) {
      if (r.gross > best.gross) best = r
    }
    return best
  }, [])

  const totalTransactions = mockRevenueData.length
  const avgTaxPerTransaction = totalTax / totalTransactions

  const chartData = useMemo(() => getRevenueByPeriod(periodFilter), [periodFilter])

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl md:text-3xl text-mist">Revenue Reports</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="section-panel rounded-2xl p-5">
          <p className="text-mist/50 text-xs uppercase tracking-wider font-body mb-1">Gross Revenue</p>
          <p className="font-display text-2xl text-amber">{formatCurrency(totalGross)}</p>
        </div>
        <div className="section-panel rounded-2xl p-5">
          <p className="text-mist/50 text-xs uppercase tracking-wider font-body mb-1">Net Revenue</p>
          <p className="font-display text-2xl text-amber">{formatCurrency(totalNet)}</p>
        </div>
        <div className="section-panel rounded-2xl p-5">
          <p className="text-mist/50 text-xs uppercase tracking-wider font-body mb-1">Total Tax</p>
          <p className="font-display text-2xl text-amber">{formatCurrency(totalTax)}</p>
        </div>
        <div className="section-panel rounded-2xl p-5">
          <p className="text-mist/50 text-xs uppercase tracking-wider font-body mb-1">Total Discounts</p>
          <p className="font-display text-2xl text-amber">{formatCurrency(totalDiscounts)}</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="section-panel rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h3 className="font-display text-lg text-mist tracking-wide">Revenue Overview</h3>
          <div className="flex gap-1 bg-white/5 rounded-xl p-1">
            {(['daily', 'weekly', 'monthly', 'yearly'] as Period[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriodFilter(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                  periodFilter === p
                    ? 'bg-amber/20 text-amber'
                    : 'text-mist/50 hover:text-mist hover:bg-white/5'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <BarChart
          labels={chartData.labels}
          data={chartData.data}
          height={280}
          title=""
        />
      </div>

      {/* Stats Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="section-panel rounded-2xl p-5 space-y-4">
          <h3 className="font-display text-lg text-mist tracking-wide">Revenue Insights</h3>
          <div className="flex justify-between items-center pb-3 border-b border-white/10">
            <span className="text-mist/50 text-sm">Average Daily Revenue</span>
            <span className="text-mist font-medium">{formatCurrency(avgDailyRevenue)}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-white/10">
            <span className="text-mist/50 text-sm">Best Day</span>
            <span className="text-mist font-medium text-right">{formatDate(bestDay.date)} — {formatCurrency(bestDay.gross)}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-white/10">
            <span className="text-mist/50 text-sm">Total Transactions</span>
            <span className="text-mist font-medium">{totalTransactions}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-mist/50 text-sm">Average Tax Per Transaction</span>
            <span className="text-mist font-medium">{formatCurrency(avgTaxPerTransaction)}</span>
          </div>
        </div>

        <div className="section-panel rounded-2xl p-5">
          <h3 className="font-display text-lg text-mist tracking-wide mb-4">Export Reports</h3>
          <p className="text-mist/50 text-sm mb-4">Download revenue reports for offline analysis.</p>
          <div className="flex flex-col gap-3">
            <button type="button" className="btn-3d w-full" onClick={() => setShowModal(true)}>
              <span className="btn-3d-layer justify-center text-sm gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download PDF
              </span>
              <span className="btn-3d-depth" />
            </button>
            <button type="button" className="btn-3d w-full" onClick={() => setShowModal(true)}>
              <span className="btn-3d-layer justify-center text-sm gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download CSV
              </span>
              <span className="btn-3d-depth" />
            </button>
            <button type="button" className="btn-3d w-full" onClick={() => setShowModal(true)}>
              <span className="btn-3d-layer justify-center text-sm gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Excel
              </span>
              <span className="btn-3d-depth" />
            </button>
          </div>
        </div>
      </div>

      {/* Revenue Table */}
      <DataTable
        pageSize={10}
        columns={[
          { key: 'date', header: 'Date', sortable: true, render: (item) => { const r = item as unknown as RevenueData; return <span className="text-mist">{formatDate(r.date)}</span> } },
          { key: 'gross', header: 'Gross Revenue ($)', sortable: true, render: (item) => { const r = item as unknown as RevenueData; return <span className="text-amber font-medium">{formatCurrency(r.gross)}</span> } },
          { key: 'net', header: 'Net Revenue ($)', sortable: true, render: (item) => { const r = item as unknown as RevenueData; return <span className="text-mist">{formatCurrency(r.net)}</span> } },
          { key: 'tax', header: 'Tax ($)', sortable: true, render: (item) => { const r = item as unknown as RevenueData; return <span className="text-mist/70">{formatCurrency(r.tax)}</span> } },
          { key: 'discounts', header: 'Discounts ($)', sortable: true, render: (item) => { const r = item as unknown as RevenueData; return <span className="text-mist/70">{formatCurrency(r.discounts)}</span> } },
          { key: 'refunds', header: 'Refunds ($)', sortable: true, render: (item) => { const r = item as unknown as RevenueData; return <span className="text-red-400">{formatCurrency(r.refunds)}</span> } },
        ]}
        data={mockRevenueData as unknown as Record<string, unknown>[]}
      />

      {/* Export Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Export" size="sm">
        <div className="flex flex-col items-center gap-4 py-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c8a76a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <p className="text-mist text-sm text-center">
            Export will be available when connected to a real backend. Currently in demo mode.
          </p>
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 text-sm text-mist/70 hover:text-mist hover:bg-white/10 transition-all"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  )
}
