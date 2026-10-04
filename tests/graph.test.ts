import { describe, expect, it } from 'vitest'
import { LOOP_SECONDS, SCENARIOS, SCENE_SECONDS, STILL_SECONDS, cardFrame, createGraph, curvePoint, graphFrame } from '../src/lib/graph'

const at = (scene: number, seconds: number) => scene * SCENE_SECONDS + seconds

describe('graph geometry', () => {
  const graph = createGraph(640)

  it('places four groups of thirty four nodes on one circle', () => {
    expect(graph.nodes).toHaveLength(136)
    for (const node of graph.nodes) expect(Math.hypot(node.x - graph.cx, node.y - graph.cy)).toBeCloseTo(graph.radius, 6)
    expect(graph.radius).toBeCloseTo(268.8, 6)
  })

  it('is deterministic', () => {
    expect(createGraph(640).edges).toEqual(graph.edges)
    expect(createGraph(320).edges).toEqual(graph.edges)
  })

  it('counts every edge once on each endpoint', () => {
    expect(graph.nodes.reduce((sum, node) => sum + node.deg, 0)).toBe(graph.edges.length * 2)
    expect(graph.base).toHaveLength(graph.edges.length)
  })

  it('scales with the container', () => {
    const small = createGraph(320)
    expect(small.radius).toBeCloseTo(graph.radius / 2, 6)
    expect(small.scale).toBe(0.5)
    expect(graph.scale).toBe(1)
    expect(small.nodes[5].x).toBeCloseTo(graph.nodes[5].x / 2, 6)
  })

  it('gives each scenario a focus with real neighbours', () => {
    expect(graph.scenes).toHaveLength(SCENARIOS.length)
    for (const scene of graph.scenes) {
      expect(graph.nodes[scene.focus].deg).toBeGreaterThanOrEqual(4)
      expect(scene.hot.has(scene.focus)).toBe(true)
      expect(scene.curves.length).toBeGreaterThanOrEqual(graph.nodes[scene.focus].deg)
    }
  })

  it('grows the second ring only for the blast radius scenario', () => {
    graph.scenes.forEach((scene, i) => {
      const blast = SCENARIOS[i].kind === 'blast'
      expect(scene.blast).toBe(blast)
      expect(scene.curves2.length > 0).toBe(blast)
      for (const node of scene.hot2) expect(scene.hot.has(node)).toBe(false)
    })
  })

  it('samples a curve from its start to its end', () => {
    const c = graph.scenes[0].curves[0]
    expect(curvePoint(c, 0)).toEqual([c.ax, c.ay])
    expect(curvePoint(c, 1)).toEqual([c.bx, c.by])
  })
})

describe('graph frame', () => {
  const graph = createGraph(640)

  it('stays dark until the read starts, then grows and fades at the end', () => {
    expect(graphFrame(graph, at(1, 2)).grow).toBe(0)
    expect(graphFrame(graph, at(1, 3.05)).grow).toBeCloseTo(0.5, 6)
    expect(graphFrame(graph, at(1, 4)).grow).toBe(1)
    expect(graphFrame(graph, at(1, 4)).fade).toBe(1)
    expect(graphFrame(graph, at(1, 8.6)).fade).toBeCloseTo(0.5, 6)
    expect(graphFrame(graph, at(1, 9 - 1e-9)).fade).toBeCloseTo(0, 6)
  })

  it('reads the blast radius faster and reaches the second ring later', () => {
    expect(graphFrame(graph, at(3, 3.3)).grow).toBe(1)
    expect(graphFrame(graph, at(3, 3.3)).grow2).toBeCloseTo(0, 6)
    expect(graphFrame(graph, at(3, 4.5)).grow2).toBe(1)
    expect(graphFrame(graph, at(2, 7)).grow2).toBe(0)
  })

  it('moves to the next scenario every nine seconds and loops after the last', () => {
    expect(SCENE_SECONDS).toBe(9)
    expect(graphFrame(graph, at(1, 0)).scene).toBe(graph.scenes[1])
    expect(graphFrame(graph, at(4, 5)).scene).toBe(graph.scenes[4])
    expect(graphFrame(graph, LOOP_SECONDS + 1).scene).toBe(graph.scenes[0])
    expect(LOOP_SECONDS).toBe(SCENARIOS.length * SCENE_SECONDS)
  })

  it('clamps a clock that starts before zero', () => {
    expect(graphFrame(graph, -0.02).scene).toBe(graph.scenes[0])
    expect(cardFrame(-0.02).question).toBe('')
  })
})

