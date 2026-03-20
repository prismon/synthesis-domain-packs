---
title: "Operating Model Domain"
documentType: design
---

# Operating Model Domain

The operating model domain (internally namespaced `ppm`) describes the Platform-Product-Market architecture: a scalable operating model that separates organizational concerns into three distinct layers, each with its own accountability model, UX ownership, and API integration patterns. The domain captures the layers themselves, the durable tenets that govern decision-making across them, and the shared platform capabilities that power multiple products.

## Item Kinds

| Kind | Traits | Description |
|------|--------|-------------|
| `ppm.layer` | Ownable, Linkable | Organizational architecture layer (Platform, Product, or Market). Defines purpose, accountability model, UX ownership, API integration strategy, and the default sorting rule for deciding what belongs in this layer. |
| `ppm.tenet` | Ownable | Durable guiding belief that drives decisions and acts as a tie-breaker across Platform-Product-Market tradeoffs. Each tenet has a concise statement, rationale, display order, and references to the layers it primarily governs. |
| `ppm.capability` | Ownable, Trackable, Lifecycle, Linkable | Shared, reusable platform capability that powers multiple products. Capabilities are promoted to the platform layer only when demonstrably serving more than one product. Tracks API surface, reuse evidence, and the products consuming it. |
| `system.view` | Viewable | Visual layout definition for displaying domain items. |
| `system.nav-item` | — | Sidebar navigation item contributed by this domain. |

## Reference Kinds

| Name | Direction | Description |
|------|-----------|-------------|
| `parent` | `ppm.capability` → `ppm.layer` | Links a capability to the layer it belongs to (typically Platform). Cardinality: each capability has exactly one parent layer. |
| `governs` | `ppm.tenet` → `ppm.layer` | Links a tenet to the layers it primarily governs. Many-to-many. |

## Seed Data

### Layer: Platform

```asset kind=ppm.layer src=./seeds/layer-platform.yaml
```

The shared capability layer. Provides horizontal building blocks that solve platform-level problems once and expose them through stable APIs. Capabilities belong here only when reuse is demonstrated, not intended.

### Layer: Product

```asset kind=ppm.layer src=./seeds/layer-product.yaml
```

### Layer: Market

```asset kind=ppm.layer src=./seeds/layer-market.yaml
```

### Tenet 1: Reuse

```asset kind=ppm.tenet src=./seeds/tenet-1-reuse.yaml
```

### Tenet 2: Agnostic

```asset kind=ppm.tenet src=./seeds/tenet-2-agnostic.yaml
```

### Tenet 3: Differentiate

```asset kind=ppm.tenet src=./seeds/tenet-3-differentiate.yaml
```

### Tenet 4: APIs

```asset kind=ppm.tenet src=./seeds/tenet-4-apis.yaml
```

### Tenet 5: UX

```asset kind=ppm.tenet src=./seeds/tenet-5-ux.yaml
```

### Tenet 6: Accountability

```asset kind=ppm.tenet src=./seeds/tenet-6-accountability.yaml
```

### Tenet 7: Simplicity

```asset kind=ppm.tenet src=./seeds/tenet-7-simplicity.yaml
```

### PPM Overview View Component

```asset kind=system.view-component src=./seeds/view-components/vc-onetru.yaml
```

Registers the PPM overview visual layout.
