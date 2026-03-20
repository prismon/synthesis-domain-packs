---
title: "Delivery Domain"
documentType: design
---

# Delivery Domain

The delivery domain models value stream management using a four-level Product → Value Stream → Segment → Feature hierarchy. It captures the full delivery flow from high-level business products down to individual deliverable features, with cross-references to the architecture domain for traceability between delivery intent and implementation. Products declare which architecture systems they depend on; value streams reference the containers they touch; segments reference the components they affect; and features reference the components that implement them. The domain provides the VSM Overview view for visualizing the entire delivery hierarchy.

## Item Kinds

| Kind | Traits | Description |
|------|--------|-------------|
| `delivery.product` | Ownable, Hierarchical, Linkable | Top-level business products that contain value streams |
| `delivery.value-stream` | Ownable, Hierarchical, Composable, Trackable, Impactable | Multi-year delivery constructs within a product |
| `delivery.segment` | Ownable, Trackable, Composable | Operational slices of a value stream with funding allocation |
| `delivery.feature` | Ownable, Trackable, Dependable, Lifecycle, Governable | Deliverable units of work within a segment |
| `system.view` | Viewable | Visual layouts for displaying domain items |
| `system.nav-item` | _(none)_ | Sidebar navigation items defined by domains |

## Reference Kinds

| Name | Display Name | Reverse | Constraints |
|------|-------------|---------|-------------|
| `parent` | Parent Of | Child Of | value-stream→product, segment→value-stream, feature→segment |
| `depends-on` | Depends On | Depended On By | product→architecture.system, value-stream→architecture.container, segment→architecture.component |
| `implemented-by` | Implemented By | Implements | feature→architecture.component |

## Views

The delivery domain uses the `vsm-overview` view (referenced as `preferredViewRef` on all four item kinds) which renders the full Product → Value Stream → Segment → Feature hierarchy in a hierarchical board layout.

## Seed Data

### Synthesis Product

```asset kind=delivery.product src=./seeds/product-synthesis.yaml
```

The top-level Synthesis platform product. It is the single product that owns all value streams tracking the delivery of the Synthesis platform itself.

---

### Value Stream: Domain Management

```asset kind=delivery.value-stream src=./seeds/vs-domain-management.yaml
```

The Domain Management value stream covering the core domain CRUD, definition management, and schema validation capabilities that form the foundation of the platform.

---

### Value Stream: Architecture Visualization

```asset kind=delivery.value-stream src=./seeds/vs-architecture-viz.yaml
```

The Architecture Visualization value stream covering C4 diagrams, hierarchy boards, and the view registry system that renders visual representations of domain data.

---

### Value Stream: MCP Integration

```asset kind=delivery.value-stream src=./seeds/vs-mcp-integration.yaml
```

The MCP Integration value stream covering the Model Context Protocol server, client library, and all MCP tool registration and dispatch infrastructure.

---

### Value Stream: Multi-Tenancy

```asset kind=delivery.value-stream src=./seeds/vs-multi-tenancy.yaml
```

The Multi-Tenancy value stream covering tenant provisioning, row-level security enforcement, OIDC authentication, and per-tenant data isolation.

---

### Value Stream: Domain Extensibility

```asset kind=delivery.value-stream src=./seeds/vs-domain-extensibility.yaml
```

The Domain Extensibility value stream covering domain packs, trait composition, hot-reload, and the YAML-based domain definition system.

---

### Value Stream: AI Enablement

```asset kind=delivery.value-stream src=./seeds/vs-ai-enablement.yaml
```

The AI Enablement value stream covering AI agent integration, sandbox orchestration, context generation, and AI-assisted architecture review capabilities.

---

### Value Stream: Dynamic Feature Management

```asset kind=delivery.value-stream src=./seeds/vs-dynamic-feature-management.yaml
```

The Dynamic Feature Management value stream covering enterprise build tags, feature flags, and runtime feature exposure strategies.

---

### Segment: Item CRUD

```asset kind=delivery.segment src=./seeds/seg-item-crud.yaml
```

The Item CRUD segment covering create, read, update, and delete operations for domain items including inline editing and field validation.

---

### Segment: Definition Management

```asset kind=delivery.segment src=./seeds/seg-definition-management.yaml
```

The Definition Management segment covering the management of domain definitions, trait declarations, and field schema configuration.

---

### Segment: MCP Server

```asset kind=delivery.segment src=./seeds/seg-mcp-server.yaml
```

The MCP Server segment covering the server-side MCP tool registration, JSON-RPC dispatch, and Streamable HTTP transport layer.

---

### Segment: MCP Client

```asset kind=delivery.segment src=./seeds/seg-mcp-client.yaml
```

The MCP Client segment covering the frontend MCP client library, tool call abstraction, and error handling for all backend communications.

