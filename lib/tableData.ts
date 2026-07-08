import { TableData, TableShape, TableStatus, ChairPosition, TableArea } from './types'

export interface TableDimensions {
  width: number
  height: number
}

export function getTableDimensions(shape: TableShape, capacity: number): TableDimensions {
  switch (shape) {
    case 'round': {
      const d = capacity <= 2 ? 44 : capacity <= 4 ? 56 : capacity <= 6 ? 66 : 74
      return { width: d, height: d }
    }
    case 'square': {
      const s = capacity <= 2 ? 34 : 42
      return { width: s, height: s }
    }
    case 'rectangle': {
      if (capacity <= 4) return { width: 40, height: 22 }
      if (capacity <= 6) return { width: 52, height: 26 }
      if (capacity <= 8) return { width: 62, height: 30 }
      return { width: 76, height: 34 }
    }
  }
}

function roundChairPositions(radius: number, count: number): ChairPosition[] {
  const gap = 8
  const d = radius + gap
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2
    return { x: Math.cos(angle) * d, y: Math.sin(angle) * d }
  })
}

function rectChairPositions(w: number, h: number, count: number): ChairPosition[] {
  const gap = 7
  const halfW = w / 2 + gap
  const halfH = h / 2 + gap
  if (count <= 4) {
    return [
      { x: 0, y: -halfH },
      { x: halfW, y: 0 },
      { x: 0, y: halfH },
      { x: -halfW, y: 0 },
    ]
  }
  const perSide = count / 2
  const spread = Math.max(w - 12, h - 12) * 0.35
  const step = perSide > 1 ? (spread * 2) / (perSide - 1) : 0
  const start = perSide > 1 ? -spread : 0
  const chairs: ChairPosition[] = []
  for (let i = 0; i < perSide; i++) {
    const y = start + i * step
    chairs.push({ x: -halfW, y }, { x: halfW, y })
  }
  return chairs
}

export function getChairPositions(shape: TableShape, capacity: number, dims: TableDimensions): ChairPosition[] {
  if (shape === 'round') return roundChairPositions(dims.width / 2, capacity)
  return rectChairPositions(dims.width, dims.height, capacity)
}

interface BaseTable {
  id: number
  number: number
  shape: TableShape
  capacity: number
  area: TableArea
  nearWindow: boolean
  position: { x: number; y: number }
  stageDistance?: string
}

const baseTables: BaseTable[] = [
  { id: 1, number: 1, shape: 'round', capacity: 4, area: 'vip', nearWindow: false, position: { x: 155, y: 245 }, stageDistance: '8m' },
  { id: 2, number: 2, shape: 'round', capacity: 4, area: 'vip', nearWindow: false, position: { x: 155, y: 325 }, stageDistance: '9m' },
  { id: 3, number: 3, shape: 'round', capacity: 2, area: 'vip', nearWindow: false, position: { x: 80, y: 290 }, stageDistance: '9m' },
  { id: 4, number: 4, shape: 'round', capacity: 2, area: 'indoor', nearWindow: true, position: { x: 105, y: 455 }, stageDistance: '5m' },
  { id: 5, number: 5, shape: 'round', capacity: 2, area: 'indoor', nearWindow: true, position: { x: 105, y: 540 }, stageDistance: '6m' },
  { id: 6, number: 6, shape: 'round', capacity: 4, area: 'indoor', nearWindow: true, position: { x: 105, y: 630 }, stageDistance: '7m' },
  { id: 7, number: 7, shape: 'square', capacity: 4, area: 'indoor', nearWindow: true, position: { x: 105, y: 720 }, stageDistance: '8m' },
  { id: 8, number: 8, shape: 'round', capacity: 4, area: 'indoor', nearWindow: false, position: { x: 280, y: 430 }, stageDistance: '2m' },
  { id: 9, number: 9, shape: 'round', capacity: 4, area: 'indoor', nearWindow: false, position: { x: 400, y: 425 }, stageDistance: '3m' },
  { id: 10, number: 10, shape: 'round', capacity: 4, area: 'indoor', nearWindow: false, position: { x: 280, y: 525 }, stageDistance: '3m' },
  { id: 11, number: 11, shape: 'round', capacity: 4, area: 'indoor', nearWindow: false, position: { x: 400, y: 520 }, stageDistance: '4m' },
  { id: 12, number: 12, shape: 'square', capacity: 2, area: 'indoor', nearWindow: false, position: { x: 220, y: 600 }, stageDistance: '4m' },
  { id: 13, number: 13, shape: 'round', capacity: 4, area: 'indoor', nearWindow: false, position: { x: 340, y: 620 }, stageDistance: '4m' },
  { id: 14, number: 14, shape: 'rectangle', capacity: 6, area: 'indoor', nearWindow: false, position: { x: 260, y: 720 }, stageDistance: '5m' },
  { id: 15, number: 15, shape: 'rectangle', capacity: 6, area: 'indoor', nearWindow: false, position: { x: 400, y: 635 }, stageDistance: '5m' },
  { id: 16, number: 16, shape: 'rectangle', capacity: 8, area: 'indoor', nearWindow: false, position: { x: 400, y: 745 }, stageDistance: '6m' },
  { id: 17, number: 17, shape: 'round', capacity: 4, area: 'indoor', nearWindow: false, position: { x: 530, y: 430 }, stageDistance: '4m' },
  { id: 18, number: 18, shape: 'round', capacity: 4, area: 'indoor', nearWindow: false, position: { x: 530, y: 530 }, stageDistance: '5m' },
  { id: 19, number: 19, shape: 'rectangle', capacity: 6, area: 'indoor', nearWindow: false, position: { x: 530, y: 635 }, stageDistance: '6m' },
  { id: 20, number: 20, shape: 'rectangle', capacity: 10, area: 'indoor', nearWindow: false, position: { x: 300, y: 830 }, stageDistance: '6m' },
  { id: 21, number: 21, shape: 'rectangle', capacity: 8, area: 'indoor', nearWindow: false, position: { x: 530, y: 755 }, stageDistance: '7m' },
  { id: 22, number: 22, shape: 'round', capacity: 2, area: 'indoor', nearWindow: false, position: { x: 660, y: 290 }, stageDistance: '6m' },
  { id: 23, number: 23, shape: 'round', capacity: 2, area: 'indoor', nearWindow: false, position: { x: 740, y: 290 }, stageDistance: '7m' },
  { id: 24, number: 24, shape: 'square', capacity: 2, area: 'outdoor', nearWindow: false, position: { x: 980, y: 460 } },
  { id: 25, number: 25, shape: 'square', capacity: 2, area: 'outdoor', nearWindow: false, position: { x: 980, y: 545 } },
  { id: 26, number: 26, shape: 'round', capacity: 4, area: 'outdoor', nearWindow: false, position: { x: 980, y: 640 } },
  { id: 27, number: 27, shape: 'rectangle', capacity: 6, area: 'outdoor', nearWindow: false, position: { x: 980, y: 745 } },
  { id: 28, number: 28, shape: 'square', capacity: 4, area: 'outdoor', nearWindow: false, position: { x: 870, y: 640 } },
  { id: 29, number: 29, shape: 'rectangle', capacity: 6, area: 'outdoor', nearWindow: false, position: { x: 980, y: 850 } },
]

const reservedIds = new Set([3, 7, 13, 20])
const disabledIds = new Set([29])

export const tables: TableData[] = baseTables.map(t => {
  let status: TableStatus = 'available'
  if (reservedIds.has(t.id)) status = 'reserved'
  if (disabledIds.has(t.id)) status = 'disabled'
  return { ...t, status }
})
