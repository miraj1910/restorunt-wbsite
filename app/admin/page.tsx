'use client'

import { useState, useEffect } from 'react'
import { useRequireAuth } from '@/lib/admin/auth'
import {
  getDashboardStats,
  getRevenueByPeriod,
  getReservationsByDay,
  getReservationsByTime,
  getMenuSalesByCategory,
  getBestSellingItems,
  getCustomerStats,
  kpiTrends,
} from '@/lib/admin/data'
import type { DashboardStats } from '@/lib/admin/types'
import StatCard from '@/components/admin/StatCard'
import BarChart from '@/components/admin/BarChart'
import PieChart from '@/components/admin/PieChart'
import LoadingSkeleton from '@/components/admin/LoadingSkeleton'

export default function AdminDashboard() {
  useRequireAuth()

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [revenueData, setRevenueData] = useState<{ labels: string[]; data: number[] }>({ labels: [], data: [] })
  const [reservationsByDay, setReservationsByDay] = useState<{ labels: string[]; data: number[] }>({ labels: [], data: [] })
  const [reservationsByTime, setReservationsByTime] = useState<{ labels: string[]; data: number[] }>({ labels: [], data: [] })
  const [menuSales, setMenuSales] = useState<{ labels: string[]; data: number[]; colors: string[] }>({ labels: [], data: [], colors: [] })
  const [bestSelling, setBestSelling] = useState<{ name: string; sales: number; revenue: number }[]>([])
  const [customerStats, setCustomerStats] = useState<{ returning: number; new: number; avgSpend: number }>({ returning: 0, new: 0, avgSpend: 0 })

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats(getDashboardStats())
      setRevenueData(getRevenueByPeriod('daily'))
      setReservationsByDay(getReservationsByDay())
      setReservationsByTime(getReservationsByTime())
      setMenuSales(getMenuSalesByCategory())
      const best = getBestSellingItems()
      setBestSelling(best.slice(0, 5))
      setCustomerStats(getCustomerStats())
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  function formatCurrency(val: number): string {
    return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
  }

  const revenueLabels14 = revenueData.labels.length >= 14
    ? revenueData.labels.slice(-14)
    : revenueData.labels
  const revenueData14 = revenueData.data.length >= 14
    ? revenueData.data.slice(-14)
    : revenueData.data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-mist tracking-wide">Dashboard</h1>
        <p className="text-mist/40 text-sm mt-1">{dateStr}</p>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 13 }).map((_, i) => (
              <LoadingSkeleton key={i} type="card" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <LoadingSkeleton key={i} type="chart" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <StatCard
              title="Today's Revenue"
              value={formatCurrency(kpiTrends.todayRevenue.value)}
              change={kpiTrends.todayRevenue.change}
              trend={kpiTrends.todayRevenue.trend}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              }
            />
            <StatCard
              title="Weekly Revenue"
              value={formatCurrency(kpiTrends.weeklyRevenue.value)}
              change={kpiTrends.weeklyRevenue.change}
              trend={kpiTrends.weeklyRevenue.trend}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              }
            />
            <StatCard
              title="Monthly Revenue"
              value={formatCurrency(kpiTrends.monthlyRevenue.value)}
              change={kpiTrends.monthlyRevenue.change}
              trend={kpiTrends.monthlyRevenue.trend}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              }
            />
            <StatCard
              title="Total Reservations"
              value={kpiTrends.totalReservations.value}
              change={kpiTrends.totalReservations.change}
              trend={kpiTrends.totalReservations.trend}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <path d="M12 14l2 2 4-4" />
                </svg>
              }
            />
            <StatCard
              title="Active Reservations"
              value={kpiTrends.activeReservations.value}
              change={kpiTrends.activeReservations.change}
              trend={kpiTrends.activeReservations.trend}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              }
            />
            <StatCard
              title="Cancelled Reservations"
              value={kpiTrends.cancelledReservations.value}
              change={kpiTrends.cancelledReservations.change}
              trend={kpiTrends.cancelledReservations.trend}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              }
            />
            <StatCard
              title="Tables Occupied"
              value={kpiTrends.tablesOccupied.value}
              change={kpiTrends.tablesOccupied.change}
              trend={kpiTrends.tablesOccupied.trend}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18V3H3z" />
                  <path d="M3 9h18" />
                  <path d="M3 15h18" />
                  <path d="M9 3v18" />
                  <path d="M15 3v18" />
                </svg>
              }
            />
            <StatCard
              title="Available Tables"
              value={kpiTrends.availableTables.value}
              change={kpiTrends.availableTables.change}
              trend={kpiTrends.availableTables.trend}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18V3H3z" />
                  <path d="M3 9h18" />
                  <path d="M3 15h18" />
                  <path d="M9 3v18" />
                  <path d="M15 3v18" />
                  <path d="M8 12l2 2 4-4" />
                </svg>
              }
            />
            <StatCard
              title="Total Customers"
              value={kpiTrends.totalCustomers.value}
              change={kpiTrends.totalCustomers.change}
              trend={kpiTrends.totalCustomers.trend}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              }
            />
            <StatCard
              title="New Customers"
              value={kpiTrends.newCustomers.value}
              change={kpiTrends.newCustomers.change}
              trend={kpiTrends.newCustomers.trend}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
              }
            />
            <StatCard
              title="Total Employees"
              value={kpiTrends.totalEmployees.value}
              change={kpiTrends.totalEmployees.change}
              trend={kpiTrends.totalEmployees.trend}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              }
            />
            <StatCard
              title="Today's Orders"
              value={kpiTrends.todayOrders.value}
              change={kpiTrends.todayOrders.change}
              trend={kpiTrends.todayOrders.trend}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              }
            />
            <StatCard
              title="Pending Orders"
              value={kpiTrends.pendingOrders.value}
              change={kpiTrends.pendingOrders.change}
              trend={kpiTrends.pendingOrders.trend}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              }
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <BarChart
              title="Daily Revenue (Last 14 Days)"
              labels={revenueLabels14}
              data={revenueData14}
              height={200}
              color="#c8a76a"
            />
            <BarChart
              title="Reservations by Day"
              labels={reservationsByDay.labels}
              data={reservationsByDay.data}
              height={200}
              color="#c8a76a"
            />
            <PieChart
              title="Menu Sales by Category"
              labels={menuSales.labels}
              data={menuSales.data}
              colors={menuSales.colors}
            />
            <BarChart
              title="Best Selling Items"
              labels={bestSelling.map(i => i.name.replace(/^(.{12}).*$/, '$1…'))}
              data={bestSelling.map(i => i.sales)}
              height={200}
              color="#c8a76a"
            />
            <BarChart
              title="Reservations by Time"
              labels={reservationsByTime.labels}
              data={reservationsByTime.data}
              height={200}
              color="#c8a76a"
            />
            <div className="section-panel rounded-2xl p-5">
              <h3 className="font-display text-mist text-lg tracking-wide mb-4">Customer Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate/50 rounded-xl p-4 text-center">
                  <div className="text-mist/50 text-xs font-body tracking-wide uppercase mb-1">Returning</div>
                  <div className="font-display text-3xl text-mist">{customerStats.returning}</div>
                  <div className="text-mist/30 text-xs mt-1">loyal guests</div>
                </div>
                <div className="bg-slate/50 rounded-xl p-4 text-center">
                  <div className="text-mist/50 text-xs font-body tracking-wide uppercase mb-1">New</div>
                  <div className="font-display text-3xl text-mist">{customerStats.new}</div>
                  <div className="text-mist/30 text-xs mt-1">first-time diners</div>
                </div>
              </div>
              <div className="mt-4 bg-slate/50 rounded-xl p-4 text-center">
                <div className="text-mist/50 text-xs font-body tracking-wide uppercase mb-1">Average Spend</div>
                <div className="font-display text-2xl text-amber">{formatCurrency(customerStats.avgSpend)}</div>
                <div className="text-mist/30 text-xs mt-1">per customer</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
