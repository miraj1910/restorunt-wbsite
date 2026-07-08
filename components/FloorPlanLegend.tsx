const statuses = [
  { color: '#22c55e', label: 'Available' },
  { color: '#ef4444', label: 'Reserved' },
  { color: '#ca8a04', label: 'Selected' },
  { color: '#6b7280', label: 'Maintenance' },
]

const icons = [
  { icon: '⬇', label: 'Entrance' },
  { icon: '▤', label: 'Reception' },
  { icon: '◉', label: 'Kitchen' },
  { icon: '⊔', label: 'Washroom' },
  { icon: '╌', label: 'Bar' },
  { icon: '★', label: 'VIP' },
  { icon: '▯', label: 'Window' },
]

export default function FloorPlanLegend() {
  return (
    <div className="mt-4 px-2 space-y-3">
      <div className="flex flex-wrap gap-x-5 gap-y-1.5">
        {statuses.map(s => (
          <span key={s.label} className="flex items-center gap-2 text-[10px] md:text-xs text-mist/70">
            <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full shrink-0" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1.5">
        {icons.map(ic => (
          <span key={ic.label} className="flex items-center gap-1.5 text-[10px] md:text-xs text-mist/50">
            <span className="text-[11px] md:text-sm leading-none">{ic.icon}</span>
            {ic.label}
          </span>
        ))}
      </div>
    </div>
  )
}
