---
title: Open a project
description: Open a directory in Jensen, what happens the first time, and the two things Jensen deliberately leaves for you to decide.
---

The space switcher at the top left is where projects live. It offers **Recent Projects**, **Open
New**, **New Sandbox** and **Remove project**. Any directory works.

:::tip[From the terminal]
```bash frame="none"
jensen .
jensen ~/code/acme
```
:::

## What happens the first time

Jensen indexes a project it has not seen before. An overlay on the map reads **Scanning project**,
then **Indexing graph**. On a large repository this can take a while. `jensen setup --no-scan` skips
it if you would rather index later.

## Two things are left to you

Neither of these happens automatically, and both are deliberate.

- **The project is not trusted yet.** A new repository stays restricted until you approve it. You can
  browse and edit a restricted workspace, but it cannot run project commands, local toolchains,
  debug adapters or plan acceptance checks. See
  [Trust and permissions](../../safety/trust-and-permissions/).
- **No assistant is chosen**, unless exactly one is available. Jensen asks instead of picking. See
  [Choosing an assistant](../../assistant/choosing-an-assistant/).

Both are settled in the setup wizard, which is the next page.

## Sandboxes

**New Sandbox** creates a throwaway workspace, for trying something without adding a project you
will have to clean up later. It carries a dismissible notice saying what it is, and closes with
**Close Sandbox**.

## Removing a project

**Remove project** takes it out of the switcher. Stores for projects that no longer exist on disk
are reclaimed separately, and workspaces holding traces, sessions or automation state are never
removed.

:::tip[From the terminal]
```bash frame="none"
jensen gc --dry-run    # show what would be reclaimed
jensen gc              # reclaim it
```
:::

See [Storage and cleanup](../../reference/troubleshooting/#storage-and-cleanup).
