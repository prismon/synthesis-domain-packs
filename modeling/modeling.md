---
title: "Modeling Domain"
documentType: design
---

# Modeling Domain

The modeling domain captures Domain-Driven Design (DDD) concepts applied to the Synthesis platform's own architecture. It provides a structured vocabulary for strategic design (bounded contexts, context maps, anti-corruption layers, shared kernels) and tactical design (aggregates, entities, value objects, domain events, domain services, repositories). All modeling constructs are cross-referenced to the architecture domain: bounded contexts reference systems, and aggregates, services, repositories, and ACLs reference the components that implement them. This allows the DDD model to act as a living specification layer above the C4 architecture.

## Item Kinds

| Kind | Traits | Description |
|------|--------|-------------|
| `modeling.bounded-context` | Ownable, Linkable, Lifecycle, Governable | Explicit boundaries within which a domain model is consistent and authoritative |
| `modeling.context-map` | Ownable, Linkable | High-level maps of how bounded contexts relate and integrate |
| `modeling.anti-corruption-layer` | Ownable, Linkable, Dependable | Translation boundaries that protect a downstream context from an upstream model |
| `modeling.shared-kernel` | Ownable, Linkable, Governable | A deliberately shared subset of the domain model co-owned by two or more bounded contexts |
| `modeling.aggregate` | Hierarchical, Ownable, Linkable, Lifecycle | Cluster of domain objects that form a consistency boundary with a single entry point |
| `modeling.entity` | Hierarchical, Ownable | Domain objects with a persistent identity that persists through state changes |
| `modeling.value-object` | Hierarchical, Ownable | Immutable domain objects defined entirely by their attributes, with no identity |
| `modeling.event` | Hierarchical, Ownable, Linkable, Lifecycle | Immutable records that something significant happened in the domain |
| `modeling.service` | Ownable, Linkable, Dependable, Lifecycle | Stateless operations that belong to the domain but do not fit on any single entity |
| `modeling.repository` | Ownable, Linkable, Lifecycle | Persistence abstraction for aggregate roots |
| `system.view` | Viewable | Visual layouts for displaying domain items |
| `system.nav-item` | _(none)_ | Sidebar navigation items defined by domains |

## Reference Kinds

| Name | Display Name | Reverse | Constraints |
|------|-------------|---------|-------------|
| `parent` | Parent Of | Child Of | aggregate→bounded-context, entity→aggregate, value-object→aggregate, event→aggregate, service→bounded-context, repository→aggregate |
| `belongs-to-context` | Belongs To Context | Contains | aggregate→bounded-context, service→bounded-context |
| `implements` | Implemented By | Implements | bounded-context→architecture.system, aggregate→architecture.component, service→architecture.component, repository→architecture.component, anti-corruption-layer→architecture.component |
| `publishes` | Publishes | Published By | aggregate→event |
| `subscribes-to` | Subscribes To | Subscribed To By | aggregate→event, service→event, bounded-context→event |
| `translates` | Translates | Translated By | anti-corruption-layer→bounded-context |
| `shares-kernel-with` | Shares Kernel With | Shares Kernel With | bounded-context↔bounded-context |
| `manages-aggregate` | Manages Aggregate | Managed By | repository→aggregate |

## Views

The modeling domain uses two views:

- `ddd-context-map` — the preferred view for bounded contexts, context maps, anti-corruption layers, and shared kernels; renders the strategic DDD context map showing context relationships
- `ddd-class-diagram` — the preferred view for aggregates, entities, value objects, domain events, domain services, and repositories; renders the tactical DDD class diagram

## Seed Data

### Bounded Context: Domain

```asset kind=modeling.bounded-context src=./seeds/context-domain.yaml
```

The Domain bounded context representing the core domain item, definition, and field management responsibility within Synthesis. It is the authoritative context for all CRUD operations on domain items.

---

### Bounded Context: Reference

```asset kind=modeling.bounded-context src=./seeds/context-reference.yaml
```

The Reference bounded context responsible for managing first-class reference items, enforcing cardinality constraints, and resolving the reference vocabulary between domain items.

---

### Bounded Context: Tenant

```asset kind=modeling.bounded-context src=./seeds/context-tenant.yaml
```

The Tenant bounded context responsible for tenant identity, OIDC authentication, row-level security enforcement, and multi-tenant data isolation.

---

### Bounded Context: Trait

