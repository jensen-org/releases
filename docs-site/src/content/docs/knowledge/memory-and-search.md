---
title: Memory and knowledge search
description: Durable project memory, offline hybrid search over everything Jensen knows, and how documentation gets in.
---

Project memory stops the same ground being rediscovered every session. Knowledge search is how it
gets found again.

## What a memory is

A durable fact about the project: a curated fact, a preference, a decision or a constraint that any
future session should recall. Memories are shared by every assistant working in the project, and not
scoped to one tool or one conversation.

They are leads. A memory records what was true when it was written, so an assistant is told to
re-verify against the code before acting on one, and to remove it when it turns out wrong.

## Where the store lives

**Settings, AI, Knowledge** holds everything about the store: statistics, the **Embedding model**
status, **Index documentation**, **Compact**, **Refresh**, and the learning records waiting for you.

While the model is being prepared the panel reads **Preparing semantic search**.

:::tip[From the terminal]
```bash frame="none"
jensen knowledge            # statistics
jensen knowledge refresh    # re-index
jensen knowledge compact    # reclaim space; --dry-run to look first
jensen knowledge export     # take it elsewhere
```
:::

## What search covers

One query reaches four sources: the curated memories, the recorded skills, ingested documentation,
and indexed source symbols. Assistants are told to search this before reading files or guessing,
which is where most of the time saving comes from.

## Where you search it

In Code, the finder has a **Semantic** mode that searches meaning instead of text.

On the map, **Documentation** mode carries **Search documentation**. A query returns either an
inline **Answer** or **Ask in session** for something longer, with citation cards that link back to
the source passage through **Open source**. See
[Documentation](../../app/project/#documentation).

## It runs offline

Search is local. It combines a lexical index with a semantic one for ranking.

On first use Jensen tries to fetch a small embedding model to enrich that ranking. On a machine with
no network it falls back to lexical search. Nothing about search depends on a remote service, and
nothing about your code is sent anywhere to make it work.

## Adding documentation

Jensen indexes README files and local documentation folders beside the project and its services on
its own. Nothing is added to your git history.

For a source it would not find by itself, **Index documentation** in **Settings, AI, Knowledge**
takes a file or a directory, markdown or plain text.

:::tip[From the terminal]
```bash frame="none"
jensen ingest . ./docs/runbooks
```
:::

## Reviewing what was learned

Not everything an assistant learns should guide the next one. **Review learning records** lists what
is pending, with **Review with AI** to summarise, then **Approve** for records that should guide
future sessions and **Dismiss** for the ones that should not.

The `/jensen-debrief` command, installed by setup, saves what a session learned at the end of
substantive work. Session hooks close the same loop automatically.
