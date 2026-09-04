---
title: What your assistant can do
description: The catalogue of capabilities Jensen gives a connected assistant, grouped by purpose, and which of them are gated writes.
---

Once connected, your assistant can ask Jensen questions instead of guessing, and act on the project
through capabilities you control. Around ninety are available. They group like this.

## Recall and knowledge

Search across confirmed facts, evidence-backed procedures, ingested documentation and indexed source
symbols, before reading files or guessing. Also: ingest a documentation source, store a durable
project memory, and delete one that turned out to be wrong.

A separate search over the catalogue itself lets an assistant discover the right capability without
loading the whole list into its context.

## Navigating the code

Instead of `ls`, `find`, `tree` and grep:

| Capability | What it answers |
| --- | --- |
| List files | What is here, already filtered by your ignore rules. |
| Dependencies | What this depends on, without grepping imports. |
| Impact analysis | The blast radius of a change to a symbol. Treated as a lead, not a verdict. |
| Explain a service | A structural profile from the map. |
| Detect languages | Which languages this project actually uses. |
| Rename a symbol | A project-wide whole-word rename. |
| Project brief | Where to start in a project it has never seen, with every fact naming the file it came from. |

## Bugs and quality

Existing findings are checked before any bug or regression work begins. From a bug report or a
failing job log, likely source locations are ranked, again as a lead to investigate rather than an
answer. A separate structural read supports a quality review: over-connected hubs, low-cohesion
components, dependency cycles, oversized files and likely copy-paste clones.

See [Findings and screening](../../safety/findings-and-screening/).

## Git and changes

History, and a semantic diff that projects working-tree changes onto the symbols that own them.
Staged changes are screened for leaked secrets and junk files before a commit, and every blocking
finding has to be resolved or accepted by you first. Recent history movements are surfaced as
labelled undo points, so an assistant can offer a safe target instead of a raw commit hash.

Every edit is recorded on the session timeline, which is what makes it reversible. See
[Undo and the session trace](../../safety/undo-and-the-session-trace/).

## Worktrees

List, open and remove the isolated checkouts that keep parallel tasks from sharing an index. See
[Worktrees for parallel work](../../safety/worktrees/).

## Plans, decisions and objectives

Fetch the canonical plan skeleton, register a plan, update its status or tick one of its steps, and
record a departure from it: a decision that supersedes the plan, a critical bug found outside its
scope, or a blocker. Objectives bind a set of plans, chats, ordered goals and standing constraints
for one feature that may span many days.

See [Plans and objectives](../plans-and-objectives/).

## Architecture

An assistant can read the material behind your architecture and submit an inference from it. That
inference is stored as **inferred** and shown to you for confirmation. It never enters the map on its
own, and an assistant is told not to confirm its own inference without your go-ahead. See
[Honest by design](../../start/honest-by-design/).

## Spec-driven development

Create a feature specification, analyze it for review issues before approval, refine it, approve it,
sync it, run it, and trace requirements to the work that satisfies them. Jensen never installs
software or reaches the network to do it, and initialising a specification toolkit requires your
explicit approval.

## Your tracker, merge requests and CI

**Reads are not gated.** Issue context, work items, your inbox, labels, a merge request, pipeline
status and a job log are all available.

**Writes are gated, individually.** Each one is blocked until you enable the matching permission, and
each says so in its own description. They are: comment on an issue, create an issue, set issue
labels, set issue state, assign an issue, schedule a work item, create a merge request, review a
merge request, and post to Slack.

See [Trust, approvals and permissions](../trust-approvals-and-permissions/).

## Developer tooling and health

List which tools a language resolves to, install one from the catalog, run the formatter or the
linter, read diagnostics, and report what is and is not working in the project's Jensen setup:
workspace trust, the tools its languages need, whether it is indexed, and whether an assistant can
see it.

## Debugging

Start, continue, step, pause and stop a debug session, set breakpoints, inspect the stack or the
variables, and evaluate an expression in the running program. An assistant can drive the debugger
rather than reason from a stack trace.

Debugging requires a trusted workspace.

## Skills and hooks

Search, list and use approved skills, and read a file belonging to one. A generated skill is staged
as pending your approval rather than added silently, and running a skill's script needs explicit
permission and stays confined to that skill's package. Agent hooks can be listed, registered and
evaluated.

See [Skills](../../knowledge/skills/) and [Agent hooks](../agent-hooks/).

## Plugins

Validate a plugin manifest and publish a plugin. See
[Plugins and themes](../../extending/plugins-and-themes/).
