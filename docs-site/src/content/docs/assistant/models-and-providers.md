---
title: Models and providers
description: How Jensen reaches a model directly, how sources and roles work, and where credentials live.
---

Jensen embeds no model. Besides driving your assistant's own tool, it can call a provider itself for
chat and for the work a workflow node does.

## Two modes

| Mode | What it is |
| --- | --- |
| **Assistant** | The default. Your assistant's own command line tool runs in a session, with Jensen's context server wired in. |
| **API** | Jensen calls a model itself, for its own chat, background work and workflow nodes. |

Open **Settings, AI, AI assistant** and turn on **API mode** to reveal the second. API mode does not
replace sign in for your external assistant.

## Sources

A source is a provider you can call. Choose **Add source** and pick a **Kind**: **Anthropic**,
**OpenAI**, **Gemini** or **Gateway**, for any OpenAI compatible endpoint, including LiteLLM.

Each source takes a **Name**, a **Base URL** (needed for a gateway), an optional **Model listing path**,
and a **Default model**, which is what **Test** sends and what the source falls back to.

Per source you can **Refresh models**, **Test**, **Make default**, turn it off, or delete it.

Custom endpoints need HTTPS. A loopback address may use HTTP, because there is no network hop to
protect. A gateway also asks how it authenticates: **x-api-key** or **Authorization Bearer**. You can
store a separate listing key that may only read the gateway's model list.

## Credentials

Choose **Stored key** or **Environment variable**.

- **Stored key** lives in your OS keychain, one item per secret, readable only by Jensen's
  background service. macOS asks once. Choose Always Allow.
- **Environment variable** names a variable Jensen reads. Nothing is stored.

Endpoints and keys stay on your machine and never enter the project.

## Roles

A workflow node asks for a role, not a model. Under **Workflow roles** assign a model to each role:

**planner**, **coder**, **documenter**, **reviewer** and **fast**.

Leave a role on Auto and Jensen picks a model by capability. Changing provider is then one edit, not a
sweep through every workflow.

## The catalogue

**Catalogue** lists every model your sources report, with its context size and capabilities: **tools**,
**streaming**, **vision**, **reasoning**, **json mode** and **caching**. Filter by capability to find
what fits.

## File edits

**Behaviour, File edits** is off by default and remembered per project. Turn it on and the assistant
can edit files in the project. You review each result as a git diff.

## What a run records

For every call a run records the requested role, the resolved endpoint and model, usage, an estimated
cost and why that model was chosen. Resolved credentials are never saved. You can see which model
answered, and why, instead of trusting that you got the one you asked for.

See [Workflows](/flow/workflows/).
