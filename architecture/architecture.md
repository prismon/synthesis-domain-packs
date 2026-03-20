---
title: "Architecture Domain"
documentType: design
---

# Architecture Domain

The architecture domain models C4 architecture diagrams — systems, people, and external dependencies. It provides a structured vocabulary for capturing software architecture at four levels of abstraction: Systems, Containers, Components, and Code Elements. It also models abstract Capabilities (such as LLMs or vector databases), People (users and roles), and External Systems outside the architecture boundary. Items in this domain are interlinked through `uses`, `parent`, and `supports` reference kinds, enabling rich cross-domain traceability from architecture down to delivery features.

## Item Kinds

| Kind | Traits | Description |
|------|--------|-------------|
| `architecture.system` | Ownable, Investable, Linkable | Software systems that provide value to users |
| `architecture.external-system` | Linkable | Systems outside the architecture boundary |
| `architecture.person` | Linkable | People and roles who interact with the architecture (C4 actors) |
| `architecture.container` | Ownable, Deployable, Linkable | Deployable units within a software system — applications, services, databases |
| `architecture.component` | Ownable | Major structural building blocks inside a container |
| `architecture.code-element` | _(none)_ | Classes, interfaces, functions, and modules that make up components |
| `architecture.capability` | Ownable, Linkable | Abstract technical capabilities — LLMs, vector databases, ML algorithms, etc. |
| `system.view` | Viewable | Configured view instances combining a view component with focused data |
| `system.nav-item` | _(none)_ | Sidebar navigation items defined by domains |

## Reference Kinds

| Name | Display Name | Reverse | Constraints |
|------|-------------|---------|-------------|
| `parent` | Parent Of | Child Of | container→system, component→container, code-element→component |
| `uses` | Uses | Used By | Any Composable→Any Composable (many-to-many) |
| `supports` | Supports | Supported By | architecture.component→delivery.feature |

## Views

The architecture domain ships view component registrations in `seeds/view-components/`:

- `vc-c4-context.yaml` — C4 Context diagram
- `vc-c4-container.yaml` — C4 Container diagram
- `vc-c4-component.yaml` — C4 Component diagram
- `vc-class-diagram.yaml` — Class / code-element diagram
- `vc-hierarchy-board.yaml` — Hierarchy board
- `vc-graph.yaml` — Dependency graph
- `vc-table.yaml` — Tabular list
- `vc-application-landscape.yaml` — Application landscape
- `vc-context-map.yaml` — DDD context map
- `vc-dashboard.yaml` — Summary dashboard
- `vc-tech-radar.yaml` — Technology radar
- `vc-git-repo-diagram.yaml` — Git repository diagram
- `vc-conversation-timeline.yaml` — Conversation timeline

## Seed Data

### Synthesis System

```asset kind=architecture.system src=./seeds/system-synthesis.yaml
```

The top-level Synthesis platform system. It depends on external systems for authentication (OIDC), persistence (PostgreSQL), source control (GitHub), and container images (Docker Registry).

---

### Backend Container

```asset kind=architecture.container src=./seeds/container-ss-backend.yaml
```

The Go microservice backend container for Synthesis. Hosts the MCP protocol server, domain service, repository layer, and all business logic.

---

### Database Container

```asset kind=architecture.container src=./seeds/container-ss-database.yaml
```

The PostgreSQL database container that stores all domain items, definitions, references, and tenant data with row-level security.

---

### Frontend Container

```asset kind=architecture.container src=./seeds/container-ss-frontend.yaml
```

The React/TypeScript/Vite single-page application container. Communicates exclusively with the backend via the MCP protocol.

---

### MCP Server Component

```asset kind=architecture.component src=./seeds/component-ss-mcp-server.yaml
```

The MCP protocol server component inside the backend container. Registers and dispatches all MCP tools over Streamable HTTP, serving as the primary API surface.

---

### MCP Client Component

```asset kind=architecture.component src=./seeds/component-ss-mcp-client.yaml
```

The frontend-side MCP client component. Wraps all backend calls through `callTool()`, making MCP the sole communication channel between UI and server.

---

### Domain Service Component

```asset kind=architecture.component src=./seeds/component-ss-domain-service.yaml
```

The core domain service component responsible for business logic, schema validation, and orchestrating interactions between the repository, trait system, and schema resolver.

---

### Domain Schema Component

```asset kind=architecture.component src=./seeds/component-ss-domain-schema.yaml
```

The domain schema component that owns the definition and field type model. Validates item fields against their definition schema at write time.

---

### Domain Editor Component

