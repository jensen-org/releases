---
title: How Jensen reaches your assistant
description: Jensen supplies context, not a model. What your assistant gets when it connects, where to check the connection, and what Jensen will not do.
---

Jensen embeds no AI model. It works with the assistant on your machine and adds what surrounds the
model.

Pointed at raw source, an assistant burns effort re-scanning files and describes an architecture that
was never there. Both failures share a cause: it has no trustworthy description of the system, so it
improvises one.

## What Jensen supplies

| | |
| --- | --- |
| **The map** | A compact, honest description of the real structure, in place of the whole repository. |
| **Project knowledge** | Confirmed facts, decisions, conventions and past investigations, so no session rediscovers old ground. |
| **Conventions** | The plan format, the branch rules and the habits of recall and navigation. |
| **Tools** | Ways to ask the map a question instead of grepping the tree. |
| **Rails** | Approvals, permissions, workspace trust and the git guard. Jensen enforces them, the model is never asked to. |
| **A record** | A session timeline where every net file change is a point you can restore. |

## Check the connection

**Settings, System, Health** runs every check, explains what each covers, and offers **Re-check** and
**Copy as Markdown** for pasting into an issue.

**Settings, AI, AI assistant** shows the assistants Jensen found and which is the default.

During setup, the **Connect** step reports how many checks are wired and offers **Fix all**.

:::tip[From the terminal]
```bash frame="none"
jensen setup --status    # what is wired, writes nothing
jensen doctor            # what works and what does not
```
:::

## What your assistant gets on connect

Setup registers the context server once, at user scope, with each supported assistant on your `PATH`.
You approve it one time, not once per project.

On connect, three things arrive before the assistant asks for anything.

1. **Whether Jensen is active here.** In a project never set up, the only thing offered is a way to
   activate it. An empty answer there means the project was never indexed, not that the code is
   empty.
2. **The rules for this project.** A short brief: which branches are protected, how to plan, which
   workflows exist, whether the project is onboarded, and what the project already knows. Anything
   longer sits behind a `guide` topic the assistant opens when it needs it.
3. **A short tool list.** A handful of core tools, plus `find_tools` and `use_tool` to reach the rest.
   See the [Assistant tool reference](/reference/assistant-tools/).

Setup also wires each assistant's session hooks. They let Jensen nudge recall before the first edit,
keep the plan format, capture file versions as work proceeds, answer a plan while its session runs,
and prompt a debrief when a session ends having saved nothing. Setup installs `/jensen-debrief` for
that last step.

## The conventions every assistant follows

- **Plans.** Every change starts as a plan, and nothing is built before you approve it. See
  [Plans](/flow/plans/).
- **Branches.** Jensen cuts the task branch and checkout and lands the work. The assistant never
  merges, pushes to a protected branch, or deletes anything. See
  [Approval and task branches](/flow/approval-and-task-branches/).
- **Recall first.** Search project knowledge and skills before guessing, and check existing findings
  before bug work.
- **Recording.** Each edit is recorded on the plan and the session timeline. See
  [Undo and the session trace](/safety/undo-and-the-session-trace/).
- **Learning.** Save what a future session could not recover. See
  [Memory and knowledge search](/knowledge/memory-and-search/).

## Where you start does not matter

An assistant launched in a plain shell gets the same context server, tools and rules as one inside
the app. See [Working outside the app](/assistant/working-outside-the-app/).

## What Jensen will not do

- Choose a model for you when several assistants are available. It asks.
- Let an assistant confirm its own inference about your architecture. That is your call.
- Let an assistant write to your tracker, merge requests or Slack without that permission.
- Run project commands or toolchains in a workspace you have not trusted.
- Let an assistant create its own worktree. Jensen provisions every checkout.

## Where to go next

- [Choosing an assistant](/assistant/choosing-an-assistant/), if you have more than one installed.
- [Assistant tool reference](/reference/assistant-tools/), for what it can call.
- [Trust and permissions](/safety/trust-and-permissions/), for the rails.