---

### Segment: C4 Diagrams

```asset kind=delivery.segment src=./seeds/seg-c4-diagrams.yaml
```

The C4 Diagrams segment covering context, container, and component diagram rendering using the shared C4 diagram utilities and layout engine.

---

### Segment: Hierarchy Views

```asset kind=delivery.segment src=./seeds/seg-hierarchy-views.yaml
```

The Hierarchy Views segment covering the hierarchy board, VSM overview, and any view that renders a tree or multi-level drill-down structure.

---

### Segment: View Registry

```asset kind=delivery.segment src=./seeds/seg-view-registry.yaml
```

The View Registry segment covering view component registration, `ViewRenderer` dispatch, and the `system.view` item kind infrastructure.

---

### Segment: Tenant Isolation

```asset kind=delivery.segment src=./seeds/seg-tenant-isolation.yaml
```

The Tenant Isolation segment covering PostgreSQL RLS policies, tenant middleware, and per-request tenant context injection.

---

### Segment: Trait System

```asset kind=delivery.segment src=./seeds/seg-trait-system.yaml
```

The Trait System segment covering the 16 built-in traits, the trait registry, and schema injection into definition resolved schemas.

---

### Segment: Domain Packs

```asset kind=delivery.segment src=./seeds/seg-domain-packs.yaml
```

The Domain Packs segment covering the YAML domain manifest format, seed file loading, and the domain pack loader infrastructure.

---

### Segment: Reference Integrity

```asset kind=delivery.segment src=./seeds/seg-reference-integrity.yaml
```

The Reference Integrity segment covering first-class reference items, cardinality constraint enforcement, and reference vocabulary management.

---

### Segment: Version History

```asset kind=delivery.segment src=./seeds/seg-version-history.yaml
```

The Version History segment covering item versioning, diff computation, and the version history view for tracking changes over time.

---

### Segment: Review Workflow

```asset kind=delivery.segment src=./seeds/seg-review-workflow.yaml
```

The Review Workflow segment covering the draft/pending/approved/rejected change lifecycle and the reviewer approval UI.

---

### Segment: Domain Composition

```asset kind=delivery.segment src=./seeds/seg-domain-composition.yaml
```

The Domain Composition segment covering how multiple domain packs are composed together, namespace resolution, and cross-domain reference kinds.

---

### Segment: Schema Validation

```asset kind=delivery.segment src=./seeds/seg-schema-validation.yaml
```

The Schema Validation segment covering field type validation, required field enforcement, and enum value checking at item write time.

---

### Segment: Enterprise Plugins

```asset kind=delivery.segment src=./seeds/seg-enterprise-plugins.yaml
```

The Enterprise Plugins segment covering the Go build tag system that gates enterprise-only features and the plugin interface for enterprise extensions.

---

### Segment: AI Agent Integration

```asset kind=delivery.segment src=./seeds/seg-ai-agent-integration.yaml
```

The AI Agent Integration segment covering the sandbox plugin interface, Docker-based agent execution, and the `SandboxProvider` abstraction.

---

### Segment: AI Architecture Modeling

```asset kind=delivery.segment src=./seeds/seg-ai-architecture-modeling.yaml
```

The AI Architecture Modeling segment covering AI-assisted C4 generation, dependency risk analysis, and bottleneck detection capabilities.

---

### Segment: AI Process Intelligence

```asset kind=delivery.segment src=./seeds/seg-ai-process-intelligence.yaml
```

The AI Process Intelligence segment covering delivery flow analysis, WIP metrics, and AI-assisted process improvement recommendations.

---

### Segment: Agent Execution

```asset kind=delivery.segment src=./seeds/seg-agent-execution.yaml
```

The Agent Execution segment covering the sandbox launch, messaging, and termination lifecycle for Docker-containerized AI agent sessions.

---

### Segment: Inline Editing

```asset kind=delivery.segment src=./seeds/seg-inline-editing.yaml
```

The Inline Editing segment covering the domain table inline edit mode, field-level editors, and optimistic update patterns in the UI.

---

### Segment: Identify Opportunity

```asset kind=delivery.segment src=./seeds/seg-identify-opportunity.yaml
```

The Identify Opportunity segment covering the initial phase of the dynamic feature management lifecycle where opportunities are surfaced and scoped.

---

### Segment: Define Goals

```asset kind=delivery.segment src=./seeds/seg-define-goals.yaml
```

The Define Goals segment covering the goal-setting phase of feature management where success metrics and acceptance criteria are established.

---

### Segment: Analyze Competitive Examples

```asset kind=delivery.segment src=./seeds/seg-analyze-competitive-examples.yaml
```

The Analyze Competitive Examples segment covering research and benchmarking of competitive feature implementations to inform design decisions.

