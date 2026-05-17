# P0 — Admin security setup (your checklist)

Complete these steps **per Firebase project** (staging first, then production).

## Separate admin users (staging vs production)

Teaching Torch uses **two Firebase projects**. Each has its own:

- **Authentication** users (staging admin ≠ production admin, even if emails look similar)
- **Firestore** database and `admins/allowedList` document
- **Auth UID** for the same email address (UIDs are **not** shared across projects)

So you should:

| Environment | Firebase project | Admin login | Allowlist |
|-------------|------------------|-------------|-----------|
| Staging | e.g. `tt-staging-5a60d` | Staging-only admin user | That user’s **staging** UID in staging Firestore |
| Production | e.g. `tt-v1-c2a11` | Production-only admin user | That user’s **production** UID in production Firestore |

Use `npm run dev:staging` + `.env.staging` for staging work. Use production `.env` only when you intentionally work on live data.

You must run the allowlist script (or manual doc) **once per project**, with the correct `serviceAccountKey.json` and UID for that project.

---

## 1. Get your Firebase Auth UID

1. Open [Firebase Console](https://console.firebase.google.com) → your project.
2. **Authentication** → **Users** → open your admin user.
3. Copy the **User UID** (long string).

Repeat for every person who should be an admin.

## 2. Seed `admins/allowedList`

### Option A — Script (recommended)

1. Project Settings → **Service accounts** → **Generate new private key** → save as  
   `scripts/serviceAccountKey.json` (never commit this file).
2. Edit `scripts/setup_admin_allowlist.js` — replace `YOUR_AUTH_UID_HERE` with real UID(s).
3. Point the script at the correct project (the JSON `project_id` must match staging or prod).
4. Run:

```bash
cd scripts
node setup_admin_allowlist.js
```

### Option B — Firebase Console (manual)

1. **Firestore** → **Start collection** (if needed): `admins`
2. Document ID: `allowedList`
3. Field: `uids` (type **array**) → add each admin UID as a string element.

Example:

```json
{ "uids": ["abc123uid", "def456uid"] }
```

## 3. Deploy Firestore rules

From the repo root, with Firebase CLI logged in and project selected:

```bash
# Staging
firebase use tt-staging-5a60d   # or your staging project id
firebase deploy --only firestore:rules

# Production (when ready)
firebase use tt-v1-c2a11        # or your production project id
firebase deploy --only firestore:rules
```

Rules must include **authenticated read** on `admins/allowedList` (the app checks membership on login).

## 4. Environment files

| File | Use |
|------|-----|
| `.env` | Local dev → **production** project (avoid for admin edits) |
| `.env.staging` | `npm run dev:staging` → **staging** project |

Copy from `.env.example` and fill `VITE_FIREBASE_*` from Firebase Console → Project settings → Your apps.

## 5. Verify in the app

1. `npm run dev:staging`
2. Log in at `/admin/login` with an **allowlisted** account → should reach `/admin` and manage mode works.
3. Log in with a Firebase user **not** in `uids` → should be signed out with “not authorized”.
4. Logged-out visitors should **not** see admin chrome or edit buttons.

## 6. Optional — production deploy

Only after staging passes: build and deploy hosting + rules to production.

---

## Configured (May 2026)

| Environment | Project | Admin sign-in | `admins/allowedList` |
|-------------|---------|---------------|----------------------|
| Staging | `tt-staging-5a60d` | Staging admin (separate account) | `qPfbIO4HU8hVwKZYpLLrqNxANgu2` |
| Production | `tt-v1-c2a11` | `teachingtorchlk+4dm1n` | `aaAJ9C5pRgJTzTFIMN4rhYzCtXOj1` |

Firestore rules (P0 allowlist read) deployed to **both** projects via Firebase CLI.

**Verify:** In each project’s Authentication tab, confirm the admin user’s UID still matches the allowlist entry after any password resets or user re-creation.
