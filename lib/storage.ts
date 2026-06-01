export type AnswerRecord = {
  questionId: string
  correct: boolean
  mode: 'eq2graph' | 'graph2eq'
  ts: number
}

export type CategoryStats = {
  total: number
  correct: number
}

export type GameStats = {
  total: number
  correct: number
  byCategory: Record<string, CategoryStats>
  recent: AnswerRecord[]
}

const KEY = 'gtg_stats_v1'
const MAX_RECENT = 100

function empty(): GameStats {
  return { total: 0, correct: 0, byCategory: {}, recent: [] }
}

export function loadStats(): GameStats {
  if (typeof window === 'undefined') return empty()
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as GameStats) : empty()
  } catch {
    return empty()
  }
}

export function recordAnswer(
  questionId: string,
  category: string,
  correct: boolean,
  mode: 'eq2graph' | 'graph2eq',
): GameStats {
  const stats = loadStats()
  stats.total += 1
  if (correct) stats.correct += 1

  if (!stats.byCategory[category]) stats.byCategory[category] = { total: 0, correct: 0 }
  stats.byCategory[category].total += 1
  if (correct) stats.byCategory[category].correct += 1

  stats.recent.push({ questionId, correct, mode, ts: Date.now() })
  if (stats.recent.length > MAX_RECENT) stats.recent = stats.recent.slice(-MAX_RECENT)

  localStorage.setItem(KEY, JSON.stringify(stats))
  return stats
}

export function clearStats(): void {
  localStorage.removeItem(KEY)
}

export function accuracy(stats: GameStats): number {
  return stats.total === 0 ? 0 : Math.round((stats.correct / stats.total) * 100)
}
