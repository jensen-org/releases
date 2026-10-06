---
title: Worktrees
description: One isolated checkout per task, created and removed by Jensen, so no two writers share an index.
---

Two agents, or an agent and you, working one repository at the same time collide on the git index and
bundle unrelated files into each other's commits. Jensen's answer: nobody shares a working tree.

## The rule

One worktree per task. Jensen creates it when you approve a plan, or when an agent writes to a
protected branch without one. See [Approval and task branches](/flow/approval-and-task-branches/).

Agents never create worktrees themselves. If an assistant or subagent asks its runtime for one, Jensen
refuses and provisions the checkout instead.

The task branch starts from your development branch. By default the worktree is at
`.jensen/worktrees/<name>`.

## Choose where they go

Open **Settings, AI, AI assistant, Worktrees** and pick:

- **Jensen folder (.jensen/worktrees)**, the default.
- **Claude folder (.claude/worktrees)**.

## What is in a fresh checkout

Source, and nothing else. Dependency directories such as `node_modules`, `target` and virtual
environments are not copied, so install and build in the worktree before trusting its checks. Jensen
tells the agent this when it approves a plan.

## The Worktrees pane

Open **Worktrees** from **Open a pane**, in the **Git** group.

- **New** asks for a **Task name (branch)** and a **Base ref**, then **Create**. Starting a session
  does this for you, so you rarely need it.
- **Push** publishes the branch for review.
- **Delete** removes a worktree you are finished with. Check it holds no uncommitted work first.

:::tip[From the terminal]
```bash frame="none"
jensen worktree list .
jensen worktree create . fix-login
jensen worktree remove . fix-login
```
:::

Agents cannot run `jensen worktree remove`. Jensen removes their checkouts itself.

## Landing and cleanup

When an agent finishes, Jensen lands the branch and removes the checkout. See
[Landing and cleanup](/flow/landing-and-cleanup/). A session that retires with unpushed commits or
uncommitted changes keeps its worktree until you decide what to do.

## Parallel work

Give each writer its own approved plan, and each gets its own checkout. Sessions can edit the same
files at once. Their changes meet when Jensen integrates them. A coordinating session can land its
workers' branches into its own branch. See [Landing and cleanup](/flow/landing-and-cleanup/).
