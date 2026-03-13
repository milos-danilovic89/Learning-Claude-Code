# Calendar App

A browser-based weekly calendar that lets you add, edit, and delete timed events — no account or internet connection required.

## Table of Contents

- [About](#about)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup and Installation](#setup-and-installation)
- [Running the App](#running-the-app)
- [Example Usage](#example-usage)
- [Project Structure](#project-structure)

---

## About

Calendar App is a lightweight personal scheduler that runs entirely in your browser. You can create events with a title, date, start time, end time, and optional description. All data is saved automatically to your browser's local storage, so your events persist across page refreshes without needing a server or database.

This app is a great starting point if you want to study how a real-world UI is built with plain HTML, CSS, and JavaScript — no frameworks, no build step, no dependencies.

---

## Features

- **Week view** — see all seven days of the current week laid out with a 24-hour time grid
- **Add events by clicking** — click any time slot in a day column to open the "Add Event" form pre-filled with that date and time
- **Timed events** — set a start time and end time; events are rendered as coloured blocks sized proportionally to their duration
- **Edit events** — click an existing event block to reopen the form and update any field
- **Delete events** — hover (or focus) an event block and click the × button to remove it
- **Week navigation** — use the Previous and Next arrows to move between weeks; the Today button snaps back to the current week and scrolls to 8 AM
- **Past-date warning** — a non-blocking warning appears when you pick a date in the past
- **Form validation** — the form blocks submission if the title is empty, the date is missing, or the end time is not after the start time
- **Persistent storage** — events are saved to `localStorage` automatically, so they survive page refreshes
- **Colour-coded events** — each event is assigned one of five colours based on its ID, making it easy to visually distinguish events at a glance
- **Responsive layout** — the calendar adapts to narrow screens (mobile-friendly below 600 px wide)
- **Accessible** — full keyboard navigation, focus trapping inside the modal, screen-reader live regions, and `aria` attributes throughout

---

## Prerequisites

You only need a web browser. No Node.js, Python, or any other runtime is required.

| Tool | Version | Notes |
|------|---------|-------|
| Web browser | Any modern version | Chrome, Firefox, Safari, or Edge all work |

> If you want to serve the files over HTTP (recommended to avoid any browser restrictions with `file://` URLs), you can use any simple static file server. A few options are listed in the [Running the App](#running-the-app) section.

---

## Setup and Installation

1. **Clone the repository** to your machine:

   ```bash
   git clone https://github.com/milos-danilovic89/Learning-Claude-Code.git
   cd Learning-Claude-Code/claude-calendar
   ```

   If you downloaded a ZIP instead, unzip it and navigate into the folder.

2. **That's it.** There are no dependencies to install and no build step. The app is three files: `index.html`, `style.css`, and `app.js`.

---

## Running the App

### Option A — Open directly in your browser (simplest)

Double-click `index.html` or drag it into a browser tab. The app will load immediately.

### Option B — Serve with a local HTTP server (recommended)

Running over HTTP avoids occasional browser security restrictions with `file://` URLs. Pick whichever tool you already have:

**Using Python (built into macOS and most Linux systems):**

```bash
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080) in your browser.

**Using Node.js (if you have it installed):**

```bash
npx serve .
```

Then open the URL printed in your terminal (usually [http://localhost:3000](http://localhost:3000)).

**Using VS Code Live Server extension:**

Right-click `index.html` in the VS Code file explorer and choose "Open with Live Server".

---

## Example Usage

### Adding a new event

1. Navigate to the week you want using the arrow buttons in the header.
2. Click on a time slot in the day column you want — for example, click in the Monday column at the 10 AM row.
3. The "Add Event" form opens with the date and time already filled in.
4. Type a title (e.g., "Team standup"), adjust the end time if needed, and optionally add a description.
5. Click **Save**. The event block appears on the calendar immediately.

### Editing an existing event

1. Click on any coloured event block on the calendar.
2. The form reopens in "Edit Event" mode with the existing values pre-filled.
3. Change whatever you need, then click **Save**.

### Deleting an event

1. Hover your mouse over an event block (or tab to it with your keyboard).
2. A small **×** button appears in the top-right corner of the block.
3. Click it. The event is removed immediately.

---

## Project Structure

```
claude-calendar/
├── index.html      # HTML shell: header, calendar grid, modal form
├── style.css       # All styles: dark theme, grid layout, event blocks, modal, responsive
├── app.js          # All logic: rendering, navigation, modal, validation, localStorage
└── tasks/
    └── todo.md     # Development task log and change history
```

The app has no external dependencies. Everything runs in the browser using standard Web APIs (`localStorage`, `DOM`, `Date`).
