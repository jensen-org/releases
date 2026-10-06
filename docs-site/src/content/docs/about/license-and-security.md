---
title: License and security
description: Jensen is proprietary and free to use, including at work. What the license permits, how to report a vulnerability, and the security posture in plain terms.
---

## License

Jensen is proprietary software under the
[Jensen End User License Agreement 1.0](https://github.com/jensen-org/releases/blob/main/LICENSE.md).
It is free to download and use, on as many machines and for as many people in your organization as you
like. The source is not published.

This table is a summary. The agreement governs.

| You can | You cannot |
| --- | --- |
| Use Jensen at work, on client engagements, and for personal, educational and research work | Sell, resell, rent, lease or sublicense Jensen itself |
| Build, ship and sell software made with Jensen, with no charge and no share of what you earn | Redistribute it, or bundle it inside another product you distribute |
| Configure it, and modify it as far as your own permitted use needs | Run it as a hosted or managed service for other people |
| Write, publish and sell your own Jensen plugins, under the MIT licensed plugin kits | Publish a modified version, or build a product that competes with Jensen |

**This is not an open source license.** All rights not granted stay reserved. For a distribution,
reseller or hosting license, open a
[licensing issue](https://github.com/jensen-org/releases/issues/new?template=licensing.yml).

## Report a vulnerability

Do not open a public issue for a suspected vulnerability. Report it privately through the security
policy on the [repository](https://github.com/jensen-org/releases).

## Security posture

Know these before you rely on any protection here.

### Credentials are as safe as your keychain

Each credential is its own item in your operating system keychain, under the service `dev.jensen`.
Only Jensen's background service reads it, after you choose **Always Allow** once. Anything the
keychain trusts, or anything running as you once the keychain is unlocked, can ask for it. Treat any
credential you store as recoverable by software you run.

### Trust is per folder

You trust a folder, and every project under it may run the hooks, tools and interpreters its
repository ships. Trust is one decision per folder, not a set of them. Trust repositories you would
already be willing to run. See [Trust and permissions](/safety/trust-and-permissions/).

### Installed tooling is third party code

Jensen bundles no language server, formatter, linter, debugger or scanner. It installs what you ask
for from a public catalog and runs it. Those programs are not Jensen's code, and running them is
running someone else's software with your project in front of it.

That is why a project's own tool manifest is read only once you trust it: a tool entry decides which
program runs.

### Jensen runs your login shell at startup

So the commands it launches see the environment you expect.

## What Jensen does not send anywhere

- **The map, knowledge store and search are local.** Semantic ranking downloads a small embedding
  model once. With no network, search falls back to lexical.
- **Provider endpoints and model identifiers stay on your machine.** They are not committed to the
  project.
- **Resolved credentials are not saved** in a run's record, which stores the requested role, the
  endpoint, the model, usage, an estimated cost and the routing reason.
- **Custom provider endpoints need HTTPS**, except a loopback URL.
- **Diagnostic logs stay local** and are kept three days.

## Related

- [Trust and permissions](/safety/trust-and-permissions/), for what each control stops.
- [The git guard](/safety/git-guard/), for what is refused before it reaches your history.
- [Plugins and themes](/extending/plugins-and-themes/), for what an installed plugin can reach.
