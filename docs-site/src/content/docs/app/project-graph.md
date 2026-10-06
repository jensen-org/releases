---
title: Project graph and overview
description: The graph pane that draws your codebase, the Ask Jensen card, and the overview pane that shows what needs you.
---

Both are panes, not pages. Open them from **Open a pane**, in the **Project** group. On the Sessions
page they open beside your agent by default. See [Getting around](/app/getting-around/).

## The graph

The **Project graph** pane draws your repository as a radial graph of files and their imports.
Everything on it was read from your source. See [Honest by design](/start/honest-by-design/).

With no project open it reads **Map your codebase**. While indexing it reads **Scanning project** or
**Reading the graph**. If reading fails you get **The project graph could not be read** and
**Retry**.

### Move through it

- Click a **file** to open it in the editor.
- Click a **folder** or its label to drill in. A breadcrumb above the canvas tracks where you are, so
  you can climb back out.
- Drag to pan. Scroll to zoom.
- Hover for a card: path, region, file and link counts, and what to do next. Files that git shows as
  changed are highlighted, and files agents touch light up live, with a note such as "is editing".

### The toolbar

A vertical toolbar sits on the right.

| Button | What it does |
| --- | --- |
| **Ask Jensen** | Opens the question card below. |
| **What did you learn** | Highlights where your assistants have saved memories. A note counts them, for example "12 memories across 9 files". |
| **Expand all** and **Collapse all** | Open or fold every folder at once. |
| **Zoom in**, **Zoom out** and **Fit to screen** | Frame the view. |
| **Zen mode** and **Show names** | Clear the chrome, or bring labels back. |

### Ask Jensen

Type a question about your code, for example "Where is the session token refreshed?". Jensen finds a
target in the graph and shows how it got there.

- A route picker, **Auto** by default, lets you force **Locate**, **Impact**, **Callers** or
  **Dependencies**.
- Matches appear as file chips. Click one to open it, or press `Enter` to trace.
- Impact questions show a blast radius: callers, hops, dependents and regions.
- **Ask agent** hands the answer to a new chat session, so you can keep going. `Esc` closes the card.

## The overview

The **Project overview** pane answers "what should I be doing".

- **The header** shows your branch, how many files changed, and whether you are ahead of or behind the
  remote. **Push (N)** appears when you are ahead. **Refresh** reloads it.
- **Active work** lists running external sessions tagged **Needs input**, **Working** or **Idle**,
  worktrees that are **Ready to merge**, and plans to review with **Open Sessions**. With nothing
  waiting it says **You are all caught up**.
- **Assigned to you** lists your issues. Click one to open its inspector.
- **Storage** shows what Jensen stores for the project, with **Clean up** to free space.
- **Architecture** summarizes services and layers, for example "6 services across 3 layers", with
  **Review and confirm** for what an assistant proposed.

## Ask the map from the terminal

Your assistant queries the same map through the context server. You can too.

:::tip[From the terminal]
```bash frame="none"
jensen view . --json                          # the file and import graph
jensen query . "calls:authenticate" --json    # what calls a symbol
jensen gen .                                  # write the full map to disk
jensen watch .                                # keep it current as you edit
```
:::

## The map files

The map is not locked inside the IDE. `jensen gen` writes it as portable files next to your code, which
any assistant can read, as a compact description of the system in place of the whole repository.

- **Git friendly.** The map lives in version control beside the code it describes, so its changes
  show up in review.
- **Deterministic.** The same codebase always produces the same map. Two runs of `jensen gen` over an
  unchanged tree give byte identical files, so a change in the map means a real change in the code.
