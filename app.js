(function () {
  const monthEl = document.getElementById('month');
  const yearEl = document.getElementById('year');
  const studentsEl = document.getElementById('students');
  const classNameEl = document.getElementById('className');
  const teacherNameEl = document.getElementById('teacherName');
  const hideWeekendsEl = document.getElementById('hideWeekends');
  const markGridEl = document.getElementById('markGrid');

  const generateBtn = document.getElementById('generate');
  const downloadCsvBtn = document.getElementById('downloadCsv');
  const printBtn = document.getElementById('printBtn');

  const metaEl = document.getElementById('meta');
  const tableWrap = document.getElementById('tableWrap');

  /* Populate months + default year */
  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  months.forEach((m, i) => {
    const opt = document.createElement('option');
    opt.value = String(i);
    opt.textContent = m;
    monthEl.appendChild(opt);
  });
  const now = new Date();
  monthEl.value = String(now.getMonth());
  yearEl.value = now.getFullYear();

  function getDaysInMonth(monthIndex, year) {
    return new Date(year, monthIndex + 1, 0).getDate();
  }
  function isWeekend(year, monthIndex, day) {
    const d = new Date(year, monthIndex, day);
    const w = d.getDay(); // 0 Sun, 6 Sat
    return w === 0 || w === 6;
  }

  function parseStudents(raw) {
    return raw.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  }

  function buildTable() {
    const mIndex = parseInt(monthEl.value, 10);
    const y = parseInt(yearEl.value, 10);
    const days = getDaysInMonth(mIndex, y);
    const students = parseStudents(studentsEl.value);
    const hideWeekends = hideWeekendsEl.checked;
    const showControls = markGridEl.checked;

    if (!students.length) {
      tableWrap.innerHTML = '';
      metaEl.textContent = 'Add at least one student to generate the sheet.';
      downloadCsvBtn.disabled = true;
      printBtn.disabled = true;
      return;
    }

    // Header meta
    metaEl.textContent = `${classNameEl.value || 'Class'} • ${months[mIndex]} ${y} • Teacher: ${teacherNameEl.value || '—'}`;

    // Column headers
    const headers = ['#', 'Student'];
    for (let d = 1; d <= days; d++) {
      if (hideWeekends && isWeekend(y, mIndex, d)) continue;
      headers.push(String(d));
    }

    // Build table
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const thr = document.createElement('tr');

    headers.forEach((h, i) => {
      const th = document.createElement('th');
      th.textContent = h;
      if (i <= 1) th.classList.add('sticky');
      if (!isNaN(parseInt(h, 10))) {
        // weekend marker in header
        const dayNum = parseInt(h, 10);
        if (isWeekend(y, mIndex, dayNum)) th.classList.add('weekend');
      }
      thr.appendChild(th);
    });
    thead.appendChild(thr);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    students.forEach((name, idx) => {
      const tr = document.createElement('tr');
      const num = document.createElement('td'); num.textContent = String(idx + 1); num.classList.add('sticky'); tr.appendChild(num);
      const n = document.createElement('td'); n.textContent = name; n.classList.add('sticky'); tr.appendChild(n);

      for (let d = 1; d <= days; d++) {
        if (hideWeekends && isWeekend(y, mIndex, d)) continue;
        const td = document.createElement('td');
        td.dataset.value = ''; // '', '✓', '✗'
        if (showControls) {
          const b = document.createElement('div');
          b.className = 'cell-btn';
          b.textContent = '';
          b.title = 'Click to toggle ✓ / ✗ / blank';
          b.addEventListener('click', () => {
            const current = td.dataset.value || '';
            const next = current === '' ? '✓' : (current === '✓' ? '✗' : '');
            td.dataset.value = next;
            b.textContent = next;
          });
          td.appendChild(b);
        }
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    tableWrap.innerHTML = '';
    tableWrap.appendChild(table);

    downloadCsvBtn.disabled = false;
    printBtn.disabled = false;
  }

  function toCsv() {
    const mIndex = parseInt(monthEl.value, 10);
    const y = parseInt(yearEl.value, 10);
    const days = getDaysInMonth(mIndex, y);
    const hideWeekends = hideWeekendsEl.checked;

    const table = tableWrap.querySelector('table');
    if (!table) return '';

    const rows = [];
    const headerCells = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent);
    rows.push(headerCells.join(','));

    table.querySelectorAll('tbody tr').forEach(tr => {
      const cells = Array.from(tr.children).map(td => {
        const btn = td.querySelector('.cell-btn');
        if (btn) {
          // export mark or blank
          return `"${btn.textContent || ''}"`;
        }
        // number / name / plain
        return `"${(td.textContent || '').replace(/"/g, '""')}"`;
      });
      rows.push(cells.join(','));
    });

    return rows.join('\n');
  }

  function download(filename, text) {
    const a = document.createElement('a');
    a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // Events
  generateBtn.addEventListener('click', buildTable);
  downloadCsvBtn.addEventListener('click', () => {
    const mIndex = parseInt(monthEl.value, 10);
    const y = parseInt(yearEl.value, 10);
    const className = (classNameEl.value || 'Class').replace(/\s+/g, '_');
    const csv = toCsv();
    if (csv) download(`${className}_${months[mIndex]}_${y}_attendance.csv`, csv);
  });
  printBtn.addEventListener('click', () => window.print());

  // Shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea')) return;
    if (e.key.toLowerCase() === 'g') buildTable();
    if (e.key.toLowerCase() === 'd' && !downloadCsvBtn.disabled) downloadCsvBtn.click();
    if (e.key.toLowerCase() === 'p' && !printBtn.disabled) printBtn.click();
  });

  // First render (empty state)
  buildTable();
})();
