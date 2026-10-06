---
title: Turn Jensen on
description: The setup wizard, what it wires into your machine and project, and how to check or reverse any of it.
---

Installing put the app and the `jensen` command on your machine. Turning Jensen on for a project is a
separate step, and the app walks you through it.

## The guided wizard

Open a project that has not been set up and the wizard starts. Reopen it any time from **Settings,
System, Setup**.

It has nine steps. Five need a decision from you.

| Step | What you decide | Required |
| --- | --- | --- |
| Welcome | Nothing. It explains what Jensen builds for this project. | No |
| Import configuration | Whether to bring VS Code or Kiro configuration across. Your original files stay untouched. | No |
| Connect | Nothing. It reconciles hooks, the context server, the git guard and the index, reports how many are wired, and offers **Fix all**. | Yes |
| Appearance | Theme and interface size. | No |
| AI connection | Which assistant or API Jensen calls. | Yes |
| Git workflow | Which branch serves each environment. This sets your [branch policy](/flow/branch-policy/). | Yes |
| Agent Hooks | Which built-in agent hooks are on. | Yes |
| Project tools | Which language tools this project uses. | Yes |
| Complete | Nothing. It shows where to go next. | No |

Finish the wizard and Jensen counts the project as onboarded, even if you skipped the questions
below.

:::tip[From the terminal]
```bash frame="none"
jensen setup
```
Same steps, no window.
:::

## Onboarding your assistant

The first time an assistant works in a project that is not onboarded, Jensen tells it so. It asks you
questions about the project, in its own words, and saves your answers as five context documents:
Constitution, Product, Architecture, Engineering and Workflow. Every later session starts from them.
See [Project context](/knowledge/project-context/).

## What setup wires

| Step | What it does |
| --- | --- |
| `cli-path` | Links `jensen` onto your `PATH`. |
| `project-activate` | Turns Jensen on for this project. |
| `git-shim` | Installs the git guard. |
| `git-hooks` | Points this project's git hooks at the guard, so it runs on every commit. |
| `mcp` | Registers the context server once, at user scope, with each supported assistant on your `PATH`. |
| `hooks` | Wires each assistant's session lifecycle hooks. |
| `attribution` | Silences the assistant's commit byline. |
| `debrief-command` | Installs `/jensen-debrief`, which saves what a session learned. |
| `guidance` | Writes a short availability note into your agent instruction files. |
| `daemon` | Checks the background service. |
| `project` | Indexes the project so its map and knowledge are ready. |
| `state` | Records what was wired. |

The workflow rules do not live in your repository. Jensen sends them to the assistant when it
connects, and an assistant can read more on demand. Older Jensen blocks in `AGENTS.md`, `CLAUDE.md`
and `GEMINI.md` are removed on setup.

## Setup works out the answers

You do not describe your machine. Setup looks, and each decision stays scoped to the project it ran
in.

- **It finds your assistants.** Claude Code, Codex, Gemini CLI, Antigravity, Hermes and OpenCode are
  supported. Setup registers the context server with each one installed. It never installs one.
- **It wires each assistant its own way.** Session hooks and the debrief command go into that
  assistant's own configuration. Hermes and OpenCode run inside the app only.
- **It reads language tooling from the repository.** See [Code](/app/code/).
- **It reconciles, not overwrites.** Each step probes what exists first. Setup never replaces
  configuration you own or touches hooks and binaries it did not install.
- **Settings stay with the project.** Branch policy, agent hooks, tool overrides and project context
  are per project, so two repositories on one machine can work differently.

## Re-running is safe

Every step checks what exists and leaves it alone.

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

Restart your shell, or source your profile, so the linked command is found.

Codex needs a one-time trust review for user-installed command hooks. Start Codex and use `/hooks` to
review and trust the Jensen entries. Claude Code and Gemini CLI pick up new settings on their next
session.

Next: [Your first session](/start/your-first-session/).

Prefer never to open the app? Everything above still applies. See
[Working outside the app](/assistant/working-outside-the-app/).
