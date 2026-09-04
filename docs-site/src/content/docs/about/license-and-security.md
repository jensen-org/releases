---
title: License and security
description: Jensen is source-available, not open source. What the license permits, how to report a vulnerability, and the security posture in plain terms.
---

## License

Jensen is source-available under the
[PolyForm Noncommercial License 1.0.0](https://polyformproject.org/licenses/noncommercial/1.0.0).

You may use, modify and redistribute Jensen for permitted **noncommercial** purposes.

Commercial use, resale, paid redistribution, hosted offerings, or bundling Jensen into a paid product
requires a **separate written license** from the copyright holder.

**This is not an open-source license.** All commercial rights not expressly granted remain reserved.
If you are unsure which side of the line your use falls on, ask before you deploy rather than after.

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability. Report it privately through the security
policy on the [repository](https://github.com/jensen-org/releases).

## Security posture

Jensen is candid about what its protections do and do not cover. Four things are worth knowing before
you rely on any of them.

### Credentials are machine-bound, not user-bound

Integration credentials are encrypted on the machine they are stored on. That protects a credential
file copied off the machine. It does not separate one user account on that machine from another.

### Workspace trust is coarse

Trusting a workspace is one decision, not a set of them. Trusting a workspace to run its development
server also trusts it to run its git hooks on push. There is no finer split today. Trust
repositories you would already be willing to run.

### Installed tooling is third-party code

Jensen bundles no language server, formatter, linter, debugger or vulnerability scanner. It installs
what you ask it to from a public catalog and runs it. Those programs are not Jensen's code, and
running them is running someone else's software with your project's contents in front of it.

This is why a project's own tool manifest is only read once you trust the workspace: a tool entry
decides which program gets executed.

### Jensen runs your login shell at startup

So that the commands it launches see the environment you expect.

## What Jensen does not send anywhere

- **The map, the knowledge store and search are local.** Semantic ranking downloads a small embedding
  model once, and falls back to lexical search with no loss of availability when there is no network.
- **Provider endpoints and model identifiers are machine-local.** They are not committed to the
  project.
- **Resolved credentials are not persisted** in a workflow run's record, which stores the tier, the
  endpoint, the model, usage, an estimated cost and the routing reason.
- **Custom provider endpoints require HTTPS**, except a loopback URL, where there is no network hop
  to protect.

## Related

- [Trust, approvals and permissions](../../ai/trust-approvals-and-permissions/), for the three gates
  and what each one stops.
- [The git guard](../../safety/git-guard/), for what is refused before it reaches your history.
- [Plugins and themes](../../extending/plugins-and-themes/), for what an installed plugin can and
  cannot reach.
