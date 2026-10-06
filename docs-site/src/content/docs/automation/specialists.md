---
title: Specialists
description: Specialists are agents that own a scope, work in isolated checkouts and can run on a schedule.
---

A specialist is an agent narrowed to one job. It owns a scope, keeps what it learns, and can wake on
a schedule to work alone.

## Create one

Choose **New session**, open **Advanced**, and check **Work as a specialist**. Fill in:

- **Name**, for example `Session lifecycle`.
- **What it owns**, in a sentence.
- **Ceiling**: **Read only** or **Can write**. It is the most a scheduled run may do. Read only never
  writes to a checkout.
- **Scope**: paths, labels, issues and plans it covers.

Jensen creates the specialist once its first plan is approved. Until then the session holds the draft.

## The rail group

Each specialist is a card in the session rail, with sessions grouped under it. It shows **Next run
in**, **Expires in** or **Expired**, and its last report line. Tags mark **Frozen** and **Archived**.

The **Actions** menu has **Open specialist**, **Extend by 21 days**, **Freeze** or **Unfreeze**, **Run
now**, **Archive** and **Delete…**. Deleting asks whether to **Keep its knowledge** or **Delete its
knowledge**.

## The specialist pane

| Section | What it holds |
| --- | --- |
| **Brief** | What it is for. Up to 8 KB. |
| **Instructions** | How it works. Up to 16 KB. Specialists can refine their own. |
| **Scope** | What it owns. **Edit scope**, **Save scope**. |
| **Schedule** | A cron time and timezone, a mode of **Isolated worktree** or **Read only**, a timeout and retries. |
| **Runs** | Each run's status and report. **Show report**, **Allow**, **Deny**, **Cancel run**. |
| **Skills waiting for approval** | Skills it learned, ready for your review. |

With no schedule it says **No schedule**. Start a run from the menu when it should work on its own.

## Limits

- A specialist lives 21 days by default, and warns 72 hours before it expires. Extend it from the
  menu.
- Up to four runs go at once. A timeout may be up to 24 hours, with up to five retries.
- A missed run catches up only within six hours.
- A run that ends without a report counts as failed.

## What it learns

A specialist keeps its skills inside its own scope. They are not promoted to the project on their
own. After two successful sessions a skill is ready for your approval, and it never activates alone.
**Review in Settings** opens **Settings, AI, Skills**. See [Skills](/knowledge/skills/).

## Reusable setups

You can export and import agents from the caret beside **New session**, to share definitions between
machines.
