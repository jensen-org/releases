---
title: Open a project
description: Open a directory in Jensen, what happens the first time, and the two things Jensen leaves for you to decide.
---

Projects live in the project card at the top of the sidebar. Open the **Projects** list to switch, or
choose **New project** to open another directory. `Cmd O` does the same. Any directory works.

One project is open at a time. Switching closes the previous one.

:::tip[From the terminal]
```bash frame="none"
jensen .
jensen ~/code/acme
```
:::

## What happens the first time

Jensen indexes a project it has not seen. On a large repository this takes a while. Skip it and index
later with `jensen setup --no-scan`.

## Two things are left to you

Jensen does neither on its own.

- **Trust the project.** A new repository stays restricted until you approve it. You can browse and
  edit it, but it cannot run project commands, local toolchains, debug adapters or plan acceptance
  checks. See [Trust and permissions](/safety/trust-and-permissions/).
- **Choose an assistant.** If only one is available, Jensen uses it. Otherwise it asks. See
  [Choosing an assistant](/assistant/choosing-an-assistant/).

Both are settled in the setup wizard on the next page.

## Sandboxes

**Open sandbox** gives you a throwaway workspace for trying something without adding a project to
clean up later. It carries a notice saying what it is. Leave with **Close Sandbox**.

## Removing a project

**Remove** in the **Projects** list takes a project out of the list. Your files are not deleted.
Stores for projects no longer on disk are reclaimed separately, and workspaces holding traces,
sessions or automation state are never removed.

:::tip[From the terminal]
```bash frame="none"
jensen gc --dry-run    # show what would be reclaimed
jensen gc              # reclaim it
```
:::

See [Storage and cleanup](/reference/troubleshooting/#storage-and-cleanup).
