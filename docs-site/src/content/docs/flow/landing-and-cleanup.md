---
title: Landing and cleanup
description: How a finished task branch reaches your development branch, when it opens a merge request instead, and how Jensen removes the checkout afterward.
---

When the work is done, the agent hands the branch back and stops. Jensen does the merging, the
pushing and the cleanup. An agent never merges, pushes to a protected branch or deletes a branch or
worktree.

## What the agent does

It commits, then calls `handoff_work` with `ready`. Behind that call, Jensen:

1. **Runs your checks** in the worktree when your branch policy requires them. It uses the `check`
   target in your `Makefile`.
2. **Lands the branch.** Fast-forwards it into your development branch, or opens a merge request when
   that environment requires review.
3. **Removes the checkout and the branch.**

The agent hears either that Jensen landed the branch, or what to fix before it tries again.

## Why a landing is refused

| Reason | What to do |
| --- | --- |
| The environment requires checks and the project has none | Add a `check` target to your `Makefile`. |
| A server is still running from the worktree | Stop it. |
| The checks fail | Fix what the output says, then hand back again. |
| The target needs review | Jensen opens a merge request, no fix needed. |

Jensen lands only into a development branch. Production and staging are reached through merge
requests.

## Land from the app

A finished session shows a notice in its pane.

- **This session finished and left its checkout behind** offers **Land**, **Push**, **Merge** and
  **Delete**.
- **This session has its own branch** offers **Land**.

**Land** asks you to confirm. Following your branch policy, Jensen merges into the integration
branch, or pushes and opens a pull request. You then see **Branch landed** or **Pull request
opened**.

## Cleanup

Jensen removes the worktree and branch after a landing, and when a session retires. Retiring refuses
if the checkout holds unpushed commits or uncommitted changes, so nothing is lost. Source control
also lists leftover branches. See [Source control](/app/source-control/).

## Several agents at once

Give each agent its own approved plan, so each gets its own checkout. A coordinating session can
land its workers' ready branches into its own branch with `handoff_work` and `integrate`, running
checks once per task. Jensen never lands them into a shared branch such as `develop`.

## Close the plan

When the plan's verifications pass, the agent marks it done. Jensen posts the outcome to the issue,
removes the in-progress label and closes the issue. The agent is then asked to save anything a future
session could not recover, with `remember`, and to stage reusable skills. See
[Skills](/knowledge/skills/).

## If you work by hand

Prefer to land it yourself? The task branch is an ordinary git branch.

```bash
git -C <repo-root> merge <branch>
git -C <worktree> push -u origin <branch>
```

Then delete the worktree from **Source control** or with `jensen worktree remove`. The
[git guard](/safety/git-guard/) still checks your commits.
