---
title: Code
description: The editor, its bottom dock, the AI that works inline, the finder, language tooling and the debugger.
---

The Code view is a conventional editor workbench, with the map and the assistant a keystroke away
rather than in a different application.

With no project open it reads **Understand any codebase**.

## The workbench

A file **Explorer** on the left, a tab bar, split and mosaic tiles, breadcrumbs, and a status bar.
Beyond plain text files it has specialised viewers for diffs, images, tables and markdown preview.

Merge conflicts get a dedicated editor with **Current (ours)** and **Incoming (theirs)** side by
side, **Next conflict** and **Previous conflict** to move between them, and **Complete merge** when
you are done.

## The bottom dock

Three tabs.

### Problems

Diagnostics from whatever language servers and linters your project resolves to. Scope it to
**Current file** or the whole **Project**, filter by severity, **Copy problems**, or hand one to the
assistant with **Fix with Agent**. Clean, it says **No problems detected**.

### Output

Per-run output from the tools Jensen ran, with **Rerun**, **Restart**, **Open log**, **Clear
output**, **Copy output**, **Wrap output**, and **Fix with Agent**.

### TODO

Everything marked in the project, with **Rescan**. Empty, it says **Nothing marked in this project**.

## AI in the editor

Four surfaces, all of them optional and none of them modal.

| Surface | What it does |
| --- | --- |
| **Jensen Assist** | An inline prompt on the current selection, *Describe the change*, answered as a diff you **Accept**, **Reject** or **Dismiss**. **Open Agent** escalates it to a full session. |
| **Jensen Actions** | A quick-action menu, *Filter actions, or describe a change*. When no code action matches what you typed, it falls through to **Ask Jensen**. |
| **Explain** | An overlay that reads the code and explains it, with **Show in Graph** to jump to the same symbol on the map. |
| **Symbol popover** | What a symbol is, without leaving the line you are on. |

Navigation carries the same idea: **Go to line** accepts *line* or *line:column*, and **Go to symbol**
searches the project's symbols rather than its text.

## Finding things

The finder takes three kinds of query from one box, *Search files, text, or ask in words*:

- **Text**, with **Match case**, **Whole word** and **Regular expression**.
- **Files**, by name.
- **Semantic**, which searches by meaning rather than by string, over what Jensen has indexed.

**Replace in files** applies a change across the matches, and reports how many files it will touch
before it does.

## Language tools

Jensen never bundles a language server, formatter, linter or debugger. It discovers what the machine
already has, and installs what you ask it to from a public catalog into its own directory.

**Selection follows the project, not a fixed preference order.** A tool your repository configured, by
checking in its own configuration file, beats a higher-priority rival. A binary beside the project
beats a global one. Both are searched from the edited file upward, so a package inside a monorepo
gets its own answer rather than the repository's.

Settings shows what each language actually resolves to, marks the ones the repository chose, names
what is declared but not installed, and installs it. You can override any of it:

| Scope | File |
| --- | --- |
| Every project on this machine | `~/.config/jensen/tools/tools.json` |
| One project | `.jensen/tools.json` |

A project's own manifest is only read once you trust the workspace, because a tool entry decides
which program gets executed. See
[Trust, approvals and permissions](../../ai/trust-approvals-and-permissions/).

## Debugging

The debug toolbar carries **Start debugging**, **Continue**, **Pause**, **Step over**, **Step into**,
**Step out** and **Stop debugging**. The panel shows the **Call stack**, **Variables** and a
**Console** you can evaluate in, plus watch expressions you add and remove.

Debug adapters are discovered and installed the same way as every other tool, and like project
commands they require a trusted workspace.

Your assistant can drive the same debugger rather than guessing from a stack trace. See
[What your assistant can do](../../ai/what-your-assistant-can-do/#debugging).
