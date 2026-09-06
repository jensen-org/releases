---
title: What is Jensen
description: Jensen is an AI-first IDE for large, complex codebases. It maps your project and hands the same map to your AI assistant.
---

Jensen is an AI-first IDE built for large, complex codebases. It maps your project into a navigable
picture of how its components fit together, and hands that same map to your AI assistant so you both
work from a shared understanding.

## Two ways to use it

Installing Jensen gives you a desktop application and a `jensen` command, from the same package.

The application is where you read the map, run sessions, and grant or refuse what an agent asks for.
This documentation is written for it, and shows the equivalent command in an aside where one exists.

The command line reaches the same map, the same knowledge and the same guard with the app closed,
which matters if you would rather not change how you already work. See
[Working outside the app](../../assistant/working-outside-the-app/).

## The problem it solves

Big multi-service codebases are hard to hold in your head. When you are new to a repo, you spend
days tracing what talks to what. AI assistants make that worse in a specific way: pointed at raw
source, they burn effort re-scanning files and confidently invent an architecture or facts that are
completely wrong.

Jensen removes that friction for both of you. You get a map you can open from wherever you stand,
and your assistant gets a compact, trustworthy description of the real structure, so its answers
about the system are faster and correct.

## It supplies the context, not the model

Jensen embeds no AI model of its own. It works with the assistant you already use, discovers the
assistant command-line tools installed on your machine, and drives whichever one you choose. What it
adds is everything around the model: the map, the project's accumulated knowledge, the conventions,
the safety rails, and a record of what happened.

Jensen never asks you to switch models. See
[How Jensen reaches your assistant](../../assistant/how-it-works/).

## What you get

| | |
| --- | --- |
| **A map you can navigate** | Services, symbols, calls, imports and routes, drawn as a graph you drill through by altitude rather than by folder. |
| **A shared context for your assistant** | The same map, plus project memory and conventions, delivered through a context server your assistant connects to automatically. |
| **Sessions in isolated checkouts** | Every agent session runs in its own worktree, so parallel work never collides on one index. |
| **A guard on your history** | Secrets, junk and history-discarding pushes are refused where the commit is typed. |
| **A record you can undo** | Every net file change an agent makes is a reversible point on a session timeline. |
| **Your issues, merge requests and pipelines** | GitHub, GitLab and Slack connected to the same workspace, with every outbound write behind an explicit permission. |

## Where to go next

- [Honest by design](../honest-by-design/) is the guarantee everything else rests on.
- [Download and install](../install/) gets the app onto your machine.
- [Turn Jensen on](../turn-jensen-on/) sets Jensen up in your project.
- [Your first session](../your-first-session/) walks one piece of work from end to end.

## Status

Jensen is in public beta. It is proprietary software under the Jensen End User License Agreement
1.0, and not open source. It is free to use, including at work and to build products you sell. What
it does not allow is selling, redistributing or hosting Jensen itself. See
[License and security](../../about/license-and-security/).
