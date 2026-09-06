---
title: Assistant tool reference
description: Every capability Jensen gives a connected assistant, grouped by purpose, with the gate each one sits behind.
---

You never call these. Your assistant does, through the context server, once Jensen is set up for the
project. This page exists so you can see exactly what it is able to do.

Which assistant receives them is set in **Settings, AI, AI assistant**. Two gates apply, and the
Gate column below says which:

- **Trust** means the workspace must be trusted, because the call runs a program. Granted in
  **Settings, System, Security**.
- **Permission** means a named integration permission must be enabled in **Settings, Extensions,
  Integrations, Permissions**. Each one is separate.

Everything else is ungated and read-only.

One rule runs through the whole catalogue. Where a tool ranks or suggests rather than observes, its
answer is a lead to investigate and not a verdict, and Jensen labels it that way.

## Recall and knowledge

| Tool | What it answers | Gate |
| --- | --- | --- |
| `search_knowledge` | Hybrid search over the map, memory, skills and ingested documentation. | |
| `remember` | Store a durable project fact. | |
| `forget` | Remove one that turned out wrong. | |
| `ingest_docs` | Add a documentation source to the store. | |
| `get_project_brief` | The project's context documents. | |
| `onboarding`, `save_onboarding` | The seeded interview that writes project context. | |
| `update_project_context` | Edit one context document. | |
| `steering_refresh_preview`, `steering_apply_refresh` | Propose evidence-backed context changes, then apply only the ones you accept. | |

See [Memory and knowledge search](../../knowledge/memory-and-search/) and
[Project context](../../knowledge/project-context/).

## Navigating the code

| Tool | What it answers | Gate |
| --- | --- | --- |
| `list_files` | The tree, without shelling out to `ls` or `find`. | |
| `get_dependencies` | What a node depends on. | |
| `impact_analysis` | What breaks if you change it. | |
| `explain_service` | What a service is and does. | |
| `detect_languages` | Which languages the repository uses. | |
| `rename_symbol` | Rename across the project, using the map rather than text search. | |
| `get_git_history` | History for a path. | |
| `git_semantic_diff` | A diff described in terms of symbols. | |

## Architecture

| Tool | What it answers | Gate |
| --- | --- | --- |
| `get_architecture` | The confirmed architecture. | |
| `get_architecture_material` | The evidence an architecture proposal would rest on. | |
| `submit_architecture` | Propose one, stored as inferred. | |
| `confirm_architecture` | Promote it into the map. | |

An assistant cannot confirm its own inference. See [Honest by design](../../start/honest-by-design/).

## Bugs and quality

| Tool | What it answers | Gate |
| --- | --- | --- |
| `list_findings` | What Jensen has noticed about the project. | |
| `localize_bug` | The likely places to look, from a report or a failing log. | |
| `get_quality_material` | Structural quality signals. | |
| `get_diagnostics` | Language server diagnostics for a file. | |
| `screen_changes` | Secrets and junk in a change, before it becomes a commit. | |

See [Findings and analysis](../../knowledge/findings/).

## Changes and recovery

| Tool | What it answers | Gate |
| --- | --- | --- |
| `record_change` | Record an edit on the session timeline. | |
| `draft_change_context` | Draft the description of a change. | |
| `list_undo_points` | The reversible points on the timeline. | |
| `record_decision` | Log a departure from an approved plan. Publishing it to the issue needs Permission. | Permission |

See [Undo and the session trace](../../safety/undo-and-the-session-trace/).

## Worktrees

| Tool | What it answers | Gate |
| --- | --- | --- |
| `list_worktrees` | Which isolated checkouts exist. | |
| `open_worktree` | Create or reuse one. | |
| `remove_worktree` | Remove one. | |
| `checkout_profiles` | The checkout profiles available. | |

See [Worktrees for parallel work](../../safety/worktrees/).

## Plans and objectives

| Tool | What it answers | Gate |
| --- | --- | --- |
| `plan_template` | The canonical plan skeleton. | |
| `plan_register` | Register a plan Jensen should track. | |
| `plan_update` | Move a plan through its lifecycle. | |
| `objective_create`, `objective_get`, `objective_list`, `objective_update` | Longer work held together across many sessions. | |

See [Plans and objectives](../../automation/plans-and-objectives/).

## Spec-driven development

`sdd_create`, `sdd_analyze`, `sdd_refine`, `sdd_approve`, `sdd_inspect`, `sdd_list`, `sdd_status`,
`sdd_sync`, `sdd_trace`, `sdd_run`, `sdd_repair` and `sdd_cancel` drive a specification from draft to
traced implementation. `speckit_init`, `speckit_feature`, `speckit_run` and `speckit_status` do the
same for a Spec Kit project. None are gated on their own, though the work they start is.

## Your tracker, merge requests and CI

Reading is never gated:

`get_issue_context`, `list_work_items`, `list_inbox`, `list_labels`, `get_merge_request`,
`get_pipeline_status`, `get_job_log`.

Every write is gated individually:

| Tool | Permission it needs |
| --- | --- |
| `create_issue` | Create issues |
| `comment_issue` | Comment on issues |
| `set_issue_labels` | Change issue labels |
| `set_issue_state` | Close or reopen issues |
| `assign_issue` | Assign yourself to issues |
| `set_work_item_schedule` | Schedule work items |
| `create_merge_request` | Create merge requests |
| `review_merge_request` | Approve merge requests |
| `notify_slack` | Send Slack messages |

This is the same list you see in **Settings, Extensions, Integrations, Permissions**, and it applies
whether you clicked the button or your assistant did. See
[Trust and permissions](../../safety/trust-and-permissions/).

## Developer tooling and health

| Tool | What it answers | Gate |
| --- | --- | --- |
| `list_tools`, `search_tools` | Which language tools are installed and what the catalog offers. | |
| `install_tool` | Install one from the catalog. | Trust |
| `run_formatter` | Format a file. | Trust |
| `run_linter` | Lint a file. | Trust |
| `check_health` | The same checks as `jensen doctor`. | |

## Debugging

`debug_session`, `debug_breakpoints`, `debug_inspect` and `debug_evaluate` start and drive a debug
session, set breakpoints, read the stack and variables, and evaluate an expression in the running
program. All need Trust, because they run your program. An assistant can drive the debugger instead
of reasoning from a stack trace.

## Skills and hooks

| Tool | What it answers | Gate |
| --- | --- | --- |
| `skill_search`, `skill_list`, `skill_read_file` | Find and read a recorded procedure. | |
| `skill_use`, `skill_stage` | Deliver one for use. | |
| `skill_execute` | Run a skill's script. | Trust |
| `hook_list`, `hook_register`, `hook_evaluate` | Read, add and test agent hooks. | |

See [Skills](../../knowledge/skills/) and [Agent hooks](../../automation/agent-hooks/).

## Plugins

`validate_plugin_manifest` checks a plugin manifest, and `publish_plugin` generates the manifest and
registry entry. See [Plugins and themes](../../extending/plugins-and-themes/).

## In a project that was never set up

Only `activate_project` is offered, and any other call answers that the project is inactive. An
empty answer there means the project was never indexed, and not that the code is empty.
