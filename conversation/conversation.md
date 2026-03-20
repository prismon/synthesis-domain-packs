---
title: "Conversation Domain"
documentType: design
---

# Conversation Domain

The Conversation domain models Slack-like channels and messages for team communication, automated domain activity feeds, and integration message routing. It serves as the primary communication substrate for both human team members and AI agents — sandbox sessions post messages into conversation channels as they execute.

## Item Kinds

| Kind | Traits | Description |
|------|--------|-------------|
| `conversation.channel` | Ownable, Linkable | Named channels for team discussion, automated activity feeds, or integration events. Channel types: `discussion`, `activity-feed`, `integration` |
| `conversation.message` | — | Individual messages within a channel. Supports markdown body text, author attribution (person, system, integration, or agent), and optional links back to domain items via `itemRef` |

## Reference Kinds

| Reference Kind | Source → Target | Description |
|----------------|-----------------|-------------|
| `parent` | `conversation.message` → `conversation.channel` | A message belongs to exactly one parent channel |

## Seed Data

### Channel: General

```asset kind=conversation.channel src=./seeds/channel-general.yaml
```

General team discussion channel.

### Channel: Architecture

```asset kind=conversation.channel src=./seeds/channel-architecture.yaml
```

Channel for architecture decision discussions and RFCs.

### Channel: Domain Activity

```asset kind=conversation.channel src=./seeds/channel-domain-activity.yaml
```

Automated activity feed channel tracking domain item changes across the platform.

### Message: Welcome

```asset kind=conversation.message src=./seeds/msg-welcome.yaml
```

Welcome message posted to the general channel.

### Message: General Standup

```asset kind=conversation.message src=./seeds/msg-general-standup.yaml
```

Sample standup message in the general channel.

### Message: Architecture Introduction

```asset kind=conversation.message src=./seeds/msg-arch-intro.yaml
```

Introduction message in the architecture channel.

### Message: Architecture RFC

```asset kind=conversation.message src=./seeds/msg-arch-rfc.yaml
```

RFC discussion message in the architecture channel.

### Message: Activity Feed (1)

```asset kind=conversation.message src=./seeds/msg-activity-1.yaml
```

First automated activity feed message.

### Message: Activity Feed (2)

```asset kind=conversation.message src=./seeds/msg-activity-2.yaml
```

Second automated activity feed message.

### Message: Activity Feed (3)

```asset kind=conversation.message src=./seeds/msg-activity-3.yaml
```

Third automated activity feed message.
