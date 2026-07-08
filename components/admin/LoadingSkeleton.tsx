'use client'

interface Props {
  type?: 'card' | 'chart' | 'text'
  lines?: number
}

export default function LoadingSkeleton({ type = 'card', lines = 1 }: Props) {
  if (type === 'text') {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-3 bg-white/5 rounded animate-pulse"
            style={{ width: `${70 + Math.random() * 30}%` }}
          />
        ))}
      </div>
    )
  }

  if (type === 'chart') {
    return (
      <div className="section-panel rounded-2xl p-5 space-y-4">
        <div className="h-5 bg-white/5 rounded w-1/3 animate-pulse" />
        <div className="h-[200px] bg-white/5 rounded animate-pulse" />
      </div>
    )
  }

  return (
    <div className="section-panel rounded-2xl p-5 flex items-start gap-4 animate-pulse">
      <div className="w-12 h-12 rounded-full bg-white/5 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-white/5 rounded w-1/2" />
        <div className="h-6 bg-white/5 rounded w-1/3" />
        <div className="flex gap-2">
          <div className="h-3 bg-white/5 rounded w-12" />
          <div className="h-3 bg-white/5 rounded w-16" />
        </div>
      </div>
    </div>
  )
}
