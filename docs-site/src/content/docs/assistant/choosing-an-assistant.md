---
title: Choosing an assistant
description: Which assistants Jensen supports, how it picks one, and how to set the default from the app or the command line.
---

Jensen discovers the assistant command-line tools already installed on your machine and registers the
context server with each of them.

## Supported assistants

| Assistant | Configuration directory |
| --- | --- |
| Claude Code | `.claude` |
| Codex | `.codex` |
| Gemini CLI | `.gemini` |
| Antigravity | its own |

## Connecting one Jensen does not know about

Any assistant that speaks the same context-server protocol can be wired by hand. The command behind
the context server is `jensen bridge <path>`, and your assistant launches it for you:

```bash
<assistant> mcp add jensen -- jensen bridge .
```

Jensen still delivers the shared navigation, plan, worktree and learning conventions to that
assistant, even where it has no adapter for that tool's own lifecycle hooks.

## Setting the default

**Settings, AI, AI assistant** shows what Jensen found on this machine and which one is the default.
The default is used for new sessions, drafts and reviews.

:::tip[From the terminal]
```bash frame="none"
jensen assistant list          # what was discovered, the evidence, and the effective default
jensen assistant set codex     # claude, codex, gemini, antigravity, or automatic
```
:::

## How Jensen picks one

Jensen selects an assistant on its own only when exactly one is available. Where several are
configured it asks you. An explicit choice never falls back to a different provider when its tool is
missing, and says so instead.

That is a decision about trust. Silently switching which model answered would make every other
guarantee harder to reason about.

## After you change it

One assistant needs a one-time trust review for user-installed command hooks: start Codex and use
`/hooks` to review and trust the Jensen entries. Claude Code and Gemini CLI pick up their updated
settings on the next session.

## Per-project profiles

A project can define reusable profiles that select an assistant, a prompt and a permission allowlist
for a particular kind of work. See
[Agent profiles and missions](../../automation/profiles-and-missions/).
