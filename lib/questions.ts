export type CartesianFormula = {
  kind: 'cartesian'
  latex: string
  eval: (x: number) => number
}

export type ParametricFormula = {
  kind: 'parametric'
  latex: string
  evalX: (t: number) => number
  evalY: (t: number) => number
  tRange: [number, number]
}

export type Formula = CartesianFormula | ParametricFormula

export type Question = {
  id: string
  category: 'composite' | 'trigonometric' | 'exponential' | 'algebraic' | 'parametric'
  difficulty: 1 | 2 | 3
  correct: Formula
  fakes: [Formula, Formula, Formula]
  xRange: [number, number]
  yRange: [number, number]
}

const { sin, cos, tan, asin, acos, atan, exp, log, abs, sqrt, floor, PI } = Math

export const questions: Question[] = [
  {
    id: 'q01',
    category: 'composite',
    difficulty: 3,
    correct: {
      kind: 'cartesian',
      latex: 'y = \\cos(\\sin x - x)',
      eval: (x) => cos(sin(x) - x),
    },
    fakes: [
      { kind: 'cartesian', latex: 'y = \\sin(\\cos x - x)', eval: (x) => sin(cos(x) - x) },
      { kind: 'cartesian', latex: 'y = \\cos(\\sin x + x)', eval: (x) => cos(sin(x) + x) },
      { kind: 'cartesian', latex: 'y = \\cos(2\\sin x - x)', eval: (x) => cos(2 * sin(x) - x) },
    ],
    xRange: [-8, 8],
    yRange: [-1.5, 1.5],
  },
  {
    id: 'q02',
    category: 'composite',
    difficulty: 2,
    correct: {
      kind: 'cartesian',
      latex: 'y = x\\sin\\dfrac{1}{x}',
      eval: (x) => (x === 0 ? 0 : x * sin(1 / x)),
    },
    fakes: [
      { kind: 'cartesian', latex: 'y = \\sin\\dfrac{1}{x}', eval: (x) => (x === 0 ? NaN : sin(1 / x)) },
      { kind: 'cartesian', latex: 'y = x\\cos\\dfrac{1}{x}', eval: (x) => (x === 0 ? 0 : x * cos(1 / x)) },
      { kind: 'cartesian', latex: 'y = \\dfrac{\\sin x}{x}', eval: (x) => (x === 0 ? 1 : sin(x) / x) },
    ],
    xRange: [-1.2, 1.2],
    yRange: [-1.3, 1.3],
  },
  {
    id: 'q03',
    category: 'composite',
    difficulty: 2,
    correct: {
      kind: 'cartesian',
      latex: 'y = \\dfrac{\\sin x}{x}',
      eval: (x) => (x === 0 ? 1 : sin(x) / x),
    },
    fakes: [
      { kind: 'cartesian', latex: 'y = \\dfrac{\\cos x}{x}', eval: (x) => (x === 0 ? NaN : cos(x) / x) },
      { kind: 'cartesian', latex: 'y = \\dfrac{\\sin 2x}{x}', eval: (x) => (x === 0 ? 2 : sin(2 * x) / x) },
      { kind: 'cartesian', latex: 'y = \\dfrac{\\sin x^2}{x}', eval: (x) => (x === 0 ? 0 : sin(x * x) / x) },
    ],
    xRange: [-12, 12],
    yRange: [-0.5, 1.3],
  },
  {
    id: 'q04',
    category: 'exponential',
    difficulty: 2,
    correct: {
      kind: 'cartesian',
      latex: 'y = e^{\\sin x}',
      eval: (x) => exp(sin(x)),
    },
    fakes: [
      { kind: 'cartesian', latex: 'y = \\sin(e^x)', eval: (x) => sin(exp(x)) },
      { kind: 'cartesian', latex: 'y = e^{\\cos x}', eval: (x) => exp(cos(x)) },
      { kind: 'cartesian', latex: 'y = e^{\\sin x/2}', eval: (x) => exp(sin(x) / 2) },
    ],
    xRange: [-8, 8],
    yRange: [-0.2, 3.5],
  },
  {
    id: 'q05',
    category: 'composite',
    difficulty: 2,
    correct: {
      kind: 'cartesian',
      latex: 'y = \\sin(\\sin x)',
      eval: (x) => sin(sin(x)),
    },
    fakes: [
      { kind: 'cartesian', latex: 'y = \\cos(\\sin x)', eval: (x) => cos(sin(x)) },
      { kind: 'cartesian', latex: 'y = \\sin(x + \\sin x)', eval: (x) => sin(x + sin(x)) },
      { kind: 'cartesian', latex: 'y = \\sin^2 x', eval: (x) => sin(x) * sin(x) },
    ],
    xRange: [-9, 9],
    yRange: [-1.2, 1.2],
  },
  {
    id: 'q06',
    category: 'composite',
    difficulty: 2,
    correct: {
      kind: 'cartesian',
      latex: 'y = \\cos(x^2)',
      eval: (x) => cos(x * x),
    },
    fakes: [
      { kind: 'cartesian', latex: 'y = \\sin(x^2)', eval: (x) => sin(x * x) },
      { kind: 'cartesian', latex: 'y = \\cos^2 x', eval: (x) => cos(x) * cos(x) },
      { kind: 'cartesian', latex: 'y = \\cos(2x^2)', eval: (x) => cos(2 * x * x) },
    ],
    xRange: [-5, 5],
    yRange: [-1.3, 1.3],
  },
  {
    id: 'q07',
    category: 'exponential',
    difficulty: 2,
    correct: {
      kind: 'cartesian',
      latex: 'y = xe^{-x^2}',
      eval: (x) => x * exp(-x * x),
    },
    fakes: [
      { kind: 'cartesian', latex: 'y = e^{-x^2}', eval: (x) => exp(-x * x) },
      { kind: 'cartesian', latex: 'y = x^2 e^{-x^2}', eval: (x) => x * x * exp(-x * x) },
      { kind: 'cartesian', latex: 'y = xe^{-|x|}', eval: (x) => x * exp(-abs(x)) },
    ],
    xRange: [-3, 3],
    yRange: [-0.9, 0.9],
  },
  {
    id: 'q08',
    category: 'composite',
    difficulty: 3,
    correct: {
      kind: 'cartesian',
      latex: 'y = \\tan(\\sin x)',
      eval: (x) => tan(sin(x)),
    },
    fakes: [
      { kind: 'cartesian', latex: 'y = \\sin(\\tan x)', eval: (x) => sin(tan(x)) },
      { kind: 'cartesian', latex: 'y = \\arctan(\\sin x)', eval: (x) => atan(sin(x)) },
      { kind: 'cartesian', latex: 'y = \\tan(\\cos x)', eval: (x) => tan(cos(x)) },
    ],
    xRange: [-8, 8],
    yRange: [-2.5, 2.5],
  },
  {
    id: 'q09',
    category: 'trigonometric',
    difficulty: 2,
    correct: {
      kind: 'cartesian',
      latex: 'y = \\sin x \\cos 3x',
      eval: (x) => sin(x) * cos(3 * x),
    },
    fakes: [
      { kind: 'cartesian', latex: 'y = \\sin 3x \\cos x', eval: (x) => sin(3 * x) * cos(x) },
      { kind: 'cartesian', latex: 'y = \\sin x \\cos 2x', eval: (x) => sin(x) * cos(2 * x) },
      { kind: 'cartesian', latex: 'y = \\sin x + \\cos 3x', eval: (x) => sin(x) + cos(3 * x) },
    ],
    xRange: [-8, 8],
    yRange: [-1.3, 1.3],
  },
  {
    id: 'q10',
    category: 'trigonometric',
    difficulty: 3,
    correct: {
      kind: 'cartesian',
      latex: 'y = \\sin x + \\sin(\\sqrt{2}\\,x)',
      eval: (x) => sin(x) + sin(Math.SQRT2 * x),
    },
    fakes: [
      { kind: 'cartesian', latex: 'y = \\sin x + \\cos(\\sqrt{2}\\,x)', eval: (x) => sin(x) + cos(Math.SQRT2 * x) },
      { kind: 'cartesian', latex: 'y = \\sin x + \\sin 2x', eval: (x) => sin(x) + sin(2 * x) },
      { kind: 'cartesian', latex: 'y = 2\\sin x\\cos(\\sqrt{2}\\,x)', eval: (x) => 2 * sin(x) * cos(Math.SQRT2 * x) },
    ],
    xRange: [-18, 18],
    yRange: [-2.5, 2.5],
  },
  {
    id: 'q11',
    category: 'composite',
    difficulty: 2,
    correct: {
      kind: 'cartesian',
      latex: 'y = \\arctan(\\sin x)',
      eval: (x) => atan(sin(x)),
    },
    fakes: [
      { kind: 'cartesian', latex: 'y = \\arctan x', eval: (x) => atan(x) },
      { kind: 'cartesian', latex: 'y = \\arctan(\\cos x)', eval: (x) => atan(cos(x)) },
      { kind: 'cartesian', latex: 'y = \\sin(\\arctan x)', eval: (x) => sin(atan(x)) },
    ],
    xRange: [-8, 8],
    yRange: [-2, 2],
  },
  {
    id: 'q12',
    category: 'composite',
    difficulty: 3,
    correct: {
      kind: 'cartesian',
      latex: 'y = \\ln|\\sin x|',
      eval: (x) => {
        const v = abs(sin(x))
        return v < 1e-10 ? NaN : log(v)
      },
    },
    fakes: [
      {
        kind: 'cartesian',
        latex: 'y = \\ln|\\cos x|',
        eval: (x) => {
          const v = abs(cos(x))
          return v < 1e-10 ? NaN : log(v)
        },
      },
      { kind: 'cartesian', latex: 'y = \\sin(\\ln|x|)', eval: (x) => (x === 0 ? NaN : sin(log(abs(x)))) },
      { kind: 'cartesian', latex: 'y = \\ln(x^2+1)', eval: (x) => log(x * x + 1) },
    ],
    xRange: [-9, 9],
    yRange: [-5, 0.2],
  },
  {
    id: 'q13',
    category: 'exponential',
    difficulty: 2,
    correct: {
      kind: 'cartesian',
      latex: 'y = e^{-|x|}\\cos 3x',
      eval: (x) => exp(-abs(x)) * cos(3 * x),
    },
    fakes: [
      { kind: 'cartesian', latex: 'y = e^{-x^2}\\cos 3x', eval: (x) => exp(-x * x) * cos(3 * x) },
      { kind: 'cartesian', latex: 'y = e^{-|x|}\\sin 3x', eval: (x) => exp(-abs(x)) * sin(3 * x) },
      { kind: 'cartesian', latex: 'y = e^{-|x|}\\cos x', eval: (x) => exp(-abs(x)) * cos(x) },
    ],
    xRange: [-4, 4],
    yRange: [-1.3, 1.3],
  },
  {
    id: 'q14',
    category: 'composite',
    difficulty: 3,
    correct: {
      kind: 'cartesian',
      latex: 'y = \\cos x\\cdot e^{-\\sin x}',
      eval: (x) => cos(x) * exp(-sin(x)),
    },
    fakes: [
      { kind: 'cartesian', latex: 'y = \\sin x\\cdot e^{-\\cos x}', eval: (x) => sin(x) * exp(-cos(x)) },
      { kind: 'cartesian', latex: 'y = \\cos x\\cdot e^{-x}', eval: (x) => cos(x) * exp(-x) },
      { kind: 'cartesian', latex: 'y = e^{-\\sin x}', eval: (x) => exp(-sin(x)) },
    ],
    xRange: [-8, 8],
    yRange: [-1.5, 4.5],
  },
  {
    id: 'q15',
    category: 'algebraic',
    difficulty: 2,
    correct: {
      kind: 'cartesian',
      latex: 'y = \\dfrac{x^2-1}{x^2+1}',
      eval: (x) => (x * x - 1) / (x * x + 1),
    },
    fakes: [
      { kind: 'cartesian', latex: 'y = \\dfrac{x-1}{x+1}', eval: (x) => (x === -1 ? NaN : (x - 1) / (x + 1)) },
      { kind: 'cartesian', latex: 'y = \\dfrac{x}{x^2+1}', eval: (x) => x / (x * x + 1) },
      { kind: 'cartesian', latex: 'y = \\dfrac{x^2+1}{x^2-1}', eval: (x) => (x === 1 || x === -1 ? NaN : (x * x + 1) / (x * x - 1)) },
    ],
    xRange: [-5, 5],
    yRange: [-1.5, 1.5],
  },
  {
    id: 'q16',
    category: 'composite',
    difficulty: 2,
    correct: {
      kind: 'cartesian',
      latex: 'y = \\sin(x + \\cos x)',
      eval: (x) => sin(x + cos(x)),
    },
    fakes: [
      { kind: 'cartesian', latex: 'y = \\sin x + \\cos x', eval: (x) => sin(x) + cos(x) },
      { kind: 'cartesian', latex: 'y = \\sin(x - \\cos x)', eval: (x) => sin(x - cos(x)) },
      { kind: 'cartesian', latex: 'y = \\sin x\\cdot\\cos x', eval: (x) => sin(x) * cos(x) },
    ],
    xRange: [-8, 8],
    yRange: [-1.3, 1.3],
  },
  // Parametric questions
  {
    id: 'q17',
    category: 'parametric',
    difficulty: 2,
    correct: {
      kind: 'parametric',
      latex: '\\begin{cases}x=\\cos 3t\\\\y=\\sin 2t\\end{cases}',
      evalX: (t) => cos(3 * t),
      evalY: (t) => sin(2 * t),
      tRange: [0, 2 * PI],
    },
    fakes: [
      {
        kind: 'parametric',
        latex: '\\begin{cases}x=\\cos 2t\\\\y=\\sin 3t\\end{cases}',
        evalX: (t) => cos(2 * t),
        evalY: (t) => sin(3 * t),
        tRange: [0, 2 * PI],
      },
      {
        kind: 'parametric',
        latex: '\\begin{cases}x=\\cos 3t\\\\y=\\cos 2t\\end{cases}',
        evalX: (t) => cos(3 * t),
        evalY: (t) => cos(2 * t),
        tRange: [0, 2 * PI],
      },
      {
        kind: 'parametric',
        latex: '\\begin{cases}x=\\cos t\\\\y=\\sin 2t\\end{cases}',
        evalX: (t) => cos(t),
        evalY: (t) => sin(2 * t),
        tRange: [0, 2 * PI],
      },
    ],
    xRange: [-1.3, 1.3],
    yRange: [-1.3, 1.3],
  },
  {
    id: 'q18',
    category: 'parametric',
    difficulty: 2,
    correct: {
      kind: 'parametric',
      latex: '\\begin{cases}x=t\\cos t\\\\y=t\\sin t\\end{cases}',
      evalX: (t) => t * cos(t),
      evalY: (t) => t * sin(t),
      tRange: [0, 7 * PI],
    },
    fakes: [
      {
        kind: 'parametric',
        latex: '\\begin{cases}x=e^{-t}\\cos t\\\\y=e^{-t}\\sin t\\end{cases}',
        evalX: (t) => exp(-t * 0.15) * cos(t),
        evalY: (t) => exp(-t * 0.15) * sin(t),
        tRange: [0, 7 * PI],
      },
      {
        kind: 'parametric',
        latex: '\\begin{cases}x=t^2\\cos t\\\\y=t^2\\sin t\\end{cases}',
        evalX: (t) => t * t * cos(t) * 0.15,
        evalY: (t) => t * t * sin(t) * 0.15,
        tRange: [0, 7 * PI],
      },
      {
        kind: 'parametric',
        latex: '\\begin{cases}x=t\\sin t\\\\y=t\\cos t\\end{cases}',
        evalX: (t) => t * sin(t),
        evalY: (t) => t * cos(t),
        tRange: [0, 7 * PI],
      },
    ],
    xRange: [-22, 22],
    yRange: [-22, 22],
  },
  {
    id: 'q19',
    category: 'parametric',
    difficulty: 3,
    correct: {
      kind: 'parametric',
      latex: '\\begin{cases}x=\\cos t+\\tfrac{1}{3}\\cos 3t\\\\y=\\sin t-\\tfrac{1}{3}\\sin 3t\\end{cases}',
      evalX: (t) => cos(t) + cos(3 * t) / 3,
      evalY: (t) => sin(t) - sin(3 * t) / 3,
      tRange: [0, 2 * PI],
    },
    fakes: [
      {
        kind: 'parametric',
        latex: '\\begin{cases}x=\\cos t+\\tfrac{1}{2}\\cos 2t\\\\y=\\sin t-\\tfrac{1}{2}\\sin 2t\\end{cases}',
        evalX: (t) => cos(t) + cos(2 * t) / 2,
        evalY: (t) => sin(t) - sin(2 * t) / 2,
        tRange: [0, 2 * PI],
      },
      {
        kind: 'parametric',
        latex: '\\begin{cases}x=\\cos t\\\\y=\\sin t\\end{cases}',
        evalX: (t) => cos(t),
        evalY: (t) => sin(t),
        tRange: [0, 2 * PI],
      },
      {
        kind: 'parametric',
        latex: '\\begin{cases}x=\\cos t+\\tfrac{1}{3}\\sin 3t\\\\y=\\sin t-\\tfrac{1}{3}\\cos 3t\\end{cases}',
        evalX: (t) => cos(t) + sin(3 * t) / 3,
        evalY: (t) => sin(t) - cos(3 * t) / 3,
        tRange: [0, 2 * PI],
      },
    ],
    xRange: [-1.5, 1.5],
    yRange: [-1.5, 1.5],
  },
  {
    id: 'q20',
    category: 'composite',
    difficulty: 3,
    correct: {
      kind: 'cartesian',
      latex: 'y = \\sin x^2 - \\cos x^2',
      eval: (x) => sin(x * x) - cos(x * x),
    },
    fakes: [
      { kind: 'cartesian', latex: 'y = \\sin x - \\cos x', eval: (x) => sin(x) - cos(x) },
      { kind: 'cartesian', latex: 'y = \\sin x^2 + \\cos x^2', eval: (x) => sin(x * x) + cos(x * x) },
      { kind: 'cartesian', latex: 'y = (\\sin x - \\cos x)^2', eval: (x) => (sin(x) - cos(x)) ** 2 },
    ],
    xRange: [-5, 5],
    yRange: [-2, 2],
  },
]
