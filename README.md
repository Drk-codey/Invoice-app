# 🧾 Invoice App

A fully functional, responsive Invoice Management Application built with React, TypeScript, and Tailwind CSS. Based on the Frontend Wizards Stage 2 task.

## 🚀 Live Demo & Repo

**Live demo:** https://invoice-app-sigma-gold.vercel.app/
**Repo:** https://github.com/Drk-codey/Invoice-app

---

## Features
 
- ✅ Create, read, update, and delete invoices (full CRUD)
- ✅ Save invoices as **Draft**, send as **Pending**, mark as **Paid**
- ✅ Status-based filtering (All / Draft / Pending / Paid)
- ✅ Form validation with inline error states
- ✅ Light / Dark mode toggle with system preference detection
- ✅ Fully responsive — Mobile (320px+), Tablet (768px+), Desktop (1024px+)
- ✅ Data persisted via **LocalStorage** — survives page refreshes
- ✅ Accessible: keyboard navigation, focus management, ARIA roles, modal focus trap

---

## 🛠️ Setup Instructions

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Drk-codey/Invoice-app.git
cd Invoice-app

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open in browser
# → http://localhost:5173
```

### Build for Production

```bash
npm run build       # TypeScript compile + Vite bundle
npm run preview     # Preview the production build locally
```

### Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

---

## 🏗️ Architecture Explanation

### Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI library with hooks |
| TypeScript | Type safety |
| Tailwind CSS v3 | Utility-first styling |
| Vite | Lightning-fast dev server + build |
| date-fns | Date formatting & arithmetic |

### Directory Structure

```
src/
├── components/
│   ├── Sidebar.tsx          # Fixed nav with logo, theme toggle & avater
│   ├── InvoiceList.tsx      # Invoice listing page with filter
│   ├── InvoiceDetail.tsx    # Full invoice detail view
│   ├── InvoiceCard.tsx      # Invoice Display card
│   ├── InvoiceForm.tsx      # Sliding panel create/edit form
│   ├── StatusBadge.tsx      # Coloured status pill
│   ├── InvoiceFilter.tsx    # Multi-select checkbox filter
│   ├── DeleteModal.tsx      # Delete Confirmation modal, focus-trapped
│   ├── Dropdown.tsx         # Custom Invoice Status Dropdown
│   ├── DatePicker.tsx       # Custom Date picker/calender
│   └── EmptyState.tsx       # Empty list illustration
├── context/
│   ├── InvoiceContext.tsx   # All invoice CRUD, localStorage persistence
│   └── ThemeProvider.tsx    # Light/dark mode context
├── data/
│   └── sampleData.ts        # Sample data 
├── hooks/
│   └── useFormValidation.ts # Form Validation hooks
├── pages/
│   └── Home.tsx             # Home page with all invoices
├── types/
│   └── invoice.ts           # TypeScript interfaces
├── utils/
│   └── helpers.ts           # ID gen, date format, currency, calculations
├── App.tsx                  # Root component + view routing state
├── main.tsx                 # React entry point
└── index.css                # Tailwind imports + global resets
```
---

### State Management
 
Global state uses **React Context + `useReducer`** — no external library needed at this complexity level.
 
```
InvoiceContext
  ├── invoices[]          — source of truth (mirrors localStorage)
  ├── filter              — 'all' | 'draft' | 'pending' | 'paid'
  ├── currentInvoiceId    — drives list ↔ detail view switch
  ├── isFormOpen          — controls form drawer visibility
  └── editingInvoiceId    — null = new invoice, string = edit mode
```
 
The reducer handles all mutations. Side effects (localStorage sync, focus management) live in `useEffect` hooks inside components or providers.
 
### Routing
 
No client-side router is used. Navigation is purely state-driven:
 
- `currentInvoiceId === null` → renders `<InvoiceList />`
- `currentInvoiceId !== null` → renders `<InvoiceDetail />`
- `isFormOpen === true` → renders `<InvoiceForm />` overlay
This avoids URL complexity for a single-page tool while remaining clean and predictable.
 
### Data Flow
 
```
User action
  → dispatch(action)
  → reducer produces new state
  → useEffect persists invoices to localStorage
  → React re-renders affected subtree
```
---

## Trade-offs & Decisions

1. **No routing library** — navigation is driven by context state (`currentInvoiceId`). This avoids a React Router dependency and keeps the app simple.

2. **useReducer instead of Redux/Zustand** — sufficient for this app's complexity. Adding a global state library would be over-engineering.

3. **Tailwind over CSS Modules** — faster iteration, dark mode via `dark:` prefix, no class-name collisions.

4. **Custom DatePicker and Dropdown** — built from scratch, no external libraries used.

5. **localStorage over IndexedDB** — simpler API, synchronous, no async complexity. For large invoice volumes IndexedDB would scale better.

---

## Accessibility Notes

- **Semantic HTML**: `<main>`, `<header>`, `<article>`, `<section>`, `<address>`, `<ul>/<li>` used appropriately.
- **Labels**: Every `<input>` and `<select>` has a corresponding `<label>` element with matching `htmlFor`/`id`.
- **Buttons**: All interactive controls use `<button>` with meaningful `aria-label` attributes.
- **Modal**: `DeleteModal` uses `role="dialog"`, `aria-modal="true"`, `aria-labelledby`/`aria-describedby`, ESC key close, and a focus trap between Cancel and Delete.
- **Keyboard navigation**: All interactive elements are reachable via Tab, activated with Enter/Space.
- **Focus visible**: Custom `focus-visible:ring-2` styles on all interactive elements (WCAG 2.1 § 2.4.7).
- **Colour contrast**: Status badge colours and body text meet WCAG AA in both light and dark modes.
- **Reduced motion**: No animation-heavy transitions that would require `prefers-reduced-motion` handling.
- **Role alerts**: Form error messages and the items-required error use `role="alert"` for screen reader announcements.

---

## Potential Improvements

- **Custom `DatePicker`** built from scratch with `date-fns`
- **Sample data** pre-loaded on first visit so the app isn't blank on initial open
- **System dark-mode preference** detected on first load via `window.matchMedia`
- **Tailwind custom theme** — full colour token system (`primary`, `delete`, `status-*`, `bg-*`, `text-*`) rather than hardcoded hex values in classes

---

Built for Frontend Wizards Stage 2.