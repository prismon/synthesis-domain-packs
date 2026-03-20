---
title: "Audit Domain"
documentType: design
---

# Audit Domain

The audit domain records as-built system documentation: audit findings, API endpoints, database schemas, permissions, design patterns, and design documents. It serves as the authoritative source of truth for what is actually deployed — as opposed to what was planned — enabling security posture assessment, compliance reviews, and architectural due diligence. All audit items are cross-referenced to the architecture domain (systems, containers, components) so that findings and patterns can be traced to the specific architectural elements they affect. The domain also provides the `audit-findings-table` view for reviewing findings by severity and category.

## Item Kinds

| Kind | Traits | Description |
|------|--------|-------------|
| `audit.finding` | Trackable, Lifecycle, Governable | Individual audit observations with severity, category, and references to affected architecture items |
| `audit.api-endpoint` | Ownable, Linkable | Directory of all MCP tools and HTTP endpoints exposed by the system |
| `audit.db-schema` | Ownable, Linkable | Database tables, columns, indexes, and row-level security policies |
| `audit.permission` | Ownable | Authorization checks, RBAC rules, middleware, and admission controllers |
| `audit.design-pattern` | Ownable, Linkable | Architectural and implementation patterns observed in the system |
| `audit.design-document` | Ownable, Lifecycle, Governable, Agentic | Generated design documentation for systems, containers, and components |
| `system.view` | Viewable | Visual layouts for displaying domain items |
| `system.nav-item` | _(none)_ | Sidebar navigation items defined by domains |

## Reference Kinds

| Name | Display Name | Reverse | Constraints |
|------|-------------|---------|-------------|
| `audits` | Audits | Audited By | finding→architecture.system, finding→architecture.container, finding→architecture.component |
| `documents` | Documents | Documented By | design-document→architecture.system, design-document→architecture.container |
| `implements-endpoint` | Implements | Implemented By | api-endpoint→architecture.component |
| `enforces` | Enforces | Enforced By | permission→architecture.component |
| `owns-schema` | Owns Schema | Schema Owned By | db-schema→architecture.component |

## Views

The audit domain uses the `audit-findings-table` view (referenced as `preferredViewRef` on `audit.finding`) which renders all findings in a tabular layout sortable by severity and filterable by category.

## Seed Data

### Finding: Admin Check Hardcoded False

```asset kind=audit.finding src=./seeds/finding-admin-check-hardcoded-false.yaml
```

An audit finding noting that an admin authorization check is hardcoded to return false, effectively disabling the check rather than enforcing it.

---

### Finding: Agent API Key Empty

```asset kind=audit.finding src=./seeds/finding-agent-api-key-empty.yaml
```

An audit finding noting that the agent API key configuration is empty, meaning sandbox agent sessions could be launched without credential validation.

---

### Finding: Auth Callback Silent Catch

```asset kind=audit.finding src=./seeds/finding-auth-callback-silent-catch.yaml
```

An audit finding noting that the OIDC auth callback error handler silently catches exceptions without surfacing them to the user or logging them for diagnostics.

---

### Finding: Budget Manager Unwired

```asset kind=audit.finding src=./seeds/finding-budget-manager-unwired.yaml
```

An audit finding noting that the budget manager component is declared but not wired into the request processing pipeline, making it a no-op at runtime.

---

### Finding: Chat Bubble Unconditional

```asset kind=audit.finding src=./seeds/finding-chat-bubble-unconditional.yaml
```

An audit finding noting that the chat bubble UI element is rendered unconditionally regardless of feature flags or user permissions.

---

### Finding: ChatWindow JSON Parse No Try-Catch

```asset kind=audit.finding src=./seeds/finding-chatwindow-json-parse-no-trycatch.yaml
```

An audit finding noting that the ChatWindow component parses JSON message payloads without a try-catch block, causing unhandled exceptions on malformed messages.

---

### Finding: Database SSL Mode Disabled

```asset kind=audit.finding src=./seeds/finding-database-sslmode-disabled.yaml
```

An audit finding noting that the PostgreSQL connection string has SSL mode disabled, meaning database traffic is transmitted in plaintext.

---

### Finding: DCR Proxy Error Swallowing

```asset kind=audit.finding src=./seeds/finding-dcr-proxy-error-swallowing.yaml
```

