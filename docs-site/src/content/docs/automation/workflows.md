---
title: Workflows
description: The deterministic graph an agent run follows, the environments it targets, the approval gate before it starts, and how a retry recovers.
---

A workflow decides what an agent run does, in what order, and where it stops for you. Runs follow a
local graph in `.jensen/workflows.yaml`, seeded during onboarding from the built-in policy.

## Before anything starts

The Sessions view asks you to confirm a workflow and an environment, and shows the exact remote
target it will push to. Jensen then fetches and pins that target, and runs agents only in dedicated
worktrees.

## Environments

An environment maps a role to a branch: production, staging, development. Configure the mapping in
**Settings, Workspace, Git**, along with the branch template, the words used for feature and bug
branches, a maximum slug length, a push timeout and the merge rules.

Jensen does not infer an environment you have not declared, and it never uses the current checkout as
a target.

## The seven workflows

| Workflow | Mutating | Ends with |
| --- | --- | --- |
| Feature | Yes | A commit, a push and a ready merge request |
| Bugfix | Yes | The same |
| Hotfix | Yes | The same |
| Refactor | Yes | The same |
| Documentation | Yes | The same |
| Research | No | Cleanup, no commit and no merge request |
| Review or audit | No | Cleanup, no commit and no merge request |

The five mutating workflows stop at a human approval gate, then run a fixed sequence. Confirm the
workflow and pin the target, discovery against the map, a canonical plan, your approval,
implementation, documentation, integrate any child worktrees, the project's required checks, an
independent review, screen the changes for secrets, one commit, a verified push, local cleanup, a
ready merge request against the configured target, and monitoring of required CI.

Plain chat stays a read-only way to ask about the project, with no run attached.

## Recovery

Recovery is checkpoint based. Retrying a node reuses or advances its idempotency key as appropriate,
and completed git or merge-request effects are reconciled instead of repeated, so a retry does not
create a second commit or a second merge request.

Missing credentials or an invalid target stop preflight before a worktree is created, so a
misconfigured run costs you nothing to clean up.

## What a run always does

Whatever the workflow, three things hold.

1. It runs in its own worktree, never in your checkout. See
   [Worktrees for parallel work](../../safety/worktrees/).
2. Its changes pass the secret and junk screen before a commit is made. See
   [The git guard](../../safety/git-guard/).
3. Every net file change it makes is a reversible point on the session timeline. See
   [Undo and the session trace](../../safety/undo-and-the-session-trace/).
