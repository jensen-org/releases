---
title: Project context
description: The five-document contract that tells every assistant what this project is, how it is built and how work gets done here.
---

Project context answers a question every assistant asks and most of them guess at. What kind of
project is this, and how do people work in it?

It is a five-document contract, reviewed by you, stored locally in `.jensen/steering`, and delivered
to every assistant that connects.

## The five documents

| Document | What it settles |
| --- | --- |
| **Constitution** | The rules that are not up for negotiation. |
| **Product** | What this project is, who it is for, and the outcomes that matter. |
| **Architecture** | How the code is laid out and who owns what. |
| **Engineering** | The stack, how to build, run and test, and the conventions to follow. |
| **Workflow** | How work moves, from an idea to something merged. |

Kept separately from project memory and from skills, because these are decisions and not
observations. See [Skills](../skills/#skills-memory-and-context).

## How it gets written

Onboarding seeds an interview. Your assistant asks you each question in its own words, you review the
answers, and the reviewed result is saved. From then on it is versioned: the contract carries a
revision, and a refresh is applied against the revision it was drafted from.

**Settings, AI, Project context** is where you work on it.

- **Generate with AI** or **Refresh with AI** to draft from what Jensen has indexed. *The draft
  remains local and editable. Nothing is saved until you review it.*
- **Edit** any document by hand.
- **Refresh preview** to see evidence-backed suggestions without writing anything.
- **Apply selected** to take only the ones you agree with.

The preview step matters more than it looks. A contract that drifts silently is worse than no
contract, and a contract regenerated wholesale loses the decisions you made deliberately.

## Why a README is not enough

A README is written for a human arriving once. This is read by an assistant at the start of every
session, and it is what stops it inventing a convention that has never been true here.

Because Jensen holds it, an assistant that ignores it gets corrected by the harness, and not by you
noticing in review.

## Onboarding

The full setup flow, including this, is in
[The guided wizard](../../start/turn-jensen-on/#the-guided-wizard).
A project that was never onboarded returns no context rather than empty context, and an assistant is
told to read the code directly and tell you `jensen setup` is available, instead of reporting that
the project has nothing in it.
