---
title: Working outside the app
description: Everything Jensen gives your assistant works with the desktop app closed. What you can reach from a terminal, and the one thing that needs a window.
---

This is the one page where the terminal leads, because it is about not opening the app.

The desktop app is one way in. The context server, the command line and the git guard all work with it
closed, so you can keep the setup you have.

## Turn it on once

Run this in the project, then carry on as before.

```bash
jensen setup
```

It registers the context server with every assistant it finds, installs the git guard on the project's
hooks and indexes the code. See [Turn Jensen on](/start/turn-jensen-on/) for each step and how to
reverse it.

## What you can reach from a shell

```bash
jensen query . "calls:authenticate" --json   # ask the map
jensen gen .                                 # write the map for another tool to read
jensen watch .                               # keep it current as you edit
jensen ingest . ./docs                       # add documentation to the knowledge store
jensen plan list                             # see your plans
jensen status --for engineering              # a status report for the project
jensen review                                # review your changes
jensen doctor --json                         # gate a pipeline on it
```

The [CLI reference](/reference/cli/) has the full list.

## Your assistant gets the same thing

An assistant launched in a plain shell connects to the same context server as one inside the app. It
gets the same map, knowledge and rules. Where you start it changes nothing.

Your commits meet the same checks, because the git guard runs from the project's git hooks, not the
app. See [The git guard](/safety/git-guard/).

The map is also written as portable files in the repository, so a tool that is not Jensen can read it.
See [Project graph](/app/project-graph/).

## The one thing that needs the app

The background service drives workflow runs and polls your integrations. Opening the desktop app
starts it. Check it with `jensen ping`. Everything above works without it.

See [The background service](/reference/troubleshooting/#the-background-service).
