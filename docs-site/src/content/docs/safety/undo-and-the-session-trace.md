---
title: Undo and the session trace
description: Every net file change an agent makes is a reversible point on a 30-day timeline, independent of git.
---

The reason you can let an agent work is that you can put it back.

## The trace

Every captured session stays in the **Trace** timeline for **30 days**. Each net file change is a
node on it, and each node is reversible.

Two levels of undo:

| Action | What it restores |
| --- | --- |
| **Restore before this change** | One file, to its state before that one change. |
| **Restore AI changes** | Every file a session touched, to its earliest recorded state. |

Recovery is trace-native. It **does not create git refs**, and it is **unaffected by pushes**. You do
not have to reason about what a reset would do to a branch you have already shared.

A trace can be **pinned** so it survives beyond the window, and a capture that broke offers **Repair
capture**.

With nothing captured it reads **No sessions captured yet**.

## Why it is not git

Git records what you committed. The trace records what happened, including everything that never
became a commit, which is most of what an agent does while it is working. The two answer different
questions and neither replaces the other.

## Local history

Alongside the trace, Jensen keeps per-file saved versions. **Local History**, from the command palette
or the right panel, shows them, and reads **No saved versions yet** for a file with none.

This is the fine-grained one: your own saves, not an agent's session.

## Undo points in git

For history that has already been committed, Jensen surfaces recent movements of `HEAD` as **labelled
undo points** rather than raw commit hashes. An assistant asked to undo something offers a safe mixed
reset to a named point, instead of a hash you have to verify yourself.

The commit graph carries the same idea, with **Reset to here** on a commit.

## Checkpoints in a chat

In the chat flow, longer work carries **Checkpoints** with **Keep**, **Discard** and **Revert step**,
so you can back out one step of a conversation without unwinding the whole session.

## How agent runs use it

Every edit an agent makes is recorded on the timeline as it happens; that recording is what makes it
reversible. Session lifecycle hooks capture recoverable file versions at tool boundaries, so the
granularity does not depend on the agent remembering to save.

Workflow runs add their own layer: recovery is checkpoint based, a retried node reuses or advances
its idempotency key, and completed git or merge-request effects are reconciled rather than repeated.
See [Agent profiles and workflows](../../ai/profiles-and-workflows/#recovery).
