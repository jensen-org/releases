---
title: Troubleshooting
description: What to run when something is not working, what the background service is for, and how to reclaim disk space.
---

## Start here

```bash
jensen doctor
```

It reports what is working and what is not. It is read-only, and it exits non-zero **only when
something is actually broken**, so it can gate a pipeline.

`--json` and `--markdown` give you output you can paste somewhere.

The same checks run inside the app as **Settings, Health**, with advice per check, **Re-check**, and
**Copy as Markdown**. They also appear as **Project checks** in the project overview.

## Is Jensen wired for this project?

```bash
jensen setup --status
```

Reports what is and is not wired, and writes nothing. To fix what is missing, re-run `jensen setup`.
It is safe: every step checks what is already in place and leaves it alone, and it never touches
hooks or binaries it did not install.

Inside the app the **Connect** step of the wizard does the same reconciliation, reports "N of M
wired", and offers **Fix all**.

## Common causes

| Symptom | Likely cause |
| --- | --- |
| The map is empty or stale | The project was never indexed, or was set up with `--no-scan`. Run `jensen setup` again, or `jensen watch .`. |
| An assistant cannot see the project | The context server is not registered for that assistant, or the project was never activated. `jensen setup --status`. |
| Commands, toolchains or the debugger will not run | The workspace is not trusted. **Settings, Security**. |
| A write to your tracker silently does nothing | The matching permission is off. **Settings, Integrations, Permissions**. |
| Semantic search is not ranking well | The embedding model has not been fetched. Lexical search still works offline. **Settings, Knowledge**. |
| Codex is not running Jensen's hooks | It needs a one-time trust review. Start Codex and use `/hooks`. |
| A Linux build will not start | Builds need glibc 2.39 or newer, so they do not run on Ubuntu 22.04. An AppImage may need FUSE 2. |

## The background service

Jensen runs a small background service. From your side it is what keeps the map, the knowledge store
and the proactive findings current, polls your integrations, and runs the workflow engine. It is what
makes the map live rather than something you re-run by hand.

**It is started by opening the desktop app**, deliberately not by the command line.

```bash
jensen ping
```

That asks it for its version and starts nothing. Success prints `daemon ok` with the version; failure
prints `ping failed` and exits non-zero, which means the service is not running, and opening the app
is what fixes it. In a process list it appears as `jensend`.

The Sessions view says so directly when it is down: *The workflow daemon is unavailable. Workflow
controls will be available when it starts.*

It is the one part of Jensen that needs the app. The context server, the map commands, the knowledge
store and the git guard all work without it. See
[You do not have to use the app](../../start/first-run/#you-do-not-have-to-use-the-app).

## Storage and cleanup

The **Storage** panel in the project overview breaks usage into **Code graph**, **Knowledge**,
**Traces** and **Other**, with **Clean up**.

From a terminal:

```bash
jensen gc --dry-run              # what would be reclaimed
jensen gc                        # reclaim stores for projects that no longer exist
jensen gc --stale-days 90        # widen the window; the default is 30 days
jensen clean                     # report what earlier versions left elsewhere
jensen clean -y                  # actually remove it
```

`jensen gc` never removes a workspace holding traces, sessions or automation state. `jensen clean`
reports and stops unless you pass `-y`, and only removes locations Jensen itself declares.

Knowledge has its own compaction:

```bash
jensen knowledge compact --dry-run
jensen knowledge compact
```

## Reversing things

| To remove | Run |
| --- | --- |
| The git guard, and this project's hooks pointing at it | `jensen setup --only git-shim --only git-hooks --uninstall` |
| The `jensen` link on your `PATH` | `jensen setup --only cli-path --uninstall` |
| Everything setup wired | `jensen setup --uninstall` |

## Reporting a problem

Open an issue at
[github.com/jensen-org/releases/issues](https://github.com/jensen-org/releases/issues), with
`jensen doctor --markdown` attached where it is relevant.

For a suspected security vulnerability, do not open a public issue. See
[License and security](../../about/license-and-security/).
