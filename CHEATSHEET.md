# Teaching Torch Workflow Cheatsheet

Save this as a reference for your daily work.

## 🚀 Development Mode (Staging)
*Work here to build v2. It is safe and isolated.*
1. **Switch Branch**: `git checkout develop`
2. **Start Site**: `npm run dev:staging`
3. **Database**: Uses `tt-staging-5a60d` (Your clone project)

## 🔴 Production Mode (Live)
*Only switch here to check the live site or release updates.*
1. **Switch Branch**: `git checkout main`
2. **Start Site**: `npm run dev`
3. **Database**: Uses `tt-v1-c2a11` (The real project)

---

## 🏗️ Releasing to Live (The "Merge")
*When your v2 is ready for the world:*
1. `git checkout main`
2. `git merge develop`
3. `npm run build`
4. `npx firebase deploy --only hosting`

---

## 💾 Database Backups
*Run this before doing anything "dangerous" to the data.*
1. **Backup**: `node scripts/backup_db.cjs`
2. **Restore**: `node scripts/restore_db.cjs <filename> <env_file>`
   - Example: `node scripts/restore_db.cjs backup_xyz.json .env.staging`

---

**Current Status**: 
- **Branch**: `develop`
- **Setup**: 100% Ready.
