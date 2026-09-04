---
title: Skills
description: Evidence-backed procedures an assistant records once and reuses, held pending your approval before any of them can run.
---

A skill is a procedure that worked: how something is done in this project, recorded once so the next
session does not derive it again from scratch.

## Where skills come from

Two routes.

**You record one**, from the command line:

```bash
jensen learn record . --name deploy-preview --description "Ship a preview environment"
jensen learn list .
jensen learn view . deploy-preview
jensen learn search . preview
jensen learn use . deploy-preview
```

A recorded skill can carry a version, tags, a body file and named reference files.

**An assistant stages one.** When an assistant works something out that is worth keeping, it stages
the skill as **pending human approval**. It does not become usable by writing itself into the store.

## Approval is the whole point

A skill is a procedure that will be replayed, so an unreviewed one is a way for a mistake to become a
convention. Nothing an assistant stages is available until you approve it.

Beyond that, a skill's script is only executed with **explicit permission**, and only along a path
confined to that skill's own package. A skill cannot become a way to run arbitrary code by being
approved as documentation.

## Using them

**Settings, Skills** browses the shared skill store, described there as *discover trusted procedures
from the shared skill store*, with **Search skills**, a filter by provider, and **Use skill**.

Every skill carries a **Trust and audit** block showing its **License**, its **Content hash**, and
the list of files in the package, so you can see exactly what you are about to trust. If the catalog
is unreachable it says so and serves what it has: *showing cached results while the catalog is
offline.*

## How an assistant reaches them

Through the context server, an assistant can search approved skills, list them, deliver a complete
approved skill package and record that it used one, and read an archived reference file belonging to
one. Usage is recorded, so a skill that never gets used is visible as such.

See [What your assistant can do](../../ai/what-your-assistant-can-do/#skills-and-hooks).

## Skills, memory and context

Three different things, kept separate on purpose:

| | Holds | Answers |
| --- | --- | --- |
| [Project context](../project-context/) | Decisions | How work is done here |
| [Memory](../memory-and-search/) | Facts | What is true about this project |
| Skills | Procedures | How to do this specific thing |

All three are searched by the same query, so an assistant does not have to know which one holds the
answer.
