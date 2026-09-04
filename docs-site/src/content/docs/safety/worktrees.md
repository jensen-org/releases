---
title: Worktrees for parallel work
description: One isolated checkout per task, so two agents never collide on a shared index or bundle each other's files into a commit.
---

If two agents, or an agent and you, work the same repository at once, they will collide on the git
index and bundle unrelated files into each other's commits. Jensen's answer is that nobody shares a
working tree.

## The rule

**One worktree per task, never a shared checkout.** That applies to a session you started, to an
agent run, and to work fanned out across several agents.

Worktrees live at `.jensen/worktrees/<name>`, each on a branch also called `<name>`, based on the
integration branch named in your branch policy.

## From the app

The **Worktrees** panel, under Git in the right panel:

| Action | What it does |
| --- | --- |
| **Create** | A task name, and optionally a base ref. |
| **Apply** | Bring the work back. |
| **Push** | Publish the branch for review. |
| **Merge into primary** | Land it locally. |
| **Resume session** | Pick the task back up. |
| **Delete** | Remove it once merged or pushed. |

A worktree kept beyond its session is marked **Long-lived (survives closing its session)**.

## From the command line

```bash
jensen worktree list .
jensen worktree create . <name>
jensen worktree remove . <name>
```

## Dependencies are not reinstalled

Installed dependency directories, `node_modules`, build target directories, virtual environments, are
**symlinked to the primary checkout**. Run the project's checks directly in a worktree. Never
reinstall or rebuild them there, and if something you need is still missing, link it from the primary
checkout rather than installing a second copy.

This is the difference between a worktree being cheap and being a five-minute setup cost nobody pays.

## Handing work back

A worktree is only useful if you can collect it. When a task is done, one of two things happens:

```bash
git -C <repo-root> merge <name>                      # land it locally
git -C .jensen/worktrees/<name> push -u origin <name> # publish it for review
```

Then remove the worktree. **Never remove one holding uncommitted work.**

## In an agent run

Agent runs only ever execute in dedicated worktrees, and a mutating workflow ends by integrating any
child worktrees, pushing, and cleaning up locally. A run whose preflight fails, for a missing
credential or an invalid target, stops **before** a worktree is created, so there is nothing to clean
up.

When a plan drives the task, the branch is recorded in the plan so the next agent picks up where the
last one left off. See [Plans and objectives](../../ai/plans-and-objectives/).
