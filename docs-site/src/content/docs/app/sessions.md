---
title: Sessions
description: The session rail, starting a session, the session pane and its tabs, and what needs your attention.
---

A session is one piece of work with an assistant. Press `Cmd 1`, or `Alt 1` on Linux and Windows.

Each session works in its own task checkout, so parallel work never collides. See
[Worktrees](/safety/worktrees/).

## The rail

The sidebar lists every session in the project. With none running it reads **Nothing is running yet**.

Each card shows a status: **Needs input**, **Blocked**, **Working**, **Idle** or **Finished**. It also
shows the plan status, the branch, a linked issue such as `issue #12`, plan progress such as `3/8
steps`, and tokens and cost for finished work. Chips flag **checkout left behind** and **outside
Jensen**.

Jensen sorts a session to the top when it needs you: it asked a question, a plan awaits approval, its
process died, or it finished and left a checkout behind. Filter the rail by typing, and press `Esc` to
clear the filter.

The card menu, **Session actions**, offers **Settings**, **Open the plan**, **Inspect the trace**,
**Server logs**, **Open a shell here**, **Remove from the canvas** and **Delete**.

Above the cards sit **Handoffs**, which lists branches handed back by workers, and one card per
specialist. See [Specialists](/automation/specialists/).

## Start a session

Choose **New session** at the foot of the rail, or press `Cmd N`.

- **Runtime** is the coding agent that does the work. Runtimes that are not ready are disabled with a
  reason, such as **Not installed** or **Needs an upgrade**.
- **Tag** labels the session.

Open **Advanced** for more.

| Field | What it does |
| --- | --- |
| **Start from** | **Prompt**, **Issue** or **Plan**. Pick an issue assigned to you or a plan that is waiting. |
| **What this session is for** | The first line names the session and the rest is context. |
| **Model** | Override the runtime's default model. |
| **Work as a specialist** | Create a specialist that owns a scope. |
| **Servers** | Commands to run for this session, each with an optional port. |

Choose **Start**. With no runtime installed, Jensen offers to install one or pick another.

The caret beside **New session** opens **Import agents…** and **Export agents…** for moving agent
definitions between machines.

## The session pane

A session opens as a pane. Tabs appear only when they apply.

| Tab | Shown when | What it holds |
| --- | --- | --- |
| **Chat** | Jensen can drive the runtime | The conversation, tool calls, diffs and permission cards. |
| **Terminal** | Jensen started a terminal for it | The real terminal. |
| **Plan** | The session has a plan | The plan, with the review bar and **Mark done**. |
| **Issues** | It is linked to issues | The issue inspector. |
| **Nodes** | It delegated to subagents | A graph of subagent and tool calls. Click a node for its input and output. |
| **Trace** | A trace exists | Calls, errors and duration. See [Undo and the session trace](/safety/undo-and-the-session-trace/). |
| **Artifacts** | Skills are staged | **Staged skills**, promoted into the project once the session retires. |

The pane menu, **More actions**, has **Settings**, **Open the plan beside this session**, **Inspect the
trace beside this session**, **Open background tasks**, **New chat**, **Open a shell here**, **Delete
this session** and **Close this pane**. Deleting removes the conversation. Its checkout and commits
stay.

### How a runtime connects

A runtime runs one of three ways, and the pane says which.

- **Over the agent protocol.** Jensen drives it and shows the conversation in **Chat**.
- **In a terminal Jensen started.** You see the real terminal.
- **Outside Jensen.** Jensen watches but cannot drive it. There is no **Chat** tab, and the pane offers
  **Bring it forward** and **Inspect the trace**.

### The composer

Type under **Message** and press `Enter`. `Shift Enter` adds a line. `Cmd Option Enter` sends to every
running session.

- Pick a mode: **Plan**, **Ask** or **Auto**. `Shift Tab` cycles them. Plan mode asks your assistant to
  write a [plan](/flow/plans/) before it edits.
- Attach images up to 5 MB and files up to 25 MB by pasting, dragging or giving a path.
- Type `/` for the commands the runtime offers. `/review` uses your reviewer model.
- **Agent options** sets effort and speed where the runtime has them.
- **Stop this turn** halts the agent.

A read only specialist locks the mode.

## What needs you

A banner at the top of a pane tells you what is waiting.

- **Plan approval** shows **Approve**, **Request changes** and **Open plan**. See
  [Approval and task branches](/flow/approval-and-task-branches/).
- **This session finished and left its checkout behind** offers **Land**, **Push**, **Merge** and
  **Delete**. See [Landing and cleanup](/flow/landing-and-cleanup/).
- **This session has its own branch** offers **Land**.
- **This session is over** means its checkout is gone. **Delete** clears it.
- **Waiting on you in its terminal** means the runtime has no protocol adapter, so the prompt is in
  the terminal below.
- A permission request shows the runtime's own options. A count says how many more are waiting.

If a plan has no tracking issue because **Create issues** is off, a notice offers **Open permissions**.

## Specialists

A specialist is a narrower agent that owns a scope and can run on a schedule. See
[Specialists](/automation/specialists/).

## Background tasks

**Background tasks** is a pane in the **Activity** group. It lists long work such as documentation
indexing and workflow runs. Pause, **Cancel**, **Approve requirements**, **Approve execution**,
**Resume** or **Collect** from its detail view. **Clear finished** tidies it. See
[Workflows](/flow/workflows/).

## The terminal

`Cmd Shift J` opens a **Terminal** pane running a login shell in the project root. Open as many as you
like. **Open a shell here** starts one in a session's directory.

## Servers

Per card, the play button starts a session's servers. **Server logs** opens the output. For project
wide services, see [Code](/app/code/#run-your-project).
