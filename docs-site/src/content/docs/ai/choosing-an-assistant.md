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

Any other assistant that speaks the same context-server protocol can be connected by hand with its
equivalent of:

```bash
<assistant> mcp add jensen -- jensen bridge .
```

Jensen still delivers the shared navigation, plan, worktree and learning conventions to that
assistant, even where it has no adapter for that tool's own lifecycle hooks.

## Selection is deliberately conservative

Jensen selects an assistant automatically **only when exactly one is available**. If several are
configured it asks you to choose rather than silently preferring one. And an explicit choice never
falls back to a different provider when its tool is unavailable: it tells you the one you picked is
missing.

That is a decision about trust, not about convenience. Silently switching which model answered would
make every other guarantee harder to reason about.

## Setting the default

In the app, **Settings, AI assistant**. The default is used for new sessions, drafts and reviews.

From a terminal:

```bash
jensen assistant list          # what was discovered, the evidence, and the effective default
jensen assistant set codex     # claude, codex, gemini, antigravity, or automatic
```

## After you change it

One assistant needs a one-time trust review for user-installed command hooks: start Codex and use
`/hooks` to review and trust the Jensen entries. Claude Code and Gemini CLI pick up their updated
settings on the next session.

## Per-project profiles

A project can define reusable profiles that select an assistant, a prompt and a permission allowlist
for a particular kind of work. See
[Agent profiles and workflows](../profiles-and-workflows/).
