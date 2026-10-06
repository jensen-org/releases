---
title: Roadmap
description: Where Jensen is going, organized by its five product pillars. Direction, not a commitment.
---

Nothing here is a commitment. There are no dates, and anything can change. This page shows the shape
of the product, which the feature pages cannot, because they describe only what ships today.

## Published status

| Capability | What it does | Status |
| --- | --- | --- |
| Map a codebase | Builds a navigable graph of the real structure: files, imports, services, symbols and routes. | Available |
| Confirm architecture | An assistant proposes structure, you confirm it, and it joins the map. | Available |
| Share the map with your AI | Writes a portable, git friendly map any assistant can read. | Available |
| Ask the map questions | Asks what calls this, what connects to that, and what a change reaches. | Available |
| One flow for every change | Plan, approve, task branch, land and cleanup, by your branch policy. | Available |
| Stay live | Keeps the map current as you edit, and pulls in issues and pipelines from GitHub, GitLab and Slack. | Available |

## The five pillars

Each pillar already has something shipping.

### Understand

Helping you and your assistant understand the codebase: the map, the graph, impact analysis and
confirmed architecture, so the map carries what exists and why.

Ahead: knowledge shared across repositories, for monorepos, microservice estates and platform teams.

### Learn

Letting an assistant improve its understanding over time. Project memory, skills, recall before the
first edit, a debrief when work ends, and five context documents ship today.

Ahead: a clearer picture of where understanding is thin, so you see what an assistant knows well and
what it guesses.

### Execute

Autonomous work that stays predictable. Plans, task branches and worktrees, landing by branch policy,
deterministic workflows and a guard that refuses a bad commit where it is typed.

Ahead: deeper coordination between several agents on one feature.

### Observe

Making an assistant's work transparent: the session trace, recorded changes and impact analysis before
a plan is approved.

Ahead: replaying a session end to end, and clearer confidence signals on what an assistant produced.

### Govern

Stopping an autonomous agent damaging the project. Trusted folders, per permission integration writes,
approval gates, branches agents can never move or delete, and an independent review step in every
workflow that changes code.

Ahead: architectural constraints defined apart from prompts and checked on every change.

## Out of scope

Jensen works with the tools you already use. It is not becoming a hosted IDE, a CI system, a package
registry or a project management tool.
