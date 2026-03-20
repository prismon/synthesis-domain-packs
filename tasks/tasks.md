---
title: "Tasks Domain"
documentType: design
---

# Tasks Domain

The tasks domain tracks actionable work items in two forms: lightweight personal and team tasks (Apple Reminders style) and structured issue tracking tickets (Jira style). Tasks support flags, recurrence, and list grouping; tickets add story points, sprints, labels, acceptance criteria, and direct linkage to architecture components. Both kinds share Trackable, Ownable, Managed, Linkable, and Dependable traits, giving them status, priority, ownership, due dates, and dependency modeling out of the box.

## Item Kinds

| Kind | Traits | Description |
|------|--------|-------------|
| `tasks.task` | Trackable, Ownable, Managed, Linkable, Dependable | Lightweight task with optional list grouping, flag for urgency, recurrence patterns, location context, and free-form markdown notes. Default view: task kanban. |
| `tasks.ticket` | Trackable, Ownable, Managed, Linkable, Dependable, Lifecycle | Structured issue with issue type (story/bug/task/spike/improvement), story points, sprint identifier, labels, component references, acceptance criteria, reporter, and resolution note. Default view: ticket kanban. |
| `system.view` | Viewable | Visual layout definition for displaying domain items. |
| `system.nav-item` | — | Sidebar navigation item contributed by this domain. |

## Reference Kinds

| Name | Direction | Description |
|------|-----------|-------------|
| `implements` | `tasks.ticket` → `architecture.component` | Links a ticket to the architecture components it implements or relates to. Enables traceability from work items to the system model. |

## Seed Data

### Task: Validate Domain Pack Hot-Reload

```asset kind=tasks.task src=./seeds/task-hot-reload-domains.yaml
```

Confirms that modifying a `domain.yaml` triggers a reload without restarting the backend process.

### Task: Review RLS Policies

```asset kind=tasks.task src=./seeds/task-review-rls-policies.yaml
```

### Task: Set Up OIDC

```asset kind=tasks.task src=./seeds/task-setup-oidc.yaml
```

### Task: Update CLAUDE.md

```asset kind=tasks.task src=./seeds/task-update-claude-md.yaml
```

### Task: Write E2E Tests

```asset kind=tasks.task src=./seeds/task-write-e2e-tests.yaml
```

### Ticket: Changeset SSE

```asset kind=tasks.ticket src=./seeds/ticket-changeset-sse.yaml
```

### Ticket: Kanban View Component

```asset kind=tasks.ticket src=./seeds/ticket-kanban-view-component.yaml
```

### Ticket: Task Notes View

```asset kind=tasks.ticket src=./seeds/ticket-task-notes-view.yaml
```

### Ticket: Tasks Domain Pack

```asset kind=tasks.ticket src=./seeds/ticket-tasks-domain-pack.yaml
```

### Ticket: UID Ref Fix

```asset kind=tasks.ticket src=./seeds/ticket-uid-ref-fix.yaml
```

### Task Kanban View Component

```asset kind=system.view-component src=./seeds/view-components/vc-task-kanban.yaml
```

Registers the `task-kanban` layout type for task and ticket list views.

### Task Notes View Component

```asset kind=system.view-component src=./seeds/view-components/vc-task-notes.yaml
```

Registers the `task-notes` layout type for the task notes detail view.
