# Calendar App — Todo

- [x] Create `tasks/todo.md`
- [x] Create `index.html` shell with grid, modal, nav buttons
- [x] Create `style.css` with grid layout, modal overlay, chips, responsive
- [x] Create `app.js` — persistence helpers (`loadEvents`, `saveEvents`, `generateId`)
- [x] `app.js` — `buildGrid()` renderer
- [x] `app.js` — `stampEvents()` + `highlightToday()`
- [x] `app.js` — `prevMonth()` / `nextMonth()` navigation
- [x] `app.js` — `openModal()` / `closeModal()` / `submitModal()`
- [x] `app.js` — `validateForm()` with blocking + non-blocking rules
- [x] `app.js` — `deleteEvent()` + chip edit/delete click wiring
- [x] `app.js` — `init()` bootstrap
- [ ] Smoke test all 12 acceptance criteria

---

## Review

Created three files from scratch — no framework, no build step.

**`index.html`** — semantic shell: header with prev/next nav, `#grid` div, and a `#modal-overlay` with the full form (title, date, description, error/warning paragraphs, save/cancel buttons).

**`style.css`** — CSS Grid 7-column month layout, day-cell with min-height, `.today` highlight, `.event-chip` flex row (title + delete button), modal overlay + box, responsive breakpoint at 600px.

**`app.js`** — all logic in ~170 lines:
- `loadEvents` / `saveEvents` / `generateId` — localStorage persistence
- `buildGrid` — injects 7 day-name headers, blank spacers, then clickable day cells with `data-date`
- `stampEvents` / `buildChip` — appends chips to matching cells; chip title opens edit modal, `×` deletes
- `highlightToday` — adds `.today` to current date's cell
- `prevMonth` / `nextMonth` — month navigation with year wrap
- `openModal` / `closeModal` / `submitModal` — prefills form for add/edit, validates, persists
- `validateForm` — blocking: empty title, empty date, title > 100 chars; `checkPastDate` — non-blocking warning
- `deleteEvent` — filters array, saves, re-renders
- Backdrop click and live past-date warning wired in `init()`
