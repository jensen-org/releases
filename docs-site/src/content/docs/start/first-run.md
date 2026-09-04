---
title: First run
description: One command turns Jensen on for a project. What jensen setup wires, the guided wizard, and how to check or reverse any of it.
---

Installing Jensen puts the app and the `jensen` command on your machine. Turning it on for a project
is a separate step, and it is one command.

## Turn Jensen on for a project

Open a project, then use **Setup** in Settings, About, or run this in the project from a terminal:

```bash
jensen setup
```

Both run the same steps.

## What that one command wires

| Step | What it does |
| --- | --- |
| `cli-path` | Links `jensen` onto your `PATH` so you can open any project from a terminal. |
| `project-activate` | Turns Jensen on for this project. |
| `git-shim` | Installs the git guard. |
| `git-hooks` | Points this project's git hooks at the guard, so it runs on every commit however it was made. |
| `mcp` | Registers the context server once at user scope with every supported assistant found on your `PATH`. |
| `hooks` | Wires each assistant's own session lifecycle hooks. |
| `attribution` | Silences the assistant's commit byline. |
| `debrief-command` | Installs the `/jensen-debrief` command that saves what a session learned. |
| `guidance` | Writes the shared agent conventions into the project. |
| `daemon` | Prepares the background service. |
| `project` | Indexes the project so its map and knowledge are ready to query. |
| `state` | Records what was wired. |

**The point of all that is that it does not matter where you start.** An assistant you launch in a
plain shell gets the same context server, the same tools and the same conventions as one running
inside the app.

## It is safe to re-run

Every step checks what is already in place and leaves it alone. Setup never overwrites your
configuration, and it never touches hooks or binaries it did not install.

```bash
jensen setup --status          # report what is wired, write nothing
jensen setup --no-scan         # skip indexing, the slow part on a large repo
jensen setup --only git-shim   # run one step
jensen setup --skip mcp        # run everything but one step
jensen setup --uninstall       # reverse every step, or just the ones --only and --skip select
```

## The guided wizard

Inside the app the same work is presented as a nine-step wizard, reachable later from **Settings,
Setup**. Five steps are required and four are optional.

| Step | What you decide | Required |
| --- | --- | --- |
| Welcome | Nothing. It explains what Jensen builds for this project. | No |
| Import configuration | Whether to bring VS Code or Kiro configuration across. Your original files are left untouched. | No |
| Connect | Nothing to decide. It reconciles hooks, the context server, the git guard and the index, reports "N of M wired", and offers **Fix all**. | Yes |
| Appearance | Theme and interface size. | No |
| AI connection | Which assistant or API Jensen calls. | Yes |
| Git workflow | Which branch serves each environment. | Yes |
| Agent hooks | Which built-in agent hooks are on. | Yes |
| Project tools | Which language tools this project uses. | Yes |
| Complete | Nothing. Where to go next. | No |

A separate flow drafts the project's five-document context with AI. The draft stays local and
editable, and nothing is saved until you review it. See
[Project context](../../knowledge/project-context/).

## Finishing up

Restart your shell, or source your profile, so the newly linked command is found.

One assistant needs a one-time trust review for user-installed command hooks: start Codex and use
`/hooks` to review and trust the Jensen entries. Claude Code and Gemini CLI pick up their updated
settings on the next session.

To remove the git guard entirely and unwire this project's hooks from it:

```bash
jensen setup --only git-shim --only git-hooks --uninstall
```
