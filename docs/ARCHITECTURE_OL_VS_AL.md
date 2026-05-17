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

| Tab / area | Domain |
|------------|--------|
| Overview, Upload, Files, Grades, Settings | O/L (`useData`) |
| A/L Admin | A/L (`useALData`) |

Keep **separate admin entry points** long term (e.g. `/admin` O/L + `/admin/al` or tabs with no shared mutation helpers).

## Implementation phases

1. **P0 (done)** — Admin allowlist, rules, `isAdmin`, staging vs production admins.
2. **Phase A (in progress)** — Contexts + `useGradePage` live under `src/features/ol` and `src/features/al`. Legacy paths (`src/context/*`, `src/hooks/useGradePage.js`) are thin re-export shims. `App.jsx` imports from feature barrels.
3. **Phase A2 (next)** — Move O/L and A/L **pages** into feature folders; update imports.
4. **Phase B** — Split `AdminDashboard` into `OlAdmin` + `AlAdmin` routes.
5. **Phase C** — Remove shim re-exports; all new code imports from `features/ol` or `features/al` only.

## O/L-only notes

- Module catalog: `resourceTranslations.js` (no `resource_types` collection on staging).
- Canonical write: `resourceType: "textbook"` (singular) in Firestore.

## A/L-only notes

- Lazy `initializeALData()` on first A/L visit.
- Per-subject `onSnapshot` on `al_resources`.
- Localized `name` fields normalized in `ALContext`.
