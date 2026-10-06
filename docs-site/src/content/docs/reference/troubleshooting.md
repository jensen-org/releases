---
title: Troubleshooting
description: What to run when something is not working, what the background service is for, how a refused action reads, and how to reclaim disk space.
---

## Start here

```bash
jensen doctor
```

It reports what works and what does not. It is read only, and it exits non zero only when something is
broken, so it can gate a pipeline.

`--json` and `--markdown` give output you can paste somewhere.

The same checks run in the app at **Settings, System, Health**, with advice per check, **Re-check** and
**Copy as Markdown**. The verdict reads **Everything Jensen checks is working**, **Jensen works, but
some parts are degraded**, or **Some parts of Jensen are not working**.

## Is Jensen wired for this project?

```bash
jensen setup --status
```

It reports what is wired and writes nothing. To fix what is missing, re-run `jensen setup`, which is
safe. See [Turn Jensen on](/start/turn-jensen-on/#re-running-is-safe).

In the app, the **Connect** step of the wizard does the same and offers **Fix all**.

## Common causes

| Symptom | Likely cause |
| --- | --- |
| The map is empty or stale | The project was never indexed, or set up with `--no-scan`. Run `jensen setup` again, or `jensen watch .`. |
| An assistant cannot see the project | The context server is not registered for it, or the project was never activated. Run `jensen setup --status`. |
| Tools, formatters or the debugger will not run | The project is not trusted. **Settings, System, Security, Trusted folders**. |
| A project will not open | It is outside your scope. **Settings, System, Security, Scope**. |
| A write to your tracker does nothing | The matching permission is off. **Settings, Extensions, Integrations**. |
| An assistant's edit was refused | It tried to write on a protected branch or outside its checkout. See below. |
| A landing was refused | The environment needs checks and the project has none, or a server is still running. See [Landing and cleanup](/flow/landing-and-cleanup/). |
| Semantic search ranks poorly | The embedding model has not downloaded. Lexical search still works offline. **Settings, AI, Knowledge**. |
| Codex is not running Jensen's hooks | It needs a one time trust review. Start Codex and use `/hooks`. |
| The trace is empty | Capture needs repair. Choose **Repair capture** in the trace. |
| A Linux build will not start | Builds need glibc 2.39 or newer, so they do not run on Ubuntu 22.04. An AppImage may need FUSE 2. |

## When Jensen refuses an agent

Refusals say what to do. The ones you will meet:

- "Jensen cut a task branch from {branch} for this session." The agent wrote on a protected branch.
  Jensen made it a task branch and checkout, and the agent repeats the change there.
- "Jensen refused this command: agents never delete, move or disable" a branch, a worktree or the git
  guard. Do it yourself if you mean it.
- "it provisions every checkout itself, so a runtime never creates its own worktree." A runtime tried
  to create one.
- "production is only reached through a merge request." A plan targeted production.
- "an agent session may not push here directly." The agent tried to push an environment branch.

See [The git guard](/safety/git-guard/).

## Keychain prompts

Jensen stores each credential as its own keychain item under the service `dev.jensen`. Only Jensen's
background service reads it. macOS asks the first time. Choose **Always Allow** so it asks once. If you
upgraded from a version with a vault, enter your tokens again under **Settings, Extensions,
Integrations**.

## The background service

Jensen runs a small background service. It keeps the map, knowledge store and findings current, polls
your integrations and runs workflows.

Opening the desktop app starts it. The command line does not.

```bash
jensen ping
```

That asks for its version and starts nothing. Success prints `daemon ok` with the version. Failure
prints `ping failed` and exits non zero, which means it is not running, and opening the app fixes it.
In a process list it is `jensend`.

It is the one part of Jensen that needs the app. The context server, map commands, knowledge store and
git guard work without it. See [Working outside the app](/assistant/working-outside-the-app/).

## Sandbox

Agents run a project's servers through Jensen. A project with a Dockerfile or compose file runs inside
containerd, never on the host. On macOS that needs one small Linux VM.

```bash
jensen sandbox status    # is it ready
jensen sandbox setup     # install and start it, once
jensen sandbox stop      # stop the VM to free memory
```

## Storage and cleanup

The **Storage** panel in **Project overview** breaks usage into parts and offers **Clean up**.

```bash
jensen gc --dry-run              # what would be reclaimed
jensen gc                        # reclaim stores for projects that are gone
jensen gc --stale-days 90        # widen the window, 30 days by default
jensen clean                     # report what earlier versions left behind
jensen clean -y                  # remove it
jensen uninstall                 # report Jensen's own data
jensen uninstall -y              # remove it
```

`jensen gc` never removes a workspace holding traces, sessions or automation state. `jensen clean`
and `jensen uninstall` report and stop unless you pass `-y`, and they only remove locations Jensen
declares. Your projects and saved credentials stay.

Knowledge has its own compaction:

```bash
jensen knowledge compact --dry-run
jensen knowledge compact
```

## Logs

**Settings, System, Security, Diagnostic logs** has **Open logs folder**. Logs stay on your machine for
three days and are never sent anywhere.

## Reverse setup

| To remove | Run |
| --- | --- |
| The git guard and the hooks pointing at it | `jensen setup --only git-shim --only git-hooks --uninstall` |
| The `jensen` link on your `PATH` | `jensen setup --only cli-path --uninstall` |
| Everything setup wired | `jensen setup --uninstall` |

## Report a problem

Open an issue at [github.com/jensen-org/releases/issues](https://github.com/jensen-org/releases/issues)
and attach `jensen doctor --markdown`.

For a suspected security vulnerability, do not open a public issue. See
[License and security](/about/license-and-security/).
