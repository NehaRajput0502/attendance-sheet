# Class Attendance Sheet Generator

A tiny, static, privacy-friendly web app to generate printable attendance sheets for any month.  
**No backend. No tracking.** Works entirely in the browser.

## Features
- Paste student names, choose month/year
- Hide weekends (optional)
- Click cells to toggle ✓ / ✗ / blank
- **Download CSV** for records
- **Print / Save as PDF** (nice print CSS)
- Keyboard shortcuts: **G**enerate, **D**ownload, **P**rint

Name: Class Attendance Sheet Generator

Stack: 100% static (HTML + CSS + Vanilla JS)

What it does: Paste student names → choose month/year → click Generate → get a printable attendance grid (✔︎/✗ or blank), Download CSV, or Print to PDF.

Why it’s good: Useful for schools, zero backend, showcases clean code & UX.

## Run Locally
Just open `index.html` in your browser, or use any static server:
```bash
npx serve .
