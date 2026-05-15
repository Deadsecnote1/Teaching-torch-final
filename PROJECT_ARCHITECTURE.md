# 🏛️ Teaching Torch - Project Architecture

This document provides a highly detailed architectural overview of the **Teaching Torch** platform. It serves as the definitive guide for understanding how data flows, how state is managed globally, and how the codebase is structured following the Vite/Tailwind migration.

---

## 1. Database Schema & Firestore Structure

The platform uses **Firebase Firestore** as a NoSQL document database. Data is strictly separated into two domains: **General Education (Grades 6-11)** and **Advanced Level (A/L)**.

### A. General Grades Architecture (6-11)
- **`grades`**: Documents representing core grades (e.g., `grade6`, `grade10`). 
  - *Fields*: `display` (Name), `order` (Sorting integer), `visibleResourceTypes` (Array of allowed types).
- **`subjects`**: Core subjects (e.g., `mathematics`, `science`).
  - *Fields*: `name`, `nameSinhala`, `nameTamil`, `icon` (Bootstrap icon string), `order`, `grades` (Array of grade IDs this subject belongs to).
- **`resources`**: A master collection containing *all* actual files for Grades 6-11.
  - *Fields*: `grade`, `subject`, `resourceType` ('textbook', 'papers', 'notes', 'videos'), `languages` (Array), `url` (or `driveLink`/`youtubeUrl`), `uploadDate`, `order`.
  - *Note*: This collection is queried client-side without a composite index by filtering `where("grade", "==", id)` and applying JavaScript-based date sorting.

### B. Advanced Level Architecture (A/L)
Because of the complexity of A/L sub-categories (e.g., Physics Mechanics vs. Waves), A/L uses a completely distinct collection group:
- **`al_streams`**: e.g., `science`, `commerce`.
- **`al_subjects`**: Linked via `streamId`.
- **`al_resource_types`**: Global resource types (Text Books, Past Papers).
- **`al_sub_categories`**: Crucial structural glue. Groups resources inside a subject (e.g., "Unit 1: Mechanics"). Links to `subjectIds` and `resourceTypeId`.
- **`al_resources`**: The file links. Queries rely entirely on exact matches (e.g., `alSubjectId`) and do not require composite indexes.

---

## 2. Environment Separation Strategy

The app utilizes a robust two-project Firebase configuration driven by Vite mode execution:
1. **Production (`tt-v1-c2a11`)**: Loaded via `.env` when running `npm run dev` or `npm run build`. This is the live database serving end users.
2. **Staging (`tt-staging-5a60d`)**: Loaded via `.env.staging` when running `npm run dev:staging`. This is entirely isolated and used for testing Admin operations safely.

CI/CD is handled by a GitHub Action (`firebase-deploy.yml`) that triggers on pushes to the `main` branch, explicitly injecting GitHub Secrets to deploy to the Production database.

---

## 3. Global State Management (Context API)

We rely on heavily decoupled React Context providers wrapping the `App.jsx` tree.

- **`AuthContext.jsx`**: Handles Firebase initialization, authentication state, and the `isManageMode` toggle (which dictates whether Admin edit buttons appear globally on the frontend).
- **`ThemeContext.jsx`**: Controls `light`/`dark` variables on the `html` tag.
- **`LanguageContext.jsx`**: Centralized hub for toggling `sinhala`, `tamil`, or `english`. Includes helper functions like `shouldShowResource(lang)`.
- **`DataContext.jsx`**: The orchestrator for Grades 6-11. It stitches together listeners from `GradeContext` and `ResourceContext` to build unified `generateGradePageData` objects.
- **`ALContext.jsx`**: An isolated monolith provider specifically handling the fetching, caching, and mutation of all A/L data.

---

## 4. UI / UX Design System

The application was modernized away from standard Bootstrap UI into a hybrid **Tailwind CSS + Custom CSS Variables** system.

### Core Utilities
- **`modern-base.css`**: Defines layout variables (`--max-w-7xl`) and utility resets.
- **`index.css` & `globals.css`**: Contain root variables (e.g., `--primary: #0d9488`, `--bg-secondary`) that support dynamic theming.
- **Radix UI**: Used for complex, accessible interactive components (Tabs, Dropdowns, Dialogs).
- **Framer Motion**: Handles all page transitions and card hover animations.

### Component Philosophy
All new UI views should utilize the abstracted layout components located in `src/components/ui/Layout.jsx`:
- `<Container>`: Standardizes page width (`max-w-7xl`).
- `<Section>`: Handles vertical padding.
- `<Grid>`: Responsive CSS grid utility.

---

## 5. Routing Layout (`react-router-dom`)

Routing uses splat routes to dynamically serve content based on context:
- `/grade/:gradeId` -> Main grade overview.
- `/grade/:gradeId/:subjectId/:resourceType` -> Specific resource view for Grades 6-11.
- `/al/:streamId/:subjectId/:resourceTypeId` -> Specific resource view for Advanced Level.
- `/admin` -> Protected by `<ProtectedRoute>`, checks `currentUser`.

---

## 6. Critical Rules for Contributors

1. **A/L vs General Separation**: NEVER import or attempt to query `al_resources` from inside standard Grade 6-11 components, and vice versa. Their schemas are fundamentally incompatible.
2. **Admin Verification**: If testing the Admin UI locally, **always** use `npm run dev:staging` to avoid accidentally mutating live production data.
3. **Database Queries**: Avoid combining `where()` and `orderBy()` on different fields inside new queries unless you intend to manually build a Composite Index in the Firebase Console. Sort arrays using JavaScript `Array.prototype.sort()` where feasible for small datasets.
