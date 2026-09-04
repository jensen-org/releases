---
title: Agent profiles and workflows
description: Reusable per-project agent profiles, and the deterministic workflow graph an agent run follows before it touches your repository.
---

Two related things. A **profile** decides what an agent is. A **workflow** decides what a run does,
in what order, and where it stops for you.

## Agent profiles

A project can define reusable profiles at `.jensen/agents/*.yaml`. Each one selects:

| Field | What it sets |
| --- | --- |
| `name` | What this profile is called. |
| `assistant` | Which assistant it uses, or none to follow the default. |
| `instructions` | The prompt this profile always carries. |
| `permissions` | `standard`, `read_only`, or `custom`. |
| `allowedTools` | The explicit allowlist for a custom profile. |

**Jensen validates the profile and enforces the allowlist itself, rather than trusting the assistant
to honour it.** That distinction is the reason a profile is worth writing: an instruction is a
request, an allowlist is a rule.

## Workflows

Agent runs follow a local graph in `.jensen/workflows.yaml`, seeded during onboarding from the
built-in policy. The `.jensen` directory stays local and ignored.

### Before anything starts

The Sessions view asks you to confirm a workflow and an environment, and **shows the exact remote
target**. Jensen then fetches and pins that target, and runs agents only in dedicated worktrees.

### Environments

An environment maps a role to a branch: production, staging, development. You configure the mapping
in **Settings, Git**, along with the branch template, the words used for feature and bug branches, a
maximum slug length, a push timeout and the merge rules.

Jensen does not infer an environment you have not declared, and it never uses the current checkout as
a target.

### The seven workflows

| Workflow | Mutating | Ends with |
| --- | --- | --- |
| Feature | Yes | A commit, a push and a ready merge request |
| Bugfix | Yes | The same |
| Hotfix | Yes | The same |
| Refactor | Yes | The same |
| Documentation | Yes | The same |
| Research | No | Cleanup, no commit and no merge request |
| Review or audit | No | Cleanup, no commit and no merge request |

The five mutating workflows require a **human approval gate**, and then run a fixed sequence: confirm
the workflow and pin the target, discovery against the map, a canonical plan, your approval,
implementation, documentation, integrate any child worktrees, the project's required checks, an
independent review, screen the changes for secrets, one commit, a verified push, local cleanup, a
ready merge request against the configured target, and monitoring of required CI.

Plain chat remains a read-only way to ask about the project, with no run attached.

### Recovery

Recovery is checkpoint based. Retrying a node reuses or advances its idempotency key as appropriate,
and completed git or merge-request effects are reconciled rather than repeated, so a retry does not
create a second commit or a second merge request.

Missing credentials or an invalid target stop preflight **before** a worktree is created, so a
misconfigured run costs you nothing to clean up.

## What a run always does

Whatever the workflow, three things hold:

1. It runs in its own worktree, never in your checkout. See
   [Worktrees for parallel work](../../safety/worktrees/).
2. Its changes pass the secret and junk screen before a commit is made. See
   [The git guard](../../safety/git-guard/).
3. Every net file change it makes is a reversible point on the session timeline. See
   [Undo and the session trace](../../safety/undo-and-the-session-trace/).
