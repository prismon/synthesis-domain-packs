// State Machine Diagram — domain-pack web component
// SVG-based state diagram with rounded state nodes and transition edges
// Depends on window.synthesis.DomainItemView

const { DomainItemView } = window.synthesis

const STATE_W = 140
const STATE_H = 44
const STATE_GAP_X = 180
const STATE_GAP_Y = 100
const SM_PAD = 50
const ARROW = 6

function esc(t) { return (t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') }
function truncate(t, n) { return t.length > n ? t.slice(0, n - 1) + '…' : t }

function parseStates(text) {
  if (!text) return []
  return text.split('\n').filter(Boolean).map(line => {
    const parts = line.split(' — ')
    return { name: (parts[0] || '').trim(), description: (parts[1] || '').trim() }
  })
}

function parseTransitions(text) {
  if (!text) return []
  return text.split('\n').filter(Boolean).map(line => {
    const m = line.match(/^\s*(\S+)\s*->\s*(\S+)(?:\s*\[([^\]]*)\])?(?:\s*\/\s*(.*))?$/)
    if (!m) return null
    return { source: m[1], target: m[2], guard: (m[3] || '').trim(), action: (m[4] || '').trim() }
  }).filter(Boolean)
}

function svgCurvedArrow(x1, y1, x2, y2, color, label) {
  const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy)
  if (len < 1) return ''
  const ux = dx / len, uy = dy / len
  const ex = x2 - ux * ARROW, ey = y2 - uy * ARROW

  // Slight curve offset
  const ox = -uy * 20, oy = ux * 20
  const cx1 = (x1 + x2) / 2 + ox, cy1 = (y1 + y2) / 2 + oy

  let s = `<path d="M${x1},${y1} Q${cx1},${cy1} ${ex},${ey}" fill="none" stroke="${color}" stroke-width="1.3"/>`

  // Arrowhead
  const adx = ex - cx1, ady = ey - cy1, alen = Math.sqrt(adx * adx + ady * ady)
  const aux = adx / alen, auy = ady / alen
  const px = -auy * ARROW * 0.4, py = aux * ARROW * 0.4
  s += `<polygon points="${x2},${y2} ${x2 - aux * ARROW + px},${y2 - auy * ARROW + py} ${x2 - aux * ARROW - px},${y2 - auy * ARROW - py}" fill="${color}"/>`

  if (label) {
    const lx = cx1, ly = cy1
    const tw = Math.min(label.length * 5 + 12, 120)
    s += `<rect x="${lx - tw / 2}" y="${ly - 8}" width="${tw}" height="16" rx="3" fill="hsl(var(--background))" opacity="0.9"/>`
    s += `<text x="${lx}" y="${ly}" font-size="8" fill="${color}" text-anchor="middle" dominant-baseline="middle" font-family="monospace">${esc(truncate(label, 22))}</text>`
  }
  return s
}

class StateMachineDiagram extends DomainItemView {
  static tagName = 'synth-state-machine-diagram'