An audit finding noting that the dynamic client registration proxy swallows errors from the upstream OIDC provider, masking registration failures from callers.

---

### Finding: Dead Routes

```asset kind=audit.finding src=./seeds/finding-dead-routes.yaml
```

An audit finding identifying unreachable frontend routes that are registered in the router but have no corresponding navigation entry or link, representing dead code.

---

### Finding: Dev Mode Trusts Headers

```asset kind=audit.finding src=./seeds/finding-dev-mode-trusts-headers.yaml
```

An audit finding noting that in development mode the backend trusts tenant identity headers without cryptographic verification, creating an impersonation risk.

---

### Finding: Evaluate Rules Stub

```asset kind=audit.finding src=./seeds/finding-evaluate-rules-stub.yaml
```

An audit finding noting that the rule evaluation endpoint is a stub that always returns success, meaning no rules are actually enforced at runtime.

---

### Finding: EventSource Memory Leak

```asset kind=audit.finding src=./seeds/finding-eventsource-memory-leak.yaml
```

An audit finding noting that EventSource connections opened for SSE streaming are not closed on component unmount, causing a memory leak in long-running sessions.

---

### Finding: Expiry Worker Stub

```asset kind=audit.finding src=./seeds/finding-expiry-worker-stub.yaml
```

An audit finding noting that the session expiry background worker is a stub that does not actually expire sessions, allowing stale sessions to accumulate indefinitely.

---

### Finding: Git Analyze Recipe

```asset kind=audit.finding src=./seeds/finding-git-analyze-recipe.yaml
```

An audit finding noting a design concern in the git analysis recipe that may produce incomplete results for large repositories.

---

### Finding: Git Inactive

```asset kind=audit.finding src=./seeds/finding-git-inactive.yaml
```

An audit finding noting that the git integration plugin is present in the codebase but is not actively connected to any running value stream or domain item.

---

### Finding: Goroutine Leak Auto-Tools

```asset kind=audit.finding src=./seeds/finding-goroutine-leak-auto-tools.yaml
```

An audit finding noting that the auto-tools background goroutines are not bound to a context with cancellation, causing goroutine leaks when the server shuts down.

---

### Finding: i18n Table Keys Unused

```asset kind=audit.finding src=./seeds/finding-i18n-table-keys-unused.yaml
```

An audit finding noting that a set of i18n translation keys defined in the locale file are never referenced in the frontend, representing stale translation debt.

---

### Finding: Impersonation via LocalStorage

```asset kind=audit.finding src=./seeds/finding-impersonation-localstorage.yaml
```

An audit finding noting that tenant realm identity is read from localStorage, allowing a user to impersonate a different tenant realm by modifying browser storage.

---

### Finding: JSON Encode Errors Ignored

```asset kind=audit.finding src=./seeds/finding-json-encode-errors-ignored.yaml
```

An audit finding noting that multiple JSON encoding operations in the backend discard the error return value, silently producing incomplete or corrupted responses.

---

### Finding: Keycloak Passwords in Compose

```asset kind=audit.finding src=./seeds/finding-keycloak-passwords-in-compose.yaml
```

An audit finding noting that Keycloak admin credentials are hardcoded in the Docker Compose file, committing secrets to source control.

---

### Finding: Keycloak SSL Required None

```asset kind=audit.finding src=./seeds/finding-keycloak-ssl-required-none.yaml
```

An audit finding noting that the Keycloak realm configuration has `sslRequired` set to `none`, meaning OIDC tokens can be issued over unencrypted HTTP connections.

---

### Finding: Lifecycle Not Enforced

```asset kind=audit.finding src=./seeds/finding-lifecycle-not-enforced.yaml
```

An audit finding noting that items with the Lifecycle trait have a `lifecycleStage` field but there is no server-side enforcement preventing invalid stage transitions.

---

### Finding: Markdown in Spec

```asset kind=audit.finding src=./seeds/finding-markdown-in-spec.yaml
```

An audit finding noting that some YAML seed files contain embedded markdown in string fields, creating an inconsistency between the declared field type and its actual content format.

---

### Finding: MCP Client Unvalidated Array

```asset kind=audit.finding src=./seeds/finding-mcp-client-unvalidated-array.yaml
```

An audit finding noting that the frontend MCP client processes array responses from tool calls without validating their structure, risking runtime errors on unexpected shapes.

---

