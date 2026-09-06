---
title: Undo and the session trace
description: Every net file change an agent makes is a reversible point on a 30-day timeline, independent of git.
---

You can let an agent work because you can put it back.

There is no command for any of this. The trace lives in the app.

## The trace

Open the right panel with `Cmd J` and pick **Trace**. Every captured session stays there for 30
days. Each net file change is a node on the timeline, and each node is reversible.

| Action | What it restores |
| --- | --- |
| **Restore before this change** | One file, to its state before that one change. |
| **Restore AI changes** | Every file a session touched, to its earliest recorded state. |

Recovery is trace-native. It creates no git refs and is unaffected by pushes, so you never have to
reason about what a reset would do to a branch you have already shared.

A trace can be **pinned** so it survives beyond the window, and a capture that broke offers **Repair
capture**.

With nothing captured it reads **No sessions captured yet**.

## How this differs from git

Git records what you committed. The trace records what happened, including everything that never
became a commit, which is most of what an agent does while it is working. The two answer different
questions, and neither replaces the other.

## Local history

Jensen also keeps per-file saved versions. **Local History**, from the command palette (`Cmd K`) or
the right panel, shows them, and reads **No saved versions yet** for a file with none.

This is the fine-grained one, covering your own saves rather than an agent's session.

## Undo points in git

For history that has already been committed, Jensen surfaces recent movements of `HEAD` as labelled
undo points instead of raw commit hashes. An assistant asked to undo something offers a safe mixed
reset to a named point, and not a hash you have to verify yourself.

The commit graph carries the same idea, with **Reset to here** on a commit.

## Checkpoints in a chat

In the chat flow, longer work carries **Checkpoints** with **Keep**, **Discard** and **Revert step**,
so you can back out one step of a conversation without unwinding the whole session.

## How agent runs use it

Every edit an agent makes is recorded on the timeline as it happens, and that recording is what
makes it reversible. Session lifecycle hooks capture recoverable file versions as work proceeds, so
the granularity does not depend on the agent remembering to save.

Workflow runs add a layer of their own. See [Recovery](../../automation/workflows/#recovery).
