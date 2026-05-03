# Teaching Torch - Project Architecture & AI Instructions

## ⚠️ THE GOLDEN RULE: TOTAL ISOLATION
The **Advanced Level (A/L)** system and the **Grade 6-11** system MUST be treated as two entirely independent applications. 
- **NEVER** share data between them.
- **NEVER** use `DataContext` for A/L pages.
- **NEVER** use `ALContext` for Grade 6-11 pages.
- **NEVER** mix subject IDs. Even if a subject has the same name (e.g., "Buddhism"), the A/L version is a different entity in a different collection.

---

## 🏗️ Database Structure (Firestore)

### 1. Grade 6-11 Collections (Standard)
- `grades`, `subjects`, `textbooks`, `papers`, `videos`, `notes`, `settings`.

### 2. A/L Collections (Prefixed)
- `al_streams`: Science, Commerce, Arts, Technology.
- `al_subjects`: A/L specific subjects linked to streams via `streamId`.
- `al_resource_types`: Text Books, Past Papers, etc.
- `al_sub_categories`: Sub-groups inside resource types.
- `al_resources`: The actual file links/metadata.

---

## 🧠 State Management (React Contexts)
- **`DataContext.jsx`**: Powers Grades 6-11.
- **`ALContext.jsx`**: Powers the entire A/L section.
- **`LanguageContext.jsx`**: Shared language preference (Sinhala/Tamil/English).

---

## 🛠️ Strict Filtering Logic (A/L Section)
To maintain total control over content visibility, we use **Strict Explicit Linking**:

1. **Explicit Subject IDs**: `al_resource_types` and `al_sub_categories` contain a `subjectIds` array. 
2. **Strict Mode**: A category is ONLY visible if the current `subjectId` is present in that array.
3. **Empty Array = Hidden**: If the `subjectIds` list is empty, the item is HIDDEN from the website (No global fallbacks allowed).
4. **Smart Hiding**: Empty categories (0 resources) are hidden from students (`!isManageMode`) to keep the UI clean, but shown to Admins for uploading.

---

## 🎨 UI & Design Standards
- **Resource Cards (A/L)**: Sub-category boxes have a **fixed max-height (280px)**.
- **Scrollbars**: Lists with more than 4 files must use a thin, modern scrollbar (`.resources-list`).
- **Isolation in Admin**: The `ALAdminTab.jsx` is the heart of A/L management within the shared dashboard.

---

## 📂 Folder Structure
- `src/pages/`: Grade 6-11 Page components.
- `src/pages/al/`: A/L Page components (Strictly isolated).
- `src/components/admin/`: Admin-specific components.
- `scripts/`: Data population and migration tools.

---

**Note to future AI:** When modifying the A/L section, ensure you maintain the `al_` prefixing and never remove the strict filtering logic in `ALResourcesPage.jsx` and `ALResourceTypesPage.jsx`.
