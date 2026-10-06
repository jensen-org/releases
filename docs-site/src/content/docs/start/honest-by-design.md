---
title: Honest by design
description: Jensen never guesses. Everything on the map was observed in your source or confirmed by you, and anything unknown is marked unknown.
---

You can only lean on a map you trust. So Jensen's core rule is: never guess.

## The rule

Everything Jensen shows is one of two things:

1. **Observed.** Read from your source.
2. **Confirmed.** Proposed by an assistant, then approved by you.

Nothing else gets in. Each fact carries its evidence, so you can always ask where it came from. What
Jensen does not know is marked unknown until someone says otherwise.

## Why it matters

When the map says two services connect, they do. A human can rely on that. An assistant can build on
it without inheriting a made-up architecture, the failure that makes AI expensive on large codebases.

## What this rules out

- Drawing an edge because two services have similar names.
- Naming an owner it cannot evidence.
- Describing a route it did not find.
- Presenting an assistant's inference as fact.

## Where your confirmation fits

Some structure no tool can read from source, such as how services group into layers. An assistant may
propose it. Jensen stores the proposal as inferred and keeps it off the map until you confirm. An
assistant cannot confirm its own inference.

To review a proposal, open **Overview** and choose **Review and confirm** on the **Architecture**
card. See [Project graph](/app/project-graph/).
