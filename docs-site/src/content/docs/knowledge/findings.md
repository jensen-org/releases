---
title: Findings and analysis
description: Detections Jensen derives from the map, how you and your assistant reach them, and the structural read before a review.
---

A finding is something Jensen noticed about the project. It comes from a deterministic detection over
the live map, not a model's opinion.

## What a finding carries

| Attribute | Values |
| --- | --- |
| Category | security, quality, regression, ownership, infra |
| Severity | info, low, medium, high, critical |
| Status | active, superseded, expired |
| Kind | detection, fix, warning, improvement |

## Where you reach them

Findings have no pane of their own. They surface where you already work.

- **Your assistant** lists them with `list_findings`, filtered by category, severity or status.
  Assistants are told to check existing findings before bug or regression work, which is the
  difference between investigating and re-investigating.
- **A review** reports what a change reaches. `jensen review` names who calls the changed symbols,
  what tests cover them, and whether the change crosses a boundary your team confirmed. It is
  advisory and says nothing where the graph does not reach.
- **The commit box** shows secret and junk findings for staged changes. See
  [The git guard](/safety/git-guard/).
- **A hook** can review proactive findings when a file saves. See
  [Agent hooks](/automation/agent-hooks/).

:::tip[From the terminal]
```bash frame="none"
jensen review                       # what a reviewer cannot see in the diff
jensen review --json                # the same findings for a CI job
jensen review --publish 123         # post the review on a merge request
jensen review --publish 123 --dry-run
```
:::

`--publish` needs the **Comment on merge requests** permission, and `--dry-run` checks it and prints
without posting.

## Turn a finding into work

A finding becomes tracked work as an issue. Use **Create issue** from a pipeline, or **Create issue from
selection** and **Create issue from this TODO** in the editor. See [Notes](/app/notes/).

## Quality material

Before a review, an assistant can ask for a structural read of the map: over connected hubs, low
cohesion components, dependency cycles, oversized files and likely copy and paste clones.

That read is evidence, not a verdict. The same holds when Jensen localizes a bug from a report or a
failing job log. It ranks the likely places to look and says the ranking is a lead.

## Check your setup

**Settings, System, Health** reports what is not working in this project's setup: trust, the tools its
languages need, whether it is indexed, and whether an assistant can see it. See
[Troubleshooting](/reference/troubleshooting/).
