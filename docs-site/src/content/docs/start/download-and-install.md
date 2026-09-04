---
title: Download and install
description: Where to get Jensen, which build to take for your platform, and how to install it.
---

Every Jensen build is published on the
[releases page](https://github.com/jensen-org/releases/releases).

## Which build to take

| Platform | Architecture | Asset |
| --- | --- | --- |
| macOS | Apple Silicon | `.dmg` |
| Debian, Ubuntu | x86_64 | `.deb` |
| Fedora, RHEL, openSUSE | x86_64 | `.rpm` |

Beta builds are published as prereleases, so GitHub does not expose them through the `latest` release
URL. Take them from the releases page itself.

Every release also carries a checksum file per platform, its detached signature, the signing public
key `JENSEN_RELEASE_PUBKEY.asc`, and a `release-*.json` describing the build. See
[Verify a download](../verify-a-download/).

## Install

On macOS, open the disk image and drag Jensen into your Applications folder. The build is signed and
notarized, so it opens like any other app.

On Debian or Ubuntu:

```bash
sudo apt install ./Jensen_*_amd64.deb
```

On Fedora, RHEL or openSUSE:

```bash
sudo dnf install ./Jensen-*.x86_64.rpm
```

Both packages put `jensen-desktop` and the `jensen` command-line tool on your `PATH`, and register
the desktop entry the shell needs to show the app's own icon.

## What the beta does not do yet

The current beta is deliberately narrow. Before you install, know that:

- There is **no automatic updater**. New builds are downloaded from the releases page.
- Linux builds are **x86_64 only** and need **glibc 2.39 or newer**, so they do not run on Ubuntu
  22.04.
- An AppImage, where published, may require FUSE 2. Install `libfuse2`, or launch it with
  `APPIMAGE_EXTRACT_AND_RUN=1`.
- Semantic knowledge search downloads a small embedding model on first use. On a machine with no
  network it falls back to lexical search with no loss of availability. See
  [Memory and knowledge search](../../knowledge/memory-and-search/).
- Commercial use requires a separate written license. See
  [License and security](../../about/license-and-security/).

## Next

Installing puts the app and the command on your machine. It does not yet turn Jensen on for a
project. That is [First run](../first-run/).
