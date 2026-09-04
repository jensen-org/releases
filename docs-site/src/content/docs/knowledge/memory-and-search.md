---
title: Memory and knowledge search
description: Durable project memory, offline hybrid search over everything Jensen knows, and how documentation gets in.
---

Project memory is what stops the same ground being rediscovered every session. Knowledge search is
how it gets found again.

## Project memory

A memory is a durable fact about the project: a curated fact, a preference, a decision, or a
constraint that any future session should recall. Memories are shared by every assistant working in
the project, not scoped to one tool or one conversation.

They are leads rather than gospel. A memory records what was true when it was written, so an
assistant is told to re-verify against the code before acting on one, and to remove it when it turns
out to be wrong.

The `/jensen-debrief` command, installed by setup, saves what a session learned at the end of
substantive work. Session hooks close the same loop automatically.

## What search covers

One query, four sources:

- **Confirmed facts**, the curated memories above.
- **Evidence-backed procedures**, the skills. See [Skills](../skills/).
- **Ingested documentation**.
- **Indexed source symbols**.

Assistants are told to search this before reading files or guessing, which is most of where the time
saving comes from.

## It runs offline

Search is local. It combines a lexical index with a semantic one for ranking.

On first use Jensen tries to fetch a small embedding model to enrich the ranking. **On a machine with
no network it falls back to lexical search with no loss of availability.** Nothing about search
depends on a remote service, and nothing about your code is sent anywhere to make it work.

The embedding model's status is visible in **Settings, Knowledge**, which reads **Preparing semantic
search** while it is being prepared.

## Adding documentation

Two ways in.

**Automatically.** Jensen indexes README files and local documentation folders beside the project and
its services. Nothing is added to your git history.

**Explicitly**, for a source it would not find on its own:

```bash
jensen ingest . ./docs/runbooks
jensen ingest . ./ARCHITECTURE-NOTES.md
```

Either a file or a directory, markdown or plain text.

Indexed documentation becomes the Documentation mode on the map, with search, inline answers and
citation cards that link back to the source passage. See
[Project, the map](../../app/project/#documentation).

## Maintaining the store

```bash
jensen knowledge            # statistics, the default
jensen knowledge refresh    # re-index
jensen knowledge compact    # reclaim space; --dry-run to look first
jensen knowledge eval       # score retrieval quality
jensen knowledge export     # take it elsewhere
```

The same controls, plus **Compact** and **Refresh**, are in **Settings, Knowledge**, alongside store
statistics and the learning records awaiting your review.

## Reviewing what was learned

Not everything an assistant learns should guide the next one. **Review learning records** lists what
is pending, with **Review with AI** to summarise, then **Approve** for records that should guide
future sessions and **Dismiss** for the ones that should not.
