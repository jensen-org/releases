---
title: Getting around
description: How this documentation names things, the four views, the keyboard map, the right panel and the chrome that is the same wherever you are.
---

Jensen has four views and one panel. Everything else is reachable from the command palette.

## How this documentation names things

A path is written as **view, then surface, then control**. `Right panel > Git > Versioning` means
open the right panel, pick the Git tab, then the Versioning section.

Settings paths always name their group, one of Workspace, AI, Extensions or System, so
**Settings, AI, Knowledge** is unambiguous when two sections share a word.

Anything in the app is reachable three ways: a keyboard shortcut, the command palette, or the click
path above. This documentation gives the shortest of the three.

## The four views

| View | Key | What it is for |
| --- | --- | --- |
| **Project** | `Cmd 1` | The map. Your codebase drawn as a graph you drill through by altitude. |
| **Sessions** | `Cmd 2` | Terminals and agents, each in its own isolated checkout. |
| **Work** | `Cmd 3` | Issues, merge requests and pipelines for the repositories you have connected. |
| **Code** | `Cmd 4` | The editor. Files, tabs, problems, output and the debugger. |

On Linux and Windows the view keys are `Alt 1` to `Alt 4`. Plugins can contribute whole views, which
appear in the same switcher and take `Cmd 5`. See
[Plugins and themes](../../extending/plugins-and-themes/).

Each view has an empty state that says what it needs. With no project open, Project reads **Map your
codebase**, Sessions reads **Run agents in parallel**, Work reads **Track issues and pipelines**, and
Code reads **Understand any codebase**.

## The keyboard map

`Cmd` is `Ctrl` on Linux and Windows, except for the view keys noted above. Everything here is
rebindable in **Settings, Workspace, Keyboard**.

**Moving around the app**

| Command | Key |
| --- | --- |
| Command Palette | `Cmd K` |
| Toggle the right panel | `Cmd J` |
| Toggle Terminal | `Cmd Shift J` |
| Toggle Sidebar | `Cmd B` |
| Settings | `Cmd ,` |
| Open Project | `Cmd O` |
| Zoom in, out, reset | `Cmd =`, `Cmd -`, `Cmd 0` |

**Files and symbols**

| Command | Key |
| --- | --- |
| Go to File | `Cmd P` |
| Fuzzy Finder | `Cmd E` |
| Go to Symbol in File | `Cmd Shift O` |
| Go to Symbol in Project | `Cmd T` |
| Go to Line | `Ctrl G` |
| Find in File | `Cmd F` |
| Find in Files | `Cmd Shift F` |
| Format Document | `Ctrl Shift F` |
| Save, Save All | `Cmd S`, `Cmd Shift S` |
| Close Tab, Reopen Closed Tab | `Cmd W`, `Cmd Shift T` |

**Moving through code**

| Command | Key |
| --- | --- |
| Back, Forward | `Cmd Alt Left`, `Cmd Alt Right` |
| Next, Previous Change | `Alt Down`, `Alt Up` |
| Next, Previous Problem | `F8`, `Shift F8` |
| Next, Previous Function | `Cmd Down`, `Cmd Up` |
| Jensen Actions | `Cmd .` |
| Mark Line, Select to Mark | `Cmd Shift M`, `Cmd Shift A` |

**Debugging**

| Command | Key |
| --- | --- |
| Start or continue | `F5` |
| Stop | `Shift F5` |
| Step over, into, out | `F10`, `F11`, `Shift F11` |

Notifications, Format Selection and Set Up This Project ship unbound, and can be given a key in the
same settings section.

## The command palette

`Cmd K` is the fastest route to anything, and it takes plain language as well as command names. Its
placeholder says what it accepts: *Search files, commands, or ask in words.*

It reaches navigation, maintenance such as **Check Health** and **Manage LSP servers**, direct jumps
into settings, editor toggles such as **Vim Mode** and **Word Wrap**, and per-item entries for the
current file. Plugins contribute their commands into the same list.

## The right panel

`Cmd J` opens a drawer on the right. **Git** and **Trace** are always there, and **Sessions** and
**Terminal** are pinned at the end. The rest appear according to where you are and what you have
selected, and can be closed.

| Tab | What it shows | When |
| --- | --- | --- |
| **Git** | Commits, Versioning and Worktrees, chosen from the caret on the tab itself. | Always |
| **Trace** | The session timeline and the restore points on it. | Always |
| **Overview** | Project status, active work, what is assigned to you, what is ready to merge. | Project view |
| **Findings** | Deterministic detections from the map. | Once an analysis has run |
| **Knowledge** | What the assistant has learned, and its open questions. | With the map's self-learning highlight on |
| **Documentation** | Indexed documentation and its citations. | Once a symbol is engaged |
| **Issue** | The issue inspector. | On selecting an issue |
| **Pipeline** | A pipeline run and its jobs. | On selecting a run |
| **File** | Details for the selected file. | On selecting a file |
| **Notifications** | The last 24 hours. | On opening the bell |

Plugins can add panels of their own.

## The space switcher

Top left. It shows the current project name, or **No project**, and opens **Recent Projects**, **Open
New**, **New Sandbox**, **Remove project** and **Settings**. See
[Open a project](../../start/open-a-project/).

## The project overview

The Overview tab answers "what should I be doing". It carries **Project status**, **Active work**,
**Assigned to you**, **Ready to merge**, how far the branch is ahead or behind, how many files
changed, and a **Jensen suggests** line. From it you can **Start session**, **Open Sessions**,
**Push** or **Refresh overview**. With nothing outstanding it says **You are all caught up**.

Beside it sit **Project checks**, the project's architecture summary with **Review and confirm**, and
**Storage**, broken into code graph, knowledge, traces and other, with **Clean up**.

## Running your project's services

**Run project** in the top bar detects the services in your repository and runs them.

- **Detect services** and **Re-detect services** find what is there.
- **Run all**, **Stop all**, and per-service **Run**, **Stop**, **Restart** and **Open**.
- Live output per service, with **Edit servers.yaml** when you want to correct what was detected.

With nothing found it says **No services detected**, and with nothing running, **No server running**.

Running project commands needs a trusted workspace. See
[Trust and permissions](../../safety/trust-and-permissions/).

## Notifications and background tasks

The bell opens **Notifications**, scoped to the last 24 hours, with per-entry actions, **Clear**, and
**Nothing in the last 24 hours** when it is quiet.

Longer work reports into the **Background Tasks** centre in Sessions: documentation indexing, and the
approval gates that pause an agent run, **Approve requirements** and **Approve execution**. Finished
results are picked up with **Collect** or thrown away with **Discard**.
