# Teaching Torch — Change Tracker

This file records intentional changes made during the reliability and UX hardening work (May 2026). Update it when merging significant fixes or features.

---

## 2026-05-17

### `47977a9` — fix: restore data layer facade and harden O/L resource UX

**Data layer**
- `ResourceContext.jsx` — `normalizeResourceType()`, `processResources()` with `extras` bucket; `textbook` singular/plural handling; grade fetch with orderBy fallback; deduped merge; force refetch after mutations.
- `DataContext.jsx` — Facade restored: `resourceTypes` from translations, `addTextbook`/`addPaper`/`addVideo`/`addNote`/`addResource`, `exportData`, `updateSettings`, `fetchAllResources`, `coercePayload` for admin + modal shapes.
- `GradeContext.jsx` — `updateSettings()` writing to `settings/general`.
- `LanguageContext.jsx` — Whitelist languages from localStorage.
- `resourceTranslations.js` / `subjectTranslations.js` — Lookup fixes and null-safe names.

**Pages & hooks**
- `GradePage.jsx`, `useGradePage.js` — Loading gate before “Grade Not Found”.
- `ResourcesPage.jsx` — Subject-only metadata edit; async `updateSubject`; removed broken `updateResourceType` usage.
- `Home.jsx`, `TextbooksPage.jsx`, `PapersPage.jsx`, `NotesPage.jsx`, `VideosPage.jsx` — Await Firestore before success toasts.
- `AdminDashboard.jsx` — try/catch on file refresh and load-more.

**UI**
- `Footer.jsx` — Internal routes use React Router `Link`.
- `modern-base.css` — 44px min-size scoped to nav/CTAs/forms (not every `<a>`).
- `ALStreamsPage.jsx` — Initial title-wrap attempt (`break-words`).

**Cleanup**
- Removed dead `Navbar.jsx` (app uses `ModernNavbar`).

**Deferred (by design)**
- Firestore security rules / `admins` setup — pre-deploy.

---

### `422b7d4` — fix(al): prevent stream titles breaking mid-word on mobile

- `ALStreamsPage.jsx` — Single column below `lg`; removed `break-words` and `sm:col-span-2`; full-opacity stream cards with `break-normal` / `text-pretty`.

---

### `09a7179` — fix(home): show original hero background in light and dark

- `Home.jsx` — Removed teal `mix-blend-multiply` overlay, 30% image opacity, and blur orbs. Hero uses responsive `<picture>` (`bg1-small` / `bg1-medium` / `bg1`) at full opacity in both themes. Text legibility via `text-shadow` only.
- `CHANGELOG.md` — Added this change tracker (maintain going forward).

---

## Files touched (summary)

| Area | Files |
|------|--------|
| Context | `DataContext.jsx`, `ResourceContext.jsx`, `GradeContext.jsx`, `LanguageContext.jsx` |
| Pages | `Home.jsx`, `GradePage.jsx`, `ResourcesPage.jsx`, `TextbooksPage.jsx`, `PapersPage.jsx`, `NotesPage.jsx`, `VideosPage.jsx`, `AdminDashboard.jsx`, `al/ALStreamsPage.jsx` |
| Components | `Footer.jsx`, `ModernNavbar.jsx` (prior session), deleted `Navbar.jsx` |
| Styles | `modern-base.css` |
| Utils / hooks | `resourceTranslations.js`, `subjectTranslations.js`, `useGradePage.js` |

---

## How to use this file

1. Add a dated section for each meaningful commit or PR.
2. Note **why** the change was made, not only what files changed.
3. List anything **deferred** or **known follow-ups** so the next session has context.

---

### Mobile nav — theme toggle inside hamburger menu

- `ModernNavbar.jsx` — Theme control hidden on bar below `lg`; added “Light mode” / “Dark mode” item at bottom of mobile menu (closes menu on toggle). Desktop header unchanged.

---

## Known follow-ups

- [ ] Suspense fallback for lazy routes (reduce empty shell flash).
- [ ] Firestore rules + admin allowlist before production deploy.
- [ ] Wire or remove unused `RecentResources.jsx`.
