---
title: Work
description: Issues, merge requests and pipelines from GitHub and GitLab, with Slack, in the same workspace as the code.
---

The Work view puts your tracker next to your code, so an issue becomes something you can start rather
than something you have to go and read somewhere else.

With no project open it reads **Track issues and pipelines**.

## The dashboard

A repository tab strip sits across the top: **All**, then one tab per repository root in the
workspace. Below it are three cards you can rearrange and resize:

| Card | Empty state |
| --- | --- |
| **Assigned issues** | Nothing assigned |
| **Merge requests** | No open merge requests |
| **Pipelines** | No pipeline runs |

With nothing connected at all, the cards say **No repository is connected yet** and offer **Open
integration settings** or **Verify repository**.

An **On this branch** filter narrows everything to the branch you are on.

## Issues

**New issue** opens one from scratch, **From plan** when a plan should become tracked work, or **From
finding** when something the map detected deserves an issue.

The issue inspector carries the description, the comment thread (**No comments yet**), and the
scheduling fields: **Milestone**, **Priority**, **Target date** and iteration. From it you can:

- **Start work**, which sets up the session and worktree for it.
- **Assign to me** or **Unassign**.
- **Comment** and **Send**.
- **Close issue** or **Reopen**.
- **Edit labels**.
- **Open on provider**, to go to GitHub or GitLab itself.

Approving a plan opens and links its tracking issue for you, assigns it, and closes it when the plan
is done. See [Plans and objectives](../../ai/plans-and-objectives/).

## Merge requests

The card lists what is open. **AI review** hands a merge request to your assistant for an independent
read, and **Share to Slack** posts it to a channel.

## Pipelines

Recent runs, with their jobs and logs. A failed run offers **Fix with AI**, which opens a session
pointed at the failure and its log rather than at a blank prompt.

## Every write is behind a permission

Reading your tracker is not gated. Writing to it always is. An action you have not enabled shows a
link to the exact permission that unblocks it, such as **Open comment permission** or **Open Slack
permission**, and a blocked action raises an **Allow this integration action?** approval.

This applies whether you clicked the button or your assistant did. See
[Trust, approvals and permissions](../../ai/trust-approvals-and-permissions/).

## Connecting GitHub, GitLab and Slack

Connections are configured in **Settings, Integrations**. For each host you store a credential, a
personal access token for GitHub or GitLab, a bot user OAuth token for Slack, then:

- **Test connection** confirms the credential works.
- **Verify repository** checks access to a specific `namespace/repository`.
- **Credential scope** decides who may use it: **This workspace** only, or the **Entire host**, where
  every workspace connected to that host can use it.
- **Rotate** and **Revoke** manage it afterwards, and **Saved credentials** and **Saved hosts** show
  what is already stored.

A **Bug label** term tells Jensen which of your labels mean "bug": *labels containing this term are
treated as bugs*.

Credentials are stored on the machine. See
[License and security](../../about/license-and-security/) for the security posture, including what
that protects against and what it does not.
