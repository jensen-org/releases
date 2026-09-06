---
title: Agent hooks
description: Rules that run something when something happens in the project, the built-in catalogue, and how to write your own.
---

An agent hook is a rule: when this happens in the project, do that. The plan-lifecycle hooks are on
by default and keep your tracker in step with your plans. Everything else is opt-in.

Configured in **Settings, Agent Hooks**.

## The built-in catalogue

### Plan lifecycle, enabled by default

| Hook | What it does |
| --- | --- |
| Plan first change | Sets the plan in progress the first time a change lands against it. |
| Plan approved | Opens and links the tracking issue, prepares a worktree, reopens the issue, clears the in-progress label. |
| Plan in progress | Keeps the issue's state in step. |
| Plan blocked | Marks the plan and its issue blocked. |
| Plan decision recorded | Posts an outcome digest to the issue. |
| Plan implemented | Posts the digest, clears the label, closes the issue. |
| Add merge closing links | Links a merge request to the issue it closes. |

### Code quality, opt-in

Format on save · Lint on save · Scan secrets before commit · Review proactive findings · Analyze
change impact · Update tests.

### Delivery integrations, opt-in

Create draft merge request after push · Review merge requests · Fix failed pipelines · Work newly
assigned issues.

**All four start an assistant session.** That is why they are separate, and why they are behind their
own permission.

## Letting a hook start an assistant

A hook that opens a session and edits files is a different proposition from one that sets a label, so
it has its own gate: **Let agent hooks start assistants**, with **Allow** and **Revoke**. Its own
description is the warning: *assistant agent hooks can open a session and edit files in an isolated
worktree.*

Review is required before built-in agent hooks run.

## Writing your own

Custom hooks live at `.jensen/hooks/<id>.yaml`. **New agent hook** creates one, and any of them can
be disabled or deleted.

### Triggers

| Trigger | Fires when |
| --- | --- |
| `file.save`, `file.create`, `file.delete` | A file changes. |
| `git.commit`, `git.push` | You commit or push. |
| `pipeline.failed`, `pipeline.success` | A pipeline finishes. |
| `merge_request.creating`, `merge_request.updated` | A merge request is opened or changed. |
| `issue.assigned` | An issue is assigned. |
| The plan events | A plan changes status or records a decision. |

### Narrowing it

A hook that fires on everything is a hook you will turn off. Scope it by file glob, for example
`**/*.rs`, and leave it blank to match every file. Scope it further by branch, target branch, labels,
authors, and whether a merge request is a draft.

Two more controls keep a noisy trigger sane: a debounce in milliseconds, and a maximum number of
attempts.

## A note on naming

The project conventions written into a repository sometimes call these automations. The app calls
them **Agent Hooks**, and that is the name to look for in Settings.
