// ── State ──────────────────────────────────────────────────────────────────────
const today = new Date();
let currentYear  = today.getFullYear();
let currentMonth = today.getMonth(); // 0-based
let events       = [];
let editingId    = null;

// ── Persistence ────────────────────────────────────────────────────────────────
function loadEvents() {
  try {
    return JSON.parse(localStorage.getItem('calendarEvents')) || [];
  } catch {
    return [];
  }
}

function saveEvents(evts) {
  localStorage.setItem('calendarEvents', JSON.stringify(evts));
}

function generateId() {
  return Date.now() + '-' + Math.random().toString(36).slice(2, 8);
}

// ── Rendering ──────────────────────────────────────────────────────────────────
function renderCalendar() {
  const monthName = new Date(currentYear, currentMonth, 1)
    .toLocaleString('default', { month: 'long', year: 'numeric' });
  document.getElementById('month-heading').textContent = monthName;
  buildGrid();
  stampEvents();
  highlightToday();
}

function buildGrid() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';

  // Day name headers
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  dayNames.forEach(name => {
    const el = document.createElement('div');
    el.className = 'day-name';
    el.textContent = name;
    grid.appendChild(el);
  });

  // First weekday of the month (0=Sun)
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  // Number of days in this month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Blank spacers
  for (let i = 0; i < firstDay; i++) {
    const spacer = document.createElement('div');
    spacer.className = 'day-cell empty';
    grid.appendChild(spacer);
  }

  // Day cells
  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement('div');
    cell.className = 'day-cell';
    const dateStr = formatDate(currentYear, currentMonth + 1, d);
    cell.dataset.date = dateStr;

    const num = document.createElement('div');
    num.className = 'day-number';
    num.textContent = d;
    cell.appendChild(num);

    cell.addEventListener('click', () => openModal(dateStr));
    grid.appendChild(cell);
  }
}

function stampEvents() {
  events.forEach(evt => {
    const cell = document.querySelector(`.day-cell[data-date="${evt.date}"]`);
    if (!cell) return;
    cell.appendChild(buildChip(evt));
  });
}

function buildChip(evt) {
  const chip = document.createElement('div');
  chip.className = 'event-chip';
  chip.dataset.id = evt.id;

  const title = document.createElement('span');
  title.className = 'chip-title';
  title.textContent = evt.title;
  title.title = evt.title;
  title.addEventListener('click', e => {
    e.stopPropagation();
    openModal(evt.date, evt.id);
  });

  const del = document.createElement('button');
  del.className = 'chip-delete';
  del.textContent = '×';
  del.setAttribute('aria-label', 'Delete event');
  del.addEventListener('click', e => {
    e.stopPropagation();
    deleteEvent(evt.id);
  });

  chip.appendChild(title);
  chip.appendChild(del);
  return chip;
}

function highlightToday() {
  const todayStr = formatDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
  const cell = document.querySelector(`.day-cell[data-date="${todayStr}"]`);
  if (cell) cell.classList.add('today');
}

// ── Navigation ─────────────────────────────────────────────────────────────────
function prevMonth() {
  currentMonth--;
  if (currentMonth < 0) { currentMonth = 11; currentYear--; }
  renderCalendar();
}

function nextMonth() {
  currentMonth++;
  if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  renderCalendar();
}

// ── Modal ──────────────────────────────────────────────────────────────────────
function openModal(dateStr, eventId) {
  editingId = eventId || null;

  const overlay = document.getElementById('modal-overlay');
  const titleEl = document.getElementById('modal-title');
  const titleInput = document.getElementById('title');
  const dateInput  = document.getElementById('date');
  const descInput  = document.getElementById('description');

  clearModalErrors();

  if (editingId) {
    const evt = events.find(e => e.id === editingId);
    titleEl.textContent  = 'Edit Event';
    titleInput.value     = evt.title;
    dateInput.value      = evt.date;
    descInput.value      = evt.description || '';
  } else {
    titleEl.textContent  = 'Add Event';
    titleInput.value     = '';
    dateInput.value      = dateStr;
    descInput.value      = '';
  }

  checkPastDate(dateInput.value);
  overlay.classList.remove('hidden');
  titleInput.focus();
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  document.getElementById('event-form').reset();
  clearModalErrors();
  editingId = null;
}

function clearModalErrors() {
  document.getElementById('form-error').classList.add('hidden');
  document.getElementById('form-error').textContent = '';
  document.getElementById('past-date-warning').classList.add('hidden');
}

function checkPastDate(dateStr) {
  if (!dateStr) return;
  const warning = document.getElementById('past-date-warning');
  const [y, m, d] = dateStr.split('-').map(Number);
  const selected = new Date(y, m - 1, d);
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (selected < todayMidnight) {
    warning.classList.remove('hidden');
  } else {
    warning.classList.add('hidden');
  }
}

function submitModal() {
  const titleVal = document.getElementById('title').value.trim();
  const dateVal  = document.getElementById('date').value;
  const descVal  = document.getElementById('description').value.trim();

  const error = validateForm(titleVal, dateVal);
  if (error) {
    const errorEl = document.getElementById('form-error');
    errorEl.textContent = error;
    errorEl.classList.remove('hidden');
    return;
  }

  if (editingId) {
    const idx = events.findIndex(e => e.id === editingId);
    if (idx !== -1) {
      events[idx] = { id: editingId, title: titleVal, date: dateVal, description: descVal };
    }
  } else {
    events.push({ id: generateId(), title: titleVal, date: dateVal, description: descVal });
  }

  saveEvents(events);
  renderCalendar();
  closeModal();
}

// ── Validation ─────────────────────────────────────────────────────────────────
function validateForm(title, date) {
  if (!title)           return 'Title is required.';
  if (title.length > 100) return 'Title must be 100 characters or fewer.';
  if (!date)            return 'Date is required.';
  return null;
}

// ── Delete ─────────────────────────────────────────────────────────────────────
function deleteEvent(id) {
  events = events.filter(e => e.id !== id);
  saveEvents(events);
  renderCalendar();
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function formatDate(year, month, day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// ── Bootstrap ──────────────────────────────────────────────────────────────────
function init() {
  events = loadEvents();
  renderCalendar();

  document.getElementById('prev-btn').addEventListener('click', prevMonth);
  document.getElementById('next-btn').addEventListener('click', nextMonth);

  document.getElementById('close-btn').addEventListener('click', closeModal);
  document.getElementById('cancel-btn').addEventListener('click', closeModal);

  document.getElementById('event-form').addEventListener('submit', e => {
    e.preventDefault();
    submitModal();
  });

  // Close on backdrop click
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });

  // Live past-date warning
  document.getElementById('date').addEventListener('change', e => {
    checkPastDate(e.target.value);
  });
}

document.addEventListener('DOMContentLoaded', init);
