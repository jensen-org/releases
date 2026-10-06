---
title: Assistant tool reference
description: What Jensen gives a connected assistant, which tools it sees first, how it reaches the rest, and the gate each one sits behind.
---

You never call these. Your assistant does, through the context server, once Jensen is set up. This
page shows what it can do.

Which assistant receives them is set in **Settings, AI, AI assistant**. Two gates apply, and the Gate
column says which:

- **Trust** means the workspace must be trusted, because the call runs a program. See
  [Trust and permissions](/safety/trust-and-permissions/).
- **Permission** means a named integration permission must be on, in **Settings, Extensions,
  Integrations**.

Everything else is ungated.

Where a tool ranks or suggests instead of observing, its answer is a lead, and Jensen labels it that
way.

## How tools are offered

An in-app chat session sees a short list of **core** tools. A terminal assistant sees them all. The
assistant reaches anything not listed through two always available tools:

- `find_tools` describes a need and returns up to five matching tools with their schemas.
- `use_tool` calls one of them by name.

Two more help it read: `guide` opens a rule topic on demand, and `more` continues a long result.

The core tools are `search_knowledge`, `plan_template`, `plan_update`, `record_change`,
`record_decision`, `remember`, `skill_list` and `skill_use`.

Guide topics: learning, navigation, plan-format, committing, worktrees, orchestration, architecture,
issues, merge-requests, pipelines, debugging, tooling, steering, memory, workflow and canvas.

## Recall and knowledge

| Tool | What it does | Gate |
| --- | --- | --- |
| `search_knowledge` | Hybrid search over the map, memory, skills and ingested documentation. | |
| `remember`, `forget` | Store a durable project fact, or remove one that turned out wrong. | |
| `ingest_docs` | Add a documentation source. | |
| `onboarding`, `save_onboarding` | Run the interview that writes the five context documents. | |
| `update_project_context` | Edit one context document. | |
| `steering_refresh_preview`, `steering_apply_refresh` | Propose evidence backed changes, then apply the ones you accept. | |
| `get_project_brief` | The project's context documents. | |

See [Memory and knowledge search](/knowledge/memory-and-search/) and
[Project context](/knowledge/project-context/).

## Navigate the code

| Tool | What it does | Gate |
| --- | --- | --- |
| `list_files` | The tree, without shelling out to `ls` or `find`. | |
| `get_dependencies` | What a node depends on. | |
| `impact_analysis` | What breaks if you change it. | |
| `explain_service` | What a service is and does. | |
| `work_overlap` | Where two sessions touch the same code. | |
| `detect_languages` | The languages the repository uses. | |
| `git_semantic_diff` | A diff described in symbols. | |
| `draft_change_context` | Draft the description of a change. | |
| `screen_changes` | Secrets and junk in a change, before it is a commit. | |

## Architecture

| Tool | What it does | Gate |
| --- | --- | --- |
| `get_architecture` | The confirmed architecture. | |
| `get_architecture_material` | The evidence a proposal would rest on. | |
| `submit_architecture` | Propose one, stored as inferred. | |
| `confirm_architecture` | Promote it into the map. | |

An assistant cannot confirm its own inference. See [Honest by design](/start/honest-by-design/).

## Plans and the flow

| Tool | What it does | Gate |
| --- | --- | --- |
| `plan_template` | The canonical plan skeleton. | |
| `plan_register` | Register a plan Jensen should track. | |
| `plan_update` | Move a plan's status, tick a step or an approval gate. It refuses `approved`, which only you can set, and refuses `done` while a step is open or a verification fails. | |
| `record_change` | Record an edit on the plan and the timeline. Can tick a step. | |
| `record_decision` | Log a departure from an approved plan. Posting it to the issue needs Permission. | Permission |
| `handoff_work` | Hand a finished branch back. `ready` lands it, `integrate` lands workers into a coordinator's branch, `list` and `brief` read state. | |
| `session_message` | Send a durable message to another session on a plan. | |
| `sdd_create`, `sdd_status`, `sdd_advance`, `sdd_approve`, `sdd_trace` | Drive a specification from draft to traced work. | |

See [Plans](/flow/plans/) and [Landing and cleanup](/flow/landing-and-cleanup/). Agents never create,
move or delete worktrees. Jensen provisions every checkout.

## Bugs and quality

| Tool | What it does | Gate |
| --- | --- | --- |
| `list_findings` | What Jensen has noticed about the project. | |
| `localize_bug` | Likely places to look, from a report or failing log. | |
| `get_quality_material` | Structural quality signals. | |
| `get_diagnostics` | Language server diagnostics for a file. | |

See [Findings](/knowledge/findings/).

## Tracker, merge requests and CI

Reading is never gated: `get_issue_context`, `list_work_items`, `list_inbox`, `list_labels`,
`get_merge_request`, `get_pipeline_status`, `get_job_log`.

Every write needs its own permission:

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

It matches **Settings, Extensions, Integrations**, and applies whether you clicked or your assistant
did.

## Run and debug

| Tool | What it does | Gate |
| --- | --- | --- |
| `run` | Run a project's servers or commands. | Trust |
| `debug_session`, `debug_breakpoints`, `debug_inspect`, `debug_evaluate` | Start a debug session, set breakpoints, read the stack and variables, evaluate an expression. An assistant drives the debugger instead of guessing from a stack trace. | Trust |

## Tooling and health

| Tool | What it does | Gate |
| --- | --- | --- |
| `list_tools` | Installed language tools and what the catalog offers. | |
| `install_tool` | Install one from the catalog. | Trust |
| `run_linter` | Lint a file. | Trust |
| `check_health` | The same checks as `jensen doctor`. | |

## Skills and hooks

| Tool | What it does | Gate |
| --- | --- | --- |
| `skill_list`, `skill_read_file` | Find and read a recorded procedure. | |
| `skill_use`, `skill_stage` | Deliver one for use, or stage a new one. | |
| `hook_list`, `hook_register`, `hook_evaluate` | Read, add and test agent hooks. | |

See [Skills](/knowledge/skills/) and [Agent hooks](/automation/agent-hooks/).

## Notes and specialists

| Tool | What it does |
| --- | --- |
| `cards`, `canvas` | Read and write notes cards and canvases. |
| `specialist_update` | A specialist refines its own instructions, brief and scope. |
| `specialist_report` | A specialist reports a run as `completed`, `failed` or `waiting_approval`. |

## Plugins

`validate_plugin_manifest` checks a plugin manifest. `publish_plugin` generates the manifest and
registry entry. See [Plugins and themes](/extending/plugins-and-themes/).

## In a project that was never set up

Only `activate_project` is offered, and any other call answers that the project is inactive. An empty
answer there means the project was never indexed, not that the code is empty.
