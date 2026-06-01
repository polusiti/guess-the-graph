'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { questions, type Question, type Formula } from '@/lib/questions'
import { recordAnswer } from '@/lib/storage'
import FormulaDisplay from '@/components/FormulaDisplay'

const GraphCanvas = dynamic(() => import('@/components/GraphCanvas'), { ssr: false })

type Mode = 'eq2graph' | 'graph2eq'
type Phase = 'question' | 'revealed'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildChoices(q: Question): Formula[] {
  return shuffle([q.correct, ...q.fakes])
}

function pickQuestion(seen: Set<string>): Question | null {
  const unseen = questions.filter((q) => !seen.has(q.id))
  if (unseen.length === 0) return null
  return unseen[Math.floor(Math.random() * unseen.length)]
}

function pickMode(q: Question): Mode {
  if (q.category === 'parametric') return 'graph2eq'
  return Math.random() < 0.5 ? 'eq2graph' : 'graph2eq'
}

// Responsive graph sizes
function useGraphSize() {
  const [size, setSize] = useState({ large: 280, small: 160 })
  useEffect(() => {
    function update() {
      const w = window.innerWidth
      if (w < 480) setSize({ large: 220, small: 100 })
      else if (w < 768) setSize({ large: 260, small: 130 })
      else setSize({ large: 300, small: 170 })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return size
}

export default function PlayPage() {
  const [question, setQuestion] = useState<Question | null>(null)
  const [choices, setChoices] = useState<Formula[]>([])
  const [mode, setMode] = useState<Mode>('eq2graph')
  const [phase, setPhase] = useState<Phase>('question')
  const [selected, setSelected] = useState<number | null>(null)
  const [seen, setSeen] = useState<Set<string>>(new Set())
  const [questionIndex, setQuestionIndex] = useState(0)
  const [sessionCorrect, setSessionCorrect] = useState(0)
  const [done, setDone] = useState(false)
  const { large, small } = useGraphSize()
  const TOTAL = questions.length

  const loadNext = useCallback(() => {
    const q = pickQuestion(seen)
    if (!q) { setDone(true); return }
    const c = buildChoices(q)
    const m = pickMode(q)
    setQuestion(q)
    setChoices(c)
    setMode(m)
    setPhase('question')
    setSelected(null)
    setSeen((prev) => new Set([...prev, q.id]))
    setQuestionIndex((i) => i + 1)
  }, [seen])

  useEffect(() => { loadNext() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleSelect(idx: number) {
    if (phase === 'revealed') return
    setSelected(idx)
    setPhase('revealed')
    const isCorrect = choices[idx] === question!.correct
    if (isCorrect) setSessionCorrect((n) => n + 1)
    recordAnswer(question!.id, question!.category, isCorrect, mode)
  }

  function correctIndex(): number {
    return choices.indexOf(question!.correct)
  }

  function cardState(idx: number): 'default' | 'correct' | 'wrong' | 'dim' {
    if (phase !== 'revealed') return 'default'
    const ci = correctIndex()
    if (idx === ci) return 'correct'
    if (idx === selected) return 'wrong'
    return 'dim'
  }

  if (!question) return null

  if (done) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-4">
        <div className="sketch-box max-w-sm w-full p-8 text-center">
          <h2 className="font-hand text-3xl mb-2">All done!</h2>
          <p className="text-ink-muted mb-6 font-hand text-lg">
            {TOTAL} questions completed
          </p>
          <p className="font-hand text-5xl mb-1">{sessionCorrect}/{TOTAL}</p>
          <p className="text-ink-muted font-hand mb-8">this session</p>
          <button
            className="sketch-btn w-full"
            onClick={() => {
              setSeen(new Set())
              setSessionCorrect(0)
              setDone(false)
              setQuestionIndex(0)
              loadNext()
            }}
          >
            Play again
          </button>
          <a href="/" className="block mt-4 font-hand text-ink-muted underline-offset-2 underline">
            Back to home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* Header bar */}
      <header className="border-b border-grid px-4 py-3 flex items-center justify-between max-w-3xl mx-auto">
        <a href="/" className="font-hand text-xl text-ink-muted hover:text-ink transition-colors">
          ← Guess the Graph
        </a>
        <span className="font-hand text-ink-muted">
          {questionIndex} / {TOTAL}
        </span>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Mode label */}
        <p className="font-hand text-sm text-ink-muted mb-4 tracking-wide uppercase">
          {mode === 'eq2graph' ? 'Which graph matches the equation?' : 'Which equation matches the graph?'}
        </p>

        {/* Question prompt */}
        {mode === 'graph2eq' ? (
          <div className="flex justify-center mb-6">
            <div className="sketch-box p-2 inline-block">
              <GraphCanvas
                formula={question.correct}
                xRange={question.xRange}
                yRange={question.yRange}
                width={large}
                height={large}
              />
            </div>
          </div>
        ) : (
          <div className="sketch-box p-6 mb-6 flex items-center justify-center min-h-[90px]">
            <FormulaDisplay latex={question.correct.latex} block />
          </div>
        )}

        {/* Choices grid */}
        <div className="grid grid-cols-2 gap-4">
          {choices.map((choice, idx) => {
            const state = cardState(idx)
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={phase === 'revealed'}
                className={`choice-card ${state}`}
              >
                {mode === 'eq2graph' ? (
                  <GraphCanvas
                    formula={choice}
                    xRange={question.xRange}
                    yRange={question.yRange}
                    width={small}
                    height={small}
                    theme={state === 'default' ? 'default' : state}
                  />
                ) : (
                  <div className="py-3 px-2 text-center">
                    <FormulaDisplay latex={choice.latex} block={false} className="text-base" />
                  </div>
                )}
                {state === 'correct' && (
                  <span className="absolute top-1.5 right-2 font-hand text-correct text-sm">correct</span>
                )}
                {state === 'wrong' && (
                  <span className="absolute top-1.5 right-2 font-hand text-wrong text-sm">wrong</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Next button */}
        {phase === 'revealed' && (
          <div className="mt-6 flex justify-center">
            <button className="sketch-btn px-10" onClick={loadNext}>
              Next →
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
