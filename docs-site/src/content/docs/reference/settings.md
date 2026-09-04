---
title: Settings reference
description: Every settings section, what it controls, and where to find it.
---

Settings opens from the space switcher, from the command palette, or with the **Settings** command.
There is a search box across every section.

Four groups.

## Workspace

### General

The theme picker, with **Search themes**, plus **Interface size**, **Indent guides**, **Render
whitespace** and **Inline problem messages**.

### Editor

**Code editor**, **Tab size**, **Auto save** and its delay, and a **Settings scope** control so a
preference can apply to one project or to all of them. **Reset all** returns the section to defaults.

### Project settings

**Advanced configuration** opens or creates the project's own configuration files.

**Export to IDE** does the reverse of importing: *preview and merge Jensen's project connection into
VS Code or Kiro.* Pick an **Export target IDE**, **Preview** what would change, then **Export**.

### Import configuration

*Bring useful editor capabilities into Jensen while keeping the original files untouched.* Jensen
detects VS Code and Kiro configuration, you **Review import**, then **Confirm and apply**. **Rollback
Jensen changes** undoes it.

**Jensen checks only standard local locations and does not scan your home directory.**

### Keyboard

Rebind any command. **Reset to default** for one, **Unbind** to remove a binding, **Reset all** to
start over. A command with no binding reads **Unbound**.

### Git

The workflow policy editor:

- **Environment roles** mapped to branches, with **Add environment** and **Remove**.
- The **Branch template**, for example `{type}/{number}-{slug}`.
- The **Feature word** and the **Bug word** used in branch names.
- **Max slug length** and **Push timeout in minutes**.
- The merge rules.
- **Task branches**, which enforces no branches without a worktree.

These are persisted in the project workflow policy and enforced by the git guard, not merely
suggested. See [Agent profiles and workflows](../../ai/profiles-and-workflows/#environments).

## AI

### AI assistant

**Default AI assistant**, used for new sessions, drafts and reviews. **Show API configuration**
reveals the direct-provider setup. See [Models and providers](../../ai/models-and-providers/).

### Project context

The five-document contract, with **Generate with AI**, **Refresh with AI**, **Edit**, **Refresh
preview** and **Apply selected**. See [Project context](../../knowledge/project-context/).

### Knowledge

Store statistics, the **Embedding model** status, **Index documentation**, **Compact**, **Refresh**,
and **Review learning records** with **Review with AI**, **Approve** and **Dismiss**. See
[Memory and knowledge search](../../knowledge/memory-and-search/).

### Agent Hooks

Enable or disable the built-in hooks, create a custom one with **New agent hook**, reset or delete
any of them. **Let agent hooks start assistants** is the separate gate for hooks that open a session
and edit files. See [Agent hooks](../../ai/agent-hooks/).

### Skills

Browse the shared skill store, **Search skills**, filter by provider, **Use skill**, and read each
one's **Trust and audit** block. See [Skills](../../knowledge/skills/).

## Extensions

### LSP

**Language tooling**. Per language and category, language server, linter, formatter, debug adapter,
what is installed against what the catalog offers, with **Install**, **Update**, **Remove**, **Update
catalog** and the install output.

A companion view shows **For this project** what each language actually resolves to, marks the choice
your repository made, and offers **Edit for this project**, **Edit for every project**, **Open
config** and **Ask the assistant**. See [Code](../../app/code/#language-tools).

### Plugins

**Browse plugins**, **Search plugins**, filter by category, **Install**, **Remove**, **Enable**,
**Disable**, a **Private registry URL**, **Refresh plugins** and **Publish**. See
[Plugins and themes](../../extending/plugins-and-themes/).

### Integrations

GitHub, GitLab and Slack. Per host: a credential, **Test connection**, **Verify repository**,
**Credential scope**, **Rotate**, **Revoke**, **Show** and **Hide credential**, **Saved credentials**,
**Saved hosts**, the required scopes, and a **Bug label** term.

Below them, the **Permissions** toggles that gate every outbound write. See
[Trust, approvals and permissions](../../ai/trust-approvals-and-permissions/).

### Mission Control

*Coordinate temporary specialists, bounded schedules, and verified work.* See
[Missions and schedules](../../ai/missions-and-schedules/).

## System

### Security

**Trust workspace** and **Revoke trust** for this workspace, and an **Environment files** control.

### Health

*Checking every part of Jensen.* Runs the same checks as `jensen doctor`, with advice per check,
**Re-check** and **Copy as Markdown**.

### About

The version, **What's new**, and **Privacy**.

### Setup

Reopens the guided setup wizard. See [First run](../../start/first-run/#the-guided-wizard).
