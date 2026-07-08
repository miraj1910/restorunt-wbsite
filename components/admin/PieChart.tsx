'use client'

interface Props {
  labels: string[]
  data: number[]
  colors: string[]
  title?: string
}

export default function PieChart({ labels, data, colors, title }: Props) {
  if (!data || data.length === 0) return null

  const total = data.reduce((s, v) => s + v, 0) || 1
  const cx = 100
  const cy = 100
  const r = 80

  let cumulative = 0
  const slices = data.map((val, i) => {
    const pct = val / total
    const startAngle = cumulative * 360
    cumulative += pct
    const endAngle = cumulative * 360
    const startRad = ((startAngle - 90) * Math.PI) / 180
    const endRad = ((endAngle - 90) * Math.PI) / 180
    const x1 = cx + r * Math.cos(startRad)
    const y1 = cy + r * Math.sin(startRad)
    const x2 = cx + r * Math.cos(endRad)
    const y2 = cy + r * Math.sin(endRad)
    const largeArc = pct > 0.5 ? 1 : 0
    return {
      path: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`,
      color: colors[i] || '#c8a76a',
      pct,
    }
  })

  return (
    <div className="section-panel rounded-2xl p-5">
      {title && (
        <h3 className="font-display text-mist text-lg tracking-wide mb-4">{title}</h3>
      )}
      <div className="flex flex-col items-center">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {slices.map((slice, i) => (
            <path key={i} d={slice.path} fill={slice.color} opacity="0.85" stroke="#0f0f11" strokeWidth="1" />
          ))}
          <circle cx={cx} cy={cy} r={40} fill="#0f0f11" />
        </svg>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4">
          {labels.map((label, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: colors[i] || '#c8a76a' }} />
              <span className="text-mist/60 text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
