// Activity Diagram — domain-pack web component
// SVG-based activity flow with swim lanes per allocated block
// Depends on window.synthesis.DomainItemView

const { DomainItemView } = window.synthesis

const ACT_W = 180
const ACT_H = 70
const DEC_SIZE = 50
const BAR_W = 140
const BAR_H = 8
const LANE_PAD = 40
const COL_GAP = 220
const ROW_GAP = 110
const ARROW = 6

function esc(t) { return (t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') }
function truncate(t, n) { return t.length > n ? t.slice(0, n - 1) + '…' : t }

function svgArrow(x1, y1, x2, y2, color, dashed) {
  const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy)
  if (len < 1) return ''
  const ux = dx / len, uy = dy / len
  const da = dashed ? ' stroke-dasharray="4 2"' : ''
  const ex = x2 - ux * ARROW, ey = y2 - uy * ARROW
  let s = `<path d="M${x1},${y1} L${ex},${ey}" fill="none" stroke="${color}" stroke-width="1.2"${da}/>`
  const px = -uy * ARROW * 0.4, py = ux * ARROW * 0.4
  s += `<polygon points="${x2},${y2} ${x2 - ux * ARROW + px},${y2 - uy * ARROW + py} ${x2 - ux * ARROW - px},${y2 - uy * ARROW - py}" fill="${color}"/>`
  return s
}

function renderActivity(x, y, item, color, showDetails) {
  const label = truncate(item.spec?.displayName ?? item.metadata.name, 22)
  const atype = item.spec?.activityType || 'action'

  // Decision: diamond
  if (atype === 'decision') {
    const cx = x + DEC_SIZE / 2, cy = y + DEC_SIZE / 2
    return {
      svg: `<g transform="translate(${cx},${cy})">` +
        `<rect x="${-DEC_SIZE / 2}" y="${-DEC_SIZE / 2}" width="${DEC_SIZE}" height="${DEC_SIZE}" rx="3" transform="rotate(45)" fill="${color}12" stroke="${color}55" stroke-width="1.5"/>` +
        `</g>` +
        `<text x="${cx}" y="${cy}" font-size="10" font-weight="600" fill="currentColor" text-anchor="middle" dominant-baseline="middle">${esc(label)}</text>`,
      w: DEC_SIZE,
      h: DEC_SIZE,
      cx, cy,
    }
  }

  // Fork/join: thin bar
  if (atype === 'fork' || atype === 'join') {
    return {
      svg: `<rect x="${x}" y="${y}" width="${BAR_W}" height="${BAR_H}" rx="4" fill="${color}80"/>`,
      w: BAR_W,
      h: BAR_H,
      cx: x + BAR_W / 2,
      cy: y + BAR_H / 2,
    }
  }

  // Standard action
  const borderRadius = atype === 'call-behavior' ? 12 : 12
  const strokeWidth = atype === 'call-behavior' ? 3 : 1.5
  const strokeStyle = atype === 'signal-send' || atype === 'signal-receive' ? ' stroke-dasharray="6 2"' : ''

  let h = ACT_H
  let svg = `<rect x="${x}" y="${y}" width="${ACT_W}" height="${h}" rx="${borderRadius}" fill="${color}12" stroke="${color}55" stroke-width="${strokeWidth}"${strokeStyle}/>`
  svg += `<text x="${x + ACT_W / 2}" y="${y + 16}" font-size="9" fill="${color}88" text-anchor="middle" font-style="italic">«${esc(atype)}»</text>`
  svg += `<text x="${x + ACT_W / 2}" y="${y + 34}" font-size="12" font-weight="600" fill="currentColor" text-anchor="middle">${esc(label)}</text>`

  if (showDetails) {
    const inputs = (item.spec?.inputs || '').split('\n')[0]
    const outputs = (item.spec?.outputs || '').split('\n')[0]
    if (inputs) {
      svg += `<text x="${x + 10}" y="${y + 52}" font-size="9" fill="currentColor" opacity="0.5">in: ${esc(truncate(inputs, 28))}</text>`
    }
    if (outputs) {
      svg += `<text x="${x + 10}" y="${y + 64}" font-size="9" fill="currentColor" opacity="0.5">out: ${esc(truncate(outputs, 28))}</text>`
    }
  }

  return { svg, w: ACT_W, h, cx: x + ACT_W / 2, cy: y + h / 2 }
}

class ActivityDiagram extends DomainItemView {
  static tagName = 'synth-activity-diagram'

  render() {
    const shadow = this.shadowRoot
    const cfg = this.config
    const actKind = cfg.activityKind || 'mbse.activity'
    const blockKind = cfg.blockKind || 'mbse.block'
    const actColor = cfg.activityColor || '#4f46e5'
    const blockColor = cfg.blockColor || '#0891b2'
    const showDetails = cfg.showDetails !== false

    const activities = this.items[actKind] ?? []
    const blocks = this.items[blockKind] ?? []

    const blockNameMap = new Map()
    blocks.forEach(b => blockNameMap.set(b.metadata.name, b.spec?.displayName ?? b.metadata.name))

    // Group by allocated block (swim lanes)
    const laneMap = new Map()
    const unallocated = []
    activities.forEach(a => {
      const allocRef = a.spec?.allocatedToBlockRef
      if (allocRef && blockNameMap.has(allocRef)) {
        if (!laneMap.has(allocRef)) laneMap.set(allocRef, [])
        laneMap.get(allocRef).push(a)
      } else {
        unallocated.push(a)
      }
    })

    const allLanes = []
    if (unallocated.length > 0) allLanes.push({ name: '_unallocated', label: 'Unallocated', items: unallocated })
    laneMap.forEach((items, name) => allLanes.push({ name, label: blockNameMap.get(name) || name, items }))

    // Layout
    const positions = new Map() // uid → { x, y, cx, cy, w, h }
    let curY = 20
    let maxW = 0
    const laneInfo = []

    allLanes.forEach(lane => {
      const cols = Math.min(lane.items.length, 3)
      const rows = Math.ceil(lane.items.length / cols)
      const laneW = cols * COL_GAP + LANE_PAD * 2
      const laneH = rows * ROW_GAP + LANE_PAD * 2 + 30
      const laneColor = lane.name === '_unallocated' ? '#94a3b8' : blockColor

      laneInfo.push({ x: 20, y: curY, w: laneW, h: laneH, label: lane.label, color: laneColor })

      lane.items.forEach((act, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        const nx = 20 + LANE_PAD + col * COL_GAP
        const ny = curY + LANE_PAD + 30 + row * ROW_GAP
        const r = renderActivity(nx, ny, act, actColor, showDetails)
        positions.set(act.metadata.uid, { ...r, item: act })
      })

      maxW = Math.max(maxW, laneW + 60)
      curY += laneH + 20
    })

    // Build UID lookup
    const nameToUid = new Map()
    activities.forEach(a => nameToUid.set(a.metadata.name, a.metadata.uid))

    const svgW = Math.max(maxW, 800)
    const svgH = Math.max(curY + 20, 400)

    let svg = ''

    // Lane boundaries
    laneInfo.forEach(l => {
      svg += `<rect x="${l.x}" y="${l.y}" width="${l.w}" height="${l.h}" rx="12" fill="${l.color}06" stroke="${l.color}22" stroke-width="1" stroke-dasharray="6 3"/>`
      svg += `<text x="${l.x + 14}" y="${l.y + 16}" font-size="9" font-weight="600" fill="${l.color}66" letter-spacing="0.04em">${esc(l.label.toUpperCase())}</text>`
    })

    // Parent-child edges
    const childrenOf = new Map()
    activities.forEach(a => {
      const parentRef = a.spec?.parentActivityRef
      if (parentRef) {
        const parentUid = nameToUid.get(parentRef)
        if (parentUid) {
          if (!childrenOf.has(parentUid)) childrenOf.set(parentUid, [])
          childrenOf.get(parentUid).push(a.metadata.uid)
        }
      }
    })

    childrenOf.forEach((children, parentUid) => {
      const pp = positions.get(parentUid)
      if (!pp) return
      children.forEach(childUid => {
        const cp = positions.get(childUid)
        if (cp) svg += svgArrow(pp.cx, pp.cy + pp.h / 2, cp.cx, cp.cy - cp.h / 2, `${actColor}88`, false)
      })
    })

    // Sequential edges within lanes
    allLanes.forEach(lane => {
      for (let i = 0; i < lane.items.length - 1; i++) {
        const cur = lane.items[i]
        const next = lane.items[i + 1]
        const hasParentEdge = childrenOf.get(cur.metadata.uid)?.includes(next.metadata.uid)
        if (!hasParentEdge) {
          const cp = positions.get(cur.metadata.uid)
          const np = positions.get(next.metadata.uid)
          if (cp && np) svg += svgArrow(cp.cx, cp.cy + cp.h / 2, np.cx, np.cy - np.h / 2, `${actColor}44`, true)
        }
      }
    })

    // Activity nodes
    positions.forEach((p, uid) => {
      svg += `<g class="node" data-uid="${uid}" data-kind="${actKind}">${p.svg}</g>`
    })

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
          <span class="legend-item"><span class="legend-dot" style="background:${actColor}"></span>${activities.length} activities</span>
          <span class="legend-item"><span class="legend-dot" style="background:${blockColor}"></span>${allLanes.length} lanes</span>
        </div>
        <svg viewBox="0 0 ${svgW} ${svgH}" width="${svgW}" height="${svgH}" style="color:hsl(var(--foreground))">
          ${svg}
        </svg>
      </div>
    `

    shadow.querySelectorAll('.node').forEach(node => {
      node.addEventListener('click', () => {
        this.inspect(node.getAttribute('data-uid'), node.getAttribute('data-kind'))
      })
    })
  }
}

DomainItemView.register(ActivityDiagram)
