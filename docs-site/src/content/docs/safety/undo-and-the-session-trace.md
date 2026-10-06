---
title: Undo and the session trace
description: See what an assistant did in a session, and take a change back with the task branch, revert or reset.
---

Two things keep agent work reversible. The task branch keeps it away from your protected branches,
and the trace shows what happened.

## The task branch is the first undo

An agent works on its own branch in its own checkout. Nothing it does touches `main` or `develop`
until Jensen lands it. To drop a whole piece of work, delete the task branch and its worktree and
nothing else changes. See [Worktrees](/safety/worktrees/).

## The session trace

Each session pane has a **Trace** tab once capture has something to show. Open the **Timeline** pane
from **Open a pane** to see a trace beside any session, or choose **Inspect the trace beside this
session** in the pane menu.

The trace lists what an assistant did: tool calls, edits and failures, in order. It captures sessions
from Claude Code, Codex and Gemini CLI, in any terminal.

| You see | What it means |
| --- | --- |
| **Capture is on** | Sessions appear here as your assistant runs. |
| **No sessions captured yet** | Run a coding assistant in this project and its calls will appear. |
| **Capture needs repair** | A hook went missing. Choose **Repair capture**. |
| **Codex capture updated** | Open `/hooks` in Codex and trust Jensen. |
| **Install Claude Code, Codex, or Gemini CLI** | None is installed, so there is nothing to capture. |

The trace is a record, not a switch. To take something back, use git.

## Take a commit back

Open **Commit history** and hover a commit.

- **Revert** adds a commit that undoes the chosen one. History stays intact.
- **Reset to here** moves the branch back to that commit. Later commits stay in your working tree as
  uncommitted changes, and Jensen asks before it moves anything.

See [Source control](/app/source-control/).

## Local history

Run **Local History** from the command palette to see up to 50 saved versions of the current file. Pick
one to open a diff against the file as it is. It is a safety net for reading, so copy back what you
want. Nothing restores for you.

## Plan steps as a ledger

Each step an agent ticks, and each recorded change, is stored against its plan. Read a plan after the
fact to see what was done and what departed from it. See
[Plans](/flow/plans/#when-reality-differs-from-the-plan).
