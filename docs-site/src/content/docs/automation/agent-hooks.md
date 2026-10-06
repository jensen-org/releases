---
title: Agent hooks
description: Rules that run a check, an action or an assistant when something happens, and the built-in hooks behind the plan flow.
---

An agent hook runs when an event fires: a file saves, you commit, a plan is approved, a pipeline
fails. Jensen ships hooks that drive the [one flow](/start/what-is-jensen/#the-one-flow), and you can
add your own.

Open **Settings, AI, Agent Hooks**.

## The list

The header reads **Run a check or an assistant automatically when files change or you commit.** The
master toggle **Built-in agent hooks** shows how many are active, such as **6 of 17 active**.

Hooks sit in four groups: **Plan lifecycle**, **Code quality**, **Delivery and integrations** and
**Custom rules**. Each row shows a state: **Default**, **Customized**, **Custom**, **Paused** or
**Permission blocked**. Use **Reset agent hook** to restore a built-in and **Delete agent hook** to
remove a custom one.

## Plan lifecycle, on by default

These move your plan, issue and checkout together.

| Hook | When | What it does |
| --- | --- | --- |
| **Plan first change** | The first change is recorded | Sets the plan to in progress. |
| **Plan approved** | You approve | Prepares issue tracking and the worktree, opens the issue and clears the in progress label. |
| **Plan in progress** | The plan moves to in progress | Opens the issue and adds the in progress label. |
| **Plan blocked** | The plan is blocked | Keeps the issue open and labeled. |
| **Plan decision recorded** | An agent records a departure | Comments the outcome on the issue. |
| **Plan implemented** | The plan is done | Comments the outcome, clears the label and closes the issue. |

Issue steps need their [permissions](/safety/trust-and-permissions/).

## Code quality, off by default

| Hook | When |
| --- | --- |
| **Format on save** | A file saves |
| **Lint on save** | A file saves |
| **Scan secrets before commit** | You commit |
| **Review proactive findings** | A file saves |
| **Analyze change impact** | A file saves |
| **Update tests** | A file saves, runs an assistant |

## Delivery and integrations

| Hook | When | Default |
| --- | --- | --- |
| **Add merge closing links** | A merge request is being created | On |
| **Create draft merge request after push** | You push, runs an assistant | Off |
| **Review merge requests** | A merge request updates | Off |
| **Fix failed pipelines** | A pipeline fails | Off |
| **Work newly assigned issues** | An issue is assigned to you | Off |

## Write your own

Choose **New agent hook**. A hook is a trigger plus an action.

**Triggers** include session start and end, prompt submit, before and after a tool, a permission
request, file save and delete, commit, push, pipeline failure and success, merge request updated,
issue assigned, and each plan transition.

**Actions** are **Format**, **Lint**, **Scan secrets**, **Findings**, **Impact analysis**, or an
assistant that works on the event. Each action has a policy: **Allow**, **Ask first** or **Block**.

Custom hooks are YAML files in your Jensen config folder, under `projects/<key>/hooks/<id>.yaml`.
Files Jensen cannot use are listed under **Agent hook files that cannot be used**.

## Let hooks start assistants

A hook that runs an assistant can open a session and edit files in an isolated worktree. That needs your
say. Under **Agent hook access**, turn on **Let agent hooks start assistants**. It reads **Allowed** or
**Ask first**, with **Allow** and **Revoke**.

## Empty

With no hooks the list reads **No agent hooks yet**. Format code, scan for secrets, or ask an
assistant, when you save or commit.
