import type { Formula } from './questions'

export type DrawConfig = {
  formula: Formula
  xRange: [number, number]
  yRange: [number, number]
  width: number
  height: number
  theme?: 'default' | 'correct' | 'wrong' | 'dim'
}

type Point = [number, number]

const STEPS = 800
const GRID_LINES = 4

// Map data coords to canvas coords
function toCanvas(
  dx: number,
  dy: number,
  xRange: [number, number],
  yRange: [number, number],
  w: number,
  h: number,
): [number, number] {
  const px = ((dx - xRange[0]) / (xRange[1] - xRange[0])) * w
  const py = h - ((dy - yRange[0]) / (yRange[1] - yRange[0])) * h
  return [px, py]
}

function sampleCartesian(
  fn: (x: number) => number,
  xRange: [number, number],
  steps: number,
): Point[] {
  const pts: Point[] = []
  for (let i = 0; i <= steps; i++) {
    const x = xRange[0] + (xRange[1] - xRange[0]) * (i / steps)
    const y = fn(x)
    pts.push([x, y])
  }
  return pts
}

function sampleParametric(
  evalX: (t: number) => number,
  evalY: (t: number) => number,
  tRange: [number, number],
  steps: number,
): Point[] {
  const pts: Point[] = []
  for (let i = 0; i <= steps; i++) {
    const t = tRange[0] + (tRange[1] - tRange[0]) * (i / steps)
    pts.push([evalX(t), evalY(t)])
  }
  return pts
}

export function drawGraph(canvas: HTMLCanvasElement, config: DrawConfig) {
  const { formula, xRange, yRange, width, height, theme = 'default' } = config
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  ctx.scale(dpr, dpr)

  const W = width
  const H = height

  // Colors
  const paperColor = '#faf7f0'
  const gridColor = '#dedad0'
  const axisColor = '#5a5650'
  const curveColor =
    theme === 'correct' ? '#2d7a4f'
    : theme === 'wrong' ? '#b03030'
    : theme === 'dim' ? '#c0bcb0'
    : '#1a1a1a'
  const curveWidth =
    theme === 'dim' ? 1.2 : 2

  // Background
  ctx.fillStyle = paperColor
  ctx.fillRect(0, 0, W, H)

  // Grid lines (faint)
  ctx.strokeStyle = gridColor
  ctx.lineWidth = 0.5
  for (let i = 1; i < GRID_LINES * 2; i++) {
    const gx = (W / (GRID_LINES * 2)) * i
    const gy = (H / (GRID_LINES * 2)) * i
    ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke()
  }

  // Axes
  const [ox, oy] = toCanvas(0, 0, xRange, yRange, W, H)
  ctx.strokeStyle = axisColor
  ctx.lineWidth = 1

  // X axis (only if visible)
  if (oy >= 0 && oy <= H) {
    ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(W, oy); ctx.stroke()
  }
  // Y axis (only if visible)
  if (ox >= 0 && ox <= W) {
    ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, H); ctx.stroke()
  }

  // Sample points
  const rawPts: Point[] =
    formula.kind === 'cartesian'
      ? sampleCartesian(formula.eval, xRange, STEPS)
      : sampleParametric(formula.evalX, formula.evalY, formula.tRange, STEPS * 2)

  const ySpan = yRange[1] - yRange[0]
  const skipThresh = ySpan * 4

  // Draw curve with discontinuity detection
  ctx.strokeStyle = curveColor
  ctx.lineWidth = curveWidth
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'

  let penDown = false
  let prevPy = 0
  ctx.beginPath()

  for (const [dx, dy] of rawPts) {
    if (!isFinite(dy) || isNaN(dy) || dy < yRange[0] - ySpan || dy > yRange[1] + ySpan) {
      penDown = false
      continue
    }
    const [px, py] = toCanvas(dx, dy, xRange, yRange, W, H)
    if (!penDown) {
      ctx.moveTo(px, py)
      penDown = true
    } else if (Math.abs(py - prevPy) > skipThresh) {
      ctx.moveTo(px, py)
    } else {
      ctx.lineTo(px, py)
    }
    prevPy = py
  }
  ctx.stroke()
}
