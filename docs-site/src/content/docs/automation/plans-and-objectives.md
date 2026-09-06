---
title: Plans and objectives
description: The canonical plan format, its lifecycle and approval gates, how it links to an issue, and how objectives hold a feature together across many days.
---

A plan is the hand-off artifact between the agent that designed a change and whoever implements it.
In Jensen the format is a contract, not a suggestion.

## Where a plan lives

Canonical plans are written to `.jensen/plans/<id>.md`, named after the plan's intent as a short
slug, never a generated name. The file stem is the plan's id.

If your assistant's own harness forces the plan somewhere else, Jensen adopts that file, so the
format still applies.

## The fixed sections

In this order:

| Section | What it holds |
| --- | --- |
| **What I understood** | The intent, the outcome and the constraints restated, so you can see the ask was grasped before changes are proposed. |
| **Root cause** | Required for a bug fix, omitted for feature work. |
| **Changes** | One row per file, with what, why and how. |
| **Risks and mitigations** | What could go wrong and what catches it. |
| **Steps** | The ordered work, as a checklist. |
| **Acceptance criteria** | Runnable commands, not sentences. |
| **Verification** | How to prove it end to end. |
| **Deviations and findings** | Filled in as the work runs, from recorded decisions. |

The style rules are as load-bearing as the sections: tables and checklists over prose, real paths and
symbols in code spans and nothing else, and every acceptance criterion something you can actually
run.

## The lifecycle

| Status | Set by |
| --- | --- |
| **Draft** | The agent, when it writes the plan. |
| **Approved** | You. An agent never sets this itself. |
| **In progress** | Automatically, the first time a change is recorded against the plan. |
| **Implemented** | The agent, the moment the work lands. |
| **Blocked** | The agent, when it cannot proceed. |

A stale status is a defect rather than a formality. A plan left below done after its work is finished
reads to you as still open, and makes you redo it.

For larger work the plan moves through phased approval gates: **Requirements**, then **Design**, then
**Tasks**.

## Approving a plan opens its issue

Approving a canonical plan creates its tracking issue, assigns it to the agent, links it in the
plan's own front matter, and closes it when the plan reaches done. That only happens for a plan in
Jensen's format. A plan written some other way silently gets no issue.

Work that is not a plan, a bug found in passing, a follow-up nobody is doing yet, gets an issue
created explicitly instead. See [Work](../../app/work/).

## The plan inspector

Open a plan and you get the document itself, with:

- **Add comment** and **Mark done** inline against any part of it.
- **Plan discussion**, the thread about the plan rather than about the code.
- **Steps** as checkboxes that move the status with them.
- **Blast radius**, what else the change touches, labelled as a heuristic rather than a verdict.
- **Acceptance checks** you can **Run all**.
- **Start session**, to begin the work in its own worktree.

Revision comments you send go back to the agent while the session is still running.

## Recording a departure

Plans meet reality. Rather than quietly diverging, an agent records the departure: a decision that
supersedes the plan, a critical bug found outside its scope, or a blocker. Those land in the plan's
**Deviations and findings** section, and the plan's issue gets a digest of them.

## Objectives

A plan is one change. An objective is the durable container for a feature that may span many days,
binding together:

- Its **plans**.
- Its **chats**.
- Its **ordered goals**.
- Its **standing constraints**, the rules that apply for the whole feature rather than one message.

Standing constraints appear in the chat pane, so they stay in front of the model instead of being
restated every session.

## Spec-driven development

For work that wants a specification before a plan, Jensen carries a spec workflow: create a feature,
analyze it for review issues before approval, refine it, approve it, sync it, run it, and trace
requirements to the tasks that satisfy them. Specifications live under `.jensen/specs`, and they
appear in a session as **Spec views** beside the assistant.

Jensen never installs software or reaches the network for this, and initialising an external
specification toolkit requires your explicit approval.
