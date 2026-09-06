---
title: Turn Jensen on
description: The setup wizard, what it wires into your machine and your project, and how to check or reverse any of it.
---

Installing Jensen put the app and the `jensen` command on your machine. Turning it on for a project
is a separate step, and the app walks you through it.

## The guided wizard

Open a project that has not been set up and the wizard starts on its own. You can reach it again
later from **Settings, System, Setup**.

Nine steps. Five need a decision from you.

| Step | What you decide | Required |
| --- | --- | --- |
| Welcome | Nothing. It explains what Jensen builds for this project. | No |
| Import configuration | Whether to bring VS Code or Kiro configuration across. Your original files are left untouched. | No |
| Connect | Nothing. It reconciles hooks, the context server, the git guard and the index, reports how many are wired, and offers **Fix all**. | Yes |
| Appearance | Theme and interface size. | No |
| AI connection | Which assistant or API Jensen calls. | Yes |
| Git workflow | Which branch serves each environment. | Yes |
| Agent hooks | Which built-in agent hooks are on. | Yes |
| Project tools | Which language tools this project uses. | Yes |
| Complete | Nothing. Where to go next. | No |

A separate flow drafts the project's five context documents with AI. The draft stays local and
editable, and nothing is saved until you review it. See
[Project context](../../knowledge/project-context/).

:::tip[From the terminal]
```bash frame="none"
jensen setup
```
Same steps, no window.
:::

## What that wires

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

## It works out the answers itself

You do not describe your machine to Jensen. Setup goes and looks, and every decision it makes is
scoped to the project it ran in.

- **It finds your assistants.** Whichever assistant command-line tools are installed get the context
  server registered, once at user scope, so you approve it a single time. It does not ask you to
  name them, and it does not install one.
- **It wires each assistant the way that assistant expects.** Session hooks, the plan format, the
  debrief command and the commit-byline setting are applied in that assistant's own configuration.
- **It works out your language tooling from the repository.** See
  [Language tools](../../app/code/#language-tools).
- **It reconciles instead of overwriting.** Every step probes what is already in place first. Setup
  never replaces configuration you own, and never touches hooks or binaries it did not install.
- **It leaves the project's settings in the project.** Branch policy, agent hooks, tool overrides and
  project context are per project, so two repositories on the same machine can work completely
  differently.

## Re-running it is safe

Every step checks what is already in place and leaves it alone.

:::tip[From the terminal]
```bash frame="none"
jensen setup --status          # report what is wired, write nothing
jensen setup --no-scan         # skip indexing, the slow part on a large repo
jensen setup --only git-shim   # run one step
jensen setup --skip mcp        # run everything but one step
jensen setup --uninstall       # reverse every step, or the ones --only and --skip select
```
:::

## Finishing up

Restart your shell, or source your profile, so the newly linked command is found.

One assistant needs a one-time trust review for user-installed command hooks. Start Codex and use
`/hooks` to review and trust the Jensen entries. Claude Code and Gemini CLI pick up their updated
settings on the next session.

You are ready for [Your first session](../your-first-session/).

If you would rather never open the app, everything above still applies. See
[Working outside the app](../../assistant/working-outside-the-app/).
