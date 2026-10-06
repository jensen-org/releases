---
title: Approval and task branches
description: What happens when you approve a plan, how Jensen cuts a task branch and worktree, and how an agent that skips the plan gets one anyway.
---

Approving a plan is the only way work begins. Jensen owns branches and checkouts, so an agent never
chooses where it works.

## Approve a plan

Use **Approve** in the plan banner or the plan pane footer. If you have comments queued, **Request
changes** sends them back instead.

When you approve, Jensen:

1. **Cuts a task branch** from your base branch.
2. **Creates a worktree** for it and tells the agent both names.
3. **Opens the tracking issue**, links it in the plan and assigns it to you, one per repository the
   plan touches. This needs the **Create issues** permission. See
   [Trust and permissions](/safety/trust-and-permissions/).
4. **Marks the plan Approved.**

The agent then works in that checkout and nowhere else. If Jensen cannot create the checkout, approval
fails and the plan stays a draft.

If several draft plans could match what you approved, Jensen blocks and asks which one you meant.

## The base branch

The task branch starts from your development branch when you have one, otherwise from production. A
project with only `main` branches from `main`. See [Branch policy](/flow/branch-policy/).

## The checkout

The worktree lives in `.jensen/worktrees/<name>` by default. Change it under **Settings, AI, AI
assistant, Worktrees**: **Jensen folder (.jensen/worktrees)** or **Claude folder
(.claude/worktrees)**.

A fresh checkout has no installed dependencies. Agents install and build there before trusting checks.
See [Worktrees](/safety/worktrees/).

## Before the first edit

Jensen nudges the agent once to recall what the project already knows: it searches project knowledge
for the task and checks for a skill that fits. Then it repeats its edit. See
[Memory and knowledge search](/knowledge/memory-and-search/).

## An agent that skips the plan

Say an agent tries to write to a protected branch with no approved plan. Jensen refuses that write,
cuts a task branch and worktree for the session, and tells the agent to repeat the change there. The
change is not lost, and the protected branch is never touched.

## Target an environment

Some work belongs on an environment branch itself, such as a hotfix on development. A plan can set a
`target`, such as `dev`. Jensen then attaches the worktree to that branch and warns that commits and
pushes go straight to it, with no task branch between.

- The grant lasts while that session's plan is approved or in progress.
- A production target is refused. Production is reached through a merge request.

## Next

The agent builds, records each change on the plan, and hands the branch back. See
[Landing and cleanup](/flow/landing-and-cleanup/).
