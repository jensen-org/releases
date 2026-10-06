---
title: Plugins and themes
description: What a plugin can do, the permissions you grant, how to install and publish one, and how themes work.
---

A **plugin** adds behavior. A **theme** changes how Jensen looks. A theme is delivered by a plugin.

## What a plugin can do

A plugin is a single `main.js` that registers what it needs when it loads. It can add panes, commands,
settings and themes. A plugin can also extend the tools your assistant sees, so it changes what your
assistant can do in the project, not only what you can see.

## Permissions

A plugin has no authority by default. It reaches only what you grant. Enabling one that declares
capabilities shows a sheet titled **{name} wants access**: *Grant only what you trust. The kernel
blocks anything not granted here.* It shows a risk level, low, medium or high.

| Permission | What it opens |
| --- | --- |
| **Read the code graph** | Read the map. |
| **Knowledge base** | Search and ingest project knowledge. |
| **Git history** | Read history and semantic diffs. |
| **Panes and layout** | Add and arrange panes. |
| **Read your code editor**, **Edit your code** | Read or change open files. |
| **Theme** | Switch the active theme and add new ones. |
| **Jensen settings** | Read and write settings. |
| **Project files** | Named paths inside the project. Empty means no access. |
| **Network** | Named hosts only. Empty means no network. |

Two defaults matter most. A plugin listing no paths gets no filesystem, and one listing no hosts gets
no network. You add access, you never take it away. Choose **Enable plugin** to grant, or **Cancel**.

## Install and manage

Open **Settings, Extensions, Plugins**.

- **Enable community plugins** is the master switch. Off, Jensen contacts no registry, blocks new
  downloads and stops every installed plugin.
- **Browse plugins** lists the catalog. Use **Search plugins**, **Filter by category** and
  **Refresh**. Cards read **Unverified** until a plugin is checked, with **Asks for** listing its
  permissions.
- **Install** and **Remove** manage each one.
- **Install from a GitHub release** takes a **Repository** such as `owner/name`, a **Release tag**
  and a **Manifest sha256**, so you can pin an exact build.
- **Private registry URL** points at your own `index.json` over HTTPS. Its plugins show beside the
  public ones and win on a conflicting id.

## Build one

Plugins speak protocol version 1. Build with `jensen-plugin-sdk`, which writes a manifest with
`"apiVersion": 1`. Jensen refuses a plugin that:

- Has no `apiVersion`. It was built for the retired plugin system, so rebuild it.
- Uses `activationEvents`. Every enabled plugin loads at startup.
- Ships WebAssembly or a separate UI entry.
- Declares `contributes`. Register panes, commands, settings and themes at runtime from `main.js`.

A manifest holds `id`, `name`, `version`, `minAppVersion`, `apiVersion`, `description`, `author`,
`entry.main` and `permissions`. Permissions are `graph`, `knowledge`, `git`, `workspace`, `theme`,
`settings`, `editor` (`none`, `read` or `write`), `fs` and `network`. An id uses lowercase letters,
digits, `.` and `-`.

## Publish

**Publish** in the plugins panel walks you through it: **Choose folder…**, then it assembles your
release and shows the **Registry entry** to **Copy**. Create a GitHub release, then open a pull
request on the registry.

:::tip[From the terminal]
```bash frame="none"
jensen publish .
```
It needs a built `main.js`, reads the `jensen` block of your `package.json`, and writes `manifest.json`,
`README.md` and `main.js` to `release/`. No forms, no prompts.
:::

## Themes

A theme is one document with three blocks:

| Block | What it colors |
| --- | --- |
| `ui` | The workbench chrome. |
| `syntax` | The editor. |
| `ansi` | The sixteen terminal slots. |

Jensen derives only state variants and elevation from what you supply. It never guesses a palette
from a few anchor colors, so a theme looks as its author intended.

A theme plugin asks for the **Theme** permission and registers its document at runtime. It can also
list, set and remove themes.

Pick one in **Settings, Workspace, General, Appearance, Theme**. Bundled themes include Catppuccin
(Latte, Frappe, Macchiato, Mocha), Dracula, Gotham, Nord, Rose Pine, Rose Pine Dawn and Tokyo Night.
Plugin themes appear in the same list while the plugin is enabled.
