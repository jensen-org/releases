---
title: CLI reference
description: Every jensen command, grouped the way the tool's own help groups them.
---

The `jensen` command is one entry point for all of it.

```bash
jensen                    # the command list
jensen help <command>     # one command's flags and examples
jensen <command> --help   # the same thing
jensen --version
```

## Start here

### `jensen setup [path]`

Turn Jensen on for this machine and project. Safe to re-run: a step already in place is never applied
again.

| Flag | What it does |
| --- | --- |
| `--status` | Report what is wired. Writes nothing. |
| `--only <step>` | Run one step. Repeatable. |
| `--skip <step>` | Run everything but one step. Repeatable. |
| `--uninstall` | Reverse every step, or just the ones `--only` and `--skip` select. |
| `--no-scan` | Skip indexing, the slow part on a large repo. |
| `--json` | Machine-readable output. |

Steps, in order: `cli-path`, `project-activate`, `git-shim`, `git-hooks`, `mcp`, `hooks`,
`attribution`, `debrief-command`, `guidance`, `daemon`, `project`, `state`.

See [First run](../../start/first-run/).

### `jensen open [path]`

Open the app on a directory, the way `code .` does. `jensen <path>` and `jensen .` are the same
thing without the subcommand.

## Explore the codebase

| Command | What it does |
| --- | --- |
| `jensen view <path> [--json]` | Print the file and import graph. |
| `jensen query <path> "<q>" [--json]` | Ask the map a question, for example `jensen query . "calls:authenticate"`. |
| `jensen watch <path> [--json]` | Keep the map current as you edit. |
| `jensen gen <path> [--out <dir>]` | Write the full map to disk. Deterministic: two runs over an unchanged tree produce byte-identical files. |

See [Project, the map](../../app/project/).

## Knowledge

| Command | What it does |
| --- | --- |
| `jensen ingest <path> <doc>` | Add a documentation source, a file or a directory. |
| `jensen knowledge [stats]` | Store statistics. The default verb. |
| `jensen knowledge refresh` | Re-index. |
| `jensen knowledge compact [--dry-run]` | Reclaim space. |
| `jensen knowledge eval` | Score retrieval quality. |
| `jensen knowledge export` | Take the store elsewhere. |
| `jensen learn record <path>` | Record a skill. Needs `--name` and `--description`; also takes `--version`, `--tag`, `--body-file` and `--ref <name>=<path>`. |
| `jensen learn list <path> [--filter <q>]` | Browse skills. |
| `jensen learn view <path> <name>` | Read one. |
| `jensen learn search <path> <q>` | Search them. |
| `jensen learn use <path> <name>` | Deliver one for use. |

See [Memory and knowledge search](../../knowledge/memory-and-search/) and
[Skills](../../knowledge/skills/).

## Workflow

| Command | What it does |
| --- | --- |
| `jensen worktree list <path>` | The isolated checkouts that exist. |
| `jensen worktree create <path> <name>` | Make one. |
| `jensen worktree remove <path> <name> [--force]` | Remove one. |
| `jensen assistant list [--json]` | Discovered assistants, the evidence, and the effective default. |
| `jensen assistant set <name>` | `automatic`, `claude`, `codex`, `gemini` or `antigravity`. |
| `jensen publish [path]` | Generate a plugin manifest and registry entry. No forms, no prompts. |

See [Worktrees for parallel work](../../safety/worktrees/) and
[Choosing an assistant](../../ai/choosing-an-assistant/).

## Maintenance

| Command | What it does |
| --- | --- |
| `jensen gc [-n] [--stale-days <n>]` | Reclaim stores for projects that are gone. Defaults to 30 days. Workspaces holding traces, sessions or automation state are never removed. |
| `jensen clean [-y]` | Remove what earlier versions left elsewhere on this machine. Reports and stops unless `-y`. Only removes locations Jensen itself declares. |
| `jensen doctor [--json] [--markdown]` | What is working and what is not. Read-only, and it exits non-zero only when something is actually broken, so it can gate a pipeline. |
| `jensen ping` | Is the background service running? |

See [Troubleshooting](../troubleshooting/).

## Run by other programs

| Command | What it does |
| --- | --- |
| `jensen bridge <path>` | The context server your assistant connects to. It launches this for you. |
| `jensen guard <program>` | The check the git guard runs before a commit. Your git hooks call it. |

A few further commands exist for Jensen's own internal use. They are not printed in the command list
and are wired by `jensen setup`; you never need to type them.
