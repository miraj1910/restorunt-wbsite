'use client'

interface Props {
  labels: string[]
  data: number[]
  height?: number
  color?: string
  title?: string
}

export default function BarChart({
  labels,
  data,
  height = 200,
  color = '#c8a76a',
  title,
}: Props) {
  if (!data || data.length === 0) return null

  const max = Math.max(...data, 1)
  const barWidth = 100 / data.length
  const gap = 4
  const barInnerWidth = barWidth - gap

  return (
    <div className="section-panel rounded-2xl p-5">
      {title && (
        <h3 className="font-display text-mist text-lg tracking-wide mb-4">{title}</h3>
      )}
      <div className="relative" style={{ height }}>
        <div className="flex items-end justify-around h-full">
          {data.map((val, i) => {
            const pct = (val / max) * 100
            return (
              <div
                key={i}
                className="relative flex flex-col items-center group"
                style={{ width: `${barWidth}%` }}
              >
                <div
                  className="w-full rounded-t-md transition-all duration-500 ease-out cursor-default"
                  style={{
                    height: `${pct}%`,
                    backgroundColor: color,
                    opacity: 0.8,
                  }}
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-ink/90 text-mist text-xs px-2 py-1 rounded-md border border-white/10 whitespace-nowrap">
                    {val}
                  </div>
                </div>
                {labels[i] && (
                  <span className="text-mist/40 text-[10px] mt-1.5 truncate w-full text-center">
                    {labels[i]}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
