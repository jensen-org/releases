---
title: Trust and permissions
description: Which folders Jensen may read, which projects may run their own tools, and which outbound actions you allow.
---

Jensen separates three questions, and answers each with its own control.

| Question | Control | Where |
| --- | --- | --- |
| Which folders may Jensen read and index? | **Scope** | **Settings, System, Security** |
| Which projects may run the hooks, tools and interpreters their repository ships? | **Trusted folders** | **Settings, System, Security** |
| Which outbound actions may Jensen take on your behalf? | **Permissions** | **Settings, Extensions, Integrations** |

Plan approval is separate. Only you can approve a plan, and no agent can do it for you. See
[Plans](/flow/plans/).

## Scope

**Scope** lists the folders Jensen may read and index. Jensen refuses to open a project outside them.
Sandboxes and Jensen's own state are always available.

Use **Add a folder** and **Remove**. With no folder in scope, no project can be opened.

## Trusted folders

Opening a project lets Jensen read it. It does not let Jensen run what the repository ships. That is a
separate decision, because a hook or tool entry decides which program executes.

The first time you open a project, Jensen asks **Trust {name}?** and offers:

- **Trust this project**
- **Trust every project in {parent}**
- **Stay restricted**

Until you trust it, a project is restricted. You can browse and edit it, but it cannot:

- Run hooks, tools or interpreters its repository ships, so formatters, linters and language servers
  stay off.
- Open a terminal.
- Run git hooks on push.
- Run plan acceptance checks.

When something is withheld, Jensen says so and points here, for example "this workspace is not
trusted", with a **Trust this workspace** action in the tool advisor.

Manage the list under **Settings, System, Security, Trusted folders**. A folder is trusted, restricted
or undecided. The deepest folder that covers a project wins, and a tie goes to restricted. A trusted
folder must sit inside the scope, and your home directory is too broad to trust.

## Integration permissions

Every write to GitHub, GitLab or Slack is blocked until you allow it. Open **Settings, Extensions,
Integrations**, pick a provider, and use its **Permissions** card. Each row shows **Allowed** or **Ask
first**, with **Allow** or **Revoke**.

| Group | Permissions |
| --- | --- |
| **Issues** | Create issues, Comment on issues, Change issue labels, Close or reopen issues, Assign yourself to issues, Change issue fields, Schedule work items |
| **Merge requests** | Create merge requests, Comment on merge requests, Approve merge requests |
| **Messaging** | Send Slack messages |

When an action needs a permission you have not given, Jensen asks with **Approve action**. Choose
**Deny** or **Allow**. Allowing saves it, and you can revoke it here at any time.

Several steps of the [one flow](/start/what-is-jensen/#the-one-flow) lean on these. Approving a plan
opens its issue and needs **Create issues**. Landing through a merge request needs **Create merge
requests**. Without a permission the work still happens, and the outbound step waits for you.

**Verify repository** checks the repository a provider points at. **Revoke** removes it.

## Agent hook access

Hooks that start an assistant can open a session and edit files in an isolated worktree, so they need
your say. **Settings, AI, Agent Hooks, Agent hook access** has **Let agent hooks start assistants**,
shown as **Allowed** or **Ask first**. See [Agent hooks](/automation/agent-hooks/).

## Command policy

Jensen decides whether a command may run with one of three answers: allow, ask or deny. The default
is ask. A repository can tighten the policy but never loosen it.

:::tip[From the terminal]
```bash frame="none"
jensen guard git commit
```
Prints `guard: allow`, `deny` or `ask`, and exits 0, 1 or 2. The git guard calls this before a
commit.
:::

No grant is made from the command line. Trust, scope and permissions are set in the app.

## Check where you stand

**Settings, System, Health** reports whether a folder is inside Jensen's scope. `jensen doctor` reports
workspace trust from a terminal.
