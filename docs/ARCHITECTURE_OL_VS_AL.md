# Architecture: O/L (Grades 6–11) vs Advanced Level (A/L)

Teaching Torch uses **two independent domains** in one app. They must stay separated in code, routes, Firestore, and admin tools.

## Firestore (already separate)

| O/L (Grades 6–11) | A/L |
|-------------------|-----|
| `grades` | `al_streams` |
| `subjects` | `al_subjects` |
| `resources` | `al_resource_types` |
| `settings` | `al_sub_categories` |
| — | `al_resources` |

**Rule:** Never query `al_*` from O/L pages or `resources` from A/L pages.

## App state (current)

```
Theme → Auth → Language
  → GradeProvider      ─┐
  → ResourceProvider   ─┼→ DataProvider (O/L facade)
  → ALProvider         ─── A/L only
```

- **O/L:** `useData()` → grades, subjects, resources, settings, admin CRUD for 6–11.
- **A/L:** `useALData()` → streams, subjects, resource types, sub-categories, resources.

## Routes (current)

| O/L | A/L |
|-----|-----|
| `/grade/:gradeId` | `/al` |
| `/grade/.../textbooks` etc. | `/al/:streamId/:subjectId` |
| | `/al/:streamId/:subjectId/:resourceTypeId` |

## Target folder layout (next refactor)

```
src/
  features/
    ol/                    # Grades 6–11
      context/             # GradeContext, ResourceContext, DataContext
      pages/
      hooks/               # useGradePage
      components/
    al/                    # Advanced Level
      context/             # ALContext (move from src/context)
      pages/               # move from src/pages/al
      components/
  shared/                  # Navbar, Footer, ui/, auth, utils
  pages/                   # Home, About, Contact, admin shell
```

## Admin

| Route | Domain |
|-------|--------|
| `/admin` — Overview, Upload, Files, Grades, Settings | O/L (`useData`) |
| `/admin/al` — streams, subjects, types, files | A/L (`useALData`) |

Nav links switch between O/L and A/L admin; no A/L tab on the O/L dashboard.

## Implementation phases

1. **P0 (done)** — Admin allowlist, rules, `isAdmin`, staging vs production admins.
2. **Phase A (done)** — Contexts + `useGradePage` under `src/features/ol` and `src/features/al`. Legacy paths are thin re-export shims.
3. **Phase A2 (done)** — O/L and A/L pages under `features/*/pages/`; `App.jsx` lazy-loads from feature paths; `src/pages/*` and `src/pages/al/*` are re-export shims.
4. **Phase B (done)** — `/admin` = Grades 6–11 only; `/admin/al` = A/L admin (`AlAdminDashboard` + shared `AdminLayout`).
5. **Phase C (done)** — Removed context/page shims; shared code imports `useData` / `useALData` from feature barrels.

## O/L-only notes

- Module catalog: `resourceTranslations.js` (no `resource_types` collection on staging).
- Canonical write: `resourceType: "textbook"` (singular) in Firestore.

## A/L-only notes

- Lazy `initializeALData()` on first A/L visit.
- Per-subject `onSnapshot` on `al_resources`.
- Localized `name` fields normalized in `ALContext`.