### Finding: Nginx Missing Security Headers

```asset kind=audit.finding src=./seeds/finding-nginx-missing-security-headers.yaml
```

An audit finding noting that the Nginx frontend configuration does not set security headers such as `Content-Security-Policy`, `X-Frame-Options`, or `X-Content-Type-Options`.

---

### Finding: No Frontend RBAC

```asset kind=audit.finding src=./seeds/finding-no-frontend-rbac.yaml
```

An audit finding noting that the frontend UI does not enforce role-based access control — admin-only actions are hidden by convention but not prevented by permission checks.

---

### Finding: Novamart Data Mixed

```asset kind=audit.finding src=./seeds/finding-novamart-data-mixed.yaml
```

An audit finding noting that seed data originally created for the Novamart demo tenant was not fully removed and is still present in the demo tenant's domain data.

---

### Finding: Pagination In-Memory

```asset kind=audit.finding src=./seeds/finding-pagination-in-memory.yaml
```

An audit finding noting that list queries for domain items perform in-memory pagination after loading all rows, which will not scale for tenants with large item counts.

---

### Finding: Rate Limiter Memory Leak

```asset kind=audit.finding src=./seeds/finding-rate-limiter-memory-leak.yaml
```

An audit finding noting that the in-process rate limiter stores per-IP state in an unbounded map without eviction, causing memory growth under sustained traffic.

---

### Finding: Realm No Character Validation

```asset kind=audit.finding src=./seeds/finding-realm-no-character-validation.yaml
```

An audit finding noting that realm name values derived from the hostname are passed to the OIDC issuer URL without character validation, creating a potential injection risk.

---

### Finding: RLS Enforced

```asset kind=audit.finding src=./seeds/finding-rls-enforced.yaml
```

A positive audit finding confirming that PostgreSQL row-level security is correctly enforced on the `domain_items`, `domain_definitions`, and `domain_edges` tables.

---

### Finding: View Registrations Type Safety

```asset kind=audit.finding src=./seeds/finding-view-registrations-type-safety.yaml
```

An audit finding noting that view component registrations use loose typing, meaning incorrectly typed view configs will produce runtime errors rather than compile-time failures.

---

### Finding: Wildcard Redirect URI

```asset kind=audit.finding src=./seeds/finding-wildcard-redirect-uri.yaml
```

An audit finding noting that the OIDC client configuration includes a wildcard redirect URI, which broadens the attack surface for open redirect exploits.

---

### Finding: Zero TODOs

```asset kind=audit.finding src=./seeds/finding-zero-todos.yaml
```

A positive audit finding confirming that the codebase contains zero outstanding TODO or FIXME comments, indicating clean technical debt hygiene.

---

### Review Policy: Findings

```asset kind=audit.finding src=./seeds/review-policy-findings.yaml
```

A review policy configuration item that defines the governance rules applied to `audit.finding` items, requiring `tenant_admin` approval before findings are marked as resolved.

---

### API Endpoint: Domain List Items

```asset kind=audit.api-endpoint src=./seeds/api-domain-list-items.yaml
```

The `domain_list_items` MCP tool that returns all items of a given kind for the current tenant.

---

### API Endpoint: Domain Get Item

```asset kind=audit.api-endpoint src=./seeds/api-domain-get-item.yaml
```

The `domain_get_item` MCP tool that retrieves a single domain item by UID, returning its full field payload and metadata.

---

### API Endpoint: Domain Create Item

```asset kind=audit.api-endpoint src=./seeds/api-domain-create-item.yaml
```

The `domain_create_item` MCP tool that creates a new domain item of a specified kind with the provided field values, subject to schema validation.

---

### API Endpoint: Domain Update Item

```asset kind=audit.api-endpoint src=./seeds/api-domain-update-item.yaml
```

The `domain_update_item` MCP tool that updates the fields of an existing domain item, creating a new version snapshot.

---

### API Endpoint: Domain Delete Item

```asset kind=audit.api-endpoint src=./seeds/api-domain-delete-item.yaml
```

The `domain_delete_item` MCP tool that permanently removes a domain item and its associated reference edges.

---

### API Endpoint: Domain List Definitions

```asset kind=audit.api-endpoint src=./seeds/api-domain-list-definitions.yaml
```

The `domain_list_definitions` MCP tool that returns all registered domain kind definitions for the current tenant.

---

