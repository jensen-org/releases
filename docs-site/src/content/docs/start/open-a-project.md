---
title: Open a project
description: Open a directory in Jensen from the app or from a terminal, and what happens the first time.
---

Once the `jensen` command is on your `PATH`, you open a project from the terminal the way you would
with any editor.

```bash
jensen .
jensen ~/code/acme
jensen open ~/code/acme    # the same thing with an explicit subcommand
```

Any directory works. Inside the app, the space switcher at the top left offers **Recent Projects**,
**Open New**, **New Sandbox** and **Remove project**.

## What happens the first time

Opening a project it has not seen before, Jensen indexes it. An overlay on the map reads **Scanning
project**, then **Indexing graph**. On a large repository this is the slow part; `jensen setup
--no-scan` skips it if you would rather index later.

Two things are deliberately not automatic:

- **The project is not trusted yet.** A new repository stays restricted until you approve it. You can
  browse and edit a restricted workspace, but it cannot run project commands, local toolchains,
  debug adapters or plan acceptance checks. See
  [Trust, approvals and permissions](../../ai/trust-approvals-and-permissions/).
- **The assistant is not chosen for you** unless exactly one is available. See
  [Choosing an assistant](../../ai/choosing-an-assistant/).

## Sandboxes

**New Sandbox** creates a throwaway workspace, for trying something without adding a project you will
have to clean up later. It carries a dismissible notice saying what it is, and closes with **Close
Sandbox**.

## Removing a project

**Remove project** takes it out of the switcher. Stores for projects that no longer exist on disk are
reclaimed separately:

```bash
jensen gc --dry-run    # show what would be reclaimed
jensen gc              # reclaim it
```

Workspaces holding traces, sessions or automation state are never removed. See
[Troubleshooting](../../reference/troubleshooting/#storage-and-cleanup).