---

### Segment: Design Feature Exposure Strategy

```asset kind=delivery.segment src=./seeds/seg-design-feature-exposure-strategy.yaml
```

The Design Feature Exposure Strategy segment covering how features are exposed via build tags, configuration, or runtime flags in the enterprise tier.

---

### Segment: Build & Integrate

```asset kind=delivery.segment src=./seeds/seg-build-integrate.yaml
```

The Build & Integrate segment covering the implementation and integration phase where features are built, tested, and merged into the platform.

---

### Segment: Release Dynamically

```asset kind=delivery.segment src=./seeds/seg-release-dynamically.yaml
```

The Release Dynamically segment covering the deployment and activation of features, including staged rollouts and enterprise gating.

---

### Segment: Measure & Learn

```asset kind=delivery.segment src=./seeds/seg-measure-learn.yaml
```

The Measure & Learn segment covering KPI tracking, feedback collection, and data-driven evaluation of feature outcomes after release.

---

### Segment: Optimize & Retire

```asset kind=delivery.segment src=./seeds/seg-optimize-retire.yaml
```

The Optimize & Retire segment covering the end-of-life phase of features where performance is tuned, usage declines, and retirement decisions are made.

---

### Segment: Prioritize Feature Investment

```asset kind=delivery.segment src=./seeds/seg-prioritize-feature-investment.yaml
```

The Prioritize Feature Investment segment covering portfolio prioritization, investment scoring, and feature backlog ranking decisions.

---

### Feature: MCP Tools

```asset kind=delivery.feature src=./seeds/feat-mcp-tools.yaml
```

The MCP Tools feature covering the full set of domain management MCP tools exposed by the backend, including item CRUD, definition management, and graph queries.

---

### Feature: MCP Health

```asset kind=delivery.feature src=./seeds/feat-mcp-health.yaml
```

The MCP Health feature covering the health check and session info MCP tools used by clients to verify connectivity and authentication status.

---

### Feature: Trait Injection

```asset kind=delivery.feature src=./seeds/feat-trait-injection.yaml
```

The Trait Injection feature covering the runtime injection of trait-defined fields into the resolved schema, enabling behavioral composition via trait declarations.

---

### Feature: Schema Validation

```asset kind=delivery.feature src=./seeds/feat-schema-validation.yaml
```

The Schema Validation feature covering server-side validation of item fields against the resolved definition schema, including type checking and required field enforcement.

---

### Feature: Version History

```asset kind=delivery.feature src=./seeds/feat-version-history.yaml
```

The Version History feature covering the storage and retrieval of item version snapshots, enabling time-travel queries and change history views.

---

### Feature: Version Diff

```asset kind=delivery.feature src=./seeds/feat-version-diff.yaml
```

The Version Diff feature covering field-level diff computation between two item versions, surfaced in the review workflow and history views.

---

### Feature: Pack Hot Reload

```asset kind=delivery.feature src=./seeds/feat-pack-hot-reload.yaml
```

The Pack Hot Reload feature covering filesystem watching and automatic reload of domain pack YAML files without requiring a backend restart.

---

### Feature: Ref Cascade

```asset kind=delivery.feature src=./seeds/feat-ref-cascade.yaml
```

The Ref Cascade feature covering cascading updates to reference items when a referenced item is renamed or deleted, maintaining referential integrity.

---

### Feature: C4 Drill-Down

```asset kind=delivery.feature src=./seeds/feat-c4-drill-down.yaml
```

The C4 Drill-Down feature covering interactive navigation from the C4 context diagram down through containers and into components.

---

### Feature: Diagram Export

```asset kind=delivery.feature src=./seeds/feat-diagram-export.yaml
```

The Diagram Export feature covering the export of C4 diagrams and other views as SVG or PNG for use in external documentation.

---

### Feature: Hierarchy Expand

```asset kind=delivery.feature src=./seeds/feat-hierarchy-expand.yaml
```

The Hierarchy Expand feature covering the expand/collapse interactions in the hierarchy board and tree views for navigating deep item trees.

---

### Feature: Inline Editing

```asset kind=delivery.feature src=./seeds/feat-inline-editing.yaml
```

The Inline Editing feature covering click-to-edit interactions in the domain table, with field-level validation and optimistic UI updates.

---

### Feature: Item Detach

```asset kind=delivery.feature src=./seeds/feat-item-detach.yaml
```

The Item Detach feature covering the ability to detach a managed item from its domain pack loader, allowing it to be freely edited by users.

---

### Feature: Bulk Import

```asset kind=delivery.feature src=./seeds/feat-bulk-import.yaml
```

The Bulk Import feature covering the import of multiple domain items from YAML or markdown export files, enabling bulk data migration.

