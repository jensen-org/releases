---
title: Trust and permissions
description: Three separate gates, workspace trust, integration permissions and per-action approval, and what each one actually stops.
---

Jensen has three gates, kept separate on purpose. Each answers a different question, and none of
them is granted from the command line.

## Workspace trust

May this repository run code on my machine?

A new repository stays **restricted** until you approve it. A restricted workspace can be browsed and
edited, but it cannot:

- run project commands,
- run local toolchains,
- run debug adapters,
- run plan acceptance checks,
- have its own tool manifest read, because a tool entry decides which program gets executed.

Review or revoke the decision in **Settings, System, Security**, with **Trust workspace** and
**Revoke trust**.

Trust is one decision, not a set of them. Trusting a workspace to run its development server also
trusts it to run its git hooks on push, and there is no finer split today.

## Integration permissions

May anything here write to my tracker, my merge requests, or Slack?

Reads are never gated. Every outbound write is, individually, under **Settings, Extensions,
Integrations, Permissions**.

| Permission | What it allows |
| --- | --- |
| Create issues | Open issues from plans and triage. |
| Comment on issues | Post comments to the tracker. |
| Change issue labels | Add or remove issue labels. |
| Close or reopen issues | Mark issues done or reopen them. |
| Assign yourself to issues | Take or drop issues and bugs. |
| Change issue fields | Set type, priority and parent. |
| Schedule work items | Set milestone, dates, weight and health. |
| Create merge requests | Open draft merge requests from sessions. |
| Comment on merge requests | Post reviews and notes. |
| Approve merge requests | Approve merge requests and pull requests. |
| Send Slack messages | Post to Slack channels. |

These apply the same whether you clicked the button or your assistant did. An action you have not
enabled names the exact permission that unblocks it instead of failing silently.

## Per-action approval

May this specific thing happen, now?

Even with a permission enabled, an action that reaches outside the project raises an **Allow this
integration action?** approval. Agent runs stop at their own gates too, **Approve requirements** and
**Approve execution**, which surface in the Background Tasks centre.

A separate gate covers agent hooks that open a session and edit files: **Let agent hooks start
assistants**, with **Allow** and **Revoke**. See [Agent hooks](../../automation/agent-hooks/).

## Where enforcement happens

Two of these are rules rather than requests, which is the whole difference.

- A profile's tool allowlist is enforced by Jensen, and not by the assistant asked to respect it.
- An architecture an assistant inferred is stored as inferred and stays out of the map until you
  confirm it. An assistant cannot confirm its own inference on your behalf.

## What is not a gate

Choosing an assistant is not a permission. It decides which model answers, not what it may do. See
[Choosing an assistant](../../assistant/choosing-an-assistant/).
