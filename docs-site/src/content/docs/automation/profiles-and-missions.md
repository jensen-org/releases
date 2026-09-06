---
title: Agent profiles and missions
description: What an agent is, written down and enforced, and the temporary specialists Mission Control coordinates on a bounded lifetime.
---

A profile decides what an agent is. A mission is a profile with a lifetime, a set of skills and
integrations, and an expiry date.

## Agent profiles

A project defines reusable profiles at `.jensen/agents/*.yaml`. Each one selects:

| Field | What it sets |
| --- | --- |
| `name` | What this profile is called. |
| `assistant` | Which assistant it uses, or none to follow the default. |
| `instructions` | The prompt this profile always carries. |
| `permissions` | `standard`, `read_only`, or `custom`. |
| `allowedTools` | The explicit allowlist for a custom profile. |

Jensen validates the profile and enforces the allowlist itself, and does not trust the assistant to
honour it. That is the reason a profile is worth writing. An instruction is a request, an allowlist
is a rule.

## Missions

A specialized session is one specialist for one piece of work. A mission is the durable version:
a specialist with its own capabilities, its own permissions, and a date it stops.

**Settings, Extensions, Mission Control** describes itself as *coordinate temporary specialists,
bounded schedules, and verified work*.

| Part | What it contributes |
| --- | --- |
| **Profiles** | Which agent, with what instructions and what tool allowlist. |
| **Skills** | The procedures this specialist is allowed to reuse. |
| **Integrations** | Which connected services it may reach. |
| **Permissions** | Which writes it may perform, within what you have already enabled globally. |
| **An expiry** | When it stops. |

The expiry is what makes this safe to leave running. A standing agent with permanent access
accumulates authority nobody reviews. Mission Control marks the ones **Expiring soon** and offers
**Archive expired**.

## Schedules

A schedule runs a mission's task on a recurring basis, in one of two modes.

- **Read only.** It looks, and reports. It changes nothing.
- **Isolated worktree.** It works, in its own checkout, never in yours.

There is no third mode that writes to your working tree.

## The panel

Mission Control lists **Missions**, split into **Active** and **Expiring soon**, then **Schedules**,
**Recent Runs** and **Recent reports**. From it you can **Start session** against a mission,
**Archive expired**, or **Refresh**.

With none configured it says **No Missions yet**, and points at where one comes from: *create one
from an imported agent profile or a shared Kit.*

## What a mission cannot do

A mission does not grant authority you have not already granted. Its permissions are a subset of
what is enabled under [Trust and permissions](../../safety/trust-and-permissions/), and its runs
stop at the same approval gates as any other agent run.

For a one-off specialist that needs no lifetime or schedule, use a specialized session instead. See
[Sessions](../../app/sessions/#specialized-sessions).