---

### Feature: Review — Approve/Reject

```asset kind=delivery.feature src=./seeds/feat-review-approve-reject.yaml
```

The Review Approve/Reject feature covering the reviewer UI for approving or rejecting pending domain item changes in the review workflow.

---

### Feature: Review — My Changes

```asset kind=delivery.feature src=./seeds/feat-review-my-changes.yaml
```

The Review My Changes feature covering the author view showing a user's own pending and historical change submissions.

---

### Feature: Review — Pending Changes

```asset kind=delivery.feature src=./seeds/feat-review-pending-changes.yaml
```

The Review Pending Changes feature covering the reviewer queue showing all pending changes awaiting approval across the tenant.

---

### Feature: RLS Policies

```asset kind=delivery.feature src=./seeds/feat-rls-policies.yaml
```

The RLS Policies feature covering the PostgreSQL row-level security policy definitions that enforce per-tenant data isolation at the database layer.

---

### Feature: Tenant Provisioning

```asset kind=delivery.feature src=./seeds/feat-tenant-provisioning.yaml
```

The Tenant Provisioning feature covering the creation and configuration of new tenants including domain pack loading and default seed data.

---

### Feature: Audit Log

```asset kind=delivery.feature src=./seeds/feat-audit-log.yaml
```

The Audit Log feature covering the recording of all domain item mutations with actor, timestamp, and change details for compliance and debugging.

---

### Feature: Enterprise Build Tags

```asset kind=delivery.feature src=./seeds/feat-enterprise-build-tags.yaml
```

The Enterprise Build Tags feature covering the Go build tag system that conditionally compiles enterprise-only code paths into the platform binary.

---

### Feature: Sandbox Launch

```asset kind=delivery.feature src=./seeds/feat-sandbox-launch.yaml
```

The Sandbox Launch feature covering the `sandbox_launch` MCP tool that spins up a Docker-containerized AI agent session for a given sandbox template.

---

### Feature: Sandbox Messaging

```asset kind=delivery.feature src=./seeds/feat-sandbox-messaging.yaml
```

The Sandbox Messaging feature covering the `sandbox_post_message` and `sandbox_chat` MCP tools for bidirectional communication with running agent sessions.

---

### Feature: Session Reconnect

```asset kind=delivery.feature src=./seeds/feat-session-reconnect.yaml
```

The Session Reconnect feature covering the ability to reconnect to an existing sandbox session after a UI refresh or network interruption.

---

### Feature: Agent Domain Tools

```asset kind=delivery.feature src=./seeds/feat-agent-domain-tools.yaml
```

The Agent Domain Tools feature covering the set of MCP tools available to AI agents running in sandbox sessions for reading and writing domain data.

---

### Feature: Agent Context Prompts

```asset kind=delivery.feature src=./seeds/feat-agent-context-prompts.yaml
```

The Agent Context Prompts feature covering the system prompt injection and context file generation that primes AI agents with platform and tenant knowledge.

---

### Feature: Platform Context

```asset kind=delivery.feature src=./seeds/feat-platform-context.yaml
```

The Platform Context feature covering the `synthesis_generate_context` MCP tool that generates a comprehensive markdown context document from live domain data.

---

### Feature: AI Architecture Review

```asset kind=delivery.feature src=./seeds/feat-ai-arch-review.yaml
```

The AI Architecture Review feature covering AI-assisted analysis of the architecture domain to surface design gaps, missing components, and improvement recommendations.

---

### Feature: AI C4 Generation

```asset kind=delivery.feature src=./seeds/feat-ai-c4-generation.yaml
```

The AI C4 Generation feature covering the generation of C4 diagram items from natural language descriptions or existing codebase analysis.

---

### Feature: AI Bottleneck Detection

```asset kind=delivery.feature src=./seeds/feat-ai-bottleneck-detection.yaml
```

The AI Bottleneck Detection feature covering AI analysis of delivery flow data to identify throughput bottlenecks and WIP accumulation.

---

### Feature: AI Dependency Risk

```asset kind=delivery.feature src=./seeds/feat-ai-dependency-risk.yaml
```

The AI Dependency Risk feature covering AI-assisted analysis of cross-domain references to surface high-impact dependency chains and single points of failure.

---

### Feature: Feature Development Goals

```asset kind=delivery.feature src=./seeds/feat-feature-development-goals.yaml
```

The Feature Development Goals feature covering the structured capture of success metrics, OKRs, and acceptance criteria for features in the dynamic feature management lifecycle.

---

### Feature: Feature Development Competitive Examples

```asset kind=delivery.feature src=./seeds/feat-feature-development-competitive-examples.yaml
```

The Feature Development Competitive Examples feature covering the collection and analysis of competitive product examples during the research phase of feature development.
