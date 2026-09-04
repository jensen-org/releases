---
title: What is Jensen
description: Jensen is an AI-first IDE for large, complex codebases. It maps your project and hands the same map to your AI assistant.
---

Jensen is an AI-first IDE built for large, complex codebases. It maps your project into a navigable
picture of how it actually fits together, the services, the calls between them, the routes they
expose, and hands that same map to your AI assistant so you both work from a shared understanding
instead of guessing.

## The problem it solves

Big multi-service codebases are hard to hold in your head. New to a repo, you spend days tracing what
talks to what. AI assistants make that worse in a specific way: pointed at raw source, they burn
effort re-scanning files and confidently invent an architecture that was never there.

Jensen removes that friction for both of you. You get a map you can open from wherever you stand, and
your assistant gets a compact, trustworthy description of the real structure, so its answers about
the system are faster and correct.

## It supplies the context, not the model

Jensen embeds no AI model of its own. It works with the assistant you already use, discovers the
assistant command-line tools already installed on your machine, and drives whichever one you choose.
What Jensen adds is everything around the model: the map, the project's accumulated knowledge, the
conventions, the safety rails, and a record of what happened.

That distinction runs through the whole product. Jensen never asks you to switch models, and it never
hides which one answered.

## What you get

| | |
| --- | --- |
| **A map you can navigate** | Services, symbols, calls, imports and routes, drawn as a graph you drill through by altitude rather than by folder. |
| **A shared context for your assistant** | The same map, plus project memory and conventions, delivered to your assistant through a context server it connects to automatically. |
| **Sessions in isolated checkouts** | Every agent session runs in its own worktree, so parallel work never collides on one index. |
| **A guard on your history** | Secrets, junk and history-discarding pushes are refused where the commit is typed. |
| **A record you can undo** | Every net file change an agent makes is a reversible point on a session timeline. |
| **Your issues, merge requests and pipelines** | GitHub, GitLab and Slack connected to the same workspace, with every outbound write behind an explicit permission. |

## Where to go next

- [Honest by design](../honest-by-design/) is the one guarantee everything else rests on. Read it
  first if you are deciding whether to trust the map.
- [Download and install](../download-and-install/) gets the app onto your machine.
- [First run](../first-run/) turns Jensen on for a project in one command.
- [How Jensen works with your assistant](../../ai/how-it-works/) is the short version of the AI story.
- [You do not have to use the app](../first-run/#you-do-not-have-to-use-the-app), if you would rather
  keep your current setup and reach Jensen from the terminal and your assistant.

## Status

Jensen is in public beta. It is proprietary software under the Jensen End User License Agreement 1.0,
not open source. It is free to use, including at work and to build products you sell. What it does
not allow is selling, redistributing or hosting Jensen itself. See
[License and security](../../about/license-and-security/).
