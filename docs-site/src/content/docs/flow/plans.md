---
title: Plans
description: Every change starts as a plan. What a plan contains, where it lives, how you review it, and how its status moves.
---

A plan is the hand-off between the agent that designed a change and whoever builds it. In Jensen the
format is a contract, so you can scan it and another agent can parse it.

Plans are the first step of the [one flow](/start/what-is-jensen/#the-one-flow). Nothing gets built
until you approve one. See [Approval and task branches](/flow/approval-and-task-branches/).

## Where a plan lives

Your assistant writes it to `.jensen/plans/<id>.md`. The id is a short slug of the plan's intent, such
as `rate-limit-public-api`. It opens beside the session that wrote it. You can also open it from
**Active work** in the Overview pane.

If your assistant's own tooling forces the plan elsewhere, Jensen offers **Adopt into Jensen's
format**.

## What a plan contains

Sections come in a fixed order.

| Section | What it holds |
| --- | --- |
| **What I understood** | The intent, outcome and constraints in the agent's words. You see it understood the ask before it proposes anything. |
| **Changes** | One item per change, with **Fix**, **Guard** and **Files**. A bug fix adds **Cause**. |
| **Risks & mitigations** | What could break and what catches it. Jensen adds a **Blast radius** from the code graph. |
| **Steps** | The ordered work, as checkboxes. |
| **Acceptance criteria** | Commands that must pass, not sentences. |
| **Verification** | How to prove the change works end to end. |
| **Deviations & findings** | Added while the work runs. See below. |

Each change names its **Guard**, the test or check that fails if the problem returns. A plan that
fixes a bug names the **Cause**, not only the symptom.

The header holds machine fields too: `status`, `risk`, `scope`, and `verifications`, the commands
Jensen runs before it lets the plan reach done. A plan with no verification cannot be marked done.

### Highlights

Agents mark what you should notice. A highlighted span can carry a note, and a color for what kind:
gold for a decision to weigh, coral for a risk, green for a gain, blue for context. Hover a highlight
to read its note.

## Review a plan

Read the plan, then act on it.

- **Comment.** Select text, choose **Comment**, then **Add comment**.
- **Request changes.** Sends your comments back to the agent while its session runs. The button
  reads **Send N comments** once you have queued some.
- **Approve.** Starts the work.
- **Run all** runs the acceptance commands.
- **Steps** are checkboxes. The agent ticks them as work lands.

Agents can leave **Messages** on a plan. You **Acknowledge** or **Reply**.

## Status

| Status | Set by |
| --- | --- |
| **Draft** | The agent, when it writes the plan. |
| **Approved** | You. No agent can set this. |
| **In progress** | Jensen, the first time a change is recorded against the plan. |
| **Done** | The agent, when the work lands and its verifications pass. |
| **Blocked** | The agent, when it cannot continue. |

A plan left below done reads as unfinished, so agents mark it done the moment the work lands. If an
implemented plan is still open, a banner reads "This plan looks implemented" with **Mark done** and
**Hide**.

## When reality differs from the plan

Agents record a departure rather than drift: a decision that supersedes the plan, a serious
bug found outside its scope, or a blocker. Each lands in **Deviations & findings** and posts to the
plan's issue, so the record outlives the plan file. A plan that went as approved posts nothing extra.

## Plans and issues

Approving a plan opens its tracking issue. Work that is not a plan gets an issue created on its own,
such as a bug found in passing. See [Notes](/app/notes/).

:::tip[From the terminal]
```bash frame="none"
jensen plan list
jensen plan open <id>
```
:::
