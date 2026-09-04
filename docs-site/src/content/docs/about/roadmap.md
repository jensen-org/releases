---
title: Roadmap
description: Where Jensen is going, organised by its five product pillars. Direction, not a commitment.
---

Nothing on this page is a commitment. There are no dates, and anything here can change. It exists so
you can see the shape of the product rather than guess it from the feature pages, which describe only
what ships today.

## Published status

Jensen's own README publishes a capability table with a status column. As of the current beta it
reads:

| Capability | What it does | Status |
| --- | --- | --- |
| Map a codebase | Builds a navigable graph of the real structure: services, calls between symbols, and the routes they expose. | Available |
| Declare topology | Lets your team assert cross-service structure, which services exist, how they connect, and over what protocol, and merges it into the same map. | Available |
| Open from where you stand | Views the map at any altitude, from the whole-system topology down to a single service's internals. | Available |
| Share the map with your AI | Emits a portable, git-friendly, always-honest map any AI assistant can read. | Available |
| Ask the map questions | Query the structure directly: what calls this, what connects to that, where these routes live. | In progress |
| Stay live | Keeps the map current as you edit, and pulls in work items and pipeline status from GitHub, GitLab and Slack. | Planned |

Two of those statuses run behind what the beta actually does. `jensen query` ships and is documented
in the [CLI reference](../../reference/cli/), and the integrations area ships with credential and
host configuration, an issue inspector, a merge request list and a pipeline inspector, documented in
[Work](../../app/work/). Read the table as the published position rather than as the current state,
and the feature pages as what is there.

## The five pillars

Jensen organises its direction into five pillars. Each one already has something shipping in it.

### Understand

Helping both you and your assistant understand the codebase. The map, the architecture explorer,
dependency mapping, and recorded architectural intent, so the map carries not only what exists but
why.

Ahead: knowledge shared across repositories, which matters for monorepos, microservice estates and
platform teams.

### Learn

Letting an assistant improve its understanding of the project over time rather than rediscovering it.
Project memory, skills and the five-document contract are the shipping parts.

Ahead: a clearer picture of where understanding is thin, so you can see which parts of the project an
assistant knows well and which it is guessing at.

### Execute

Autonomous work that stays predictable. Issue workspaces, isolated worktrees, deterministic
workflows, checkpointed recovery, and a guard that refuses a bad commit where it is typed.

Ahead: deeper coordination between several agents working one feature.

### Observe

Making an assistant's work transparent. The session trace, the reversible timeline, and impact
analysis before a change is approved.

Ahead: replaying a session end to end, and clearer confidence signals on what an assistant produced.

### Govern

Stopping an autonomous agent damaging the project. Workspace trust, per-permission integration
writes, approval gates, tool allowlists enforced by Jensen rather than requested of the model, and an
independent review step in every mutating workflow.

Ahead: architectural constraints defined independently of prompts and checked on every change.

## Deliberately out of scope

Jensen integrates with the tools you already use rather than replacing them. It is not becoming a
hosted IDE, a CI system, a package registry or a project management tool.
