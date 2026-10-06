---
title: Your first session
description: One change from start to finish. Ask your map a question, write and approve a plan, watch the task branch work, land it, and meet the git guard.
---

Setup is done. This page follows one change from start to finish, so you meet the map, a session, a
plan, a task branch, landing and the guard as one thing instead of five topics.

It takes about fifteen minutes on a repository you know.

## Before you start

You need a project that is open, indexed and trusted, with an assistant chosen. If anything is
missing, see [Turn Jensen on](/start/turn-jensen-on/).

## Read the map

Press `Cmd 1` for Sessions, or `Alt 1` on Linux and Windows. With nothing running, Jensen lays out the
**Project graph** on the right and the **Project overview** below it.

Click a folder to drill in, then click a file to open it. Every file and import you see was read from
your source. Nothing was guessed. See [Honest by design](/start/honest-by-design/).

Choose **Ask Jensen** in the graph toolbar and ask something you would normally grep for:

> Where is the session token refreshed?

Jensen shows matches as file chips. Click one to open it.

## Start a session

Choose **New session**, pick a **Runtime**, then **Start**. Choose **Plan** in the composer, so your
assistant plans before it edits.

:::tip[From the terminal]
```bash frame="none"
jensen assistant list
```
:::

## Ask for a change

Ask for something small and real, such as a rename or a guard clause. Your assistant recalls what the
project knows, then writes a plan to `.jensen/plans/` and it opens beside the session. See
[Plans](/flow/plans/).

Read it. Select text and choose **Comment** to push back, then **Request changes** to send your
comments to the agent. When it is right, choose **Approve**.

## Watch it work

Approving makes Jensen cut a task branch and a worktree for the plan, open its tracking issue, and
tell the assistant where to work. See [Approval and task branches](/flow/approval-and-task-branches/).

Your protected branches are untouched. The assistant builds in the checkout, ticks **Steps** as work
lands, and records each change. Open the **Trace** tab to see its calls and edits as they happen.

## Land it

When the work is done, the assistant hands the branch back. Jensen runs your checks if your policy
asks for them, merges the branch into your development branch, and removes the checkout.

If you would rather do it yourself, the session pane shows **This session finished and left its
checkout behind**. Choose **Land**, confirm, and look for **Branch landed**. See
[Landing and cleanup](/flow/landing-and-cleanup/).

Open **Source control** and **Commit history** to see the commit on your branch.

## Take it back

If you do not want the change, use **Revert** on its commit in **Commit history**. Reverting adds a
commit that undoes it and keeps history intact. See
[Undo and the session trace](/safety/undo-and-the-session-trace/).

## Meet the guard

Put a fake credential in a file, stage it and commit. The commit is refused from the terminal and from
the app, because the guard runs from the project's git hooks.

Open **Source control**. The commit box reads **Commit blocked** and lists a row per finding. If a
match is a false positive, a test fixture or a documented example key, **Accept** clears that one
finding for future commits and leaves every other rule in force.

Delete the fake credential and commit again. Try asking your assistant to commit to `main` too. Jensen
refuses it and points it at the task branch. See [The git guard](/safety/git-guard/).

## Where to go next

- Understand a codebase: [Project graph and overview](/app/project-graph/) and
  [Memory and knowledge search](/knowledge/memory-and-search/).
- Hand more work to agents: [Branch policy](/flow/branch-policy/), [Workflows](/flow/workflows/) and
  [Agent hooks](/automation/agent-hooks/).
- Decide what an agent may do: [Trust and permissions](/safety/trust-and-permissions/).
