---
title: Models and providers
description: How Jensen reaches a model, the three quality tiers you configure, and what a run records about the model that answered.
---

Jensen embeds no model. Beyond driving an assistant's own tool, it can also call a provider directly
for the chat flow and for the work a workflow node does.

## Two flows

| Flow | What it is |
| --- | --- |
| **Assistant** | The default. Your assistant's own command-line tool runs in a session terminal, with Jensen's context server wired into it. |
| **API** | Jensen calls a model directly, which is what gives you the chat pane, canvases and inline answers on the documentation graph. |

Configure this under **Settings, AI, AI assistant**, where **Show API configuration** reveals the second.

## Provider profiles are machine-local

Endpoints and concrete model identifiers never leave the machine and are never committed. Jensen
supports direct profiles for OpenAI, Anthropic and Gemini, and any OpenAI-compatible endpoint through
a LiteLLM profile.

A profile takes its credential from an environment variable you name, or from a vault entry. Nothing
asks you to paste a key into a field that gets stored in the project.

Custom endpoints require HTTPS, with one exception. A loopback LiteLLM URL is allowed, because there
is no network hop to protect.

## Three tiers

You configure three aliases, and never pick a model per action.

| Alias | For |
| --- | --- |
| **Economy** | High-volume, low-stakes work. |
| **Balanced** | The default. |
| **Quality** | Work where being wrong is expensive. |

Each workflow node requests a tier, and your configuration decides what that resolves to. Changing
provider is then one edit, not a sweep through every workflow.

## What a run records

For each call, the run records:

- the **requested tier**,
- the **resolved endpoint and model**,
- **usage**,
- an **estimated cost**,
- the **routing reason**, why that tier resolved to that model.

Resolved credentials are not persisted.

That record is what makes a run auditable afterwards. You can see which model answered and why,
instead of trusting that the tier you asked for is the tier you got.

## Where it shows up

The tier and its resolution appear on the workflow node in the Sessions view, alongside the node's
own status. See [Sessions](../../app/sessions/#the-workflow-canvas) and
[Workflows](../../automation/workflows/).
