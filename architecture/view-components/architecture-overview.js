// Architecture Overview — domain-pack web component
// Depends on window.synthesis.DomainItemView (set by host app initSynthesisGlobal())

const { DomainItemView } = window.synthesis

class ArchitectureOverview extends DomainItemView {
  static tagName = 'synth-architecture-overview'

  render() {
    const shadow = this.shadowRoot
    const systems = this.items['architecture.system'] ?? []
    const people = this.items['architecture.person'] ?? []
    const externals = this.items['architecture.external-system'] ?? []

    // Build structure with trusted static HTML; all user content set via textContent
    shadow.innerHTML = `
      <style>
        ${this.themeStyles()}
        :host { display: block; padding: 1.5rem; overflow: auto; }
        .landscape { display: flex; flex-direction: column; gap: 2rem; }
        .section-label {
          font-size: 0.7rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.08em; color: hsl(var(--muted-foreground)); margin-bottom: 0.5rem;
        }
        .row { display: flex; flex-wrap: wrap; gap: 1rem; }
        .card {
          background: hsl(var(--card)); border: 1px solid hsl(var(--border));
          border-radius: var(--radius); padding: 1rem 1.25rem;
          cursor: pointer; min-width: 160px; max-width: 240px;
          transition: box-shadow 0.15s;
        }
        .card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.12); }
        .card.system  { border-left: 3px solid #6366f1; }
        .card.person  { border-left: 3px solid #0891b2; }
        .card.external { border-left: 3px solid #94a3b8; }
        .card-name { font-weight: 600; font-size: 0.875rem; margin-bottom: 0.25rem; }
        .card-desc { font-size: 0.75rem; color: hsl(var(--muted-foreground));
          overflow: hidden; display: -webkit-box;
          -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
        .empty { color: hsl(var(--muted-foreground)); font-size: 0.875rem; }
      </style>
      <div class="landscape">
        ${systems.length  ? '<div><div class="section-label">Systems</div><div class="row" id="systems"></div></div>' : ''}
        ${people.length   ? '<div><div class="section-label">People</div><div class="row" id="people"></div></div>' : ''}
        ${externals.length ? '<div><div class="section-label">External Systems</div><div class="row" id="externals"></div></div>' : ''}
        ${!systems.length && !people.length && !externals.length ? '<p class="empty">No architecture items found.</p>' : ''}
      </div>
    `

    const renderCards = (containerId, items, cssClass) => {
      const container = shadow.getElementById(containerId)
      if (!container) return
      items.forEach(item => {
        const card = document.createElement('div')
        card.className = `card ${cssClass}`

        const nameEl = document.createElement('div')
        nameEl.className = 'card-name'
        nameEl.textContent = item.spec?.displayName ?? item.metadata.name
        card.appendChild(nameEl)

        if (item.spec?.description) {
          const descEl = document.createElement('div')
          descEl.className = 'card-desc'
          descEl.textContent = item.spec.description
          card.appendChild(descEl)
        }

        card.addEventListener('click', () => {
          this.drillDown(item.metadata.name, item.kind)
        })

        container.appendChild(card)
      })
    }

    renderCards('systems', systems, 'system')
    renderCards('people', people, 'person')
    renderCards('externals', externals, 'external')
  }
}

DomainItemView.register(ArchitectureOverview)