### API Endpoint: Domain Get Definition

```asset kind=audit.api-endpoint src=./seeds/api-domain-get-definition.yaml
```

The `domain_get_definition` MCP tool that retrieves a domain kind definition including its resolved field schema.

---

### API Endpoint: Domain Create Definition

```asset kind=audit.api-endpoint src=./seeds/api-domain-create-definition.yaml
```

The `domain_create_definition` MCP tool that registers a new domain kind definition with a field schema and optional trait declarations.

---

### API Endpoint: Domain Update Definition

```asset kind=audit.api-endpoint src=./seeds/api-domain-update-definition.yaml
```

The `domain_update_definition` MCP tool that modifies the field schema or metadata of an existing domain kind definition.

---

### API Endpoint: Domain Delete Definition

```asset kind=audit.api-endpoint src=./seeds/api-domain-delete-definition.yaml
```

The `domain_delete_definition` MCP tool that removes a domain kind definition; fails if items of that kind still exist.

---

### API Endpoint: Domain Query Graph

```asset kind=audit.api-endpoint src=./seeds/api-domain-query-graph.yaml
```

The `domain_query_graph` MCP tool that returns the reference graph for a set of items, including all inbound and outbound edges.

---

### API Endpoint: Domain Add Reference

```asset kind=audit.api-endpoint src=./seeds/api-domain-add-reference.yaml
```

The `domain_add_reference` MCP tool that creates a new `system.reference` item linking two domain items with a named reference kind.

---

### API Endpoint: Domain Remove Reference

```asset kind=audit.api-endpoint src=./seeds/api-domain-remove-reference.yaml
```

The `domain_remove_reference` MCP tool that deletes an existing `system.reference` item by UID, removing the relationship between two domain items.

---

### API Endpoint: Domain List Versions

```asset kind=audit.api-endpoint src=./seeds/api-domain-list-versions.yaml
```

The `domain_list_versions` MCP tool that returns the version history for a domain item, with timestamps and actor information.

---

### API Endpoint: Domain Get Version

```asset kind=audit.api-endpoint src=./seeds/api-domain-get-version.yaml
```

The `domain_get_version` MCP tool that retrieves a specific historical version snapshot of a domain item.

---

### API Endpoint: Domain Diff Versions

```asset kind=audit.api-endpoint src=./seeds/api-domain-diff-versions.yaml
```

The `domain_diff_versions` MCP tool that computes a field-level diff between two version snapshots of a domain item.

---

### API Endpoint: Domain Import Item

```asset kind=audit.api-endpoint src=./seeds/api-domain-import-item.yaml
```

The `domain_import_item` MCP tool that creates or updates a domain item from a markdown or YAML export document.

---

### API Endpoint: Domain Export Item

```asset kind=audit.api-endpoint src=./seeds/api-domain-export-item.yaml
```

The `domain_export_item` MCP tool that exports a domain item as a formatted markdown or YAML document for use in external documentation.

---

### API Endpoint: Domain Detach Item

```asset kind=audit.api-endpoint src=./seeds/api-domain-detach-item.yaml
```

The `domain_detach_item` MCP tool that removes the `managedBy` lock from a domain-pack-managed item, allowing it to be freely edited by users.

---

### API Endpoint: Domain List Traits

```asset kind=audit.api-endpoint src=./seeds/api-domain-list-traits.yaml
```

The `domain_list_traits` MCP tool that returns the full catalog of available traits with their names, descriptions, and injected fields.

---

### API Endpoint: Review List Pending

```asset kind=audit.api-endpoint src=./seeds/api-review-list-pending.yaml
```

The `review_list_pending` MCP tool that returns all domain item changes awaiting reviewer approval for the current tenant.

---

### API Endpoint: Review List My Changes

```asset kind=audit.api-endpoint src=./seeds/api-review-list-my-changes.yaml
```

The `review_list_my_changes` MCP tool that returns all changes submitted by the authenticated user, including approved and rejected ones.

---

### API Endpoint: Review Get Change

```asset kind=audit.api-endpoint src=./seeds/api-review-get-change.yaml
```

The `review_get_change` MCP tool that retrieves the full details of a specific pending change including the field diff and submitter metadata.

---

### API Endpoint: Review Approve

```asset kind=audit.api-endpoint src=./seeds/api-review-approve.yaml
```

