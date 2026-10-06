---
title: Settings reference
description: Every settings section, what it controls, and where to find it.
---

Open Settings with `Cmd ,`, from the command palette, or from the sidebar. A **Search settings** box
covers every section.

There are four groups.

## Workspace

### General

**Appearance** holds **Theme**, with search, plus **Interface size**, **Indent guides**, **Inline
problem messages** and **Render whitespace**.

The editor controls sit here too: **Code editor**, **Tab size**, **Insert spaces**, **Format on
save**, **Trim trailing whitespace**, **Insert final newline** and **Auto save**. A **Settings scope**
control lets a preference apply to one project or to all. **Reset all** returns the section to
defaults.

### Project settings

**Advanced configuration** opens or creates the project's own configuration files.

**Export to IDE** previews and merges Jensen's project connection into VS Code or Kiro. Pick an
**Export target IDE**, **Preview**, then **Export**.

### Import configuration

*Bring useful editor capabilities into Jensen while keeping the original files untouched.* Jensen
detects VS Code and Kiro configuration. **Review import**, then **Confirm and apply**. **Rollback
Jensen changes** undoes it. Jensen checks only standard local locations and never scans your home
directory.

### Keyboard

Rebind any command. The default map is in [Getting around](/app/getting-around/#the-keyboard-map).
**Reset to default** restores one, **Unbind** removes one, **Reset all** starts over. A command with no
binding reads **Unbound**.

### Git

- **Branch naming:** **Branch template** such as `{type}/{number}-{slug}`, **Feature word**, **Bug
  word** and **Max slug length**.
- **Workflow rules:** an accordion for **Production**, **Staging**, **Development** and **Task
  branches**. Each has a **Branch name**, rule chips from **Add rule**, and **Save**. See
  [Branch policy](/flow/branch-policy/).
- **Push timeout**.
- **Leftover branches:** a table with **Delete**.

## AI

### AI assistant

- **Assistant:** the default for new sessions, drafts and reviews.
- **Worktrees:** **Jensen folder (.jensen/worktrees)** or **Claude folder (.claude/worktrees)**. See
  [Worktrees](/safety/worktrees/).
- **Runtimes:** the coding agents Jensen can drive, with **Add runtime**. See
  [Choosing an assistant](/assistant/choosing-an-assistant/).
- **API mode:** a switch that reveals direct provider setup: **Sources**, **Assistant**, **Workflow
  roles**, **Catalogue** and **Behaviour**. See [Models and providers](/assistant/models-and-providers/).

### Project context

The five document contract, with **Generate with AI**, **Refresh with AI**, **Edit**, **Refresh
preview** and **Apply selected**. See [Project context](/knowledge/project-context/).

### Knowledge

Store statistics, the **Embedding model**, **Refresh**, **Compact**, **Documentation sources** with
**Index documentation**, and **Review learning records** with **Review with AI**, **Approve** and
**Dismiss**. See [Memory and knowledge search](/knowledge/memory-and-search/).

### Agent Hooks

The built-in hooks, **New agent hook**, and **Let agent hooks start assistants**. See
[Agent hooks](/automation/agent-hooks/).

### Skills

Browse the shared skill store. See [Skills](/knowledge/skills/).

## Extensions

### LSP

**Language tooling**: per language, the server, linter, formatter and debug adapter, what is installed
against what the catalog offers, with **Install**, **Update**, **Remove** and **Update catalog**. A
second view shows **For this project** what each language resolves to, with **Edit for this project**
and **Edit for every project**. See [Code](/app/code/#language-tooling).

### Plugins

**Enable community plugins**, **Browse plugins**, **Private registry URL**, **Install from a GitHub
release** and **Publish**. See [Plugins and themes](/extending/plugins-and-themes/).

### Integrations

GitHub, GitLab and Slack. Each has a credential, **Test connection**, **Verify repository**, a
credential scope, **Revoke**, saved credentials and hosts, and a **Bug label** term. Below each sits
**Permissions**, which gates every outbound write. See
[Trust and permissions](/safety/trust-and-permissions/).

Plugins can add sections to this group.

## System

### Security

- **Scope:** the folders Jensen may read and index. **Add a folder**, **Remove**.
- **Trusted folders:** where projects may run what their repository ships.
- **Environment files:** **Hide values**, **Hide page** or **Show**.
- **Diagnostic logs:** **Open logs folder**. Kept three days, never sent anywhere.
- **Record usage events** and **Open links in your browser**.

### Health

*Checking every part of Jensen.* The same checks as `jensen doctor`, with advice per check, **Re-check**
and **Copy as Markdown**.

### About

The version, **What's new** and **Privacy**.

### Setup

Closes Settings and reopens the guided setup. See [Turn Jensen on](/start/turn-jensen-on/).
