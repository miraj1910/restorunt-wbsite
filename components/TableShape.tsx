'use client'

import { useState, useMemo } from 'react'
import { TableData, TableStatus } from '@/lib/types'
import { getTableDimensions, getChairPositions } from '@/lib/tableData'

interface Props {
  table: TableData
  isSelected: boolean
  onSelect: (table: TableData) => void
}

const statusConfig: Record<TableStatus, { glow: string; label: string }> = {
  available: { glow: '#22c55e', label: 'Available' },
  reserved: { glow: '#ef4444', label: 'Reserved' },
  disabled: { glow: '#6b7280', label: 'Maintenance' },
}

const selectedConfig = { glow: '#ca8a04', label: 'Selected' }

const TABLE_COLOR = '#8B7D6B'
const TABLE_BORDER = '#5C4F3E'
const CHAIR_COLOR = '#6B5D4B'
const CHAIR_STROKE = '#4A3F2F'

export default function TableShape({ table, isSelected, onSelect }: Props) {
  const { shape, capacity, position, status, number, area, nearWindow, stageDistance } = table
  const [hovered, setHovered] = useState(false)

  const dims = useMemo(() => getTableDimensions(shape, capacity), [shape, capacity])
  const chairs = useMemo(() => getChairPositions(shape, capacity, dims), [shape, capacity, dims])

  const disabled = status === 'reserved' || status === 'disabled'
  const cfg = isSelected ? selectedConfig : statusConfig[status]
  const opacity = status === 'disabled' ? 0.4 : 1

  const handleClick = () => {
    if (!disabled) onSelect(table)
  }
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onSelect(table)
    }
  }

  const tableShape = () => {
    const hw = dims.width / 2
    const hh = dims.height / 2
    switch (shape) {
      case 'round':
        return <circle cx="0" cy="0" r={hw} fill={TABLE_COLOR} stroke={TABLE_BORDER} strokeWidth={1.5} />
      case 'square':
      case 'rectangle':
        return (
          <rect
            x={-hw} y={-hh}
            width={dims.width} height={dims.height}
            rx={5} ry={5}
            fill={TABLE_COLOR} stroke={TABLE_BORDER} strokeWidth={1.5}
          />
        )
    }
  }

  const glowFilter = isSelected
    ? `drop-shadow(0 0 8px ${cfg.glow}) drop-shadow(0 0 18px ${cfg.glow})`
    : hovered && !disabled
      ? `drop-shadow(0 0 6px ${cfg.glow}88)`
      : 'url(#drop-shadow)'

  return (
    <g transform={`translate(${position.x}, ${position.y})`}>
      <g
        className={disabled ? '' : 'cursor-pointer'}
        style={{
          transition: 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.25s ease',
          transform: hovered && !disabled ? 'scale(1.1)' : 'scale(1)',
          filter: glowFilter,
          opacity,
        }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={`Table ${number}, capacity ${capacity}, ${status}`}
      >
        {chairs.map((c, i) => (
          <circle
            key={i}
            cx={c.x}
            cy={c.y}
            r={5.5}
            fill={CHAIR_COLOR}
            stroke={CHAIR_STROKE}
            strokeWidth={1}
          />
        ))}
        {tableShape()}
        <text
          x="0" y="-2"
          textAnchor="middle" dominantBaseline="central"
          fill="#f4efe6"
          fontSize={dims.width > 60 ? 13 : dims.width > 44 ? 12 : 11}
          fontWeight={700}
          fontFamily="Manrope, sans-serif"
          style={{ pointerEvents: 'none' }}
        >
          {String(number).padStart(2, '0')}
        </text>
        <text
          x="0" y="11"
          textAnchor="middle" dominantBaseline="central"
          fill="rgba(244,239,230,0.6)"
          fontSize={8}
          fontFamily="Manrope, sans-serif"
          style={{ pointerEvents: 'none' }}
        >
          {capacity}
        </text>
      </g>

      {hovered && (
        <g>
          <foreignObject
            x={-90} y={-dims.height / 2 - 92}
            width="180" height="88"
          >
            <div
              style={{
                background: 'rgba(15,15,17,0.94)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '7px 11px',
                fontSize: '11px',
                lineHeight: '1.45',
                color: '#f4efe6',
                fontFamily: 'Manrope, sans-serif',
                boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
              }}
            >
              <div style={{ fontWeight: 600, color: '#c8a76a', marginBottom: 3, fontSize: 12 }}>
                Table {String(number).padStart(2, '0')}
              </div>
              <div>Capacity: {capacity} guests</div>
              <div>
                {area === 'vip' ? 'VIP Lounge' : area === 'outdoor' ? 'Outdoor Patio' : 'Main Dining'}
                {nearWindow ? ' · Window' : ''}
                {area === 'vip' ? ' · VIP' : ''}
              </div>
              <div>
                Status: <span style={{ color: cfg.glow, fontWeight: 600 }}>{cfg.label}</span>
                {stageDistance && <span> · Stage: {stageDistance}</span>}
              </div>
            </div>
          </foreignObject>
        </g>
      )}
    </g>
  )
}
