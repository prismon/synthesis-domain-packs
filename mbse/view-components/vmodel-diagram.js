// V-Model Traceability Diagram — domain-pack web component
// SVG-based V-shaped layout: needs → requirements → design → tests
// Depends on window.synthesis.DomainItemView

const { DomainItemView } = window.synthesis

// ─── Layout constants ──────────────────────────────────

const NODE_W = 200
const NODE_H = 80
const H_SPREAD = 340
const V_STEP = 160
const CX = 600
const TOP_Y = 60
const ARROW_SIZE = 6

// ─── Color palette ─────────────────────────────────────

const COLORS = {
  need: '#0891b2',
  requirement: '#0d9488',
  block: '#059669',
  activity: '#4f46e5',
  testCase: '#7c3aed',
  edge: '#94a3b8',
}

// ─── SVG helpers ───────────────────────────────────────

function svgRect(x, y, w, h, color, rx = 8) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${color}14" stroke="${color}60" stroke-width="1.5"/>`
}

function svgText(x, y, text, opts = {}) {
  const size = opts.size || 11
  const weight = opts.weight || 400
  const fill = opts.fill || 'currentColor'
  const anchor = opts.anchor || 'middle'
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" dominant-baseline="middle">${escaped}</text>`
}

function svgArrow(x1, y1, x2, y2, color, label, dashed) {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len === 0) return ''

  const ux = dx / len
  const uy = dy / len

  // Shorten by arrow size
  const ex = x2 - ux * ARROW_SIZE
  const ey = y2 - uy * ARROW_SIZE

  const dashAttr = dashed ? ` stroke-dasharray="6 3"` : ''

  // Bezier curve for smoother edges
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const cx1 = x1 + dx * 0.3
  const cy1 = y1 + dy * 0.05
  const cx2 = x1 + dx * 0.7
  const cy2 = y1 + dy * 0.95

  let svg = `<path d="M${x1},${y1} C${cx1},${cy1} ${cx2},${cy2} ${ex},${ey}" fill="none" stroke="${color}" stroke-width="1.2"${dashAttr}/>`

  // Arrowhead
  const ax = -ux * ARROW_SIZE
  const ay = -uy * ARROW_SIZE
  const px = -uy * ARROW_SIZE * 0.5
  const py = ux * ARROW_SIZE * 0.5
  svg += `<polygon points="${x2},${y2} ${x2 + ax + px},${y2 + ay + py} ${x2 + ax - px},${y2 + ay - py}" fill="${color}"/>`

  // Label at midpoint
  if (label) {
    svg += `<rect x="${mx - 30}" y="${my - 8}" width="60" height="16" rx="3" fill="hsl(var(--background))" opacity="0.85"/>`
    svg += svgText(mx, my, label, { size: 9, fill: color })
  }

  return svg
}

// ─── Node renderer ─────────────────────────────────────

function renderNode(x, y, item, stereotype, color, badge) {
  const label = item.spec?.displayName ?? item.metadata.name
  const truncLabel = label.length > 24 ? label.slice(0, 22) + '…' : label

  let svg = svgRect(x, y, NODE_W, NODE_H, color)
  svg += svgText(x + NODE_W / 2, y + 16, `«${stereotype}»`, { size: 9, fill: `${color}99` })
  svg += svgText(x + NODE_W / 2, y + 34, truncLabel, { size: 12, weight: 600 })

  if (badge) {
    svg += `<rect x="${x + NODE_W / 2 - 28}" y="${y + 48}" width="56" height="16" rx="4" fill="${color}25"/>`
    svg += svgText(x + NODE_W / 2, y + 56, badge, { size: 9, fill: color })
  }

  return svg
}

// ─── Phase boundary ────────────────────────────────────

function renderPhase(x, y, w, h, label, color) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${color}08" stroke="${color}30" stroke-width="1" stroke-dasharray="6 3"/>` +
    svgText(x + 12, y + 14, label.toUpperCase(), { size: 9, weight: 600, fill: `${color}80`, anchor: 'start' })
}

// ─── Main class ────────────────────────────────────────

class VModelDiagram extends DomainItemView {
  static tagName = 'synth-vmodel-diagram'

