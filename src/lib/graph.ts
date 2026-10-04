export const SCENE_SECONDS = 9
export const TYPE_START = 0.4
export const TYPE_END = 2
export const SUBMIT = 2.3
export const READ_END = 3.8
export const DIFF_AT = 4.1
const CHIP_AT = [2.5, 2.9, 3.3] as const
const FADE_START = 8.2
const FADE_END = 9
const HIDE_AT = 8.3
export const DESIGN_SIZE = 640

const GROUPS = 4
const PER_GROUP = 34
const BUNDLE = 0.12
export const SEGMENTS = 24

export type Node = { x: number; y: number; deg: number }
export type Curve = { ax: number; ay: number; qx: number; qy: number; bx: number; by: number }
export type DiffRow = { kind: -1 | 0 | 1; text: string }

type Scenario = {
  kind: 'search' | 'fix' | 'blast'
  minimal?: boolean
  question: string
  files: [string, string, string]
  count: number
  read: string
  summary: string
  diff?: { file: string; stat: string; note: string; rows: DiffRow[] }
}

export const SCENARIOS: Scenario[] = [
  { kind: 'search', minimal: true, question: 'Who owns the billing webhooks?', files: ['billing/webhook.ts', 'lib/limits.ts', 'infra/redis.ts'], count: 5, read: '', summary: '5 files · 2 services · 0.1s' },
  { kind: 'search', question: 'Where is the session token refreshed?', files: ['auth/session.ts', 'apps/web/client.ts', 'api/middleware.ts'], count: 7, read: 'Searching graph · ', summary: '7 matches · 3 packages · 0.2s' },
  {
    kind: 'fix', question: 'Why does checkout retry twice?', files: ['payments/retry.ts', 'api/checkout.ts', 'lib/queue.ts'], count: 7, read: 'Reading context · ', summary: 'Context · 7 files · 3 packages',
    diff: {
      file: 'payments/retry.ts', stat: '+2 −1', note: "Gateway call wasn't idempotent.",
      rows: [
        { kind: 0, text: 'export function withRetry(fn, opts) {' },
        { kind: -1, text: '  const max = opts.retries ?? 2;' },
        { kind: 1, text: '  const max = opts.retries ?? 1;' },
        { kind: 1, text: '  if (opts.idempotencyKey) return once(fn);' },
        { kind: 0, text: '  return retry(fn, max);' },
      ],
    },
  },
  { kind: 'blast', question: 'What breaks if I change Graph.load?', files: ['core/graph.ts', 'apps/web/search.tsx', 'api/refs.ts'], count: 23, read: 'Tracing callers · ', summary: 'Blast radius · 23 callers · 2 hops' },
  {
    kind: 'fix', question: 'Rate-limit the billing webhook', files: ['billing/webhook.ts', 'lib/limits.ts', 'infra/redis.ts'], count: 5, read: 'Reading context · ', summary: 'Context · 5 files · 2 services',
    diff: {
      file: 'billing/webhook.ts', stat: '+1 −0', note: 'Reuses the existing Redis limiter.',
      rows: [
        { kind: 0, text: 'export async function handle(req) {' },
        { kind: 1, text: "  await limit(req.ip, { per: '1m', max: 60 });" },
        { kind: 0, text: '  verifySignature(req);' },
        { kind: 0, text: '  return process(req.body);' },
        { kind: 0, text: '}' },
      ],
    },
  },
]

export const LOOP_SECONDS = SCENARIOS.length * SCENE_SECONDS
export const STILL_SECONDS = SCENARIOS.findIndex((scenario) => scenario.diff) * SCENE_SECONDS + 6