The `review_approve` MCP tool that approves a pending change, applying the field updates to the live item and recording the reviewer decision.

---

### API Endpoint: Review Reject

```asset kind=audit.api-endpoint src=./seeds/api-review-reject.yaml
```

The `review_reject` MCP tool that rejects a pending change, discarding the proposed updates and notifying the submitter.

---

### API Endpoint: Agent Chat

```asset kind=audit.api-endpoint src=./seeds/api-agent-chat.yaml
```

The agent chat MCP tool that provides a conversational interface for interacting with a running sandbox agent session.

---

### API Endpoint: Agent List Sessions

```asset kind=audit.api-endpoint src=./seeds/api-agent-list-sessions.yaml
```

The tool that lists active and recent agent sessions for the current tenant, with status and session metadata.

---

### API Endpoint: Agent Stream

```asset kind=audit.api-endpoint src=./seeds/api-agent-stream.yaml
```

The agent stream endpoint that provides real-time message delivery from a running agent session to the frontend client.

---

### API Endpoint: Sandbox Launch

```asset kind=audit.api-endpoint src=./seeds/api-sandbox-launch.yaml
```

The `sandbox_launch` MCP tool that starts a new Docker-containerized AI agent session from a sandbox template.

---

### API Endpoint: Sandbox Post Message

```asset kind=audit.api-endpoint src=./seeds/api-sandbox-post-message.yaml
```

The `sandbox_post_message` MCP tool that sends a message to a running sandbox session's agent inbox.

---

### API Endpoint: Sandbox Status

```asset kind=audit.api-endpoint src=./seeds/api-sandbox-status.yaml
```

The `sandbox_status` MCP tool that returns the current status and metadata of a sandbox session.

---

### API Endpoint: Sandbox Terminate

```asset kind=audit.api-endpoint src=./seeds/api-sandbox-terminate.yaml
```

The `sandbox_terminate` MCP tool that stops a running sandbox session and cleans up its Docker container.

---

### API Endpoint: Sandbox Update Message

```asset kind=audit.api-endpoint src=./seeds/api-sandbox-update-message.yaml
```

The `sandbox_update_message` MCP tool that updates the content or status of an existing message in a sandbox session.

---

### API Endpoint: Git Analyze Repository

```asset kind=audit.api-endpoint src=./seeds/api-git-analyze-repository.yaml
```

The `git_analyze_repository` MCP tool that triggers analysis of a connected Git repository, extracting structure and dependency information into domain items.

---

### API Endpoint: Git Sync Repository

```asset kind=audit.api-endpoint src=./seeds/api-git-sync-repository.yaml
```

The `git_sync_repository` MCP tool that synchronizes the latest branch and pull request state from a Git repository into the domain model.

---

### API Endpoint: Controller Reconcile

```asset kind=audit.api-endpoint src=./seeds/api-controller-reconcile.yaml
```

The controller reconcile endpoint that triggers a reconciliation pass to align the live domain state with declared desired state.

---

### API Endpoint: Controller Status

```asset kind=audit.api-endpoint src=./seeds/api-controller-status.yaml
```

The controller status endpoint that returns the current reconciliation status, including last run time and any errors.

---

### API Endpoint: Synthesis Generate Context

```asset kind=audit.api-endpoint src=./seeds/api-synthesis-generate-context.yaml
```

The `synthesis_generate_context` MCP tool that assembles a comprehensive markdown context document from live domain data for use in AI agent system prompts.

---

### API Endpoint: Synthesis Resolve Budget

```asset kind=audit.api-endpoint src=./seeds/api-synthesis-resolve-budget.yaml
```

The `synthesis_resolve_budget` MCP tool that resolves the token budget allocation for a synthesis context generation request.

---

### API Endpoint: Synthesis Session Info

```asset kind=audit.api-endpoint src=./seeds/api-synthesis-session-info.yaml
```

The `synthesis_session_info` MCP tool that returns information about the current authenticated session, including tenant, realm, and user identity.

---

### API Endpoint: Synthesis Validate Branch

```asset kind=audit.api-endpoint src=./seeds/api-synthesis-validate-branch.yaml
```

The `synthesis_validate_branch` MCP tool that validates the consistency of a domain data branch against the defined schemas and reference constraints.

---

### API Endpoint: Enterprise Create Twin Snapshot

