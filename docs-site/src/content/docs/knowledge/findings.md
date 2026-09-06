---
title: Findings and analysis
description: Deterministic detections from the live map, the vulnerability overlay, and the structural read an assistant can ask for before a review.
---

A finding is something Jensen noticed about the project. It is a deterministic detection derived
from the live map, and not a model's opinion.

## Where findings appear

Open the right panel with `Cmd J` and pick **Findings**. Until an analysis has run it reads
**Run an analysis to see findings here**.

Each finding carries three attributes and offers **Create issue**, so it becomes tracked work
instead of a note.

| Attribute | Values |
| --- | --- |
| Category | security, quality, regression, ownership, infra |
| Severity | info, low, medium, high, critical |
| Status | active, superseded, expired |

Assistants are told to check existing findings before starting any bug or regression work, which is
the difference between investigating and re-investigating.

## Vulnerability scanning

The map carries a vulnerability overlay that runs scanners over your dependencies and code, with a
High, Medium and Low legend, live progress and a **Cancel**.

Jensen bundles no scanners. Where one is missing the legend offers **Install** for it, and
**Re-scan** once it is there. Installing a scanner needs a trusted workspace, like installing any
tool. See [Vulnerabilities](../../app/project/#vulnerabilities).

## Quality material

An assistant can ask for a structural read of the map before a code review: over-connected hubs,
low-cohesion components, dependency cycles, oversized files and likely copy-paste clones.

That read is evidence, not a verdict. The same holds when Jensen localises a bug from a report or a
failing job log. It ranks the likely places to look and says plainly that the ranking is a lead.

## Screening a change

Secrets and junk in a staged change are handled by the guard, which runs on your git hooks and in
every agent run. See [The git guard](../../safety/git-guard/).

## Project checks

**Project checks** in the project overview reports what is not working in this project's setup:
workspace trust, the tools its languages need, whether it is indexed, and whether an assistant can
see it. See [Troubleshooting](../../reference/troubleshooting/).
