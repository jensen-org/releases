---
title: Source control
description: The multi repository overview, branch cleanup, commit history with revert and reset, and the worktrees pane.
---

Source control is three panes: **Source control**, **Commit history** and **Worktrees**. Open them
from **Open a pane**, in the **Git** group. See [Getting around](/app/getting-around/).

## Source control

The pane shows every repository under your project, so a project made of several repos reads as one
overview.

### The top bar

- A **breadcrumb** of the project path. Click a parent folder to see a card for each repository in it.
- A **filter**: **All**, **To push**, **Behind**, **Dirty**, **PR open**.
- A refresh button for repositories and pull requests.
- **Let AI do it** hands your uncommitted work to your assistant. It groups the changes by theme,
  commits them and pushes. The button reads **AI is committing…** meanwhile.
- **Bulk actions**: **Refresh all**, **Fetch all**, **Pull all**, **Push all**.

### Repository cards

Each repository is one line, sorted so the ones needing attention come first.

- Name, change count, and a commit icon. Hover it to see the latest commit.
- The branch and chips: **N changed**, **↑N to push**, **↓N to pull**, **upstream gone**, **not
  pushed**, **clean**, and **#N** for an open pull request (**#N draft** for a draft).
- **Pull (N)**, a primary **Push (N)** at the bottom right, and a **Repository actions** menu with
  **Fetch and prune**. The push count includes commits on branches you have not published yet.

### Inside one repository

Open a card to work in it.

- **Switch branch** is a dropdown. Type a name there to create one.
- **Changes** lists each file with **Diff**, **Review** (review with your agent) and **Discard**.
- **Merge conflicts** lists conflicted files with **Resolve**.
- The **Commit** box holds your message and the **Commit** button.
- **Pull (N)** and **Push (N)** sit beneath it, and also in the header when the card is collapsed.

If something goes wrong, the error line offers **Fix with AI**.

A commit with secrets or junk in it is refused. The box reads **Commit blocked** and lists each
finding, with **Accept** for a false positive. See [The git guard](/safety/git-guard/).

A merge or revert in flight shows **Merge in progress** or **Revert in progress** with **Abort** and
**Continue**.

Rebase, cherry-pick and stash are gone. Use **Revert** and **Reset to here** from history instead.

## Branch cleanup

The **Branches** accordion lists leftovers. The header reads, for example, **3 to delete · 1 not
merged**.

- **To delete** holds branches already merged. **Delete N** removes them all, **Delete branch** one.
- **Not merged into** your base branch holds work that never landed. **Push** publishes a branch and
  **Merge** merges it. Merge is off until your base branch is checked out.

Jensen never offers to delete protected branches. See [Branch policy](/flow/branch-policy/).

## Commit history

**Commit history** lists commits one line each, grouped by **Today**, **Yesterday** and dates. A
**Repository** dropdown appears when you have several. Branch labels read `source → target`.

- Click a row to see the blame. Click a file to open it in the editor.
- Hover a commit for a card: copy the id, **Open changes**, **Revert**, **Reset to here**.
- **Revert** adds a commit that undoes the chosen one.
- **Reset to here** moves the branch back and keeps later changes uncommitted.

## Worktrees

**Worktrees** lists the checkouts Jensen created. **New** asks for a **Task name (branch)** and a
**Base ref**, then **Create**. You can **Push** or **Delete** a worktree, and save or **Apply** a
profile. Agents never remove worktrees, so this is where you do. See
[Worktrees](/safety/worktrees/).
