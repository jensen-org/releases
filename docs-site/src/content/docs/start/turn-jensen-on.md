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
| `daemon` | Checks the background service. |
| `project` | Indexes the project so its map and knowledge are ready to query. |
| `state` | Records what was wired. |

**The point of all that is that it does not matter where you start.** An assistant you launch in a
plain shell gets the same context server, the same tools and the same conventions as one running
inside the app.

## Setup is per project, and it works out the answers itself

You do not describe your machine to Jensen. Setup goes and looks, and every decision it makes is
scoped to the project it was run in.

- **It finds your assistants.** Whichever assistant command-line tools are installed get the context
  server registered, once at user scope, so you approve it a single time instead of once per project.
  It does not ask you to name them, and it does not install one.
- **It wires each assistant the way that assistant expects.** Session lifecycle hooks, the plan
  format, the debrief command and the commit-byline setting are applied per assistant, in that
  assistant's own configuration.
- **It works out your language tooling from the repository.** A tool your repository configured beats
  a higher-priority rival, and a binary beside the project beats a global one, searched from each
  edited file upward, so a package inside a monorepo gets its own answer rather than the
  repository's.
- **It reconciles rather than overwrites.** Every step probes what is already in place first. Setup
  never replaces configuration you own, and it never touches hooks or binaries it did not install.
- **It leaves the project's own settings in the project.** Branch policy, agent hooks, tool overrides
  and project context are per project, so two repositories on the same machine can work completely
  differently.

## You do not have to use the app

The desktop app is one way to reach Jensen, not the only one. Everything that matters to your
existing setup, the context server, the command line and the git guard, works with the app closed.

Run `jensen setup` once, then keep working exactly as you do now:

```bash
jensen query . "calls:authenticate" --json   # ask the map from a script
jensen gen .                                 # write the map for another tool to read
jensen watch .                               # keep it current as you edit
jensen ingest . ./docs                       # add documentation to the knowledge store
jensen worktree create . fix-login           # isolate a task
jensen doctor --json                         # gate a pipeline on it
```

Your assistant, launched from any terminal, connects to the same context server and gets the same
map, the same project knowledge and the same conventions. Your commits pass the same guard, because
it runs from your project's git hooks rather than from the app. Nothing in that path opens a window.

That is what makes Jensen fit an existing ecosystem instead of replacing it. The map is written as
portable, git-friendly, deterministic files, so a tool that is not Jensen can read them too.

**One thing does need the app.** The background service, which drives workflow runs and polls your
connected integrations, is started by opening the desktop app rather than by the command line. Check
it with `jensen ping`. Everything listed above works without it.

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
