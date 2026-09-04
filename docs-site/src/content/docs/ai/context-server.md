---
title: The context server
description: The server your assistant connects to for the map, the project's knowledge, and the conventions every assistant in the project follows.
---

The context server is how an assistant reaches Jensen. It is registered for you, it starts when your
assistant starts, and you rarely think about it again.

## How it gets registered

`jensen setup` registers it **once at user scope** with every supported assistant tool it finds on
your `PATH`. You approve it a single time rather than once per project.

The command behind it is:

```bash
jensen bridge <path>
```

Your assistant launches that for you. Running it by hand is only useful when you are wiring an
assistant Jensen does not know about:

```bash
<assistant> mcp add jensen -- jensen bridge .
```

## What it delivers on connect

Three things, before your assistant has asked for anything:

1. **Whether Jensen is active for this project.** In a project that was never set up, the only thing
   offered is a way to activate it. An empty answer there means the project was never indexed, not
   that the code is empty.
2. **The project's conventions.** How to write a plan, how to work in parallel without two agents
   sharing one checkout, how to record what changed, and when to ask the map instead of the
   filesystem.
3. **The tool catalogue.** Everything the assistant can call, with a description of each. See
   [What your assistant can do](../what-your-assistant-can-do/).

## The conventions it carries

These are the same in every project Jensen is active in, which is the point. They cover:

- **Plans.** The canonical format is a contract, not a suggestion, and a plan left below done after
  its work has landed reads to you as still open. See
  [Plans and objectives](../plans-and-objectives/).
- **Navigation.** Recall before guessing, navigate the map instead of re-reading files, and check
  existing findings before starting bug work.
- **Parallel work.** One worktree per task, never a shared checkout. See
  [Worktrees for parallel work](../../safety/worktrees/).
- **Recording.** Every edit is recorded on the session timeline, which is what makes it reversible.

## Session hooks

Alongside the server, setup wires each assistant's own session lifecycle hooks. They are what let
Jensen hold the plan format, capture recoverable file versions at tool boundaries, deliver feedback
on a plan while the session is still running, and close the learning loop at the end of a substantive
session.

It also installs a `/jensen-debrief` command that saves what a session learned into the project's
memory. See [Memory and knowledge search](../../knowledge/memory-and-search/).

## Checking it is wired

```bash
jensen setup --status    # what is and is not wired, writes nothing
jensen doctor            # what is working and what is not
```

`jensen doctor` is read-only and exits non-zero only when something is actually broken, so it can
gate a pipeline. See [Troubleshooting](../../reference/troubleshooting/).
