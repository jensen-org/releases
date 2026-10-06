---
title: Memory and knowledge search
description: Durable project memory, where it comes from, offline hybrid search over everything Jensen knows, and how documentation gets in.
---

Project memory stops each session rediscovering old ground. Knowledge search finds it again.

## What a memory is

A durable fact about the project: a curated fact, preference, decision or constraint any future
session should recall. Every assistant in the project shares memories, whatever tool or conversation
wrote them.

Memories are leads. A memory records what was true when it was written, so an assistant re-checks it
against the code before acting, and removes it when it turns out wrong.

## Where memories come from

- **Assistants save them** with `remember` when they learn something a later session could not
  recover.
- **Your other assistants contribute.** Jensen reads the memories Claude Code, Codex and Hermes keep
  on your machine and merges them into project knowledge. Claude Code and its worktree memories are
  matched to the project. Codex and Hermes memories are global. It syncs about every 30 seconds.

## The recall loop

Jensen nudges the learning loop at three points.

1. **Before the first edit,** the assistant searches knowledge for the task and checks for a skill
   that fits.
2. **During work,** a search hit that is a skill tells the assistant how to open it.
3. **At the end,** when a session changed files or finished a plan and saved nothing, Jensen prompts a
   debrief. `/jensen-debrief` does the same by hand.

## The knowledge settings

**Settings, AI, Knowledge** holds the store: statistics, the **Embedding model**, **Refresh**,
**Compact**, **Documentation sources** with **Index documentation**, and the learning records waiting
for you. While the model prepares, the panel reads **Preparing semantic search**.

:::tip[From the terminal]
```bash frame="none"
jensen knowledge            # statistics
jensen knowledge refresh    # re-index
jensen knowledge compact    # reclaim space; --dry-run to look first
jensen knowledge export     # take it elsewhere
```
:::

## What search covers

One query reaches four sources: curated memories, recorded skills, ingested documentation and indexed
source symbols. Assistants search it before reading files or guessing, which is where most of the time
saving comes from.

You can search it too. Type a question in words into the command palette (`Cmd K`) and it searches by
meaning.

## It runs offline

Search is local. It combines a lexical index with a semantic one for ranking.

On first use Jensen tries to fetch a small embedding model to improve that ranking. With no network
it falls back to lexical search. Nothing about search needs a remote service, and none of your code is
sent anywhere to make it work.

## Adding documentation

Jensen indexes README files and local documentation folders beside the project and its services. Your
git history stays untouched.

For a source it would not find, use **Index documentation** under **Documentation sources**. It takes
a file or directory of markdown or plain text.

:::tip[From the terminal]
```bash frame="none"
jensen ingest . ./docs/runbooks
```
:::

## Review what was learned

Not everything an assistant learns should guide the next one. **Review learning records** lists what
is pending. **Review with AI** summarizes it, **Approve** keeps records that should guide future
sessions, and **Dismiss** drops the rest.