```asset kind=audit.api-endpoint src=./seeds/api-enterprise-create-twin-snapshot.yaml
```

The enterprise-gated `enterprise_create_twin_snapshot` MCP tool that captures a point-in-time snapshot of the digital twin state for analysis.

---

### API Endpoint: Enterprise Evaluate Rules

```asset kind=audit.api-endpoint src=./seeds/api-enterprise-evaluate-rules.yaml
```

The enterprise-gated `enterprise_evaluate_rules` MCP tool that runs the rule engine against the current domain state and returns evaluation results.

---

### API Endpoint: Enterprise Evaluate Twin

```asset kind=audit.api-endpoint src=./seeds/api-enterprise-evaluate-twin.yaml
```

The enterprise-gated `enterprise_evaluate_twin` MCP tool that evaluates a digital twin model against live observations to surface deviations.

---

### API Endpoint: Enterprise Execute Rule

```asset kind=audit.api-endpoint src=./seeds/api-enterprise-execute-rule.yaml
```

The enterprise-gated `enterprise_execute_rule` MCP tool that executes a single named rule and returns its output.

---

### API Endpoint: Enterprise List Execution Logs

```asset kind=audit.api-endpoint src=./seeds/api-enterprise-list-execution-logs.yaml
```

The enterprise-gated tool that returns the history of rule execution logs for audit and debugging purposes.

---

### API Endpoint: Enterprise List Observations

```asset kind=audit.api-endpoint src=./seeds/api-enterprise-list-observations.yaml
```

The enterprise-gated tool that returns recorded observations from the digital twin monitoring system.

---

### API Endpoint: Enterprise Query Metrics

```asset kind=audit.api-endpoint src=./seeds/api-enterprise-query-metrics.yaml
```

The enterprise-gated `enterprise_query_metrics` MCP tool that queries aggregated platform and delivery metrics from the digital twin.

---

### API Endpoint: Enterprise Record Observation

```asset kind=audit.api-endpoint src=./seeds/api-enterprise-record-observation.yaml
```

The enterprise-gated `enterprise_record_observation` MCP tool that records a new observation event into the digital twin monitoring log.

---

### API Endpoint: Enterprise Simulate Twin

```asset kind=audit.api-endpoint src=./seeds/api-enterprise-simulate-twin.yaml
```

The enterprise-gated `enterprise_simulate_twin` MCP tool that runs a simulation scenario against the digital twin model.

---

### Database Schema: Domain Items

```asset kind=audit.db-schema src=./seeds/schema-domain-items.yaml
```

The `domain_items` table schema. Stores all domain item records with UID, kind, tenant, field payload (JSONB), version counter, review status, and managed-by metadata.

---

### Database Schema: Domain Definitions

```asset kind=audit.db-schema src=./seeds/schema-domain-definitions.yaml
```

The `domain_definitions` table schema. Stores all domain kind definitions with name, field schema (JSONB), trait list, display metadata, and tenant ownership.

---

### Database Schema: Domain Edges

```asset kind=audit.db-schema src=./seeds/schema-domain-edges.yaml
```

The `domain_edges` table schema. Stores all `system.reference` items as directed edges with source UID, target UID, reference kind name, and tenant scoping.

---

### Permission: Require Write

```asset kind=audit.permission src=./seeds/perm-require-write.yaml
```

The `requireWrite` middleware permission check that enforces `tenant_admin` role on all MCP tools that mutate domain data (create, update, delete).

---

### Permission: Tenant Middleware

```asset kind=audit.permission src=./seeds/perm-tenant-middleware.yaml
```

The tenant middleware permission enforcement point that rejects requests with missing or invalid tenant identity before they reach any tool handler.

---

### Permission: Tenant Domain Write

```asset kind=audit.permission src=./seeds/perm-tenant-domain-write.yaml
```

The RBAC rule that requires the `tenant_domain_write` scope for all domain item write operations, mapping to the `tenant_admin` Keycloak role.

---

### Permission: RLS Items

```asset kind=audit.permission src=./seeds/perm-rls-items.yaml
```

The PostgreSQL RLS policy on `domain_items` that restricts all reads and writes to rows matching the current session's `app.tenant_id` setting.

---

### Permission: RLS Definitions

```asset kind=audit.permission src=./seeds/perm-rls-definitions.yaml
```

