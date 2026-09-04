---
title: Honest by design
description: Jensen never guesses. Everything on the map was observed in your source or declared by your team, and where it does not know, it says unknown.
---

A map is only worth leaning on if you can trust every line of it. Jensen's core rule is that it never
guesses.

## The rule

Everything Jensen shows you is one of two things:

1. **Observed.** Something it read directly in your source.
2. **Declared.** Something your team asserted on purpose.

Nothing is inferred. Nothing is filled in to look complete. The two kinds stay distinguishable, each
carrying the evidence behind it, so you can always ask where a line came from. Where Jensen does not
know, it says unknown rather than inventing an answer.

## Why it matters twice

That single guarantee is what makes the map safe for a human to rely on and safe for an AI to build
on.

When the map says two services are connected, they are. When it stays silent, that silence is honest,
not a gap papered over with a plausible guess. An assistant reading a map that never guesses cannot
inherit a hallucinated architecture from it, which is the failure mode that makes AI assistants
expensive on large codebases.

## What this rules out

- Jensen will not draw an edge because two services have similar names.
- It will not name an owner it cannot evidence.
- It will not describe a route it did not find.
- It will not present an assistant's inference as fact. When an assistant proposes an architecture,
  Jensen stores it as inferred and shows it to you for confirmation. It never enters the map until
  you confirm it, and an assistant is not allowed to confirm its own inference on your behalf.

## Where declaring fits

Some structure genuinely cannot be read out of any single repository: which services exist across
your estate, how they connect, over what protocol. That is what declaration is for. You state it, and
Jensen folds it into the same picture, still labelled as declared rather than observed.

See [Declaring topology](../../app/project/#declaring-topology).

## The same property in the files

The map is written out as portable files that live alongside your code. Two properties make them
dependable:

- **Git friendly.** The map lives in version control next to the code it describes, and its changes
  show up in review.
- **Deterministic.** The same codebase always produces the same map, so diffs stay clean and a change
  in the map means a real change in the code.
