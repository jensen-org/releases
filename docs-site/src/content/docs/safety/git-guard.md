---
title: The git guard
description: A guard on your git hooks that refuses a commit carrying secrets or junk, refuses a push that would discard history, and drafts your commit message.
---

The git guard runs from your project's own git hooks, so it fires on **every commit however it was
made**: from a terminal, from an editor, from an assistant, or from another tool.

Any hook you already had is chained and still runs.

## What it refuses

### A commit carrying a secret or junk

```console
$ git commit -m "wip"
jensen: commit blocked, staged changes contain secrets or junk:
  env-file in .env (.env)
Remove them, or accept a finding in Jensen. To bypass once: git commit --no-verify
```

It recognises two families.

**Secrets:** private key blocks, provider secret keys, AWS access keys, Google API keys, Slack
tokens, version-control tokens including fine-grained ones, GitLab tokens, Stripe secret keys, JSON
web tokens, and generic API keys.

**Junk:** dependency directories, `.env` and `.env.*` files, assistant configuration such as
`CLAUDE.md` and `.claude/`, build output directories, key and certificate files including `.pem`,
`.key`, `id_rsa`, `.pfx`, `.p12` and `.keystore`, and operating-system cruft such as `.DS_Store` and
`Thumbs.db`.

Blobs over 5 MB are flagged as well.

### A push that would discard history

```console
$ git push
jensen: push blocked, it would discard commits the remote already has:
Reconcile with a pull or a rebase. To bypass once: git push --no-verify
```

### A commit your branch policy forbids

A production branch is protected **where the commit is typed**, not later at the provider. A project
with no branch policy is never blocked by this. The policy is set in **Settings, Git**. See
[Agent profiles and workflows](../../ai/profiles-and-workflows/#environments).

## What it adds

The guard is not only a refusal. When you commit without supplying a message, it **drafts one into
your editor buffer**, fully editable. If no assistant is configured, or nothing staged is worth
describing, git opens exactly as it normally would.

## Accepting a finding

Some matches are correct-looking and wrong: a test fixture, a documented example key. The block
message points at the fix, and it is not "turn the guard off".

**Accept** the finding in the commit box of the **Versioning** panel, under Git in the right panel.
Acceptance is stored as a fingerprint baseline, so that reviewed match stops blocking future commits
while everything else still does.

Teams can also tighten the rules with a project ruleset.

## Bypassing once

Both refusals honour git's own flag:

```bash
git commit --no-verify
git push --no-verify
```

It is a deliberate, visible act rather than a setting you forget you changed.

## Removing it

```bash
jensen setup --only git-shim --only git-hooks --uninstall
```

That removes the guard and unwires this project's hooks from it.

## Before an agent commits

An agent run screens its staged changes through the same rules before it commits, and every blocking
finding has to be resolved, or accepted by you, first. The guard is the backstop, not the only check.
See [Findings and screening](../findings-and-screening/).