The PostgreSQL RLS policy on `domain_definitions` that restricts all reads and writes to rows matching the current session's `app.tenant_id` setting.

---

### Permission: RLS Edges

```asset kind=audit.permission src=./seeds/perm-rls-edges.yaml
```

The PostgreSQL RLS policy on `domain_edges` that restricts all reads and writes to rows matching the current session's `app.tenant_id` setting.

---

### Permission: Cardinality Controller

```asset kind=audit.permission src=./seeds/perm-cardinality-controller.yaml
```

The cardinality controller admission check that enforces reference kind cardinality constraints before allowing a new `system.reference` item to be created.

---

### Permission: Edge Sync Controller

```asset kind=audit.permission src=./seeds/perm-edge-sync-controller.yaml
```

The edge sync controller that reconciles the `domain_edges` graph table when items are deleted, preventing dangling references.

---

### Design Pattern: MCP-First

```asset kind=audit.design-pattern src=./seeds/pattern-mcp-first.yaml
```

The MCP-First architectural pattern: all frontend-to-backend communication is routed through the MCP protocol via `callTool()`, with no direct REST calls from the UI.

---

### Design Pattern: Domain Packs

```asset kind=audit.design-pattern src=./seeds/pattern-domain-packs.yaml
```

The Domain Packs pattern: all domain kind definitions, seed data, views, and navigation items are bundled into YAML domain pack directories that can be loaded, hot-reloaded, and tenant-scoped.

---

### Design Pattern: Trait Composition

```asset kind=audit.design-pattern src=./seeds/pattern-trait-composition.yaml
```

The Trait Composition pattern: behavioral capabilities (Ownable, Trackable, Hierarchical, etc.) are declared as traits on domain definitions, injecting fields into the resolved schema at runtime.

---

### Design Pattern: Reference System

```asset kind=audit.design-pattern src=./seeds/pattern-reference-system.yaml
```

The Reference System pattern: all relationships between domain items are modeled as first-class `system.reference` items with typed reference kinds, enabling rich graph queries and cardinality enforcement.

---

### Design Pattern: Row-Level Security

```asset kind=audit.design-pattern src=./seeds/pattern-row-level-security.yaml
```

The Row-Level Security pattern: PostgreSQL RLS policies enforce per-tenant data isolation at the database layer using `SET LOCAL app.tenant_id` on every connection.

---

### Design Pattern: Enterprise Plugins

```asset kind=audit.design-pattern src=./seeds/pattern-enterprise-plugins.yaml
```

The Enterprise Plugins pattern: enterprise-only features are compiled in using Go build tags and wired via a plugin interface, keeping the open-source binary free of enterprise code.

---

### Design Pattern: Admission Chain

```asset kind=audit.design-pattern src=./seeds/pattern-admission-chain.yaml
```

The Admission Chain pattern: domain item writes pass through an ordered chain of admission controllers (cardinality, schema validation, lifecycle rules) before being committed to the repository.

---

### Design Pattern: View Registry

```asset kind=audit.design-pattern src=./seeds/pattern-view-registry.yaml
```

The View Registry pattern: view components are registered by name in the view registry at startup, and `system.view` items reference them by tag, enabling dynamic view dispatch without hard-coded component references.

---

### Design Document: System Overview

```asset kind=audit.design-document src=./seeds/doc-system-overview.yaml
```

The system-level design document providing a high-level overview of the Synthesis platform architecture, its key subsystems, and the technology choices that underpin it.

---

### Design Document: Backend API

```asset kind=audit.design-document src=./seeds/doc-backend-api.yaml
```

The API reference design document cataloguing all MCP tools exposed by the backend, with parameter schemas, required permissions, and example invocations.

---

### Design Document: Database Schema

```asset kind=audit.design-document src=./seeds/doc-database-schema.yaml
```

The schema reference design document describing all PostgreSQL tables, column types, indexes, and RLS policies in the Synthesis database.

---

### Design Document: Security Model

```asset kind=audit.design-document src=./seeds/doc-security-model.yaml
```

The security model design document describing the authentication flow, RBAC role hierarchy, RLS enforcement, and known security findings with their remediation status.

---

### Design Document: Frontend Architecture

```asset kind=audit.design-document src=./seeds/doc-frontend-architecture.yaml
```

The frontend architecture design document describing the React component hierarchy, MCP client integration, React Query cache patterns, and view registry dispatch model.
