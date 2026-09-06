---
title: How Jensen reaches your assistant
description: Jensen supplies the context, not the model. What your assistant gets when it connects, where to see that the connection is live, and what Jensen will not do.
---

Jensen embeds no AI model. It works with the assistant already on your machine, and what it adds is
everything around the model.

Pointed at raw source, an assistant burns effort re-scanning files and then describes an
architecture that was never there. Both failures have the same cause. It has no trustworthy
description of the system, so it improvises one.

## What Jensen supplies

| | |
| --- | --- |
| **The map** | A compact, honest description of the real structure, in place of the whole repository. |
| **Project knowledge** | Confirmed facts, decisions, conventions and prior investigations, so the same ground is not rediscovered every session. |
| **Conventions** | The plan format, the parallel-work rules and the navigation habits, written into the project so every assistant follows them. |
| **Tools** | Ways to ask the map a question instead of grepping the tree. |
| **Rails** | Approvals, permissions, workspace trust and the git guard, enforced by Jensen and not requested of the model. |
| **A record** | A session timeline where every net file change is a reversible point. |

## Where to see that it is connected

**Settings, System, Health** runs every check, explains what each one covers, and offers
**Re-check** and **Copy as Markdown** when you need to paste the result into an issue.

**Settings, AI, AI assistant** shows which assistants Jensen found on this machine and which one is
the default.

During setup, the **Connect** step reports how many of the checks are wired and offers **Fix all**.
The same checks run from the **Project checks** card in the project overview.

:::tip[From the terminal]
```bash frame="none"
jensen setup --status    # what is and is not wired, writes nothing
jensen doctor            # what is working and what is not
```
:::

## What your assistant gets on connect

Setup registers a context server once at user scope with every supported assistant it finds on your
`PATH`, so you approve it a single time and not once per project.

When your assistant connects, three things arrive before it has asked for anything.

1. **Whether Jensen is active here.** In a project that was never set up, the only thing offered is
   a way to activate it. An empty answer there means the project was never indexed, and not that
   the code is empty.
2. **The project's conventions.** How to write a plan, how to work in parallel, how to record what
   changed, and when to ask the map instead of the filesystem.
3. **The tool catalogue.** Everything the assistant can call, with a description of each. See the
   [Assistant tool reference](../../reference/assistant-tools/).

Setup also wires each assistant's own session lifecycle hooks. Those are what let Jensen hold the
plan format, capture recoverable file versions as work proceeds, give feedback on a plan while the
session is still running, and save what the session learned at the end. It installs a
`/jensen-debrief` command for that last step.

## The conventions every assistant follows

- **Plans.** The canonical format is a contract. A plan left open after its work has landed reads to
  you as unfinished. See [Plans and objectives](../../automation/plans-and-objectives/).
- **Navigation.** Recall before guessing, navigate the map instead of re-reading files, and check
  existing findings before starting bug work.
- **Parallel work.** One worktree per task. See
  [Worktrees for parallel work](../../safety/worktrees/).
- **Recording.** Every edit lands on the session timeline, which is what makes it reversible. See
  [Undo and the session trace](../../safety/undo-and-the-session-trace/).

## It does not matter where you start

An assistant you launch in a plain shell gets the same context server, the same tools and the same
conventions as one running inside the app. See
[Working outside the app](../working-outside-the-app/).

## What it will not do

- It will not choose a model for you when several assistants are available. It asks.
- It will not let an assistant confirm its own inference about your architecture. That is your call.
- It will not let an assistant write to your tracker, your merge requests or Slack unless you have
  enabled that specific permission.
- It will not run project commands or toolchains in a workspace you have not trusted.

## Where to go next

- [Choosing an assistant](../choosing-an-assistant/), if you have more than one installed.
- [Assistant tool reference](../../reference/assistant-tools/), for what it can call.
- [Trust and permissions](../../safety/trust-and-permissions/), for the rails.
