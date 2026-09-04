---
title: Getting around
description: The four views, the right panel, the command palette and the chrome that is the same wherever you are in Jensen.
---

Jensen has four views and one panel. Everything else is reachable from the command palette.

## The four views

| View | What it is for |
| --- | --- |
| **Project** | The map. Your codebase drawn as a graph you drill through by altitude. |
| **Sessions** | Terminals and agents, each in its own isolated checkout. |
| **Work** | Issues, merge requests and pipelines for the repositories you have connected. |
| **Code** | The editor. Files, tabs, problems, output and the debugger. |

Plugins can contribute whole views of their own, and they appear in the same switcher alongside the
four built-ins. See [Plugins and themes](../../extending/plugins-and-themes/).

Each view has an empty state that says what it needs. With no project open, Project reads **Map your
codebase**, Sessions reads **Run agents in parallel**, Work reads **Track issues and pipelines**, and
Code reads **Understand any codebase**.

## The space switcher

Top left. It shows the current project name, or **No project**, and opens **Recent Projects**, **Open
New**, **New Sandbox**, **Remove project** and **Settings**.

A sandbox is a throwaway workspace, for trying something you do not want to keep. It carries a
dismissible notice explaining that, and closes with **Close Sandbox**.

## The command palette

The palette is the fastest route to anything, and it takes plain language as well as command names.
Its placeholder says what it accepts: *Search files, commands, or ask in words.*

It carries navigation (**Open Overview**, **Open Session**, **Show Problems**, **Commit Graph**,
**Versioning**, **Git: File History**, **Local History**), maintenance (**Check Health**, **Manage
LSP servers**, **Replace in Files**, **Reveal Active File in File Manager**), direct jumps into
settings (**Settings: Integrations**, **Settings: Keyboard Shortcuts**), editor toggles (**Vim
Mode**, **Word Wrap**, **Format on Save**, **Indent Guides**, **Whitespace**, **Inline Problem
Messages**), and per-item entries such as **New Scratch**, **Theme**, **Workspace** and **Summarize**
for the current file. Plugins contribute their commands into the same list.

Every command can be rebound. See [Settings reference](../../reference/settings/#keyboard).

## The right panel

A drawer on the right whose tabs appear according to where you are and what you have selected:

| Tab | What it shows |
| --- | --- |
| **Overview** | Project status, active work, what is assigned to you, what is ready to merge. Project view only. |
| **Git** | Commits, Versioning and Worktrees. |
| **Trace** | The session timeline, and the restore points on it. |
| **Issue** | The issue inspector for a selected issue. |
| **Pipeline** | A pipeline run and its jobs. |
| **File** | Details for the selected file. |
| **Findings** | Deterministic detections from the map. |
| **Knowledge** | What the assistant has learned, and its open questions. |
| **Documentation** | Indexed documentation and its citations. |
| **Notifications** | The last 24 hours. |

**Sessions** and **Terminal** are pinned, and plugins can add panels of their own.

## The project overview

The Overview tab is the answer to "what should I be doing". It carries **Project status**, **Active
work**, **Assigned to you**, **Ready to merge**, how far the branch is ahead or behind, how many
files changed, and a **Jensen suggests** line. From it you can **Start session**, **Open Sessions**,
**Push**, or **Refresh overview**. With nothing outstanding it says **You are all caught up**.

Beside it sit **Project checks**, which run the same health checks as the command line, the project's
architecture summary with **Review and confirm**, and **Storage**, broken into code graph, knowledge,
traces and other, with **Clean up**.

## Running your project's services

The top bar has a **Run project** button. It detects the services in your repository, then runs them.

- **Detect services** and **Re-detect services** find what is there.
- **Run all**, **Stop all**, and per-service **Run**, **Stop**, **Restart** and **Open**.
- Live output per service, with **Edit servers.yaml** when you want to correct what was detected.

With nothing found it says **No services detected**; with nothing running, **No server running**.

Running project commands requires a trusted workspace. See
[Trust, approvals and permissions](../../ai/trust-approvals-and-permissions/).

## Notifications and background tasks

The bell in the top bar opens **Notifications**, scoped to the last 24 hours, with per-entry actions,
**Clear**, and **Nothing in the last 24 hours** when it is quiet.

Longer work reports into the **Background Tasks** centre in Sessions: documentation indexing, and the
approval gates that pause an agent run, **Approve requirements** and **Approve execution**. Finished
results are picked up with **Collect** or thrown away with **Discard**.
