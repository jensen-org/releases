---
title: Project, the map
description: The map of your codebase, its three modes, the overlays you can put on it, and how to declare structure no single repository can show.
---

The Project view is the map. It draws your codebase as a graph you drill through by altitude rather
than by folder, because that is how people reason about systems.

## What the map contains

The map is built from what is really in your repository:

- **Services**, and the connections between them.
- **Symbols**, and the calls between them.
- **Files** and the imports that tie them together.
- **Routes** the code exposes.
- **Project knowledge** recorded against any of the above.

Everything on it was either observed directly in your source or declared on purpose by your team, and
the two stay distinguishable. Nothing is inferred. See
[Honest by design](../../start/honest-by-design/).

## Moving through it

Open the map at whatever altitude you need, from the whole system at a glance down to one service's
internals. Breadcrumbs above the canvas track where you are in the drill-through, so you can always
climb back out.

The canvas controls are zoom in and out, **fit**, expand and collapse all, and a **Zen** toggle that
clears the chrome away. While a project is being indexed an overlay reads **Scanning project**, then
**Indexing graph**.

## Three modes

A panel across the top switches what the graph is projecting.

### Graph

The code graph: services, symbols, calls and imports. This is the default and the one you drill
through.

### Infrastructure

The infrastructure Jensen detected, with an inspector for a selected element and two actions,
**Review map** and **Rescan**.

### Documentation

A documentation graph over everything Jensen has indexed. It carries a **Search documentation** box
and a **Search** button. Depending on how your AI connection is configured you either get an
**Answer** inline, or **Ask in session**, which hands the question to your assistant. Selecting a
result opens a citation card with **Open source**, so you can always get to the passage the answer
came from.

See [Memory and knowledge search](../../knowledge/memory-and-search/).

## Overlays

Three toggles put extra information on top of whichever mode you are in.

### Highlight recent changes

Marks what has moved lately, so you can see where the activity is before you decide where to look.

### Vulnerabilities

Runs the vulnerability scanners over your dependencies and code and marks what they find, with a
High, Medium and Low legend. While it runs you get live progress with elapsed time and a **Cancel**;
a failure offers **Retry**. Results are summarised as **View N findings**.

Jensen does not bundle the scanners. If a scanner is not installed the legend offers an **Install**
button for it, plus **Re-scan** and a route into language server settings. See
[Findings and screening](../../safety/findings-and-screening/).

### Agents self learning

Highlights what your assistant has learned about the project, and badges how many open questions it
has. The Knowledge panel then shows each one as **Open question** or **Needs your input**, with
**Answer with assistant** to hand it back, **Drop this question** to discard it, and **Back to the
whole project** to clear the focus.

## Declaring topology

Some structure genuinely cannot be read out of any single repository: which services exist across
your estate, how they connect, and over what protocol. Your team declares that, and Jensen folds it
into the same picture, still labelled as declared rather than observed.

Declared topology is the one place the map accepts something it did not read from source, and it is
explicit precisely so the guarantee holds everywhere else.

## Asking the map questions

You do not have to open the app to query the map. From a terminal:

```bash
jensen view . --json                          # the file and import graph
jensen query . "calls:authenticate" --json    # what calls a symbol
jensen gen .                                  # write the full map to disk
jensen watch .                                # keep it current as you edit
```

`jensen gen` is deterministic: two runs over an unchanged tree produce byte-identical files.

Your assistant asks the same questions through the context server rather than by grepping. See
[What your assistant can do](../../ai/what-your-assistant-can-do/).

## The shared map files

The map is not locked inside the IDE. Jensen writes it out as portable files that live alongside your
code and any AI assistant can read. They are the context your assistant works from, a compact
description of the system instead of the whole repository.

Two properties make those files dependable. They are **git friendly**, so the map lives in version
control next to the code it describes and its changes show up in review. And they are
**deterministic**, so diffs stay clean and a change in the map means a real change in the code.