```asset kind=architecture.component src=./seeds/component-ss-domain-editor.yaml
```

The frontend domain editor component that renders the domain table, detail panel, inline editors, and field controls for managing domain items.

---

### Domain Loader Component

```asset kind=architecture.component src=./seeds/component-ss-domain-loader.yaml
```

The domain pack loader component that reads YAML domain manifests and seed files from disk and loads them into the repository at startup or on hot-reload.

---

### Repository Component

```asset kind=architecture.component src=./seeds/component-ss-repository.yaml
```

The repository component that abstracts PostgreSQL persistence. Implements row-level security enforcement and provides typed CRUD operations for domain items and definitions.

---

### Tenant Middleware Component

```asset kind=architecture.component src=./seeds/component-ss-tenant-middleware.yaml
```

The tenant middleware component that extracts tenant context from the request (via hostname or header), validates it, and injects it into the request context for downstream handlers.

---

### Tenant RLS Component

```asset kind=architecture.component src=./seeds/component-ss-tenant-rls.yaml
```

The row-level security component that enforces per-tenant data isolation at the PostgreSQL layer using `SET LOCAL` role and policy checks.

---

### Auth Module Component

```asset kind=architecture.component src=./seeds/component-ss-auth-module.yaml
```

The authentication module component that implements OIDC integration with Keycloak, handling token validation, JWKS fetching, and session management.

---

### RBAC Component

```asset kind=architecture.component src=./seeds/component-ss-rbac.yaml
```

The role-based access control component that enforces permission checks on MCP tool calls based on the authenticated user's tenant roles.

---

### Trait System Component

```asset kind=architecture.component src=./seeds/component-ss-trait-system.yaml
```

The trait system component that defines the 16 built-in traits (Ownable, Trackable, Hierarchical, etc.) and injects their fields into the resolved schema for any item kind that declares them.

---

### Schema Resolver Component

```asset kind=architecture.component src=./seeds/component-ss-schema-resolver.yaml
```

The schema resolver component that merges trait-injected fields with definition-level fields to produce the full resolved schema used for validation and UI rendering.

---

### Reference Engine Component

```asset kind=architecture.component src=./seeds/component-ss-reference-engine.yaml
```

The reference engine component that manages first-class `system.reference` items, validates cardinality constraints, and resolves reference vocabulary defined in `referenceKinds`.

---

### Reference Tables Component

```asset kind=architecture.component src=./seeds/component-ss-reference-tables.yaml
```

The reference tables component that provides the PostgreSQL schema and query methods for the edges/references graph stored in the `domain_edges` table.

---

### View Renderer Component

```asset kind=architecture.component src=./seeds/component-ss-view-renderer.yaml
```

The view renderer component that dispatches `system.view` items to registered view components (C4 diagrams, hierarchy boards, class diagrams, etc.) via the view registry.

---

### Migrations Component

```asset kind=architecture.component src=./seeds/component-ss-migrations.yaml
```

The database migrations component that manages schema evolution using embedded Go migration files applied at backend startup.

---

### Git Plugin Component

```asset kind=architecture.component src=./seeds/component-ss-git-plugin.yaml
```

The Git plugin component that provides repository analysis and branch synchronization capabilities, bridging Git repositories into the Synthesis domain model.

---

### Review Engine Component

```asset kind=architecture.component src=./seeds/component-ss-review-engine.yaml
```

The review engine component that implements the draft/approve/reject workflow for domain item changes, tracking pending changes and reviewer actions.

---

### Sandbox Orchestrator Component

```asset kind=architecture.component src=./seeds/component-ss-sandbox-orchestrator.yaml
```

The sandbox orchestrator component that manages AI agent execution sessions in Docker containers, exposing `sandbox_launch`, `sandbox_terminate`, and `sandbox_post_message` MCP tools.

---

### LLM Capabilities

```asset kind=architecture.capability src=./seeds/capability-llms.yaml
```

The LLM capability item cataloguing the large language model capabilities used by Synthesis for context generation, architecture review, and AI agent enablement.

---

### OIDC Provider (External System)

```asset kind=architecture.external-system src=./seeds/external-ss-oidc-provider.yaml
```

The Keycloak OIDC identity provider external system that handles all authentication and token issuance for the Synthesis platform.

---

### PostgreSQL (External System)

```asset kind=architecture.external-system src=./seeds/external-ss-postgresql.yaml
```

The PostgreSQL external system entry representing the managed PostgreSQL service depended on by the Synthesis backend for durable storage.

---

### GitHub (External System)

```asset kind=architecture.external-system src=./seeds/external-github.yaml
```

