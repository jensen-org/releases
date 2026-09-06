---
title: Worktrees for parallel work
description: One isolated checkout per task, so two agents never collide on a shared index or bundle each other's files into a commit.
---

If two agents, or an agent and you, work the same repository at once, they collide on the git index
and bundle unrelated files into each other's commits. Jensen's answer is that nobody shares a
working tree.

## The rule

One worktree per task. That applies to a session you started, to an agent run, and to work fanned
out across several agents.

Worktrees live at `.jensen/worktrees/<name>`, each on a branch also called `<name>`, based on the
integration branch from **Settings, Workspace, Git**.

## Create one

Open the right panel with `Cmd J`, pick **Git**, then **Worktrees**, then **Create**. It asks for a
task name and optionally a base ref. Starting a session creates one for you, so most of the time you
never open this panel at all.

:::tip[From the terminal]
```bash frame="none"
jensen worktree list .
jensen worktree create . fix-login
```
:::

## Work in it

**Resume session** picks the task back up where you left it. A worktree kept beyond its session is
marked **Long-lived (survives closing its session)**.

Dependency directories, `node_modules`, build target directories and virtual environments, are
symlinked to the primary checkout, so run the project's checks directly. Never reinstall or rebuild
them in a worktree. If something you need is still missing, link it from the primary checkout
instead of installing a second copy. Reinstalling is what turns a worktree from free into a
five-minute cost nobody pays.

## Hand it back

A worktree is only useful if you can collect it. **Merge into primary** lands the work locally,
**Push** publishes the branch for review.

:::tip[From the terminal]
```bash frame="none"
git -C <repo-root> merge <name>                        # land it locally
git -C .jensen/worktrees/<name> push -u origin <name>  # publish it for review
```
:::

## Remove it

**Delete**, once the branch is merged or pushed. Never remove one holding uncommitted work.

:::tip[From the terminal]
```bash frame="none"
jensen worktree remove . fix-login
```
:::

## In an agent run

Agent runs only ever execute in dedicated worktrees, and a mutating workflow ends by integrating any
child worktrees, pushing, and cleaning up locally. A run whose preflight fails, for a missing
credential or an invalid target, stops before a worktree is created, so there is nothing to clean
up.

When a plan drives the task, the branch is recorded in the plan so the next agent picks up where the
last one left off. See [Plans and objectives](../../automation/plans-and-objectives/).
