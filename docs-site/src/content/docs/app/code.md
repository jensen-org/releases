---
title: Code
description: The editor, the problems and output pane, AI actions, the finder, language tooling, servers and the debugger.
---

Code is an editor workbench with the map and your assistant a keystroke away. Press `Cmd 2`, or `Alt 2`
on Linux and Windows.

With no project open it reads **Understand any codebase**, with a **New scratch file** button.

## The workbench

The sidebar holds the file **Explorer**. Beside it are tabs, split views, breadcrumbs and a status bar.
Beyond text it has viewers for diffs, images, tables and markdown preview.

Explorer actions include **New File**, **New Folder**, **Collapse All** and **Select files**.
Selection mode lets you **Ask AI to** review, refactor, document or delete the selected files.

Tabs have **Pin**, **Close Others**, **Close to the Right**, **Reopen Closed Tab** and **Split Right**.

If a file changes on disk under you, a bar offers **Compare**, **Reload**, **Keep mine** and
**Overwrite disk**.

### Merge conflicts

Conflicts open a merge editor with **Current (ours)**, **Incoming (theirs)** and **Result**. Each
conflict has **Accept Current**, **Accept Incoming** and **Accept Both**. Move with **Prev** and
**Next**. When it reads **All conflicts resolved**, choose **Complete merge**.

## Problems and output

Open **Problems and output** from **Open a pane**, in the **Code** group. It has four tabs.

- **Problems** shows diagnostics from the language servers and linters your project resolves to. Scope
  to **Current file** or **Project**, filter by severity, **Copy problems**, or hand one to your
  assistant with **Fix with Agent**. Clean, it says **No problems detected**.
- **Output** shows each run of a tool Jensen started, with **Copy output**, **Wrap output**, **Open
  log**, **Clear output** and **Fix with Agent**.
- **TODO** lists everything marked in the project, with **Rescan**.
- **Debug** carries the debugger.

## AI in the editor

| Surface | What it does |
| --- | --- |
| **Jensen Actions** (`Cmd .`) | A menu of fixes, refactors, navigation and project actions. Includes **Rename Symbol**, **Find Usages**, **Show Recent Changes** and **Ask Agent about this**. |
| **Assistant** section in the editor menu | **Summarize This File**. With a selection, **Ask the Assistant** to explain, refactor, write tests or add docs. |
| **Show in Graph** | Opens the project graph pane. |

Both menus work from the right-click menu on a symbol or selection.

## Find things

Press `Cmd P` for **Go to File**, `Cmd E` for the **Fuzzy Finder**, or `Cmd Shift F` for **Find in
Files**. One box takes files, text or a question in words: *Search files, text, or ask in words*.

- **Files**, by name.
- **Text**, with **Match case**, **Whole word** and **Regular expression**.
- **Semantic**, which searches by meaning over what Jensen has indexed.

**Replace in Files** applies a change across the matches and says how many files it will touch first.

`Ctrl G` goes to a line, and `Cmd T` searches symbols across the project.

## Language tooling

Jensen bundles no language server, formatter, linter or debugger. It uses what your machine has and
installs what you ask for from a public catalog into its own directory.

Selection follows the project, not a fixed order. A tool your repository configures beats a
higher ranked rival. A binary beside the project beats a global one. Both are searched from the edited
file upward, so a package in a monorepo gets its own answer.

Open **Settings, Extensions, LSP**. The **Language tooling** view lists what each language resolves
to, marks the tools your repository chose, names what is declared but not installed, and installs it.
Filter by **Servers**, **Formatters**, **Linters** or **Debuggers**.

To override a choice, use **Edit for this project** or **Edit for every project**. Both edit a single
`tools.yaml` in your Jensen config folder, and project overrides live in their own section of it.
Jensen reads a project's override only once you trust the workspace, because a tool entry decides which
program runs. See [Trust and permissions](/safety/trust-and-permissions/).

## Run your project

**Run** in the file view header detects the services in your repository and starts them. It becomes
**Stop** while they run. Its menu opens the run panel.

The **Run** drawer has:

- **Run all**, **Stop all** and **Re-detect services**.
- A box to run a make target, a script or any command.
- Per service **Open**, **Stop**, **Restart** and **Run**, with live logs and an unseen error marker.
- **Edit servers.yaml** to correct what Jensen detected.

With nothing found it says **No services detected**, with a **Detect services** button. With nothing
running it says **Nothing is running**. Services that answer on a port but did not start from Jensen
show under **Started outside Jensen**, without logs.

Running project commands needs a trusted workspace. See
[Trust and permissions](/safety/trust-and-permissions/).

## Debugging

The toolbar has **Start debugging** (`F5`), **Continue**, **Pause**, **Step over** (`F10`), **Step into**
(`F11`), **Step out** (`Shift F11`) and **Stop** (`Shift F5`). The debug view shows the call stack,
variables and a console you can evaluate in, plus watch expressions.

Debug adapters are found and installed like every other tool, and need a trusted workspace. Your
assistant can drive the same debugger instead of guessing from a stack trace. See
[the assistant tool reference](/reference/assistant-tools/#run-and-debug).

## Vim mode

Use **Enable Vim Mode** in the command palette. The status bar then shows `VIM`.
