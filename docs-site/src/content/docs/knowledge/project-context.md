---
title: Project context
description: Five documents that tell every assistant what this project is, how it is built and how work gets done here, and how onboarding writes them.
---

Every assistant needs to know what kind of project it is in and how people work there. Most guess.
Project context removes the guessing.

It is five documents. You review them, Jensen stores them locally in `.jensen/steering`, and every
assistant that connects reads them.

## The five documents

| Document | What it settles |
| --- | --- |
| **Constitution** | Rules that are not up for negotiation. |
| **Product** | What the project is, who it is for, and the outcomes that matter. |
| **Architecture** | How the code is laid out and who owns what. |
| **Engineering** | The stack, how to build, run and test, and the conventions to follow. |
| **Workflow** | How work moves from an idea to something merged. |

They live apart from project memory and skills because they record decisions, not observations. See
[Skills](/knowledge/skills/).

## Onboarding writes them

The first time an assistant works in a project that is not onboarded, Jensen tells it so. The assistant
asks you questions in its own words, one at a time and drawn from your project, then you review its
answers and it saves them.

A project counts as onboarded once its documents are saved, or once you finish the setup wizard.
Until then, an assistant reads the code and tells you `jensen setup` is available. It never
reports that the project has nothing in it.

From then on the documents are versioned. A refresh applies against the revision it was drafted from.

## Edit them

Open **Settings, AI, Project context**.

- **Generate with AI** or **Refresh with AI** drafts from what Jensen has indexed. The draft stays
  local and editable. Nothing saves until you review it.
- **Edit** any document by hand.
- **Refresh preview** shows evidence backed suggestions without writing anything.
- **Apply selected** takes only the ones you agree with.

The preview matters. A contract that drifts unnoticed is worse than none, and one regenerated
wholesale loses decisions you made on purpose.

## Why a README is not enough

A README is written for a person arriving once. An assistant reads project context at the start of
every session, and it stops the assistant inventing a convention that was never true here.

Jensen holds the documents, so an assistant that ignores them is corrected by the harness, not by you
catching it in review.

See [Turn Jensen on](/start/turn-jensen-on/) for the whole setup flow.
