---
title: Download and install
description: Which build to take for your platform, how to install it, and how to check that the download is genuine.
---

Installing gives you the desktop app and the `jensen` command. They share one package, and these docs
assume you have both.

Take the build for your platform from the [download page](https://www.jensen-ide.com/), which offers
the newest one. Every published build, with checksums and signatures, is on the
[releases page](https://github.com/jensen-org/releases/releases).

## Which build to take

| Platform | Architecture | Asset |
| --- | --- | --- |
| macOS | Apple Silicon | `.dmg` |
| Debian, Ubuntu | x86_64 | `.deb` |
| Fedora, RHEL, openSUSE | x86_64 | `.rpm` |

Windows is coming, with no date yet.

Beta builds are prereleases, so GitHub hides them from the `latest` release URL. Take them from the
releases page.

## Install

On macOS, open the disk image and drag Jensen into Applications. The build is signed and notarized,
so it opens like any app.

On Debian or Ubuntu:

```bash
sudo apt install ./Jensen_*_amd64.deb
```

On Fedora, RHEL or openSUSE:

```bash
sudo dnf install ./Jensen-*.x86_64.rpm
```

Both packages put `jensen-desktop` and the `jensen` command on your `PATH` and register the desktop
entry the shell needs to show the app icon.

## Verify your download

Every release publishes a checksum file per platform, a detached signature for it, and the signing
public key. Verifying takes two steps.

Check your file against the checksums:

```bash
shasum -a 256 -c SHA256SUMS-macos-arm64    # macOS
sha256sum -c SHA256SUMS-linux-x86_64       # Linux
```

A line ending in `OK` means your bytes match the published bytes.

Then check the checksum file. It only proves your download matches that file, not that the file came
from the release pipeline. The signature closes the gap:

```bash
gpg --import JENSEN_RELEASE_PUBKEY.asc
gpg --verify SHA256SUMS-macos-arm64.asc SHA256SUMS-macos-arm64
```

`Good signature` means the release key signed the checksum file.

### What else is in a release

| Asset | What it is |
| --- | --- |
| The platform package | The `.dmg`, `.deb` or `.rpm` you install. |
| `SHA256SUMS-<platform>` | SHA-256 checksums for that platform's assets. |
| `SHA256SUMS-<platform>.asc` | Detached signature over the checksum file. |
| `JENSEN_RELEASE_PUBKEY.asc` | Public key for that signature. |
| `release-*.json` | Build metadata. |

## Limits of the beta

- No auto-updater. Download new builds from the releases page.
- Linux builds are x86_64 only and need glibc 2.39 or newer, so they do not run on Ubuntu 22.04.
- An AppImage, where published, may need FUSE 2. Install `libfuse2`, or launch it with
  `APPIMAGE_EXTRACT_AND_RUN=1`.
- Semantic knowledge search downloads a small embedding model on first use. With no network it falls
  back to lexical search. See [Memory and knowledge search](/knowledge/memory-and-search/).
- Jensen is free to use, at work included. Selling, redistributing or hosting Jensen itself needs a
  separate written license. See [License and security](/about/license-and-security/).

## Next

Installing puts the app and command on your machine. It does not turn Jensen on for a project. Open
one first: [Open a project](/start/open-a-project/).
