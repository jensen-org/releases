---
title: CLI reference
description: Every jensen command, grouped the way the tool's own help groups them.
---

Installing Jensen puts the `jensen` command on your `PATH` beside the app. Everything here has an
equivalent in the app, except where a page says otherwise.

```bash
jensen                    # the command list
jensen help <command>     # one command's flags and examples
jensen <command> --help   # the same
jensen --version
```

## Start here

### `jensen setup [path]`

Turn Jensen on for this machine and project. Safe to re-run: a step already in place is not applied
again.

| Flag | What it does |
| --- | --- |
| `--status` | Report what is wired. Writes nothing. |
| `--only <step>` | Run one step. Repeatable. |
| `--skip <step>` | Run everything but one step. Repeatable. |
| `--uninstall` | Reverse every step, or the ones `--only` and `--skip` select. |
| `--no-scan` | Skip indexing, the slow part on a large repo. |
| `--json` | Machine readable output. |

Steps, in order: `cli-path`, `project-activate`, `git-shim`, `git-hooks`, `mcp`, `hooks`,
`attribution`, `debrief-command`, `guidance`, `daemon`, `project`, `state`.

See [Turn Jensen on](/start/turn-jensen-on/).

### `jensen open [path]`

Open the app on a directory, the way `code .` does. `jensen <path>` and `jensen .` do the same.

See [Open a project](/start/open-a-project/).

## Explore the codebase

| Command | What it does |
| --- | --- |
| `jensen view <path> --json` | Print the file and import graph. Only `--json` output is supported. |
| `jensen query <path> "<q>" [--json]` | Ask the map a question, for example `jensen query . "calls:authenticate"`. |
| `jensen watch <path> [--json]` | Keep the map current as you edit. |
| `jensen gen <path> [--out <dir>]` | Write the full map to disk. Two runs over an unchanged tree give byte identical files. |
| `jensen review [--json] [--publish <n>] [--dry-run]` | Review the working tree against the code graph. Advisory. `--publish` posts it on a merge request and needs **Comment on merge requests**. `--dry-run` checks the permission and prints. |
| `jensen status [--format <f>] [--for <who>] [--publish]` | Delivery status written from plans, sessions, git, CI and the tracker. `--format` is `markdown` (default), `json`, `slack` or `html`. `--for` is `product` (default) or `engineering`. Needs no app. |

See [Project graph and overview](/app/project-graph/) and [Findings](/knowledge/findings/).

## Knowledge

| Command | What it does |
| --- | --- |
| `jensen ingest <path> <doc>` | Add a documentation source, a file or directory. |
| `jensen knowledge [stats]` | Store statistics. The default. |
| `jensen knowledge refresh` | Re-index. |
| `jensen knowledge compact [--dry-run]` | Reclaim space. |
| `jensen knowledge eval` | Score retrieval quality. |
| `jensen knowledge export` | Take the store elsewhere. |
| `jensen learn record <path>` | Record a skill. Needs `--name` and `--description`. Also takes `--version`, `--tag`, `--body-file` and `--ref <name>=<path>`. |
| `jensen learn list <path> [--filter <q>]` | Browse skills. |
| `jensen learn view <path> <name>` | Read one. |
| `jensen learn search <path> <q>` | Search them. |
| `jensen learn use <path> <name>` | Deliver one for use. |

See [Memory and knowledge search](/knowledge/memory-and-search/) and [Skills](/knowledge/skills/).

## Workflow

| Command | What it does |
| --- | --- |
| `jensen plan list` | Plan ids in this project. |
| `jensen plan open <id>` | Raise Jensen on one plan to read, comment and approve. Takes `--session`, `--root` and `--no-launch`. |
| `jensen worktree list <path>` | The isolated checkouts that exist. |
| `jensen worktree create <path> <name>` | Make one. |
| `jensen worktree remove <path> <name> [--force]` | Remove one. An agent cannot run this. |
| `jensen assistant list [--json]` | Found assistants, and the effective default. |
| `jensen assistant set <name>` | `automatic`, `claude`, `codex`, `gemini`, `hermes` or `antigravity`. |
| `jensen publish [path]` | Generate a plugin manifest and registry entry. No forms, no prompts. |

See [Plans](/flow/plans/), [Worktrees](/safety/worktrees/) and
[Choosing an assistant](/assistant/choosing-an-assistant/).

## Maintenance

| Command | What it does |
| --- | --- |
| `jensen sandbox [status\|setup\|stop]` | Prepare the container sandbox agents run servers in. A project with a Dockerfile or compose file runs inside containerd, never on the host. On macOS it needs one small Linux VM that Jensen owns, made on demand. |
| `jensen gc [-n] [--stale-days <n>] [--unused]` | Reclaim stores for projects that are gone. Defaults to 30 days. `--unused` also takes stores no project on disk can reach. Workspaces holding traces, sessions or automation state are never removed. |
| `jensen clean [-y]` | Remove what earlier versions left on this machine. Reports and stops unless you pass `-y`. |
| `jensen uninstall [-y]` | Remove Jensen's own state, caches, logs and managed tools. Your projects, their `.jensen` folders and saved credentials are never touched. Reports unless you pass `-y`. |
| `jensen context cold [--surface core\|full] [--max-tokens N]` | Measure the tokens Jensen adds to an agent's context before its first word. `--max-tokens` exits non zero above N, so it can gate a pipeline. |
| `jensen context session <id>` | Where one session's tokens went. |
| `jensen doctor [--json] [--markdown]` | What works and what does not. Read only. It exits non zero only when something is broken, so it can gate a pipeline. |
| `jensen ping` | Is the background service running? |

See [Troubleshooting](/reference/troubleshooting/).

## Run by other programs

| Command | What it does |
| --- | --- |
| `jensen bridge <path>` | The context server your assistant connects to. It launches this for you. |
| `jensen guard <program>` | The check the git guard runs before a commit. Your git hooks call it. |

A few more commands exist for Jensen's own use. They are wired by `jensen setup`, are not printed in
the command list, and you never type them.
