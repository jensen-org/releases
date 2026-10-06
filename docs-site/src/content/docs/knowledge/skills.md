---
title: Skills
description: Procedures an assistant records once and reuses, how they reach your assistant, and which ones wait for your approval.
---

A skill is a procedure that worked, recorded once so the next session does not work it out again.

## Browse the store

**Settings, AI, Skills** shows the shared skill store: *Discover trusted procedures from the shared
skill store.* Use **Search skills**, switch between all, installed and pending, filter by provider,
and choose **Use skill** on a card.

Sources are `jensen`, `skills_sh` and `github`. Each card shows its name, description, provider and
whether it is installed, cached or available.

Open a card for **Skill details**: **License**, **Trust and audit**, **Content hash**, any findings
and the list of files in the package. You see what you are about to trust. When the catalog is
unreachable, Jensen says **Showing cached results while the catalog is offline**.

## Where skills come from

An assistant that works out something worth keeping stages it as a skill with `skill_stage`. Staged
skills sit in **Artifacts**, under **Staged skills**, in the session pane.

What happens next depends on who wrote it.

- **A normal session.** Its staged skills become project skills when the session retires.
- **A specialist.** Its skills stay inside its scope. After two successful sessions a skill becomes
  ready for your approval, and it never activates on its own. See
  [Specialists](/automation/specialists/).

You can record one yourself:

:::tip[From the terminal]
```bash frame="none"
jensen learn record . --name deploy-preview --description "Ship a preview environment"
jensen learn list .
jensen learn search . "preview"
jensen learn use . deploy-preview
```
:::

`record` also takes `--version`, `--tag`, `--body-file` and `--ref <name>=<path>`.

## Why a skill is not an install

A skill will be replayed, so a mistake in one becomes a habit. A skill's script runs only with explicit
permission, and only along a path confined to that skill's own package. Approving a skill as
documentation never lets it run arbitrary code.

## How an assistant finds them

Before the first edit, Jensen nudges the assistant to check `skill_list`. A search hit that is a skill
tells it how to open it, and `skill_use` delivers the whole package. Use is recorded, so a skill nobody
uses shows up as unused. See the [Assistant tool reference](/reference/assistant-tools/).

## Skills, memory and context

Three different things, kept apart on purpose.

| | Holds | Answers |
| --- | --- | --- |
| [Project context](/knowledge/project-context/) | Decisions | How work is done here |
| [Memory](/knowledge/memory-and-search/) | Facts | What is true about this project |
| Skills | Procedures | How to do this specific thing |

One query searches all three, so an assistant need not know which holds the answer.