```asset kind=modeling.bounded-context src=./seeds/context-trait.yaml
```

The Trait bounded context responsible for the trait registry, field injection, and schema resolution that composes behavioral capabilities into domain definitions.

---

### Bounded Context: View

```asset kind=modeling.bounded-context src=./seeds/context-view.yaml
```

The View bounded context responsible for the view registry, `system.view` item kind, and the dispatch of view components for rendering visual representations of domain data.

---

### Context Map: Synthesis

```asset kind=modeling.context-map src=./seeds/context-map-synthesis.yaml
```

The top-level context map for the Synthesis platform, capturing how all five bounded contexts (Domain, Reference, Tenant, Trait, View) relate and integrate with each other.

---

### Aggregate: Domain Item

```asset kind=modeling.aggregate src=./seeds/aggregate-domain-item.yaml
```

The Domain Item aggregate, the central consistency boundary in the Domain context. It owns the item's fields, version, review status, and manages all mutations through the domain service entry point.

---

### Aggregate: Domain Definition

```asset kind=modeling.aggregate src=./seeds/aggregate-domain-definition.yaml
```

The Domain Definition aggregate that owns a kind's field schema, trait declarations, and display metadata. Changes to definitions can affect all items of that kind.

---

### Entity: Item

```asset kind=modeling.entity src=./seeds/entity-item.yaml
```

The Item entity, the aggregate root of the Domain Item aggregate. It has a stable UID identity and carries the versioned field payload for a single domain item instance.

---

### Entity: Definition

```asset kind=modeling.entity src=./seeds/entity-definition.yaml
```

The Definition entity, the aggregate root of the Domain Definition aggregate. It has a stable name-based identity and carries the full field schema and trait list for a domain kind.

---

### Value Object: Item Spec

```asset kind=modeling.value-object src=./seeds/vo-item-spec.yaml
```

The Item Spec value object representing the immutable field payload of a domain item at a point in time. Equality is determined by the complete field map; it has no independent identity.

---

### Value Object: Field Schema

```asset kind=modeling.value-object src=./seeds/vo-field-schema.yaml
```

The Field Schema value object representing the definition of a single field: its name, type, required flag, enum values, and target kind for references. Immutable once declared.

---

### Domain Event: Item Created

```asset kind=modeling.event src=./seeds/event-item-created.yaml
```

The ItemCreated domain event published by the Domain Item aggregate when a new item is successfully created. Carries the item UID, kind, tenant, and initial field payload.

---

### Domain Event: Item Updated

```asset kind=modeling.event src=./seeds/event-item-updated.yaml
```

The ItemUpdated domain event published by the Domain Item aggregate when an existing item's fields are modified. Carries the previous and new field payloads for diff computation.

---

### Domain Service: Schema Resolver

```asset kind=modeling.service src=./seeds/service-schema-resolver.yaml
```

The Schema Resolver domain service that merges trait-injected fields with definition-level fields to produce the fully resolved schema. Stateless; operates purely on definition and trait data.

---

### Domain Service: Tenant Resolver

```asset kind=modeling.service src=./seeds/service-tenant-resolver.yaml
```

The Tenant Resolver domain service that extracts the tenant identity from incoming requests (via hostname or JWT claims) and resolves it to a fully hydrated tenant context object.

---

### Repository: Item Repository

```asset kind=modeling.repository src=./seeds/repo-item.yaml
```

The Item Repository, the persistence abstraction for the Domain Item aggregate root. Supports find-by-UID, find-by-kind, create, update, delete, and list-versions query methods against PostgreSQL.

---

### Repository: Definition Repository

```asset kind=modeling.repository src=./seeds/repo-definition.yaml
```

The Definition Repository, the persistence abstraction for the Domain Definition aggregate root. Supports find-by-name, find-by-domain, create, update, and delete operations.

---

### Anti-Corruption Layer: View Domain

```asset kind=modeling.anti-corruption-layer src=./seeds/acl-view-domain.yaml
```

The View–Domain ACL that translates between the View context's rendering model and the Domain context's item model. It adapts raw domain item data into the typed, view-friendly structures consumed by diagram and board components.

---

### Shared Kernel: Type Identity

```asset kind=modeling.shared-kernel src=./seeds/shared-kernel-type-identity.yaml
```

The Type Identity shared kernel containing the core UID generation scheme, kind naming conventions, and tenant identifier format co-owned by all five bounded contexts to ensure cross-context referential consistency.
