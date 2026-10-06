---
title: Choosing an assistant
description: Which assistants and runtimes Jensen supports, how it picks one, and how to set the default from the app or the command line.
---

Jensen finds the assistant command line tools installed on your machine and registers its context
server with each.

## Supported assistants

| Assistant | Wired by `jensen setup` | Inside the app |
| --- | --- | --- |
| Claude Code | Hooks and context server | Yes |
| Codex | Hooks and context server | Yes |
| Gemini CLI | Hooks and context server | Yes |
| Antigravity | Stop hook | No |
| Hermes | None | Yes |
| OpenCode | None | Yes |

**Wired** means setup registers the context server and each assistant's session hooks. **Inside the
app** means you can start it from a session.

## Runtimes

A runtime is a coding agent Jensen can drive. Open **Settings, AI, AI assistant, Runtimes** to see
each one with a tag: **Built in**, **Ready**, **Not installed**, **Needs an upgrade**, **Needs
approval**, **Not supported** or **Invalid**.

**Add runtime** brings in another agent that speaks the Agent Client Protocol. Pick one from the
**ACP registry**, or choose **Custom**, or **Import YAML**.

## Connect one Jensen does not know

Any assistant that speaks the context server protocol can be wired by hand. Your assistant launches
`jensen bridge <path>` for you:

```bash
<assistant> mcp add jensen -- jensen bridge .
```

It still receives the project rules and tools, even without an adapter for its own hooks.

## Set the default

**Settings, AI, AI assistant, Assistant** sets the default. New sessions, drafts and reviews use it.

:::tip[From the terminal]
```bash frame="none"
jensen assistant list          # what was found, and the effective default
jensen assistant set codex     # automatic, claude, codex, gemini, hermes or antigravity
```
:::

## How Jensen picks

Jensen picks for you only when one assistant is available. With several it asks. An explicit
choice never falls back to another provider when its tool is missing. It says so.

That is a trust decision. Switching which model answered without telling you would undermine every
other guarantee.

## After you change it

Codex needs a one-time trust review for user-installed command hooks. Start Codex and use `/hooks` to
review and trust the Jensen entries. Claude Code and Gemini CLI read new settings on their next
session.

## Specialists

A specialist is a narrower agent for a scoped job. See
[Specialists](/automation/specialists/).
