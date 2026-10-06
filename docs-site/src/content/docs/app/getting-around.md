---
title: Getting around
description: How these docs name things, the three pages, the pane canvas, the keyboard map and the chrome that is the same everywhere.
---

Jensen has three pages. Each is a canvas of panes you arrange yourself. Everything else is reachable
from the command palette.

## How these docs name things

A path reads **page, then surface, then control**. Settings paths name their group, one of Workspace,
AI, Extensions or System, so **Settings, AI, Knowledge** is unambiguous when two sections share a word.

Anything in the app is reachable by a shortcut, the command palette or a click path. These docs give
the shortest.

## The three pages

| Page | Key | What it is for |
| --- | --- | --- |
| **Sessions** | `Cmd 1` | Agents and terminals, plans, approvals, and what needs you. |
| **Code** | `Cmd 2` | The editor: files, tabs, problems, output and the debugger. |
| **Notes** | `Cmd 3` | Canvases for drawing designs and a board for notes and tasks. |

On Linux and Windows the page keys are `Alt 1` to `Alt 3`. `Cmd 5` opens **Settings, Extensions,
Plugins**. See [Plugins and themes](/extending/plugins-and-themes/).

The sidebar changes with the page: the session rail on Sessions, the file explorer on Code, the canvas
rail on Notes. A dot on **Sessions** means something needs you, such as a plan awaiting approval or a
session waiting for input.

## Panes

There is no fixed drawer. Each page is a canvas you split into panes.

- **Open a pane** adds one. Or right-click a pane and use **Open pane** to put it left, above, below
  or right of this one.
- Drag a pane's tab to move it. Drop on the edge to split, in the centre to join, or at the end of a
  tab strip. A ghost and a gap marker show where it lands.
- **Add a tab to this pane** stacks another. **Close this pane** closes it.

Panes you can open from the menu, by group:

| Group | Panes |
| --- | --- |
| **Project** | **Notes board**, **Project graph**, **Project overview** |
| **Git** | **Source control**, **Commit history**, **Worktrees** |
| **Code** | **File view**, **Terminal**, **Problems and output**, **Debug** |
| **Activity** | **Background tasks**, **Notifications** |

Jensen also opens panes for you in context: a session, a specialist, a plan, a **Timeline**, an issue
such as `#123`, a **Pipeline** and a canvas.

When you open a session on a fresh Sessions page, Jensen lays it out on the left, with the graph on
the right and the overview below it. See [Project graph and overview](/app/project-graph/).

## The keyboard map

`Cmd` is `Ctrl` on Linux and Windows, except for the page keys above. Rebind anything in **Settings,
Workspace, Keyboard**.

**Moving around the app**

| Command | Key |
| --- | --- |
| Command Palette | `Cmd K` |
| Toggle Terminal | `Cmd Shift J` |
| Toggle Sidebar | `Cmd B` |
| Settings | `Cmd ,` |
| Open Project | `Cmd O` |
| New session | `Cmd N` |
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

Notifications, Format Selection and Set Up This Project ship unbound. Give them a key in the same
settings section.

## The command palette

`Cmd K` is the fastest way to anything, and it takes plain words as well as command names: *Search
files, commands, or ask in words.*

It reaches navigation, maintenance such as **Check Health**, direct jumps into settings, editor
toggles such as **Enable Vim Mode**, **Local History**, and entries for the current file. Plugins add
their commands to the same list.

## The project card

At the top of the sidebar. It shows your project name and opens **Projects**, **New project**, **Open
sandbox** and **Remove**. It also holds **Search**, which opens the palette, and **Notifications**.
One project is open at a time. See [Open a project](/start/open-a-project/).

## Notifications

The bell opens **Notifications**, scoped to the last 24 hours, with per entry actions, **Clear**, and
**Nothing in the last 24 hours** when quiet. It is also a pane.

## Background work

Longer work reports into **Background tasks**: documentation indexing and workflow runs, including the
approval gates that pause them. See [Sessions](/app/sessions/#background-tasks).

## Run your project

**Run** in the Code toolbar starts the services Jensen detects. See [Code](/app/code/#run-your-project).
Running project commands needs a trusted workspace. See
[Trust and permissions](/safety/trust-and-permissions/).