const hash = (x: number, y: number) => {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return n - Math.floor(n)
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

export type Scene = {
  focus: number
  blast: boolean
  hot: Set<number>
  hot2: Set<number>
  curves: Curve[]
  curves2: Curve[]
}

export type Graph = {
  size: number
  scale: number
  cx: number
  cy: number
  radius: number
  nodes: Node[]
  edges: [number, number][]
  base: Curve[]
  scenes: Scene[]
}

const curve = (a: Node, b: Node, cx: number, cy: number): Curve => ({
  ax: a.x, ay: a.y, bx: b.x, by: b.y,
  qx: cx + (a.x + b.x - 2 * cx) * BUNDLE,
  qy: cy + (a.y + b.y - 2 * cy) * BUNDLE,
})

export function curvePoint(c: Curve, u: number): [number, number] {
  const v = 1 - u
  return [v * v * c.ax + 2 * v * u * c.qx + u * u * c.bx, v * v * c.ay + 2 * v * u * c.qy + u * u * c.by]
}

export function createGraph(size: number): Graph {
  const cx = size / 2
  const cy = size / 2
  const radius = size * 0.42
  const nodes: Node[] = []
  const edges: [number, number][] = []

  for (let g = 0; g < GROUPS; g++) {
    for (let k = 0; k < PER_GROUP; k++) {
      const angle = -Math.PI / 2 + (g + 0.12 + (0.76 * k) / (PER_GROUP - 1)) * ((Math.PI * 2) / GROUPS)
      nodes.push({ x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius, deg: 0 })
    }
  }

  for (let i = 0; i < nodes.length; i++) {
    const links = 1 + Math.floor(hash(i, 3) * 3)
    for (let j = 0; j < links; j++) {
      const target = Math.floor(hash(i, j + 7) * nodes.length)
      if (target === i) continue
      edges.push([i, target])
      nodes[i].deg++
      nodes[target].deg++
    }
  }

  const candidates = nodes.flatMap((node, index) => (node.deg >= 4 ? [index] : []))
  const scenes = SCENARIOS.map((scenario, index): Scene => {
    const focus = candidates[(index * 7 + 3) % candidates.length]
    const hot = new Set([focus])
    const hotEdges = new Set<number>()
    edges.forEach(([a, b], i) => {
      if (a === focus || b === focus) {
        hotEdges.add(i)
        hot.add(a)
        hot.add(b)
      }
    })
    edges.forEach(([a, b], i) => {
      if (hot.has(a) && hot.has(b)) hotEdges.add(i)
    })

    const hot2 = new Set<number>()
    const curves2: Curve[] = []
    const blast = scenario.kind === 'blast'
    if (blast) {
      edges.forEach(([a, b], i) => {
        if (hotEdges.has(i) || hot.has(a) === hot.has(b)) return
        const [from, to] = hot.has(a) ? [a, b] : [b, a]
        hot2.add(to)
        curves2.push(curve(nodes[from], nodes[to], cx, cy))
      })
    }

    const curves = [...hotEdges].map((i) => {
      const [a, b] = edges[i]
      return b === focus ? curve(nodes[b], nodes[a], cx, cy) : curve(nodes[a], nodes[b], cx, cy)
    })

    return { focus, blast, hot, hot2, curves, curves2 }
  })

  return { size, scale: size / DESIGN_SIZE, cx, cy, radius, nodes, edges, base: edges.map(([a, b]) => curve(nodes[a], nodes[b], cx, cy)), scenes }
}

export type GraphFrame = {
  scene: Scene
  grow: number
  grow2: number
  fade: number
  pulse: number
  ripple: number
}

export function graphFrame(graph: Graph, t: number): GraphFrame {
  const loop = Math.max(0, t) % LOOP_SECONDS
  const scene = graph.scenes[Math.floor(loop / SCENE_SECONDS)]
  const lt = loop % SCENE_SECONDS
  const grow = scene.blast ? clamp01((lt - SUBMIT) / 1) : clamp01((lt - SUBMIT) / 1.5)
  return {
    scene,
    grow,
    grow2: scene.blast ? clamp01((lt - SUBMIT - 1) / 1.2) : 0,
    fade: lt > FADE_START ? clamp01(1 - (lt - FADE_START) / (FADE_END - FADE_START)) : 1,
    pulse: lt < SUBMIT ? 0 : ((lt - SUBMIT) % 2) / 2,
    ripple: (lt - SUBMIT) / 2,
  }
}

export type CardFrame = {
  question: string
  caret: boolean
  files: [boolean, boolean, boolean]
  fileNames: [string, string, string]
  status: string
  reading: boolean
  done: boolean
  diff: { file: string; stat: string; note: string; rows: DiffRow[] } | null
  diffVisible: boolean
  minimal: boolean
  expanded: boolean
  visible: boolean
  blink: boolean
}

export function cardFrame(t: number): CardFrame {
  const loop = Math.max(0, t) % LOOP_SECONDS
  const scenario = SCENARIOS[Math.floor(loop / SCENE_SECONDS)]
  const lt = loop % SCENE_SECONDS
  const typed = Math.max(0, Math.min(scenario.question.length, Math.floor(((lt - TYPE_START) * scenario.question.length) / (TYPE_END - TYPE_START))))
  const reading = lt >= SUBMIT && lt < READ_END
  const done = lt >= READ_END
  const typing = lt > TYPE_START && lt < TYPE_END
  const status = lt < SUBMIT
    ? ''
    : reading
      ? `${scenario.read}${Math.max(1, Math.ceil((scenario.count * (lt - SUBMIT)) / (READ_END - SUBMIT)))}${scenario.kind === 'blast' ? '' : ' files'}`
      : scenario.summary
  return {
    question: scenario.question.slice(0, typed),
    caret: lt < SUBMIT && (typing || Math.floor(lt * 2.5) % 2 === 0),
    files: [lt > CHIP_AT[0], lt > CHIP_AT[1], lt > CHIP_AT[2]],
    fileNames: scenario.files,
    status,
    reading,
    done,
    diff: scenario.diff ?? null,
    diffVisible: scenario.diff !== undefined && lt > DIFF_AT,
    minimal: scenario.minimal === true,
    expanded: lt >= SUBMIT,
    visible: lt <= HIDE_AT,
    blink: reading && Math.floor(lt * 5) % 2 === 0,
  }
}
