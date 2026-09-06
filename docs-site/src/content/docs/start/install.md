---
title: Download and install
description: Where to get Jensen, which build to take for your platform, how to install it, and how to check that the download is genuine.
---

Installing gives you two things: the desktop app and the `jensen` command. They come from the same
package, and the documentation assumes you have both.

Take the build for your platform from the [download page](https://www.jensen-ide.com/), which always
offers the newest one. Every build ever published, with its checksums and signatures, is on the
[releases page](https://github.com/jensen-org/releases/releases).

## Which build to take

| Platform | Architecture | Asset |
| --- | --- | --- |
| macOS | Apple Silicon | `.dmg` |
| Debian, Ubuntu | x86_64 | `.deb` |
| Fedora, RHEL, openSUSE | x86_64 | `.rpm` |

Beta builds are published as prereleases, so GitHub does not expose them through the `latest`
release URL. Take them from the releases page itself.

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

## Verify what you downloaded

Every release publishes a checksum file per platform, a detached signature for it, and the signing
public key. Verifying takes two steps.

First, check the file you downloaded against the checksums:

```bash
shasum -a 256 -c SHA256SUMS-macos-arm64    # macOS
sha256sum -c SHA256SUMS-linux-x86_64       # Linux
```

A line ending in `OK` means the bytes you have are the bytes that were published.

Then check the checksum file itself. On its own it only proves the download matches that file, not
that the file came from the release pipeline. The signature closes that gap:

```bash
gpg --import JENSEN_RELEASE_PUBKEY.asc
gpg --verify SHA256SUMS-macos-arm64.asc SHA256SUMS-macos-arm64
```

`Good signature` means the checksum file was signed by the release key.

### What else is in a release

| Asset | What it is |
| --- | --- |
| The platform package | The `.dmg`, `.deb` or `.rpm` you install. |
| `SHA256SUMS-<platform>` | SHA-256 checksums for that platform's assets. |
| `SHA256SUMS-<platform>.asc` | The detached signature over the checksum file. |
| `JENSEN_RELEASE_PUBKEY.asc` | The public key that signature is checked against. |
| `release-*.json` | Build metadata describing the release. |

## What the beta does not do yet

The current beta is deliberately narrow. Before you install, know that:

- There is no automatic updater. New builds are downloaded from the releases page.
- Linux builds are x86_64 only and need glibc 2.39 or newer, so they do not run on Ubuntu 22.04.
- An AppImage, where published, may require FUSE 2. Install `libfuse2`, or launch it with
  `APPIMAGE_EXTRACT_AND_RUN=1`.
- Semantic knowledge search downloads a small embedding model on first use. On a machine with no
  network it falls back to lexical search. See
  [Memory and knowledge search](../../knowledge/memory-and-search/).
- Jensen is free to use, at work included. Selling, redistributing or hosting Jensen itself needs a
  separate written licence. See [License and security](../../about/license-and-security/).

## Next

Installing puts the app and the command on your machine. It does not turn Jensen on for a project
yet. Open one first: [Open a project](../open-a-project/).
