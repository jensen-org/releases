---
title: Findings and screening
description: Deterministic detections from the map, the vulnerability scanners, and the screen every change passes before it becomes a commit.
---

Two related things. **Findings** are what Jensen noticed about the project. **Screening** is the check
a specific change passes before it lands.

## Findings

A finding is a deterministic detection derived from the live map, not a model's opinion.

| Attribute | Values |
| --- | --- |
| **Category** | security, quality, regression, ownership, infra |
| **Severity** | info, low, medium, high, critical |
| **Status** | active, superseded, expired |

They appear in the **Findings** panel, which reads **Run an analysis to see findings here** until one
has run, and each finding offers **Create issue** so it becomes tracked work rather than a note.

Assistants are told to check existing findings **before** starting any bug or regression task, which
is usually the difference between investigating and re-investigating.

## Vulnerability scanning

The map carries a vulnerability overlay that runs scanners over your dependencies and code and marks
what they find, with a High, Medium and Low legend, live progress and a **Cancel**.

Jensen does not bundle the scanners. When one is missing the legend offers an **Install** button for
it, and **Re-scan** once it is there. Installing a scanner, like installing any tool, needs a trusted
workspace.

See [Project, the map](../../app/project/#vulnerabilities).

## Screening a change

Before a commit, staged changes are scanned for leaked secrets and junk files. Every blocking finding
has to be resolved, or accepted by you, before the commit is made.

This runs in three places, which is deliberate:

1. **In an agent run**, as a step before the commit node.
2. **In the guard**, on your git hooks, as the backstop for anything that did not come through a run.
3. **On demand**, as an opt-in agent hook that scans secrets before every commit.

See [The git guard](../git-guard/).

## Quality material

Beyond findings, an assistant can request a structural read of the map for a code quality review:
over-connected hubs, low-cohesion components, dependency cycles, oversized files and likely
copy-paste clones.

It is offered as evidence rather than as a verdict. The same rule applies to the localisation of a
bug from a report or a failing job log: Jensen ranks the likely places to look, and says plainly that
it is a lead to investigate.

## Project checks

Separately from findings, **Project checks** in the overview runs the same health checks as the
command line, and reports what is not working in the project's setup: workspace trust, the tools its
languages need, whether it is indexed, and whether an assistant can see it.

```bash
jensen doctor
```

See [Troubleshooting](../../reference/troubleshooting/).
