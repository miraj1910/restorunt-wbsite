'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { tables } from '@/lib/tableData'
import { TableData } from '@/lib/types'
import TableShape from './TableShape'
import FloorPlanLegend from './FloorPlanLegend'

interface Props {
  selectedTableId: number | null
  onTableSelect: (table: TableData) => void
}

const MIN_SCALE = 0.3
const MAX_SCALE = 5

function Plant({ cx, cy, size }: { cx: number; cy: number; size: number }) {
  const r = size
  return (
    <g filter="url(#drop-shadow)">
      <circle cx={cx} cy={cy} r={r} fill="#2d4a2d" opacity={0.85} />
      <circle cx={cx} cy={cy - r * 0.35} r={r * 0.7} fill="#3a5a3a" opacity={0.75} />
      <circle cx={cx} cy={cy - r * 0.6} r={r * 0.4} fill="#4a6a4a" opacity={0.55} />
      <rect x={cx - r * 0.25} y={cy + r * 0.1} width={r * 0.5} height={r * 0.55} fill="#5a4a3a" rx={2} opacity={0.8} />
    </g>
  )
}

export default function FloorPlan({ selectedTableId, onTableSelect }: Props) {
  const [vs, setVs] = useState({ x: 0, y: 0, s: 1 })
  const containerRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef({ active: false, lx: 0, ly: 0, sx: 0, sy: 0 })

  const clamp = useCallback((v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v)), [])

  const zoomTo = useCallback((ptX: number, ptY: number, factor: number) => {
    setVs(prev => {
      const ns = clamp(prev.s * factor, MIN_SCALE, MAX_SCALE)
      const ratio = ns / prev.s
      return { s: ns, x: ptX - (ptX - prev.x) * ratio, y: ptY - (ptY - prev.y) * ratio }
    })
  }, [clamp])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    zoomTo(e.clientX - rect.left, e.clientY - rect.top, e.deltaY > 0 ? 0.88 : 1.12)
  }, [zoomTo])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return
    dragRef.current = { active: true, lx: e.clientX, ly: e.clientY, sx: vs.x, sy: vs.y }
  }, [vs])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const d = dragRef.current
    if (!d.active) return
    const dx = e.clientX - d.lx
    const dy = e.clientY - d.ly
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
      d.lx = e.clientX
      d.ly = e.clientY
      setVs(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }))
    }
  }, [])

  const handleMouseUp = useCallback(() => { dragRef.current.active = false }, [])

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp)
    return () => window.removeEventListener('mouseup', handleMouseUp)
  }, [handleMouseUp])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      dragRef.current = { active: false, lx: e.touches[0].clientX, ly: e.touches[0].clientY, sx: vs.x, sy: vs.y }
    }
  }, [vs])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const d = dragRef.current
      const dx = e.touches[0].clientX - d.lx
      const dy = e.touches[0].clientY - d.ly
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        d.lx = e.touches[0].clientX
        d.ly = e.touches[0].clientY
        setVs(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }))
      }
    } else if (e.touches.length === 2) {
      e.preventDefault()
      const t = e.touches
      const cx = (t[0].clientX + t[1].clientX) / 2
      const cy = (t[0].clientY + t[1].clientY) / 2
      const dist = Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY)
      if (!dragRef.current.lx) { dragRef.current.lx = dist; dragRef.current.ly = dist; return }
      const prevDist = dragRef.current.lx
      dragRef.current.lx = dist
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      zoomTo(cx - rect.left, cy - rect.top, dist / prevDist)
    }
  }, [zoomTo])

  const handleTouchEnd = useCallback(() => { dragRef.current.active = false }, [])

  const zoomIn = () => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) zoomTo(rect.width / 2, rect.height / 2, 1.2)
  }
  const zoomOut = () => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) zoomTo(rect.width / 2, rect.height / 2, 0.8)
  }
  const resetView = () => setVs({ x: 0, y: 0, s: 1 })

  const cursorStyle = dragRef.current.active ? 'grabbing' : 'grab'
  const btnBase = 'w-9 h-9 flex items-center justify-center rounded-lg bg-white/8 border border-white/12 text-mist/80 hover:bg-white/14 hover:text-mist transition-colors text-sm'

  return (
    <div className="section-panel rounded-2xl p-3 md:p-5 overflow-hidden select-none">
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-xl"
        style={{ aspectRatio: '1200 / 900', cursor: cursorStyle }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          style={{
            transform: `translate(${vs.x}px, ${vs.y}px) scale(${vs.s})`,
            transformOrigin: '0 0',
            transition: dragRef.current.active ? 'none' : 'transform 0.08s ease',
            width: '100%', height: '100%',
          }}
        >
          <svg viewBox="0 0 1200 900" className="w-full h-auto" style={{ display: 'block', overflow: 'visible' }}>
            <defs>
              <pattern id="wood-floor" width="80" height="40" patternUnits="userSpaceOnUse">
                <rect width="80" height="40" fill="#2a231c" />
                <line x1="0" y1="0" x2="80" y2="0" stroke="#1f1812" strokeWidth="0.5" opacity="0.6" />
                <line x1="0" y1="20" x2="80" y2="20" stroke="#1f1812" strokeWidth="0.3" opacity="0.25" />
                <line x1="40" y1="0" x2="40" y2="40" stroke="#1a1410" strokeWidth="1" opacity="0.2" />
              </pattern>

              <pattern id="tile-floor" width="40" height="40" patternUnits="userSpaceOnUse">
                <rect width="40" height="40" fill="#2c2824" />
                <rect width="40" height="40" fill="none" stroke="#3a342e" strokeWidth="0.5" />
                <line x1="20" y1="0" x2="20" y2="40" stroke="#3a342e" strokeWidth="0.3" opacity={0.25} />
                <line x1="0" y1="20" x2="40" y2="20" stroke="#3a342e" strokeWidth="0.3" opacity={0.25} />
              </pattern>

              <radialGradient id="light-pool" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="#c8a76a" stopOpacity={0.10} />
                <stop offset="50%" stopColor="#c8a76a" stopOpacity={0.04} />
                <stop offset="100%" stopColor="#c8a76a" stopOpacity={0} />
              </radialGradient>

              <filter id="drop-shadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000" floodOpacity={0.35} />
              </filter>
            </defs>

            <rect x="0" y="0" width="1200" height="900" fill="#13161d" rx="10" />
            <rect x="20" y="20" width="1160" height="860" fill="none" stroke="#2a3038" strokeWidth="3" rx="8" />

            <rect x="35" y="175" width="695" height="595" fill="url(#wood-floor)" rx="4" />
            <rect x="755" y="370" width="415" height="400" fill="url(#tile-floor)" rx="4" />

            <rect x="35" y="175" width="260" height="245" fill="rgba(200,167,106,0.06)" rx="4" />
            <rect x="40" y="180" width="250" height="235" fill="none" stroke="rgba(200,167,106,0.2)" strokeWidth="1" rx="3" strokeDasharray="4,3" />

            <rect x="52" y="210" width="226" height="185" fill="none" stroke="rgba(74,26,46,0.5)" strokeWidth="2" rx="4" />
            <rect x="58" y="216" width="214" height="173" fill="rgba(74,26,46,0.12)" stroke="rgba(200,167,106,0.15)" strokeWidth="1" rx="3" />
            <line x1="58" y1="300" x2="272" y2="300" stroke="rgba(200,167,106,0.04)" strokeWidth="0.5" />
            <line x1="58" y1="350" x2="272" y2="350" stroke="rgba(200,167,106,0.04)" strokeWidth="0.5" />
            <line x1="165" y1="216" x2="165" y2="389" stroke="rgba(200,167,106,0.04)" strokeWidth="0.5" />

            <rect x="755" y="370" width="415" height="400" fill="none" stroke="#2a3038" strokeWidth="1" rx="4" />
            <line x1="755" y1="370" x2="755" y2="770" stroke="#4a525d" strokeWidth="1.5" strokeDasharray="8,6" opacity={0.4} />

            <rect x="320" y="760" width="300" height="3" fill="rgba(200,167,106,0.15)" />
            <rect x="320" y="760" width="300" height="1" fill="rgba(200,167,106,0.08)" />

            <circle cx={400} cy={460} r={55} fill="url(#light-pool)" />
            <circle cx={340} cy={560} r={50} fill="url(#light-pool)" />
            <circle cx={530} cy={470} r={50} fill="url(#light-pool)" />
            <circle cx={530} cy={570} r={50} fill="url(#light-pool)" />
            <circle cx={160} cy={250} r={45} fill="url(#light-pool)" />
            <circle cx={160} cy={330} r={45} fill="url(#light-pool)" />
            <circle cx={105} cy={540} r={35} fill="url(#light-pool)" />
            <circle cx={105} cy={720} r={35} fill="url(#light-pool)" />
            <circle cx={980} cy={540} r={45} fill="url(#light-pool)" />
            <circle cx={980} cy={740} r={45} fill="url(#light-pool)" />

            <rect x="30" y="30" width="1140" height="130" fill="#1a1f26" rx="6" stroke="#2a3038" strokeWidth="1.5" />
            <rect x="560" y="140" width="80" height="20" fill="#1e242c" rx="2" />
            <text x="600" y="100" textAnchor="middle" fill="#6b7280" fontSize={16} fontFamily="Cormorant Garamond, serif" letterSpacing="0.3em" opacity={0.6} fontWeight={600}>KITCHEN</text>

            <rect x="1080" y="185" width="90" height="90" fill="#1a1f26" rx="6" stroke="#2a3038" strokeWidth="1" />
            <text x="1125" y="238" textAnchor="middle" fill="#6b7280" fontSize={8} fontFamily="Cormorant Garamond, serif" letterSpacing="0.2em" opacity={0.45}>RESTROOMS</text>

            <g filter="url(#drop-shadow)">
              <rect x="320" y="188" width="160" height="65" fill="rgba(29,34,41,0.8)" rx="4" stroke="rgba(200,167,106,0.2)" strokeWidth="1" />
            </g>
            <text x="400" y="226" textAnchor="middle" fill="#c8a76a" fontSize={10} fontFamily="Cormorant Garamond, serif" letterSpacing="0.25em" opacity={0.65}>STAGE</text>
            {[370, 385, 400, 415, 430].map(x => (
              <circle key={x} cx={x} cy={220} r={3} fill="rgba(200,167,106,0.3)" />
            ))}

            <g filter="url(#drop-shadow)">
              <rect x="555" y="220" width="200" height="12" fill="#6f4f2a" rx="4" opacity={0.9} />
            </g>
            <text x="655" y="229" textAnchor="middle" fill="#c8a76a" fontSize={9} fontFamily="Cormorant Garamond, serif" letterSpacing="0.3em" opacity={0.7}>BAR</text>
            {[585, 625, 665, 705].map(x => (
              <circle key={x} cx={x} cy={252} r={4} fill="#5a4a3a" opacity={0.6} />
            ))}

            <g filter="url(#drop-shadow)">
              <rect x="360" y="790" width="200" height="35" fill="#4a3f2f" rx="4" opacity={0.85} />
            </g>
            <text x="460" y="812" textAnchor="middle" fill="#c8a76a" fontSize={9} fontFamily="Cormorant Garamond, serif" letterSpacing="0.2em" opacity={0.7}>RECEPTION</text>

            <rect x="280" y="795" width="60" height="25" fill="#1e242c" rx="4" stroke="#2a3038" strokeWidth="0.5" />
            <text x="310" y="811" textAnchor="middle" fill="#6b7280" fontSize={7} fontFamily="Manrope, sans-serif" opacity={0.5}>LOUNGE</text>

            <path d="M 460 850 L 540 850" stroke="#2a3038" strokeWidth="2" />
            <polygon points="500,835 490,850 510,850" fill="#2a3038" opacity={0.5} />
            <text x="500" y="868" textAnchor="middle" fill="#6b7280" fontSize={8} fontFamily="Manrope, sans-serif" letterSpacing="0.15em" opacity={0.4}>ENTRANCE</text>

            <rect x="1120" y="840" width="40" height="25" fill="#1e242c" rx="3" stroke="#ef4444" strokeWidth="1" opacity={0.5} />
            <text x="1140" y="859" textAnchor="middle" fill="#ef4444" fontSize={6} fontFamily="Manrope, sans-serif" opacity={0.45}>EXIT</text>

            {[450, 520, 590, 660, 730].map(y => (
              <g key={`win-${y}`}>
                <rect x="22" y={y} width="12" height="50" fill="#2a4a5a" opacity={0.3} rx="2" />
                <line x1="28" y1={y} x2="28" y2={y + 50} stroke="#3a5a6a" strokeWidth="0.5" opacity={0.2} />
                <line x1="22" y1={y + 25} x2="34" y2={y + 25} stroke="#3a5a6a" strokeWidth="0.5" opacity={0.2} />
              </g>
            ))}

            <Plant cx={590} cy={310} size={14} />
            <Plant cx={290} cy={770} size={11} />
            <Plant cx={600} cy={360} size={12} />
            <Plant cx={260} cy={640} size={10} />
            <Plant cx={740} cy={590} size={11} />

            <line x1="20" y1="440" x2="20" y2="780" stroke="#2a3038" strokeWidth="1" opacity={0.2} />

            {tables.map(table => (
              <TableShape
                key={table.id}
                table={table}
                isSelected={selectedTableId === table.id}
                onSelect={onTableSelect}
              />
            ))}
          </svg>
        </div>

        <div className="absolute bottom-3 right-3 flex gap-1.5 z-10">
          <button type="button" onClick={zoomIn} className={btnBase} aria-label="Zoom in">+</button>
          <button type="button" onClick={zoomOut} className={btnBase} aria-label="Zoom out">&minus;</button>
          <button type="button" onClick={resetView} className={`${btnBase} px-3 w-auto`} aria-label="Reset view">Reset</button>
        </div>
        <div className="absolute top-3 left-3 z-10 pointer-events-none text-[10px] text-mist/30 font-mono">
          {Math.round(vs.s * 100)}%
        </div>
      </div>
      <FloorPlanLegend />
    </div>
  )
}
