'use client'

import { useEffect, useRef } from 'react'
import type { Formula } from '@/lib/questions'
import { drawGraph } from '@/lib/graphRenderer'

type Props = {
  formula: Formula
  xRange: [number, number]
  yRange: [number, number]
  width?: number
  height?: number
  theme?: 'default' | 'correct' | 'wrong' | 'dim'
}

export default function GraphCanvas({
  formula,
  xRange,
  yRange,
  width = 200,
  height = 200,
  theme = 'default',
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawGraph(canvas, { formula, xRange, yRange, width, height, theme })
  }, [formula, xRange, yRange, width, height, theme])

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', borderRadius: '2px' }}
    />
  )
}
