---
title: "Git Domain"
documentType: design
---

# Git Domain

The Git domain tracks source code repositories, branches, pull requests, and repository files. It integrates with the Architecture domain via the `hosted-in` reference kind, linking containers to their backing repositories.

## Item Kinds

| Kind | Traits | Description |
|------|--------|-------------|
| `git.repository` | Ownable, Linkable | Git repositories tracked by the platform, including metadata such as visibility, provider, primary language, and clone URL |
| `git.branch` | — | Branches within a repository, capturing HEAD commit SHA, protection status, and ahead/behind counts relative to the default branch |
| `git.pull-request` | Ownable, Trackable, Lifecycle | Pull requests and merge requests with review status, merge status, and line change statistics |
| `git.repo-file` | — | Individual tracked files and directories inside a repository, with detected language and last-modified commit |

## Reference Kinds

| Reference Kind | Source → Target | Description |
|----------------|-----------------|-------------|
| `contains-branch` | `git.repository` → `git.branch` | A repository contains one or more branches |
| `contains-pr` | `git.repository` → `git.pull-request` | A repository contains pull requests |
| `contains-file` | `git.repository` → `git.repo-file` | A repository contains tracked files |
| `hosted-in` | `architecture.container` → `git.repository` | An architecture container's source code lives in a repository |

## Seed Data

### Synthesis Frontend Repository

```asset kind=git.repository src=./seeds/repo-synthesis.yaml
```

The main monorepo for the Synthesis platform — frontend, backend, and domain packs.

### Synthesis Backend Repository

```asset kind=git.repository src=./seeds/repo-synthesis-backend.yaml
```

Standalone Go backend service repository.

### Branch: main (frontend)

```asset kind=git.branch src=./seeds/branch-main.yaml
```

Default branch of the Synthesis frontend repository.

### Branch: main (backend)

```asset kind=git.branch src=./seeds/branch-backend-main.yaml
```

Default branch of the Synthesis backend repository.

### Branch: feature/git

```asset kind=git.branch src=./seeds/branch-feature-git.yaml
```

Feature branch used to develop the Git domain itself.

### PR: Add Git Domain

```asset kind=git.pull-request src=./seeds/pr-add-git-domain.yaml
```

Pull request introducing the Git domain pack to the platform.

### PR: Fix MCP Auth

```asset kind=git.pull-request src=./seeds/pr-fix-mcp-auth.yaml
```

Pull request patching MCP authentication handling in the backend.
