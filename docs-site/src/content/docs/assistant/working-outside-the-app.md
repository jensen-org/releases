---
title: Working outside the app
description: Everything Jensen gives your assistant works with the desktop app closed. What you can reach from a terminal, and the one thing that needs a window.
---

This is the one page where the terminal leads, because this page is about not opening the app.

The desktop app is one way to reach Jensen. The context server, the command line and the git guard
all work with it closed, so you can keep the setup you already have.

## Turn it on once

Run this in the project, and then carry on the way you were working before.

```bash
jensen setup
```

That registers the context server with every assistant it finds, installs the git guard on the
project's hooks, and indexes the code. See [Turn Jensen on](../../start/turn-jensen-on/) for what
each step does and how to reverse any of it.

## What you can reach from a shell

```bash
jensen query . "calls:authenticate" --json   # ask the map
jensen gen .                                 # write the map for another tool to read
jensen watch .                               # keep it current as you edit
jensen ingest . ./docs                       # add documentation to the knowledge store
jensen worktree create . fix-login           # isolate a task
jensen doctor --json                         # gate a pipeline on it
```

The [CLI reference](../../reference/cli/) has the full list.

## Your assistant gets the same thing

An assistant you launch in a plain shell connects to the same context server as one running in the
app. It gets the same map, the same project knowledge and the same conventions. Where you start it
makes no difference to what it knows.

Your commits pass the same checks too, because the git guard runs from the project's git hooks
rather than from the app. See [The git guard](../../safety/git-guard/).

The map itself is written as portable files in the repository, so a tool that is not Jensen can
read them. See [The map files](../../app/project/#the-map-files).

## The one thing that needs the app

The background service drives workflow runs and polls your connected integrations, and it is
started by opening the desktop app. Check whether it is running with `jensen ping`. Everything
above works without it.

See [The background service](../../reference/troubleshooting/#the-background-service).
