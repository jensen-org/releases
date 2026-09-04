---
title: Plugins and themes
description: What a plugin can contribute, the permissions it must be granted, how to install and scope one, and how themes work.
---

Two ways to extend Jensen. A **plugin** adds behaviour. A **theme** changes how it looks.

## What a plugin can contribute

| Contribution | Where it appears |
| --- | --- |
| **Commands** | The command palette, alongside the built-in ones. |
| **Panels** | The right panel, as their own tab. |
| **Whole views** | The view switcher, alongside Project, Sessions, Work and Code. |
| **Themes** | The theme picker. |
| **Tools for your assistant** | The catalogue your connected assistant sees. |

That last one is worth noticing: a plugin can extend what your AI assistant is able to do in this
project, not just what you can see.

## Plugins have no ambient authority

A plugin runs sandboxed. It cannot reach anything by default, and it reaches what it needs only
through capabilities you grant. Installing one shows a permission sheet, and its own wording is the
rule: *grant only what you trust. The kernel blocks anything not granted here.*

Permissions are declared per plugin and granted individually:

| Permission | What it opens |
| --- | --- |
| Code graph | Read the map. |
| Knowledge | Search and ingest project knowledge. |
| Git | Read history and semantic diffs. |
| Filesystem | Named paths inside the project. **Empty means no access.** |
| Network | Named hosts only, guarded against server-side request forgery. **Empty means no network.** |

Two of those defaults matter more than the rest: a plugin with no filesystem paths listed gets no
filesystem, and one with no hosts listed gets no network. Access is something you add, never
something you take away.

Plugin integrity is checked against a checksum.

## Installing and scoping

**Settings, Plugins** carries **Browse plugins**, **Search plugins**, a filter by category, and each
plugin's README. From there, **Install**, **Remove**, **Enable** and **Disable**.

For a plugin that is not in the public catalog, set a **Private registry URL**. **Refresh plugins**
re-reads whichever registry you are pointed at.

## Publishing

**Publish** in the same panel, or from a terminal:

```bash
jensen publish .
```

It generates the plugin manifest and the registry entry. No forms, no prompts.

## Themes

A theme is a single document with three blocks:

| Block | What it colours |
| --- | --- |
| `ui` | The workbench chrome. |
| `syntax` | The editor. |
| `ansi` | The sixteen terminal slots. |

Jensen derives only state variants and elevation from what you supply. **It never guesses a palette
from a handful of anchor colours**, which is why a Jensen theme looks the way its author intended
rather than approximately like it.

Themes are validated at publish and again at install. Pick one in **Settings, General**, which also
carries **Search themes** and the interface size.
