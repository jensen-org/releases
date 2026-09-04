---
title: Verify a download
description: Check a Jensen build against the published checksums, and confirm the checksum file came from the release pipeline.
---

Every release publishes a checksum file per platform, a detached signature for it, and the signing
public key. Verifying takes two steps: check the file, then check the checksum file itself.

## Check the file

From the directory you downloaded into:

```bash
shasum -a 256 -c SHA256SUMS-macos-arm64    # macOS
sha256sum -c SHA256SUMS-linux-x86_64       # Linux
```

A line ending in `OK` means the bytes you have are the bytes that were published.

## Check the checksum file

On its own, a checksum file only proves the download matches that file. It does not prove the file
came from the release pipeline rather than from whoever handed you the link. The signature closes
that gap:

```bash
gpg --import JENSEN_RELEASE_PUBKEY.asc
gpg --verify SHA256SUMS-macos-arm64.asc SHA256SUMS-macos-arm64
```

`Good signature` means the checksum file was signed by the release key.

## What else is in a release

| Asset | What it is |
| --- | --- |
| The platform package | The `.dmg`, `.deb` or `.rpm` you install. |
| `SHA256SUMS-<platform>` | SHA-256 checksums for that platform's assets. |
| `SHA256SUMS-<platform>.asc` | The detached signature over the checksum file. |
| `JENSEN_RELEASE_PUBKEY.asc` | The public key that signature is checked against. |
| `release-*.json` | Build metadata describing the release. |
