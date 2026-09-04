---
title: Project context
description: The five-document contract that tells every assistant what this project is, how it is built and how work gets done here.
---

Project context is the answer to a question every assistant asks and most of them guess at: what kind
of project is this, and how do people work in it?

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

Kept separately from project memory and from skills, because these are decisions rather than
observations.

## How it gets written

Onboarding seeds an interview. Your assistant asks you each question in its own words, you review the
answers, and the reviewed result is saved. From then on it is versioned: the contract carries a
revision, and a refresh is applied against the revision it was drafted from.

In **Settings, Project context** you can:

- **Generate with AI** or **Refresh with AI** to draft from what Jensen has indexed. *The draft
  remains local and editable. Nothing is saved until you review it.*
- **Edit** any document by hand.
- **Refresh preview** to see evidence-backed suggestions without writing anything.
- **Apply selected** to take only the ones you agree with.

The preview step matters more than it looks. A contract that drifts silently is worse than no
contract, and a contract regenerated wholesale loses the decisions you made deliberately.

## Why it is not just a README

A README is written for a human arriving once. This is read by an assistant at the start of every
session, and it is the thing that stops it inventing a convention that has never been true here.

It also does work a README cannot: because Jensen holds it, an assistant that ignores it can be
corrected by the harness rather than by you noticing in review.

## Onboarding

The full first-run flow, including this, is in [First run](../../start/first-run/#the-guided-wizard).
A project that was never onboarded returns no context rather than empty context, and an assistant is
told to read the code directly and tell you `jensen setup` is available, instead of reporting that
the project has nothing in it.
