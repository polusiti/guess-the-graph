'use client'

import { useEffect, useRef } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

type Props = {
  latex: string
  block?: boolean
  className?: string
}

export default function FormulaDisplay({ latex, block = true, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    try {
      katex.render(latex, ref.current, {
        displayMode: block,
        throwOnError: false,
        errorColor: '#b03030',
      })
    } catch {
      if (ref.current) ref.current.textContent = latex
    }
  }, [latex, block])

  return <div ref={ref} className={className} />
}