The GitHub external system that Synthesis integrates with for source control analysis and Git repository synchronization.

---

### Docker Registry (External System)

```asset kind=architecture.external-system src=./seeds/external-docker-registry.yaml
```

The Docker container registry external system used to pull images for sandbox agent execution environments.

---

### Developer (Person)

```asset kind=architecture.person src=./seeds/person-developer.yaml
```

The Developer persona representing software engineers who use Synthesis to understand and navigate the architecture of the systems they build.

---

### Engineering Manager (Person)

```asset kind=architecture.person src=./seeds/person-engineering-manager.yaml
```

The Engineering Manager persona representing leaders who use Synthesis to track delivery progress across value streams and segments.

---

### Operations Manager (Person)

```asset kind=architecture.person src=./seeds/person-operations-manager.yaml
```

The Operations Manager persona representing ops leads who use Synthesis to review audit findings, schema policies, and permission models.

---

### Platform Engineer (Person)

```asset kind=architecture.person src=./seeds/person-platform-engineer.yaml
```

The Platform Engineer persona representing infrastructure specialists who manage tenant provisioning, deployment topology, and enterprise plugin configuration.

---

### Portfolio Manager (Person)

```asset kind=architecture.person src=./seeds/person-portfolio-manager.yaml
```

The Portfolio Manager persona representing executives who use Synthesis to view the product hierarchy, value streams, and investment allocation across the delivery portfolio.

---

### Product Manager (Person)

```asset kind=architecture.person src=./seeds/person-product-manager.yaml
```

The Product Manager persona representing product owners who define features, track lifecycle stages, and manage the VSM hierarchy within Synthesis.

---

### AI Agent (Person)

```asset kind=architecture.person src=./seeds/person-ai-agent.yaml
```

The AI Agent persona representing autonomous agents that interact with Synthesis through the MCP protocol to read context, update domain items, and execute sandbox sessions.

---

### Review Policy: Systems

```asset kind=system.view src=./seeds/review-policy-systems.yaml
```

A review policy configuration item that defines the governance rules applied to `architecture.system` items when changes are submitted for review.

---

### Rule: Context Diagram

```asset kind=system.view src=./seeds/rule-context-diagram.yaml
```

A diagram rule item that governs how the C4 context diagram is rendered, including which systems and people are included and how layout is determined.

---

### View Components

```asset kind=system.view src=./seeds/view-components/vc-c4-context.yaml
```

C4 Context view component registration. Renders the system-level context diagram showing the top-level system and its external actors.

```asset kind=system.view src=./seeds/view-components/vc-c4-container.yaml
```

C4 Container view component registration. Renders all containers within a system and their inter-container communication.

```asset kind=system.view src=./seeds/view-components/vc-c4-component.yaml
```

C4 Component view component registration. Renders all components within a container and their dependencies.

```asset kind=system.view src=./seeds/view-components/vc-class-diagram.yaml
```

Class diagram view component registration. Renders code elements and their relationships as a UML-style class diagram.

```asset kind=system.view src=./seeds/view-components/vc-hierarchy-board.yaml
```

Hierarchy board view component registration. Renders a kanban-style board for any hierarchical domain item tree.

```asset kind=system.view src=./seeds/view-components/vc-graph.yaml
```

Graph view component registration. Renders an interactive force-directed dependency graph for items with reference relationships.

```asset kind=system.view src=./seeds/view-components/vc-table.yaml
```

Table view component registration. Renders domain items as a sortable, filterable tabular list.

```asset kind=system.view src=./seeds/view-components/vc-application-landscape.yaml
```

Application landscape view component registration. Renders a high-level map of all systems and their external dependencies.

```asset kind=system.view src=./seeds/view-components/vc-context-map.yaml
```

Context map view component registration. Renders DDD bounded contexts and their integration relationships.

```asset kind=system.view src=./seeds/view-components/vc-dashboard.yaml
```

Dashboard view component registration. Renders a summary dashboard with counts, status breakdowns, and recent activity.

```asset kind=system.view src=./seeds/view-components/vc-tech-radar.yaml
```

Tech radar view component registration. Renders capabilities on a FIRE lifecycle radar (Fix, Invest, Reduce, Eliminate).

```asset kind=system.view src=./seeds/view-components/vc-git-repo-diagram.yaml
```

Git repository diagram view component registration. Renders Git repositories, branches, and pull request relationships.

```asset kind=system.view src=./seeds/view-components/vc-conversation-timeline.yaml
```

Conversation timeline view component registration. Renders chat channels and messages in a threaded timeline format.