  render() {
    const shadow = this.shadowRoot
    const cfg = this.config
    const needKind = cfg.needKind || 'mbse.stakeholder-need'
    const reqKind = cfg.requirementKind || 'mbse.requirement'
    const blockKind = cfg.blockKind || 'mbse.block'
    const actKind = cfg.activityKind || 'mbse.activity'
    const tcKind = cfg.testCaseKind || 'mbse.test-case'

    const needs = this.items[needKind] ?? []
    const reqs = this.items[reqKind] ?? []
    const blocks = this.items[blockKind] ?? []
    const acts = this.items[actKind] ?? []
    const tests = this.items[tcKind] ?? []

    // UID → name lookup for ref resolution
    const nameToUid = new Map()
    this.allItems.forEach(i => nameToUid.set(i.metadata.name, i.metadata.uid))

    // Position calculations
    const nodePositions = new Map() // uid → {x, y, cx, cy}

    // Needs: top-left
    needs.forEach((n, i) => {
      const x = CX - H_SPREAD - NODE_W / 2
      const y = TOP_Y + 30 + i * (NODE_H + 20)
      nodePositions.set(n.metadata.uid, { x, y, cx: x + NODE_W / 2, cy: y + NODE_H / 2, kind: needKind })
    })

    // Requirements: mid-left
    reqs.forEach((r, i) => {
      const x = CX - H_SPREAD * 0.5 - NODE_W / 2
      const y = TOP_Y + V_STEP + 30 + i * (NODE_H + 20)
      nodePositions.set(r.metadata.uid, { x, y, cx: x + NODE_W / 2, cy: y + NODE_H / 2, kind: reqKind })
    })

    // Design: bottom center
    const designItems = [...blocks, ...acts]
    designItems.forEach((d, i) => {
      const col = i % 2
      const row = Math.floor(i / 2)
      const x = CX - NODE_W - 10 + col * (NODE_W + 20)
      const y = TOP_Y + V_STEP * 2 + 30 + row * (NODE_H + 20)
      nodePositions.set(d.metadata.uid, { x, y, cx: x + NODE_W / 2, cy: y + NODE_H / 2, kind: d.kind })
    })

    // Tests: mid-right (mirror of requirements)
    tests.forEach((t, i) => {
      const x = CX + H_SPREAD * 0.5 - NODE_W / 2
      const y = TOP_Y + V_STEP + 30 + i * (NODE_H + 20)
      nodePositions.set(t.metadata.uid, { x, y, cx: x + NODE_W / 2, cy: y + NODE_H / 2, kind: tcKind })
    })

    // Compute SVG size
    let maxX = 0, maxY = 0
    nodePositions.forEach(p => {
      maxX = Math.max(maxX, p.x + NODE_W + 40)
      maxY = Math.max(maxY, p.y + NODE_H + 40)
    })
    const svgW = Math.max(maxX, 1200)
    const svgH = Math.max(maxY, 600)

    // Build SVG
    let svg = ''

    // Phase boundaries
    const needsH = Math.max(needs.length * (NODE_H + 20) + 40, NODE_H + 60)
    const reqsH = Math.max(reqs.length * (NODE_H + 20) + 40, NODE_H + 60)
    const designH = Math.max(Math.ceil(designItems.length / 2) * (NODE_H + 20) + 40, NODE_H + 60)
    const testsH = Math.max(tests.length * (NODE_H + 20) + 40, NODE_H + 60)

    svg += renderPhase(CX - H_SPREAD - NODE_W / 2 - 20, TOP_Y, NODE_W + 40, needsH, 'Stakeholder Needs', COLORS.need)
    svg += renderPhase(CX - H_SPREAD * 0.5 - NODE_W / 2 - 20, TOP_Y + V_STEP, NODE_W + 40, reqsH, 'Requirements', COLORS.requirement)
    svg += renderPhase(CX - NODE_W - 30, TOP_Y + V_STEP * 2, NODE_W * 2 + 60, designH, 'Design', COLORS.block)
    svg += renderPhase(CX + H_SPREAD * 0.5 - NODE_W / 2 - 20, TOP_Y + V_STEP, NODE_W + 40, testsH, 'Verification', COLORS.testCase)

    // Traceability edges
    const edgeGroup = []

    // derives-from: req → need
    reqs.forEach(r => {
      const refs = r.spec?.derivedFromNeeds ?? []
      refs.forEach(needName => {
        const needUid = nameToUid.get(needName)
        const rp = nodePositions.get(r.metadata.uid)
        const np = nodePositions.get(needUid)
        if (rp && np) edgeGroup.push(svgArrow(np.cx, np.cy + NODE_H / 2, rp.cx, rp.cy - NODE_H / 2, COLORS.need, 'derives', false))
      })
    })

    // satisfies: block/act → req
    ;[...blocks, ...acts].forEach(d => {
      const refs = d.spec?.satisfiesReqs ?? []
      refs.forEach(reqName => {
        const reqUid = nameToUid.get(reqName)
        const dp = nodePositions.get(d.metadata.uid)
        const rp = nodePositions.get(reqUid)
        if (dp && rp) edgeGroup.push(svgArrow(dp.cx, dp.cy - NODE_H / 2, rp.cx, rp.cy + NODE_H / 2, COLORS.block, 'satisfies', true))
      })
    })

    // verifies: test → req
    tests.forEach(t => {
      const refs = t.spec?.verifiesReqs ?? []
      refs.forEach(reqName => {
        const reqUid = nameToUid.get(reqName)
        const tp = nodePositions.get(t.metadata.uid)
        const rp = nodePositions.get(reqUid)
        if (tp && rp) edgeGroup.push(svgArrow(tp.cx, tp.cy + NODE_H / 2, rp.cx + NODE_W / 2, rp.cy, COLORS.testCase, 'verifies', true))
      })
    })

    svg += edgeGroup.join('')

    // Nodes
    needs.forEach(n => {
      const p = nodePositions.get(n.metadata.uid)
      svg += `<g class="node" data-uid="${n.metadata.uid}" data-kind="${needKind}">` +
        renderNode(p.x, p.y, n, 'need', COLORS.need, n.spec?.priority) + '</g>'
    })
    reqs.forEach(r => {
      const p = nodePositions.get(r.metadata.uid)
      const level = r.spec?.level ? ` (${r.spec.level})` : ''
      svg += `<g class="node" data-uid="${r.metadata.uid}" data-kind="${reqKind}">` +
        renderNode(p.x, p.y, r, `requirement${level}`, COLORS.requirement, r.spec?.verificationMethod) + '</g>'
    })
    blocks.forEach(b => {
      const p = nodePositions.get(b.metadata.uid)
      svg += `<g class="node" data-uid="${b.metadata.uid}" data-kind="${blockKind}">` +
        renderNode(p.x, p.y, b, `block (${b.spec?.blockType || 'system'})`, COLORS.block) + '</g>'
    })
    acts.forEach(a => {
      const p = nodePositions.get(a.metadata.uid)
      svg += `<g class="node" data-uid="${a.metadata.uid}" data-kind="${actKind}">` +
        renderNode(p.x, p.y, a, `activity`, COLORS.activity) + '</g>'
    })
    tests.forEach(t => {
      const p = nodePositions.get(t.metadata.uid)
      svg += `<g class="node" data-uid="${t.metadata.uid}" data-kind="${tcKind}">` +
        renderNode(p.x, p.y, t, `test (${t.spec?.method || 'test'})`, COLORS.testCase, t.spec?.testStatus) + '</g>'
    })

    // Legend
    const total = this.allItems.length
    const legendItems = [
      { label: 'Needs', count: needs.length, color: COLORS.need },
      { label: 'Requirements', count: reqs.length, color: COLORS.requirement },
      { label: 'Blocks', count: blocks.length, color: COLORS.block },
      { label: 'Activities', count: acts.length, color: COLORS.activity },
      { label: 'Test Cases', count: tests.length, color: COLORS.testCase },
    ]

    shadow.innerHTML = `
      <style>
        ${this.themeStyles()}
        :host { display: block; overflow: hidden; }
        .container { width: 100%; height: calc(100vh - 220px); min-height: 400px; overflow: auto; position: relative; }
        .legend {
          position: absolute; top: 12px; left: 12px; z-index: 10;
          background: hsl(var(--background) / 0.85); backdrop-filter: blur(8px);
          border: 1px solid hsl(var(--border) / 0.5); border-radius: 8px;
          padding: 6px 12px; display: flex; align-items: center; gap: 12px;
          font-size: 11px; font-family: var(--font-mono, monospace);
        }
        .legend-item { display: flex; align-items: center; gap: 4px; color: hsl(var(--muted-foreground)); }
        .legend-dot { width: 8px; height: 8px; border-radius: 50%; }
        svg { font-family: 'DM Sans', system-ui, sans-serif; }
        .node { cursor: pointer; }
        .node:hover rect { filter: brightness(1.15); }
      </style>
      <div class="container">
        <div class="legend">
          ${legendItems.map(l => `<span class="legend-item"><span class="legend-dot" style="background:${l.color}"></span>${l.count} ${l.label.toLowerCase()}</span>`).join('')}
          <span style="color:hsl(var(--muted-foreground));opacity:0.5">|</span>
          <span style="color:hsl(var(--muted-foreground))">${total} total</span>
        </div>
        <svg viewBox="0 0 ${svgW} ${svgH}" width="${svgW}" height="${svgH}" style="color:hsl(var(--foreground))">
          ${svg}
        </svg>
      </div>
    `

    // Click handlers
    shadow.querySelectorAll('.node').forEach(node => {
      node.addEventListener('click', () => {
        const uid = node.getAttribute('data-uid')
        const kind = node.getAttribute('data-kind')
        this.inspect(uid, kind)
      })
    })
  }
}

DomainItemView.register(VModelDiagram)
