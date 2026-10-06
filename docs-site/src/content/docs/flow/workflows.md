---
title: Workflows
description: Seven built-in workflows that run a change from intent to a merge request, where they pause for your approval, and how to configure them.
---

A workflow is a fixed path a piece of work takes. Where the [one flow](/start/what-is-jensen/#the-one-flow)
describes a single change, a workflow orchestrates many steps, several agents and the checks around
them. Jensen picks one only when you ask it to do work.

## The seven workflows

| Workflow | Changes code | Targets | What it does |
| --- | --- | --- | --- |
| **feature** | Yes | dev | Confirm the target, discover the graph and requirements, write a plan, wait for approval, implement and document in parallel, then run the tail below. |
| **bugfix** | Yes | dev | Localize the bug, reproduce it and find the root cause, plan the fix, wait for **Approve fix**, fix with regression coverage, then the tail. |
| **hotfix** | Yes | production | Pin the production target, wait for **Approve production change**, make a minimal fix, run **Regression, full, and security gates**, then the tail. |
| **refactor** | Yes | dev | Map dependencies and impact, plan for compatibility, wait for **Approve refactor**, use scoped workers, review behavior, then the tail. |
| **documentation** | Yes | dev | Validate sources, write, wait for **Approve publication**, validate links and examples, then the tail. |
| **research** | No | dev | Create a clean worktree, research the graph and the web in parallel, write a cited synthesis, remove the worktree. |
| **review_audit** | No | dev | Create a clean audit worktree, inspect the diff, graph, tests and security in parallel, write a findings report, clean up. |

### The shared tail

Every workflow that changes code ends the same way:

1. Integrate child worktrees.
2. Run the required checks.
3. An independent review, with up to three attempts.
4. **Screen changes** for secrets and junk.
5. Create the final commit.
6. **Push and verify SHA**.
7. Remove the worktree and branch.
8. **Create or reuse ready merge request**.
9. **Monitor required CI**.

Pushing and creating the merge request are safe to retry. Running them twice does not duplicate the
push or the merge request.

## Approval pauses

A workflow that changes code must have an approval node, and Jensen refuses a definition without one.
The run waits until you approve. Approve from the plan, or from **Background tasks** with **Approve
requirements** and **Approve execution**.

These steps can never be skipped: screening, commit, push, merge request, CI, cleanup, verification
and the approval in a workflow that changes code.

## Start one

You do not start a workflow from a canvas. You ask.

- **Ask your assistant** to do the work. It picks the workflow that fits and says which.
- **Use an AI action** that starts a background task. Refactor, documentation and review audit run
  this way.

Follow the run in **Background tasks**. See [Sessions](/app/sessions/#background-tasks).

## Environments

A workflow targets an environment, `dev` or `production`, and each environment names a remote and a
branch. By default `dev` is `origin/develop` and `production` is `origin/main`. A project can point
both at one branch. Your [branch policy](/flow/branch-policy/) decides what each branch allows.

If a branch name differs only by case, Jensen rejects it and suggests the right spelling.

## Work branch names

A workflow's own branch follows `jensen/{workflow}/{slug}`. Repair attempts stop after two by
default.

## Configure them

Workflows live in `workflows.yaml` in your Jensen config folder, `~/.config/jensen` by default. Top
level keys are your defaults. A `projects` section holds each project's own settings, so two
repositories can run different workflows.

A node can request a model **role** or a model tier instead of a name. See
[Models and providers](/assistant/models-and-providers/).

Node permissions are `read`, `write`, `execute`, `network`, `git_commit`, `git_push`,
`worktree_cleanup` and `merge_request`. A node declares only what it needs.

## Why this shape

Workflows are definitions, not scripts. Jensen validates them before a run: every dependency must
exist, there are no cycles, and the protected steps stay. That is how an unattended run stays safe.
