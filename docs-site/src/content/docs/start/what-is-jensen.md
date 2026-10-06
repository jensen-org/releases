---
title: What is Jensen
description: Jensen is an AI-first IDE for large, complex codebases. It maps your project, hands the map to your AI assistant, and runs changes through one flow.
---

Jensen is an AI-first IDE for large, complex codebases. It maps your project, gives that map to your
AI assistant, and keeps every change on a task branch you can review before it lands.

## Two ways to use it

Installing Jensen gives you a desktop app and a `jensen` command, from one package.

The app is where you read the map, run sessions, approve plans and grant permissions. These docs
describe the app first and show the matching command in an aside where one exists.

The command line reaches the same map, knowledge and guard with the app closed. See
[Working outside the app](/assistant/working-outside-the-app/).

## The problem it solves

Big multi-service codebases are hard to hold in your head. Joining one means days of tracing what
talks to what. AI assistants make it worse: pointed at raw source, they burn effort re-scanning files
and invent an architecture that is wrong.

Jensen fixes this for both of you. You get a map you can open from wherever you stand. Your
assistant gets a compact, trustworthy description of the real structure, so it answers faster and
correctly.

## The one flow

Every change follows the same path.

1. Your assistant reads the map and writes a **plan**.
2. You read the plan and **approve** it.
3. Jensen cuts a **task branch** and its own worktree.
4. The assistant builds there, and Jensen records each change.
5. The assistant hands the work back. Jensen **lands** the branch by your branch policy and cleans up.

Agents never merge, push to protected branches or delete branches. Jensen does. See
[Plans](/flow/plans/) to start.

## Context, not a model

Jensen embeds no AI model. It finds the assistants installed on your machine and drives the one you
choose. It adds what surrounds the model: the map, project knowledge, conventions, safety rails and a
record of what happened.

You never switch models. See [How Jensen reaches your assistant](/assistant/how-it-works/).

## What you get

| | |
| --- | --- |
| **A map you can navigate** | Services, symbols, calls, imports and routes, drawn as a graph you drill through by altitude. |
| **Shared context for your assistant** | The map, project memory and conventions, delivered through a context server your assistant connects to. |
| **A task branch for every change** | Each plan gets its own branch and worktree, so parallel work never collides. |
| **A guard on your history** | Secrets, junk and history-discarding pushes are refused. Agents cannot move or delete branches. |
| **A record you can undo** | Every net file change an agent makes is a point on a session timeline. |
| **Your issues and merge requests** | GitHub, GitLab and Slack, with every outbound write behind a permission you grant. |

## Where to go next

- [Honest by design](/start/honest-by-design/) is the guarantee everything rests on.
- [Download and install](/start/install/) gets the app onto your machine.
- [Turn Jensen on](/start/turn-jensen-on/) sets up your project.
- [Your first session](/start/your-first-session/) follows one change from plan to landed branch.

## Status

Jensen is in public beta. It is proprietary software under the Jensen End User License Agreement 1.0.
It is free to use, at work included, and to build products you sell. You may not sell, redistribute
or host Jensen itself. See [License and security](/about/license-and-security/).
