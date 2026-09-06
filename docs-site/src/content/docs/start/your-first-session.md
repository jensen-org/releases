---
title: Your first session
description: One run from end to end. Read the map, ask your assistant a question only the map can answer, approve a plan, undo a change, and meet the git guard.
---

Everything up to here was setup. This page is one piece of work from start to finish, so you meet
the map, a session, a plan, the trace and the git guard as one thing rather than five topics.

It takes about fifteen minutes on a repository you already know.

## Before you start

You need a project that is open, indexed and trusted, with an assistant chosen. If any of that is
missing, [Turn Jensen on](../turn-jensen-on/) covers it.

## Read the map first

Press `Cmd 1` for Project, `Alt 1` on Linux and Windows. The map opens at the top altitude, one
node per service.

Drill into one service and follow an edge to something it calls. Every edge you see was read out of
your source. Nothing on the map was guessed, which is what makes the next step worth doing. See
[Honest by design](../honest-by-design/).

## Start a session

Press `Cmd 2` for Sessions, then **Open a terminal**. Jensen creates a git worktree for the session
and starts your assistant inside it, so this work cannot collide with anything else in the
repository.

The worktree is named after the task and lives in `.jensen/worktrees/`. See
[Worktrees for parallel work](../../safety/worktrees/).

:::tip[From the terminal]
```bash frame="none"
jensen worktree list .
```
:::

## Ask it something only the map can answer

Ask your assistant a question that would normally mean grepping the tree:

> Which services call `authenticate`, and where are the routes it protects?

What good looks like: it answers from the map and cites files, without re-scanning the repository
first. If it starts listing directories instead, the context server is not connected. Check
**Settings, System, Health**.

## Ask for a change

Now ask for something small and real, a rename or a guard clause. Your assistant writes a plan to
`.jensen/plans/` before it edits anything, and the plan opens in its own inspector.

Read it, then **Approve**. Approving opens the tracking issue, links it in the plan, and assigns it
to you. See [Plans and objectives](../../automation/plans-and-objectives/).

## Watch the work land

Press `Cmd J` to open the right panel and pick **Trace**. Each net file change your assistant makes
becomes a point on the timeline, and it stays there for 30 days.

## Put one change back

Pick a change on the trace and use **Restore before this change**. The file returns to its earlier
state. This is not git, so nothing was committed, no refs were created, and a later push cannot
undo it. See [Undo and the session trace](../../safety/undo-and-the-session-trace/).

## Meet the guard

Put a fake credential in a file, stage it, and commit. The commit is refused, from the terminal and
from the app alike, because the guard runs from the project's own git hooks.

Open the right panel on **Git**, then **Versioning**. The commit box reads `Commit blocked` and
lists a row per finding. If a match is a false positive, a test fixture or a documented example
key, **Accept** clears that one finding for future commits and leaves every other rule in force.

Delete the fake credential and commit again. See [The git guard](../../safety/git-guard/).

## Where to go next

- To understand a codebase, read [Project, the map](../../app/project/) and
  [Memory and knowledge search](../../knowledge/memory-and-search/).
- To hand more work to an agent, read [Workflows](../../automation/workflows/) and
  [Agent hooks](../../automation/agent-hooks/).
- To decide what an agent is allowed to do, read
  [Trust and permissions](../../safety/trust-and-permissions/).
