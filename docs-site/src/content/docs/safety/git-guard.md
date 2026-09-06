---
title: The git guard
description: A guard on your project's git hooks that refuses a commit carrying secrets or junk, refuses a push that would discard history, and drafts your commit message.
---

The git guard runs from your project's own git hooks, so it fires on every commit however it was
made, from a terminal, from the editor, from an assistant, or from another tool. Any hook you
already had is chained and still runs.

## What it refuses

- A commit carrying a secret or a junk file.
- A push that would discard commits the remote already has.
- A commit to a branch your project's policy protects.

## When it blocks you

Open the right panel with `Cmd J`, pick **Git**, then **Versioning**. The commit box reads
`Commit blocked` with the number of findings, and lists one row per finding naming the rule and the
file it matched.

Some matches are correct-looking and wrong, a test fixture or a documented example key. **Accept**
on that row clears it. Acceptance is stored as a fingerprint, so that one reviewed match stops
blocking future commits while every other rule stays in force. The fix the guard points at is never
"turn the guard off".

Committing from a shell prints the same refusal:

```console
$ git commit -m "wip"
jensen: commit blocked, staged changes contain secrets or junk:
  env-file in .env (.env)
Remove them, or accept a finding in Jensen. To bypass once: git commit --no-verify
```

## What counts as a secret

Private key blocks, provider secret keys, AWS access keys, Google API keys, Slack tokens,
version-control tokens including fine-grained ones, GitLab tokens, Stripe secret keys, JSON web
tokens, and generic API keys.

## What counts as junk

Dependency directories, `.env` and `.env.*` files, assistant configuration such as `CLAUDE.md` and
`.claude/`, build output directories, key and certificate files including `.pem`, `.key`, `id_rsa`,
`.pfx`, `.p12` and `.keystore`, and operating-system cruft such as `.DS_Store` and `Thumbs.db`.

Blobs over 5 MB are flagged as well.

## A push that would discard history

```console
$ git push
jensen: push blocked, it would discard commits the remote already has:
Reconcile with a pull or a rebase. To bypass once: git push --no-verify
```

## A commit your branch policy forbids

A production branch is protected where the commit is typed, and not later at the provider. A project
with no branch policy is never blocked by this. Set the policy in **Settings, Workspace, Git**. See
[Environments](../../automation/workflows/#environments).

## It drafts your commit message

Commit without supplying a message and the guard writes one into your editor buffer, fully
editable. With no assistant configured, or nothing staged worth describing, git opens exactly as it
normally would.

## Screening before an agent commits

The same rules run in three places, which is deliberate.

1. In an agent run, as a step before the commit.
2. In the guard, on your git hooks, as the backstop for anything that did not come through a run.
3. On demand, as an opt-in agent hook that scans secrets before every commit. See
   [Agent hooks](../../automation/agent-hooks/).

Every blocking finding has to be resolved or accepted before the commit is made, whoever staged it.

## Bypassing once, and removing it

Both refusals honour git's own flag, which makes a bypass a visible act rather than a setting you
forget you changed.

:::tip[From the terminal]
```bash frame="none"
git commit --no-verify
git push --no-verify

jensen setup --only git-shim --only git-hooks --uninstall   # remove the guard entirely
```
:::
