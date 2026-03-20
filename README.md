# Synthesis Domain Packs

External domain packs for the Synthesis platform. Loaded dynamically by the
backend at startup via the `git` domain source type.

## Included Packs
- architecture — C4 model views (system, container, component, code-element)
- delivery — Value stream mapping (product, value stream, segment, feature)
- modeling — DDD (bounded context, aggregate, entity, event, etc.)
- audit — Findings, API endpoints, permissions, design patterns
- git — Repositories, branches, pull requests
- tech-stack — Technologies, languages, libraries, services
- tasks — Tasks and tickets
- conversation — Channels and messages
- mbse — Model-based systems engineering
- operating-model — Platform/Product/Market layers

## Format
Each directory is a domain pack with:
  domain.yaml         # Kind definitions, traits, fields
  views/*.yaml        # system.view items
  navigation/*.yaml   # system.nav-item items
  seeds/*.yaml        # Demo data
  view-components/    # Web component JS files (if any)