describe('card frame', () => {
  it('opens on a minimal bar that shows only the question and its result', () => {
    expect(cardFrame(at(0, 0.2)).minimal).toBe(true)
    expect(cardFrame(at(0, 0.2)).status).toBe('')
    expect(cardFrame(at(0, 1.2)).question.length).toBeGreaterThan(5)
    expect(cardFrame(at(0, 3.79)).status).toBe('5 files')
    expect(cardFrame(at(0, 5)).status).toBe('5 files · 2 services · 0.1s')
    expect(cardFrame(at(0, 7)).diffVisible).toBe(false)
    expect(cardFrame(at(1, 0.2)).minimal).toBe(false)
  })

  it('waits for the question, then types it in a second and a half', () => {
    const idle = cardFrame(at(1, 0.2))
    expect(idle.question).toBe('')
    expect(idle.status).toBe('')
    expect(idle.files).toEqual([false, false, false])
    const half = cardFrame(at(1, 1.2))
    expect(half.question.length).toBeGreaterThan(5)
    expect(half.question.length).toBeLessThan(SCENARIOS[1].question.length)
    expect(cardFrame(at(1, 2.1)).question).toBe(SCENARIOS[1].question)
  })

  it('stays a compact bar while typing and expands once the question is submitted', () => {
    expect(cardFrame(at(1, 0.2)).expanded).toBe(false)
    expect(cardFrame(at(1, 1.2)).expanded).toBe(false)
    expect(cardFrame(at(1, 2.2)).expanded).toBe(false)
    expect(cardFrame(at(1, 2.4)).expanded).toBe(true)
    expect(cardFrame(at(1, 6)).expanded).toBe(true)
  })

  it('counts files while reading and then settles on the summary', () => {
    expect(cardFrame(at(1, 2.4)).status).toBe('Searching graph · 1 files')
    expect(cardFrame(at(1, 3.79)).status).toBe('Searching graph · 7 files')
    expect(cardFrame(at(1, 5)).status).toBe('7 matches · 3 packages · 0.2s')
    expect(cardFrame(at(3, 3.79)).status).toBe('Tracing callers · 23')
    expect(cardFrame(at(3, 5)).status).toBe('Blast radius · 23 callers · 2 hops')
  })

  it('reveals the three files one after another', () => {
    expect(cardFrame(at(1, 2.6)).files).toEqual([true, false, false])
    expect(cardFrame(at(1, 3)).files).toEqual([true, true, false])
    expect(cardFrame(at(1, 3.4)).files).toEqual([true, true, true])
  })

  it('shows a diff only for fix scenarios, once the read is done', () => {
    expect(cardFrame(at(2, 4)).diffVisible).toBe(false)
    expect(cardFrame(at(2, 4.2)).diffVisible).toBe(true)
    expect(cardFrame(at(2, 5)).diff?.file).toBe('payments/retry.ts')
    expect(cardFrame(at(2, 5)).status).toBe('Context · 7 files · 3 packages')
    expect(cardFrame(at(1, 6)).diffVisible).toBe(false)
    expect(cardFrame(at(3, 6)).diff).toBeNull()
    expect(cardFrame(at(4, 6)).diff?.stat).toBe('+1 −0')
  })

  it('hides the whole card just before the scenario ends', () => {
    expect(cardFrame(at(2, 8.2)).visible).toBe(true)
    expect(cardFrame(at(2, 8.5)).visible).toBe(false)
  })

  it('holds the diff on the still frame used for reduced motion', () => {
    const frame = cardFrame(STILL_SECONDS)
    expect(frame.diffVisible).toBe(true)
    expect(frame.visible).toBe(true)
    expect(frame.minimal).toBe(false)
    expect(frame.question).toBe('Why does checkout retry twice?')
    expect(graphFrame(createGraph(640), STILL_SECONDS).grow).toBe(1)
  })

  it('keeps every diff to five rows', () => {
    for (const scenario of SCENARIOS) if (scenario.diff) expect(scenario.diff.rows).toHaveLength(5)
  })
})
