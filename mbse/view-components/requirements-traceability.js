// Requirements Traceability Matrix — domain-pack web component
// HTML table showing requirement coverage with satisfy/verify/derive links
// Depends on window.synthesis.DomainItemView

const { DomainItemView } = window.synthesis

function esc(t) { return (t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') }

class RequirementsTraceability extends DomainItemView {
  static tagName = 'synth-requirements-traceability'

  render() {
    const shadow = this.shadowRoot
    const cfg = this.config
    const reqKind = cfg.requirementKind || 'mbse.requirement'
    const blockKind = cfg.blockKind || 'mbse.block'
    const tcKind = cfg.testCaseKind || 'mbse.test-case'
    const needKind = cfg.needKind || 'mbse.stakeholder-need'

    const satisfiedColor = cfg.satisfiedColor || '#10b981'
    const verifiedColor = cfg.verifiedColor || '#6366f1'
    const gapColor = cfg.gapColor || '#ef4444'

    const reqs = this.items[reqKind] ?? []
    const blocks = this.items[blockKind] ?? []
    const tests = this.items[tcKind] ?? []
    const needs = this.items[needKind] ?? []

    // Label lookups
    const blockLabel = new Map()
    blocks.forEach(b => blockLabel.set(b.metadata.name, b.spec?.displayName ?? b.metadata.name))
    const testLabel = new Map()
    tests.forEach(t => testLabel.set(t.metadata.name, t.spec?.displayName ?? t.metadata.name))
    const needLabel = new Map()
    needs.forEach(n => needLabel.set(n.metadata.name, n.spec?.displayName ?? n.metadata.name))

    // Reverse maps
    const satisfiedBy = new Map() // reqName → blockLabels[]
    blocks.forEach(b => {
      const refs = b.spec?.satisfiesReqs ?? []
      refs.forEach(rn => {
        if (!satisfiedBy.has(rn)) satisfiedBy.set(rn, [])
        satisfiedBy.get(rn).push(b.spec?.displayName ?? b.metadata.name)
      })
    })

    const verifiedBy = new Map() // reqName → testLabels[]
    tests.forEach(t => {
      const refs = t.spec?.verifiesReqs ?? []
      refs.forEach(rn => {
        if (!verifiedBy.has(rn)) verifiedBy.set(rn, [])
        verifiedBy.get(rn).push(t.spec?.displayName ?? t.metadata.name)
      })
    })

    // Build rows
    const rows = reqs.map(req => {
      const derivedFrom = (req.spec?.derivedFromNeeds ?? []).map(n => needLabel.get(n) || n)
      const sat = satisfiedBy.get(req.metadata.name) ?? []
      const ver = verifiedBy.get(req.metadata.name) ?? []
      return {
        item: req,
        label: req.spec?.displayName ?? req.metadata.name,
        reqType: req.spec?.reqType || '—',
        level: req.spec?.level || '—',
        derivedFrom,
        satisfiedBy: sat,
        verifiedBy: ver,
        hasSatisfy: sat.length > 0,
        hasVerify: ver.length > 0,
        isComplete: sat.length > 0 && ver.length > 0,
      }
    })

    const total = rows.length
    const satisfied = rows.filter(r => r.hasSatisfy).length
    const verified = rows.filter(r => r.hasVerify).length
    const gaps = rows.filter(r => !r.isComplete).length
    const pctSat = total > 0 ? Math.round(satisfied / total * 100) : 0
    const pctVer = total > 0 ? Math.round(verified / total * 100) : 0

    // Tag helpers
    function tags(items, color) {
      if (!items.length) return `<span style="color:${gapColor};font-size:10px">—</span>`
      return items.map(t => `<span class="tag" style="background:${color}18;color:${color}">${esc(t)}</span>`).join(' ')
    }

    function statusDot(isComplete) {
      const c = isComplete ? satisfiedColor : gapColor
      return `<span class="dot" style="background:${c}" title="${isComplete ? 'Fully traced' : 'Gap'}"></span>`
    }

    // Table rows HTML
    const rowsHtml = rows.map(r => `
      <tr class="row" data-uid="${r.item.metadata.uid}" data-kind="${reqKind}">
        <td class="cell cell-name">${esc(r.label)}</td>
        <td class="cell cell-meta">${esc(r.reqType)}</td>
        <td class="cell cell-meta">${esc(r.level)}</td>
        <td class="cell">${tags(r.derivedFrom, '#0891b2')}</td>
        <td class="cell">${r.hasSatisfy ? tags(r.satisfiedBy, satisfiedColor) : `<span style="color:${gapColor};font-size:10px">not satisfied</span>`}</td>
        <td class="cell">${r.hasVerify ? tags(r.verifiedBy, verifiedColor) : `<span style="color:${gapColor};font-size:10px">not verified</span>`}</td>
        <td class="cell cell-center">${statusDot(r.isComplete)}</td>
      </tr>
    `).join('')

    shadow.innerHTML = `
      <style>
        ${this.themeStyles()}
        :host { display: block; padding: 1.25rem; overflow: auto; }
        * { box-sizing: border-box; }

        .summary {
          display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap;
          padding: 0.75rem 1rem; border: 1px solid hsl(var(--border) / 0.5);
          border-radius: 8px; background: hsl(var(--muted) / 0.3); margin-bottom: 1rem;
          font-size: 11px; font-family: var(--font-mono, monospace);
        }
        .summary-label { color: hsl(var(--muted-foreground)); }
        .summary-value { font-weight: 600; }
        .divider { width: 1px; height: 16px; background: hsl(var(--border)); }

        .bar-container { flex: 1; display: flex; gap: 8px; align-items: center; min-width: 120px; }
        .bar { flex: 1; height: 8px; background: hsl(var(--muted)); border-radius: 4px; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 4px; transition: width 0.3s; }

        .filters { display: flex; gap: 4px; margin-bottom: 1rem; }
        .filter-btn {
          padding: 4px 12px; border-radius: 6px; border: none; cursor: pointer;
          font-size: 11px; font-family: var(--font-mono, monospace);
          background: transparent; color: hsl(var(--muted-foreground));
          transition: background 0.15s, color 0.15s;
        }
        .filter-btn:hover { background: hsl(var(--muted) / 0.5); color: hsl(var(--foreground)); }
        .filter-btn.active { background: hsl(var(--muted)); color: hsl(var(--foreground)); }

        .table-wrap { border: 1px solid hsl(var(--border)); border-radius: 8px; overflow: auto; max-height: calc(100vh - 340px); }
        table { width: 100%; border-collapse: collapse; font-size: 12px; font-family: var(--font-mono, monospace); }
        thead { position: sticky; top: 0; background: hsl(var(--background)); z-index: 2; }
        th {
          text-align: left; padding: 8px 12px; font-size: 11px; font-weight: 500;
          color: hsl(var(--muted-foreground)); border-bottom: 1px solid hsl(var(--border));
        }
        .cell { padding: 8px 12px; border-bottom: 1px solid hsl(var(--border) / 0.3); vertical-align: middle; }
        .cell-name { font-weight: 600; min-width: 180px; }
        .cell-meta { color: hsl(var(--muted-foreground)); min-width: 80px; }
        .cell-center { text-align: center; }
        .row { cursor: pointer; transition: background 0.1s; }
        .row:hover { background: hsl(var(--muted) / 0.2); }
        .row.hidden { display: none; }

        .tag {
          display: inline-block; padding: 1px 6px; border-radius: 4px;
          font-size: 10px; font-weight: 500; margin: 1px 2px;
        }
        .dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; }

        .empty { color: hsl(var(--muted-foreground)); padding: 2rem; text-align: center; }
      </style>

      <div class="summary">
        <div><span class="summary-label">Requirements:</span> <span class="summary-value">${total}</span></div>
        <div class="divider"></div>
        <div><span class="summary-label">Satisfy:</span> <span class="summary-value" style="color:${satisfiedColor}">${pctSat}%</span> <span class="summary-label">(${satisfied}/${total})</span></div>
        <div class="divider"></div>
        <div><span class="summary-label">Verify:</span> <span class="summary-value" style="color:${verifiedColor}">${pctVer}%</span> <span class="summary-label">(${verified}/${total})</span></div>
        <div class="divider"></div>
        <div><span class="summary-label">Gaps:</span> <span class="summary-value" style="color:${gapColor}">${gaps}</span></div>
        <div class="bar-container">
          <div class="bar"><div class="bar-fill" style="width:${pctSat}%;background:${satisfiedColor}"></div></div>
          <div class="bar"><div class="bar-fill" style="width:${pctVer}%;background:${verifiedColor}"></div></div>
        </div>
      </div>

      <div class="filters" id="filters">
        <button class="filter-btn active" data-filter="all">All (${total})</button>
        <button class="filter-btn" data-filter="gaps">Gaps (${gaps})</button>
        <button class="filter-btn" data-filter="satisfied">Satisfied (${satisfied})</button>
        <button class="filter-btn" data-filter="verified">Verified (${verified})</button>
      </div>

      <div class="table-wrap">
        ${total === 0 ? '<div class="empty">No requirements found</div>' : `
        <table>
          <thead>
            <tr>
              <th>Requirement</th>
              <th>Type</th>
              <th>Level</th>
              <th>Derived From</th>
              <th>Satisfied By</th>
              <th>Verified By</th>
              <th style="text-align:center;width:50px">Status</th>
            </tr>
          </thead>
          <tbody id="tbody">
            ${rowsHtml}
          </tbody>
        </table>
        `}
      </div>
    `

    // Click handlers for rows
    shadow.querySelectorAll('.row').forEach(row => {
      row.addEventListener('click', () => {
        this.inspect(row.getAttribute('data-uid'), row.getAttribute('data-kind'))
      })
    })

    // Filter buttons
    const filterBtns = shadow.querySelectorAll('.filter-btn')
    const allRows = shadow.querySelectorAll('.row')

    // Store row metadata for filtering
    const rowMeta = rows.map((r, i) => ({
      el: allRows[i],
      hasSatisfy: r.hasSatisfy,
      hasVerify: r.hasVerify,
      isComplete: r.isComplete,
    }))

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
        const filter = btn.getAttribute('data-filter')

        rowMeta.forEach(rm => {
          if (!rm.el) return
          let visible = true
          if (filter === 'gaps') visible = !rm.isComplete
          else if (filter === 'satisfied') visible = rm.hasSatisfy
          else if (filter === 'verified') visible = rm.hasVerify
          rm.el.classList.toggle('hidden', !visible)
        })
      })
    })
  }
}

DomainItemView.register(RequirementsTraceability)
