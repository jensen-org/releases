---
title: The git guard
description: Three layers that protect your history. Hooks for everyone, an agent check before each write, and a git level refusal of branch moves and deletions.
---

The guard protects your history in three layers. The first applies to everyone. The other two apply
to agents only.

## Layer 1: git hooks, for everyone

The guard runs from your project's own git hooks, so it fires on every commit however it was made:
terminal, editor, assistant or another tool. Hooks you already had are chained and still run.

It refuses:

- A commit carrying a secret or a junk file.
- A push that would discard commits the remote already has.
- A commit to a branch your [branch policy](/flow/branch-policy/) protects.

### When it blocks you

Open **Source control** in the repository. The commit box reads **Commit blocked** with the number of
findings and lists one row per finding, naming the rule and the file.

Some matches look right and are wrong, such as a test fixture or a documented example key. **Accept**
on that row clears it. Acceptance is stored as a fingerprint, so that one reviewed match stops
blocking and every other rule stays in force. The fix is never to turn the guard off.

A shell prints the same refusal:

```console
$ git commit -m "wip"
jensen: commit blocked, staged changes contain secrets or junk:
  env-file in .env (.env)
Remove them, or accept a finding in Jensen. To bypass once: git commit --no-verify
```

### What counts as a secret

Private key blocks, provider secret keys, AWS access keys, Google API keys, Slack tokens, version
control tokens including fine grained ones, GitLab tokens, Stripe secret keys, JSON web tokens, and
generic API keys.

### What counts as junk

Dependency directories, `.env` and `.env.*` files, assistant configuration such as `CLAUDE.md` and
`.claude/`, build output directories, key and certificate files including `.pem`, `.key`, `id_rsa`,
`.pfx`, `.p12` and `.keystore`, and operating system leftovers such as `.DS_Store` and `Thumbs.db`.

Blobs over 5 MB are flagged too.

### A push that would discard history

```console
$ git push
jensen: push blocked, it would discard commits the remote already has:
Reconcile with a pull or a rebase. To bypass once: git push --no-verify
```

### Your commit message

Commit with no message and the guard drafts one into your editor, ready to edit. With no assistant
configured, or nothing worth describing staged, git opens as usual.

## Layer 2: checks before an agent writes

Before an agent edits a file or runs a shell command, Jensen checks where it is working. It refuses
when the target is:

- A protected branch, or any branch your policy ties to an environment.
- Outside the session's own checkout.

The refusal says where to work instead. Jensen reads through wrappers such as `env`, `sudo` and
`bash -c`, and through `git -C`, `GIT_DIR` and combined flags, so a disguised command is judged by what
it does.

Agents also cannot delete, move or disable:

- A **branch**, for example `git branch -d`.
- A **worktree**, for example `git worktree remove`.
- **The git guard**, by overriding `core.hooksPath` with `-c`, `git config` or environment variables.

Jensen also refuses runtime worktrees. If an assistant or a subagent tries to create its own, Jensen
says it provisions every checkout itself. See [Worktrees](/safety/worktrees/).

## Layer 3: git refuses at the reference

The last layer sits inside git. When an agent's command would move an environment branch, or delete
any branch, git refuses at the reference transaction, however the command was spelled. Jensen detects
that the caller is an agent from the process that started it.

Your own commands are not affected, and neither are agent commits on its task branch.

## Screening before a commit

The secret and junk rules run in three places.

1. In an agent run, as a step before the commit.
2. In the guard, on your git hooks, as the backstop.
3. On demand, as an opt in agent hook that scans for secrets before every commit. See
   [Agent hooks](/automation/agent-hooks/).

Every blocking finding must be resolved or accepted before the commit lands, whoever staged it.

## Bypass once, or remove it

Layer 1 honors git's own flag, so a bypass is a visible act rather than a setting you forget. Layers
2 and 3 stop agents and do not honor it.

:::tip[From the terminal]
```bash frame="none"
git commit --no-verify
git push --no-verify

jensen setup --only git-shim --only git-hooks --uninstall   # remove the guard
```
:::
