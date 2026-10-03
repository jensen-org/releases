import { SEGMENTS, curvePoint, graphFrame, type Curve, type Graph } from './graph'

const INK = '#111110'
const TAU = Math.PI * 2

const basePaths = new WeakMap<Graph, Path2D>()

function basePath(graph: Graph) {
  let path = basePaths.get(graph)
  if (!path) {
    path = new Path2D()
    for (const c of graph.base) {
      path.moveTo(c.ax, c.ay)
      path.quadraticCurveTo(c.qx, c.qy, c.bx, c.by)
    }
    basePaths.set(graph, path)
  }
  return path
}

function trace(ctx: CanvasRenderingContext2D, curves: Curve[], grow: number) {
  const reach = Math.floor(SEGMENTS * grow)
  for (const c of curves) {
    ctx.moveTo(c.ax, c.ay)
    for (let k = 1; k <= reach; k++) {
      const [x, y] = curvePoint(c, k / SEGMENTS)
      ctx.lineTo(x, y)
    }
  }
}

export function drawGraph(ctx: CanvasRenderingContext2D, graph: Graph, t: number) {
  const { scene, grow, grow2, fade, pulse, ripple } = graphFrame(graph, t)
  const { nodes, size, scale } = graph

  ctx.clearRect(0, 0, size, size)
  ctx.strokeStyle = INK
  ctx.fillStyle = INK

  ctx.lineWidth = 0.6
  ctx.globalAlpha = 0.09
  ctx.stroke(basePath(graph))

  ctx.lineWidth = 1.2
  ctx.globalAlpha = 0.85 * fade
  ctx.beginPath()
  trace(ctx, scene.curves, grow)
  ctx.stroke()

  if (grow2 > 0) {
    ctx.lineWidth = 0.9
    ctx.globalAlpha = 0.4 * fade
    ctx.setLineDash([2 * scale, 3 * scale])
    ctx.beginPath()
    trace(ctx, scene.curves2, grow2)
    ctx.stroke()
    ctx.setLineDash([])
  }

  const focus = nodes[scene.focus]

  if (scene.blast && grow > 0) {
    ctx.lineWidth = 1
    for (let k = 0; k < 3; k++) {
      const p = (ripple + k / 3) % 1
      ctx.globalAlpha = (1 - p) * 0.22 * fade
      ctx.beginPath()
      ctx.arc(focus.x, focus.y, (6 + p * 70) * scale, 0, TAU)
      ctx.stroke()
    }
  }

  nodes.forEach((node, i) => {
    const hot = scene.hot.has(i)
    const radius = (1.6 + Math.min(node.deg, 6) * 0.35) * scale
    const outer = scene.hot2.has(i) && grow2 > 0.6
    ctx.globalAlpha = hot && grow > 0 ? 0.35 + 0.65 * fade : outer ? 0.35 + 0.35 * fade : 0.35
    ctx.beginPath()
    ctx.arc(node.x, node.y, hot ? radius + scale : radius, 0, TAU)
    ctx.fill()
    if (i === scene.focus && grow > 0) {
      ctx.globalAlpha = 0.25 * fade
      ctx.beginPath()
      ctx.arc(node.x, node.y, (8 + pulse * 10) * scale, 0, TAU)
      ctx.stroke()
    }
  })

  ctx.globalAlpha = 1
}
