'use client'

import { type ReactNode } from 'react'
import MiniChart from './MiniChart'

interface Props {
  title: string
  value: string | number
  change: number
  trend: number[]
  icon: ReactNode
  color?: string
}

export default function StatCard({
  title,
  value,
  change,
  trend,
  icon,
  color = '#c8a76a',
}: Props) {
  const isPositive = change >= 0

  return (
    <div className="section-panel rounded-2xl p-5 flex items-start gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_48px_rgba(0,0,0,0.35)] group">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: `${color}20`, color }}
      >
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-mist/50 text-xs font-body tracking-wide uppercase mb-0.5">
          {title}
        </div>
        <div className="font-display text-2xl text-mist tracking-wide">
          {value}
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <span
            className={`flex items-center gap-0.5 text-xs font-medium ${
              isPositive ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isPositive ? (
                <polyline points="18 15 12 9 6 15" />
              ) : (
                <polyline points="6 9 12 15 18 9" />
              )}
            </svg>
            {Math.abs(change).toFixed(1)}%
          </span>
          <span className="text-mist/30 text-xs">vs last month</span>
        </div>
      </div>

      <MiniChart data={trend} color={color} showArea width={80} height={36} />
    </div>
  )
}
