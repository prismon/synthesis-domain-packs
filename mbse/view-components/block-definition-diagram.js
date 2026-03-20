// Block Definition Diagram — domain-pack web component
// SVG-based SysML BDD showing blocks, interfaces, composition, and flows
// Depends on window.synthesis.DomainItemView

const { DomainItemView } = window.synthesis

const NODE_W = 220
const NODE_H = 100
const IFACE_W = 130
const IFACE_H = 40
const COL_GAP = 280
const ROW_GAP = 140
const BOUND_PAD = 30
const ARROW = 6

const TYPE_LABELS = {
  system: 'System', subsystem: 'Subsystem', hardware: 'Hardware',
  software: 'Software', logical: 'Logical', physical: 'Physical', human: 'Human',
}

const TYPE_COLORS = {
  system: '#0891b2', subsystem: '#0d9488', hardware: '#059669',
  software: '#4f46e5', logical: '#6366f1', physical: '#7c3aed', human: '#f59e0b',
}

function esc(t) { return (t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') }

function truncate(text, max) { return text.length > max ? text.slice(0, max - 1) + '…' : text }

function svgArrow(x1, y1, x2, y2, color, label, dashed) {
  const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy)
  if (len < 1) return ''
  const ux = dx / len, uy = dy / len
  const ex = x2 - ux * ARROW, ey = y2 - uy * ARROW
  const da = dashed ? ' stroke-dasharray="4 3"' : ''
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2
  let s = `<path d="M${x1},${y1} L${ex},${ey}" fill="none" stroke="${color}" stroke-width="1.2"${da}/>`
  const px = -uy * ARROW * 0.4, py = ux * ARROW * 0.4
  s += `<polygon points="${x2},${y2} ${x2 - ux * ARROW + px},${y2 - uy * ARROW + py} ${x2 - ux * ARROW - px},${y2 - uy * ARROW - py}" fill="${color}"/>`
  if (label) {
    s += `<rect x="${mx - 32}" y="${my - 8}" width="64" height="16" rx="3" fill="hsl(var(--background))" opacity="0.85"/>`
    s += `<text x="${mx}" y="${my}" font-size="9" fill="${color}" text-anchor="middle" dominant-baseline="middle">${esc(label)}</text>`
  }
  return s
}

function renderBlock(x, y, item, color) {
  const label = truncate(item.spec?.displayName ?? item.metadata.name, 26)
  const bt = item.spec?.blockType || 'system'
  const tech = item.spec?.technology
  const propLines = (item.spec?.properties || '').split('\n').filter(Boolean).slice(0, 3)
  const h = NODE_H + propLines.length * 16

  let svg = `<rect x="${x}" y="${y}" width="${NODE_W}" height="${h}" rx="5" fill="${color}12" stroke="${color}55" stroke-width="1.5"/>`

  // Header bar
  svg += `<rect x="${x}" y="${y}" width="${NODE_W}" height="38" rx="5" fill="${color}18"/>`
  svg += `<rect x="${x}" y="${y + 33}" width="${NODE_W}" height="5" fill="${color}18"/>` // cover bottom radius
  svg += `<line x1="${x}" y1="${y + 38}" x2="${x + NODE_W}" y2="${y + 38}" stroke="${color}30" stroke-width="0.5"/>`

  svg += `<text x="${x + NODE_W / 2}" y="${y + 14}" font-size="9" fill="${color}88" text-anchor="middle" font-style="italic">«${esc(TYPE_LABELS[bt] || bt)}»</text>`
  svg += `<text x="${x + NODE_W / 2}" y="${y + 30}" font-size="12" font-weight="600" fill="currentColor" text-anchor="middle">${esc(label)}</text>`

  if (tech) {
    svg += `<text x="${x + NODE_W / 2}" y="${y + 52}" font-size="9" fill="currentColor" opacity="0.5" text-anchor="middle">[${esc(tech)}]</text>`
  }

  propLines.forEach((line, i) => {
    svg += `<text x="${x + 10}" y="${y + 62 + i * 16}" font-size="10" fill="currentColor" opacity="0.7" font-family="monospace">${esc(truncate(line, 30))}</text>`
  })

  return { svg, h }
}

function renderInterface(x, y, item, color) {
  const label = truncate(item.spec?.displayName ?? item.metadata.name, 18)
  const itype = item.spec?.interfaceType || 'data'

  let svg = `<rect x="${x}" y="${y}" width="${IFACE_W}" height="${IFACE_H}" rx="20" fill="${color}10" stroke="${color}55" stroke-width="1" stroke-dasharray="4 2"/>`
  svg += `<text x="${x + IFACE_W / 2}" y="${y + 14}" font-size="8" fill="${color}88" text-anchor="middle">«${esc(itype)}»</text>`
  svg += `<text x="${x + IFACE_W / 2}" y="${y + 28}" font-size="10" font-weight="600" fill="currentColor" text-anchor="middle">${esc(label)}</text>`
  return svg
}

class BlockDefinitionDiagram extends DomainItemView {
  static tagName = 'synth-block-definition-diagram'

  render() {
    const shadow = this.shadowRoot
    const cfg = this.config
    const blockKind = cfg.blockKind || 'mbse.block'
    const ifaceKind = cfg.interfaceKind || 'mbse.interface'

    const blocks = this.items[blockKind] ?? []
    const ifaces = this.items[ifaceKind] ?? []

    // Build hierarchy
    const childrenOf = new Map()
    const roots = []
    const nameToItem = new Map()
    blocks.forEach(b => nameToItem.set(b.metadata.name, b))

    blocks.forEach(b => {
      const parent = b.spec?.parentBlockRef
      if (parent && nameToItem.has(parent)) {
        if (!childrenOf.has(parent)) childrenOf.set(parent, [])
        childrenOf.get(parent).push(b)
      } else {
        roots.push(b)
      }
    })

    // Layout: each root in a column with children below
    const positions = new Map() // uid → {x, y, cx, cy}
    let colX = 40
    let maxY = 0
    const boundaryInfo = []

    roots.forEach(root => {
      const children = childrenOf.get(root.metadata.name) || []
      const color = TYPE_COLORS[root.spec?.blockType] || '#0891b2'

      // Root block
      let curY = BOUND_PAD + 30
      const { h: rootH } = renderBlock(0, 0, root, color) // measure
      positions.set(root.metadata.uid, {
        x: colX + BOUND_PAD, y: curY, cx: colX + BOUND_PAD + NODE_W / 2, cy: curY + rootH / 2,
        item: root, color, h: rootH,
      })
      curY += rootH + ROW_GAP * 0.6

      // Children
      children.forEach(child => {
        const cc = TYPE_COLORS[child.spec?.blockType] || color
        const { h: ch } = renderBlock(0, 0, child, cc)
        positions.set(child.metadata.uid, {
          x: colX + BOUND_PAD, y: curY, cx: colX + BOUND_PAD + NODE_W / 2, cy: curY + ch / 2,
          item: child, color: cc, h: ch,
        })
        curY += ch + ROW_GAP * 0.5
      })

      const boundW = NODE_W + BOUND_PAD * 2
      const boundH = curY + BOUND_PAD - 20
      boundaryInfo.push({ x: colX, y: 0, w: boundW, h: boundH, label: root.spec?.displayName || root.metadata.name, color })
      maxY = Math.max(maxY, boundH)
      colX += boundW + 40
    })

    // Interfaces column
    const ifaceStartX = colX + 20
    ifaces.forEach((iface, i) => {
      const y = 60 + i * (IFACE_H + 30)
      positions.set(iface.metadata.uid, {
        x: ifaceStartX, y, cx: ifaceStartX + IFACE_W / 2, cy: y + IFACE_H / 2,
        item: iface, color: '#f59e0b', h: IFACE_H,
      })
    })

    const svgW = Math.max(ifaceStartX + IFACE_W + 60, 800)
    const svgH = Math.max(maxY + 60, 500)

    // Build SVG
    let svg = ''

    // Boundaries
    boundaryInfo.forEach(b => {
      svg += `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="12" fill="${b.color}06" stroke="${b.color}22" stroke-width="1" stroke-dasharray="6 3"/>`
      svg += `<text x="${b.x + 12}" y="${b.y + 16}" font-size="9" font-weight="600" fill="${b.color}66" text-transform="uppercase" letter-spacing="0.04em">${esc(b.label)}</text>`
    })

    // Composition edges: root → children
    roots.forEach(root => {
      const rp = positions.get(root.metadata.uid)
      const children = childrenOf.get(root.metadata.name) || []
      children.forEach(child => {
        const cp = positions.get(child.metadata.uid)
        if (rp && cp) {
          svg += `<line x1="${rp.cx}" y1="${rp.y + rp.h}" x2="${cp.cx}" y2="${cp.y}" stroke="${rp.color}" stroke-width="1.5" stroke-dasharray="4 3"/>`
          svg += `<text x="${(rp.cx + cp.cx) / 2 + 8}" y="${(rp.y + rp.h + cp.y) / 2}" font-size="10" fill="${rp.color}">◆</text>`
        }
      })
    })

    // Interface edges
    ifaces.forEach(iface => {
      const ip = positions.get(iface.metadata.uid)
      const srcName = iface.spec?.sourceBlockRef
      const tgtName = iface.spec?.targetBlockRef
      if (srcName) {
        const srcItem = nameToItem.get(srcName)
        if (srcItem) {
          const sp = positions.get(srcItem.metadata.uid)
          if (sp && ip) svg += svgArrow(sp.cx + NODE_W / 2, sp.cy, ip.x, ip.cy, '#f59e0b', null, false)
        }
      }
      if (tgtName) {
        const tgtItem = nameToItem.get(tgtName)
        if (tgtItem) {
          const tp = positions.get(tgtItem.metadata.uid)
          if (tp && ip) svg += svgArrow(ip.x + IFACE_W, ip.cy, tp.cx - NODE_W / 2, tp.cy, '#f59e0b', null, false)
        }
      }
    })

    // Flow edges
    blocks.forEach(b => {
      const refs = b.spec?.flowsToBlocks ?? []
      const bp = positions.get(b.metadata.uid)
      refs.forEach(targetName => {
        const tgtItem = nameToItem.get(targetName)
        if (tgtItem) {
          const tp = positions.get(tgtItem.metadata.uid)
          if (bp && tp) svg += svgArrow(bp.cx, bp.y + bp.h, tp.cx, tp.y, '#94a3b8', 'flows to', true)
        }
      })
    })

    // Block nodes
    positions.forEach((p, uid) => {
      if (!p.item) return
      const kind = p.item.kind
      if (kind === blockKind) {
        const { svg: blockSvg } = renderBlock(p.x, p.y, p.item, p.color)
        svg += `<g class="node" data-uid="${uid}" data-kind="${blockKind}">${blockSvg}</g>`
      } else if (kind === ifaceKind) {
        svg += `<g class="node" data-uid="${uid}" data-kind="${ifaceKind}">${renderInterface(p.x, p.y, p.item, p.color)}</g>`
      }
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
          <span class="legend-item"><span class="legend-dot" style="background:#0891b2"></span>${blocks.length} blocks</span>
          <span class="legend-item"><span class="legend-dot" style="background:#f59e0b"></span>${ifaces.length} interfaces</span>
          <span style="color:hsl(var(--muted-foreground));opacity:0.5">|</span>
          <span style="color:hsl(var(--muted-foreground))">${blocks.length + ifaces.length} total</span>
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

DomainItemView.register(BlockDefinitionDiagram)
