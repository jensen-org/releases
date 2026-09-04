---
title: Sessions
description: Terminals and agents, each in its own isolated checkout, with the artifacts and approvals a run produces.
---

A session is one piece of work with an assistant, running in its own git worktree so parallel tasks
never collide on a shared index.

Open a project with no sessions and it says **Open a terminal**, with the subtitle *Open a terminal in
its own git worktree, then run claude, codex, or anything else.*

## The tab strip

Sessions run as tabs. Each tab carries its own worktree, and its own context menu:

| Action | What it does |
| --- | --- |
| **Open shell here** | A plain shell in that session's worktree. |
| **Inspect trace** | The session timeline, and the restore points on it. |
| **Tab color** | Default, or a colour you choose. |
| **Discard worktree** | Throw away the isolated checkout. |
| **Close session** | Close the tab. |

A tab badges the plan it is bound to, and a specialist session is marked with a sparkle.

Sessions you start outside the app are adopted rather than ignored. They appear as **External
session**, described as *Ongoing session started out of Jensen*, with **View in terminal**.

## Two ways to run

Which one you get depends on how your AI connection is configured. See
[Models and providers](../../ai/models-and-providers/).

### The assistant flow

The default. A real terminal running your assistant's own command-line tool, with Jensen's context
server, tools and conventions already wired into it. Nothing about your assistant changes; it simply
knows the project.

### The chat flow

Jensen calls a model directly and gives you a chat pane instead of a terminal. It opens on **Work
with your codebase** with three starters, **Explain architecture**, **Find risks** and **Plan a
change**, and a prompt that reads *Ask a question or describe a change.*

Alongside the conversation it carries:

- **Context** chips showing exactly what has been attached.
- **Standing constraints**, the rules that apply for the whole objective rather than one message.
- **Checkpoints**, with **Keep**, **Discard** and **Revert step**.
- **Canvases**, a workspace where a longer piece of work can be laid out and revisited.

## The workflow canvas

When a change needs a full run rather than a conversation, the planner proposes a workflow and it
renders here as a node graph with a run bar and a per-node inspector. Before anything starts it says
what it is going to do, and waits:

> **No workflow yet.** Describe a change in the chat. The planner picks a workflow, proposes it here,
> and waits for you to start it.

See [Agent profiles and workflows](../../ai/profiles-and-workflows/).

## Session artifacts

The panel beside the assistant collects what the session produced: **Artifact views** and **Spec
views**, the bound **Plan and Issue** with the plan's current status, and the actions that move it
forward, **Analyze** and **Approve**.

Where a project's managed setup has drifted, the same panel offers a repair flow: **Preview repair**
shows exactly what would change, and **Apply selected repair** applies only what you tick. When
downstream artifacts fall behind their source it says so and offers **Sync files**.

The session inspector on the right opens one artifact beside the assistant, so you can read a spec
while the work referring to it is still running.

## Specialized sessions

Some work wants a narrower agent than your default. **Create a specialized session** asks for a
**Purpose**, for example *Security reviewer*, and a description such as *Review authentication
changes for risks*. Jensen drafts a specialization summary from that, you review it, then **Prepare
specialist** and **Start session**.

Longer-lived specialists, with their own schedules and expiry, are missions. See
[Missions and schedules](../../ai/missions-and-schedules/).

## Plans in a session

The plan switcher shows which plan the session is bound to, or **No plan open**, with plans grouped
into **Today** and **Earlier**. From it you can **Create issue** for the plan, **Delete plan**, or
**Clean up** finished ones.

See [Plans and objectives](../../ai/plans-and-objectives/).

## Background tasks and approvals

Work that outlives the immediate conversation reports into the **Background Tasks** centre:
documentation indexing, and the gates a mutating run stops at, **Approve requirements** and **Approve
execution**. Results are taken with **Collect** or thrown away with **Discard**.

If the background service is not running, the view says so plainly: *The workflow daemon is
unavailable. Workflow controls will be available when it starts.* See
[Troubleshooting](../../reference/troubleshooting/#the-background-service).
