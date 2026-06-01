'use client'

import { useState, useEffect } from 'react'
import { loadStats, clearStats, accuracy, type GameStats } from '@/lib/storage'
import { questions } from '@/lib/questions'

const CATEGORY_LABELS: Record<string, string> = {
  composite: 'Composite',
  trigonometric: 'Trigonometric',
  exponential: 'Exponential',
  algebraic: 'Algebraic',
  parametric: 'Parametric',
}

function Bar({ value }: { value: number }) {
  return (
    <div className="relative h-2.5 rounded-sm overflow-hidden" style={{ background: '#dedad0' }}>
      <div
        className="absolute left-0 top-0 h-full transition-all duration-500"
        style={{ width: `${value}%`, background: '#1a1a1a' }}
      />
    </div>
  )
}

export default function Home() {
  const [stats, setStats] = useState<GameStats | null>(null)

  useEffect(() => {
    setStats(loadStats())
  }, [])

  function handleClear() {
    if (!window.confirm('Clear all stats?')) return
    clearStats()
    setStats(loadStats())
  }

  const acc = stats ? accuracy(stats) : 0

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12" style={{ background: '#faf7f0' }}>

      {/* Title */}
      <div className="mb-10 text-center">
        <h1 className="font-hand text-6xl sm:text-7xl font-bold mb-2" style={{ color: '#1a1a1a', lineHeight: 1.1 }}>
          Guess the Graph
        </h1>
        <p className="font-hand text-xl" style={{ color: '#6b6760' }}>
          Match equations to graphs — {questions.length} puzzles
        </p>
      </div>

      {/* Start card */}
      <div className="sketch-box max-w-sm w-full p-8 mb-6">
        <a href="/play" className="sketch-btn block text-center w-full text-xl py-3.5">
          Start playing
        </a>

        <div className="mt-6 pt-5" style={{ borderTop: '1px solid #dedad0' }}>
          <p className="font-hand text-sm uppercase tracking-widest mb-3" style={{ color: '#6b6760' }}>
            How to play
          </p>
          <ul className="font-hand text-base space-y-1" style={{ color: '#6b6760', listStyle: 'none', padding: 0 }}>
            <li>— Read the equation, pick the matching graph</li>
            <li>— Or study a graph and identify its formula</li>
            <li>— Parametric curves included</li>
            <li>— enjoy it!</li>
          </ul>
        </div>
      </div>

      {/* Stats card */}
      {stats && stats.total > 0 && (
        <div className="sketch-box max-w-sm w-full p-6 mb-6">
          <div className="flex items-end justify-between mb-3">
            <h2 className="font-hand text-2xl font-semibold" style={{ color: '#1a1a1a' }}>
              Accuracy
            </h2>
            <span className="font-hand text-5xl font-bold" style={{ color: '#1a1a1a', lineHeight: 1 }}>
              {acc}%
            </span>
          </div>
          <Bar value={acc} />
          <p className="font-hand text-sm mt-1.5" style={{ color: '#6b6760' }}>
            {stats.correct} correct out of {stats.total} answered
          </p>

          {Object.keys(stats.byCategory).length > 1 && (
            <div className="mt-5 pt-4" style={{ borderTop: '1px solid #dedad0' }}>
              <p className="font-hand text-sm uppercase tracking-widest mb-3" style={{ color: '#6b6760' }}>
                By category
              </p>
              <div className="space-y-3">
                {Object.entries(stats.byCategory).map(([cat, s]) => {
                  const pct = Math.round((s.correct / s.total) * 100)
                  return (
                    <div key={cat}>
                      <div className="flex justify-between mb-1">
                        <span className="font-hand text-base" style={{ color: '#1a1a1a' }}>
                          {CATEGORY_LABELS[cat] ?? cat}
                        </span>
                        <span className="font-hand text-sm" style={{ color: '#6b6760' }}>
                          {s.correct}/{s.total}
                        </span>
                      </div>
                      <Bar value={pct} />
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <button
            onClick={handleClear}
            className="mt-5 font-hand text-sm underline underline-offset-2 transition-colors hover:opacity-70"
            style={{ color: '#6b6760', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Clear stats
          </button>
        </div>
      )}

      {/* LocalStorage note */}
      <p className="max-w-sm font-hand text-sm text-center leading-relaxed" style={{ color: '#6b6760' }}>
        Progress saved in localStorage — resets when browser data is cleared or on a different device.
      </p>
    </div>
  )
}
