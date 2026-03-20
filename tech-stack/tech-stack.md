---
title: "Tech Stack Domain"
documentType: design
---

# Tech Stack Domain

The Tech Stack domain provides a technology portfolio radar — cataloging programming languages, package libraries, infrastructure services, and architectural blueprints. Every item carries a FIRE lifecycle ring (`fix`, `invest`, `reduce`, `eliminate`) and approval status. The domain integrates with Architecture (linking tech items to components and capabilities) and Delivery (linking to features and products).

## Item Kinds

| Kind | Traits | Description |
|------|--------|-------------|
| `tech-stack.stack` | Ownable, Linkable | Top-level portfolio container grouping all technology decisions for a product or project. Links to a `delivery.product` via `projectRef` |
| `tech-stack.language` | Ownable, Linkable | Programming languages and runtimes. Carries FIRE ring, paradigm, version, license, CVE count, approval status, and open-source adoption level |
| `tech-stack.library` | Ownable, Linkable | Package dependencies — frameworks, SDKs, and component libraries. Carries FIRE ring, package manager, version, license, CVE count, and approval status |
| `tech-stack.service` | Ownable, Linkable | Infrastructure and platform services — databases, cloud services, and SaaS tools. Includes service delivery model (SaaS, PaaS, IaaS, self-hosted, managed) |
| `tech-stack.blueprint` | Ownable, Linkable | Architectural patterns, design blueprints, and integration strategies. Pattern types: `architectural`, `design`, `integration`, `deployment` |

## Reference Kinds

| Reference Kind | Source → Target | Description |
|----------------|-----------------|-------------|
| `parent` | `tech-stack.{language,library,service,blueprint}` → `tech-stack.stack` | Each tech item belongs to a parent stack |
| `uses-technology` | `architecture.component` → `tech-stack.{language,library,service,blueprint}` | An architecture component uses a technology |
| `depends-on-technology` | `delivery.feature` → `tech-stack.{language,library,service,blueprint}` | A delivery feature depends on a technology |
| `uses-capability` | `tech-stack.{language,library,service,blueprint}` → `architecture.capability` | A technology item leverages an architecture capability |

## Seed Data

### Synthesis Tech Stack

```asset kind=tech-stack.stack src=./seeds/techstack-synthesis.yaml
```

Root portfolio container for all Synthesis platform technology decisions.

### Language: Go

```asset kind=tech-stack.language src=./seeds/lang-go.yaml
```

Go backend service language — statically typed, compiled, excellent concurrency primitives.

### Language: TypeScript

```asset kind=tech-stack.language src=./seeds/lang-typescript.yaml
```

TypeScript for the React frontend — strict mode enabled, compiled to ES modules via Vite.

### Language: SQL

```asset kind=tech-stack.language src=./seeds/lang-sql.yaml
```

PostgreSQL SQL for schema definitions, migrations, and row-level security policies.

### Language: YAML

```asset kind=tech-stack.language src=./seeds/lang-yaml.yaml
```

YAML for domain pack manifests, seed files, and tenant configuration.

### Library: React

```asset kind=tech-stack.library src=./seeds/lib-react.yaml
```

React 18 — UI component model and rendering engine for the frontend.

### Library: React Query

```asset kind=tech-stack.library src=./seeds/lib-react-query.yaml
```

TanStack Query for server-state caching, query key management, and invalidation.

### Library: shadcn/ui

```asset kind=tech-stack.library src=./seeds/lib-shadcn-ui.yaml
```

Radix-based component library providing accessible, unstyled UI primitives styled with Tailwind.

### Library: Tailwind CSS

```asset kind=tech-stack.library src=./seeds/lib-tailwind.yaml
```

Utility-first CSS framework for all component styling.

### Library: Vite

```asset kind=tech-stack.library src=./seeds/lib-vite.yaml
```

Build tool and dev server for the React frontend — HMR and ESM-native bundling.

### Library: Vitest

```asset kind=tech-stack.library src=./seeds/lib-vitest.yaml
```

Unit test runner integrated with Vite — used for all frontend unit tests.

### Library: Playwright

```asset kind=tech-stack.library src=./seeds/lib-playwright.yaml
```

End-to-end testing framework for browser automation tests against the full stack.

### Library: mcp-go

```asset kind=tech-stack.library src=./seeds/lib-mcp-go.yaml
```

Go MCP library implementing the Model Context Protocol server in the backend.

### Service: PostgreSQL

```asset kind=tech-stack.service src=./seeds/svc-postgresql.yaml
```

Primary relational database with row-level security for multi-tenant data isolation.

### Service: Node.js

```asset kind=tech-stack.service src=./seeds/svc-nodejs.yaml
```

Node.js runtime environment for the frontend development server and build tooling.

### Service: Docker

```asset kind=tech-stack.service src=./seeds/svc-docker.yaml
```

Container runtime used for sandbox execution environments and local development compose stack.

### Blueprint: MCP Protocol

```asset kind=tech-stack.blueprint src=./seeds/bp-mcp-protocol.yaml
```

Model Context Protocol as the single communication channel between frontend and backend — all data access goes through `callTool()`.

### Blueprint: Domain Packs

```asset kind=tech-stack.blueprint src=./seeds/bp-domain-packs.yaml
```

YAML-based bundles (manifest + seed data + views + navigation) that define a domain and can be composed into tenants.

### Blueprint: Multi-Tenancy with RLS

```asset kind=tech-stack.blueprint src=./seeds/bp-multi-tenancy-rls.yaml
```

PostgreSQL row-level security pattern for tenant data isolation without application-layer filtering.

### Blueprint: Trait Composition

```asset kind=tech-stack.blueprint src=./seeds/bp-trait-composition.yaml
```

Behavioral trait system that injects fields, validation, and UI behaviours into domain item schemas by composition rather than inheritance.
