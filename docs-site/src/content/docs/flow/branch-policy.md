---
title: Branch policy
description: Environments, the rules attached to each branch, and what agents can never do to them.
---

Your branch policy says which branches are protected, how work reaches them, and what must pass
first. Jensen enforces it for agents, and the [git guard](/safety/git-guard/) backs it up.

## Environments

Each environment names a branch and plays one role.

| Environment | Role | Default branch |
| --- | --- | --- |
| **Production** | What ships. | `main` |
| **Staging** | Where it is tried first. | Not set |
| **Development** | Where finished work lands. | `develop`, if it exists |

With no `develop` branch, development falls back to production, so a project with only `main` still
works. Task branches are separate: they carry one plan each.

## Rules

Each environment carries rule chips.

| Rule | Meaning |
| --- | --- |
| **Allow direct commit** | You can commit to the branch itself. |
| **Allow direct push** | You can push to it. |
| **Pipeline green** | Checks must pass before work lands. |
| **Review approved** | A merge request needs review. |
| **Tests required** | The project must declare checks. |

Without the first two, a branch reads **No direct commit** and **No direct push**.

Defaults:

- **Production** and **Staging**: pipeline green and review approved.
- **Development**: pipeline green, tests required, direct push allowed.
- **Task branches**: commits and pushes allowed.

## Edit the policy

Open **Settings, Workspace, Git**. **Workflow rules** has an accordion for **Production**,
**Staging**, **Development** and **Task branches**. Set a **Branch name**, add or remove rules, then
**Save**. The setup wizard asks for the same branches in its Git workflow step.

Task branch names follow **Branch template**, `{type}/{number}-{slug}` by default, with **Feature
word**, **Bug word** and **Max slug length** beside it.

## What agents cannot do

- Edit, commit or push on a branch bound to an environment.
- Move or delete an environment branch, or any other branch.
- Merge into an environment branch themselves. Jensen lands finished work for them.
- Remove a worktree.

Jensen refuses each one with a message saying what to do instead. See
[The git guard](/safety/git-guard/).

## Branches Jensen never offers to delete

Cleanup in [Source control](/app/source-control/) skips `main`, `master`, `develop`, `trunk`,
`production`, `prod`, `stable`, any `release/*`, your base branch, the remote's default branch, the
branch you are on, and any branch checked out in a worktree.
