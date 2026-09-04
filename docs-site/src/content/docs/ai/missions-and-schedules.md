---
title: Missions and schedules
description: Mission Control coordinates temporary specialists with a bounded lifetime, and schedules run their work on a recurring basis.
---

A specialized session is one specialist for one piece of work. A **mission** is the durable version:
a specialist with its own capabilities, its own permissions, and an expiry date.

Mission Control lives in **Settings, Mission Control**, described there as *coordinate temporary
specialists, bounded schedules, and verified work*.

## What a mission bundles

| Part | What it contributes |
| --- | --- |
| **Profiles** | Which agent, with what instructions and what tool allowlist. |
| **Skills** | The procedures this specialist is allowed to reuse. |
| **Integrations** | Which connected services it may reach. |
| **Permissions** | Which writes it may perform, within what you have already enabled globally. |
| **An expiry** | When it stops. A mission is temporary by design. |

The expiry is the point. A standing agent with permanent access accumulates authority nobody reviews.
A mission has a date on it, and Mission Control marks the ones **Expiring soon** and offers **Archive
expired**.

## Schedules

A schedule runs a mission's task on a recurring basis, in one of two modes:

- **Read only.** It looks, and reports. It changes nothing.
- **Isolated worktree.** It works, in its own checkout, never in yours.

There is no third mode that writes to your working tree.

## The panel

Mission Control lists **Missions**, split into **Active** and **Expiring soon**, then **Schedules**,
**Recent Runs** and **Recent reports**. From it you can **Start session** against a mission, **Archive
expired**, or **Refresh**.

With none configured it says **No Missions yet**, and points at where one comes from: *create one from
an imported agent profile or a shared Kit.*

## How it relates to everything else

A mission does not grant authority you have not already granted. Its permissions are a subset of what
is enabled under [Trust, approvals and permissions](../trust-approvals-and-permissions/), and its
runs still stop at the same approval gates as any other agent run.

For one-off specialists that do not need a lifetime or a schedule, use a specialized session instead.
See [Sessions](../../app/sessions/#specialized-sessions).