  render() {
    const shadow = this.shadowRoot
    const cfg = this.config
    const smKind = cfg.stateMachineKind || 'mbse.state-machine'
    const blockKind = cfg.blockKind || 'mbse.block'
    const smColor = cfg.stateMachineColor || '#7c3aed'
    const stateColor = cfg.stateColor || '#6366f1'

    const machines = this.items[smKind] ?? []
    const blocks = this.items[blockKind] ?? []

    const blockLabel = new Map()
    blocks.forEach(b => blockLabel.set(b.metadata.name, b.spec?.displayName ?? b.metadata.name))

    let svg = ''
    let containerX = 40
    let maxH = 0

    machines.forEach(sm => {
      const states = parseStates(sm.spec?.states)
      const transitions = parseTransitions(sm.spec?.transitions)
      const initialState = sm.spec?.initialState
      const ownerRef = sm.spec?.ownerBlockRef
      const smLabel = sm.spec?.displayName ?? sm.metadata.name
      const ownerLabel = ownerRef ? (blockLabel.get(ownerRef) || ownerRef) : ''

      // Grid layout for states
      const cols = Math.max(Math.min(states.length, 3), 1)
      const rows = Math.ceil(states.length / cols)

      const containerW = cols * STATE_GAP_X + SM_PAD * 2
      const containerH = rows * STATE_GAP_Y + SM_PAD * 2 + 40

      // Container boundary
      svg += `<rect x="${containerX}" y="20" width="${containerW}" height="${containerH}" rx="12" fill="${smColor}06" stroke="${smColor}22" stroke-width="1" stroke-dasharray="6 3"/>`
      svg += `<text x="${containerX + 14}" y="38" font-size="10" font-weight="600" fill="${smColor}70">«stm» ${esc(smLabel)}</text>`
      if (ownerLabel) {
        svg += `<text x="${containerX + 14}" y="52" font-size="9" fill="${smColor}40">describes: ${esc(ownerLabel)}</text>`
      }

      // State positions
      const statePos = new Map()
      states.forEach((st, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        const sx = containerX + SM_PAD + col * STATE_GAP_X
        const sy = 60 + SM_PAD + row * STATE_GAP_Y
        statePos.set(st.name, { x: sx, y: sy, cx: sx + STATE_W / 2, cy: sy + STATE_H / 2 })
      })

      // Transition edges (render before nodes so nodes are on top)
      transitions.forEach(t => {
        const sp = statePos.get(t.source)
        const tp = statePos.get(t.target)
        if (!sp || !tp) return

        let label = ''
        if (t.guard && t.action) label = `[${t.guard}] / ${t.action}`
        else if (t.guard) label = `[${t.guard}]`
        else if (t.action) label = `/ ${t.action}`

        // Determine best connection points
        let sx = sp.cx, sy = sp.cy + STATE_H / 2
        let tx = tp.cx, ty = tp.cy - STATE_H / 2

        if (Math.abs(sp.y - tp.y) < STATE_GAP_Y * 0.5) {
          // Same row — use side connections
          if (sp.x < tp.x) {
            sx = sp.x + STATE_W; sy = sp.cy; tx = tp.x; ty = tp.cy
          } else {
            sx = sp.x; sy = sp.cy; tx = tp.x + STATE_W; ty = tp.cy
          }
        }

        svg += svgCurvedArrow(sx, sy, tx, ty, `${stateColor}99`, label)
      })

      // State nodes
      states.forEach(st => {
        const p = statePos.get(st.name)
        if (!p) return
        const isInitial = st.name === initialState

        svg += `<g class="node" data-uid="${sm.metadata.uid}" data-kind="${smKind}">`
        svg += `<rect x="${p.x}" y="${p.y}" width="${STATE_W}" height="${STATE_H}" rx="22" fill="${stateColor}12" stroke="${stateColor}50" stroke-width="2"/>`
        svg += `<text x="${p.cx}" y="${p.cy}" font-size="12" font-weight="600" fill="currentColor" text-anchor="middle" dominant-baseline="middle">${esc(truncate(st.name, 16))}</text>`

        // Initial state marker
        if (isInitial) {
          svg += `<circle cx="${p.x - 16}" cy="${p.cy}" r="6" fill="${stateColor}80"/>`
          svg += `<line x1="${p.x - 10}" y1="${p.cy}" x2="${p.x}" y2="${p.cy}" stroke="${stateColor}80" stroke-width="1.5"/>`
          svg += `<polygon points="${p.x},${p.cy} ${p.x - 4},${p.cy - 3} ${p.x - 4},${p.cy + 3}" fill="${stateColor}80"/>`
        }

        svg += '</g>'
      })

      containerX += containerW + 40
      maxH = Math.max(maxH, containerH + 40)
    })

    if (machines.length === 0) {
      svg += `<text x="400" y="200" font-size="14" fill="currentColor" opacity="0.5" text-anchor="middle">No state machines found</text>`
    }

    const svgW = Math.max(containerX, 800)
    const svgH = Math.max(maxH, 400)

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
          <span class="legend-item"><span class="legend-dot" style="background:${smColor}"></span>${machines.length} state machines</span>
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

DomainItemView.register(StateMachineDiagram)
