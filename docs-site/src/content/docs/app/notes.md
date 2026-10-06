---
title: Notes
description: Canvases for drawing designs, a board for notes and tasks, and where issues and pipelines went.
---

Notes is the third page. Press `Cmd 3`, or `Alt 3` on Linux and Windows. It pairs a **Canvas** with a
**Notes board** so a design and the work around it stay together.

With no project open it reads **No project is open**.

## Canvases

A canvas is an Excalidraw drawing for a flow or an architecture. The sidebar rail lists them. It
reads **No canvas yet** until you make one.

- **New canvas** starts a drawing. **Rename** and **Delete** are in **Canvas actions**.
- **Share a link** copies an encrypted copy anyone with the link can open. Images are not shared.
- **Bind to a note or issue** ties the canvas to a note or to an issue assigned to you, so an assistant
  can read the design behind the work. In the dialog, filter with **Show**: **All**, **Issues** or
  **Notes**, then search. Bound canvases show **Bound**. Use **Unbind** to undo it.

Issues in the bind dialog come from the forge you connected. See
[Trust and permissions](/safety/trust-and-permissions/).

## The notes board

**Notes board** holds cards. Each card has a kind and a status.

| | Values |
| --- | --- |
| **Kind** | Note, Idea, Task, Epic |
| **Status** | Incoming, Ongoing, Done, Archived |

Filter by **Kind**, **Time** (**Today**, **This week**, **Overdue**, **No date**) and **Status**. An
empty board reads **No notes yet**.

**New notes** opens a card. Give it a **Title**, **Details in markdown**, a **Due date**, and
optionally a **Linked issue** in the form `owner/repository#123`.

Each card has actions:

- **Turn into task**
- **Refine with AI**, which starts a session to sharpen it.
- **Start a session**, which opens Sessions with the note as the brief.
- **Mark done**
- **Delete.** Its canvases stay, unbound.

## Issues and pipelines

Notes replaced the old Work page. Issues, merge requests and pipelines no longer have a dashboard.
They appear where you are working.

- **Issues** open in a pane. Click one under **Assigned to you** in the [overview](/app/project-graph/),
  or open the issue a plan created. The pane shows the description and comments, and lets you **Close**
  or **Reopen**, **Assign to me**, edit **Labels**, and set a milestone, start and target date.
- **Pipelines** open from the **CI** chip in the status bar. The pane lists jobs and offers **Try
  again**, **Create issue** and **Fix with AI**. A failed run also raises a toast with **Fix with AI**.
- **Merge requests** surface as a toast when one is raised, with **AI review** to review it.
- **Create issue** is available from a pipeline and from the editor menu, as **Create issue from
  selection** or **Create issue from this TODO**.

Every write to your tracker needs its permission. See
[Trust and permissions](/safety/trust-and-permissions/).
