---
title: How Jensen works with your assistant
description: Jensen supplies the context, not the model. What it gives your assistant, and why that makes its answers about your system faster and correct.
---

Jensen embeds no AI model. It works with the assistant already on your machine, and what it adds is
everything around the model.

## The problem

Pointed at raw source, an AI assistant burns effort re-scanning files, and then confidently describes
an architecture that was never there. Both failures come from the same cause: it has no trustworthy
description of the system, so it improvises one.

## What Jensen supplies

| | |
| --- | --- |
| **The map** | A compact, honest description of the real structure, instead of the whole repository. |
| **Project knowledge** | Confirmed facts, decisions, conventions and prior investigations, so the same ground is not rediscovered every session. |
| **Conventions** | The plan format, the parallel-work rules and the navigation habits, written into the project so every assistant follows them. |
| **Tools** | Ways to ask the map a question, rather than grep the tree for an answer. |
| **Rails** | Approvals, permissions, workspace trust and the git guard, enforced by Jensen rather than requested of the model. |
| **A record** | A session timeline where every net file change is a reversible point. |

## How it reaches the assistant

`jensen setup` registers a context server once at user scope with every supported assistant tool it
finds. You approve it a single time rather than once per project. It also wires each assistant's own
session lifecycle hooks, so Jensen can hold the plan format, capture recoverable file versions at
tool boundaries, deliver feedback on a plan, and save what a session learned at the end.

The important consequence: **it does not matter where you start.** An assistant you launch in a plain
shell gets the same context server, the same tools and the same conventions as one running inside the
app.

See [The context server](../context-server/).

## What it does not do

- It does not choose a model for you when several assistants are available. It asks.
- It does not let an assistant confirm its own inference about your architecture. That is your call.
- It does not let an assistant write to your tracker, your merge requests or Slack unless you have
  enabled that specific permission.
- It does not run project commands or toolchains in a workspace you have not trusted.

## Where to go next

- [Choosing an assistant](../choosing-an-assistant/), if you have more than one installed.
- [What your assistant can do](../what-your-assistant-can-do/), for the capabilities it gains.
- [Plans and objectives](../plans-and-objectives/), for how a change is agreed before it is made.
- [Trust, approvals and permissions](../trust-approvals-and-permissions/), for the rails.
