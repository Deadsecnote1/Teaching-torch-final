import { doc, getDoc } from 'firebase/firestore';

/**
 * Returns true if uid is listed in admins/allowedList.
 * Requires Firestore rules to allow authenticated read on that document.
 */
export async function resolveIsAdmin(db, uid) {
  if (!db || !uid) return false;

  try {
    const snap = await getDoc(doc(db, 'admins', 'allowedList'));
    if (!snap.exists()) return false;
    const uids = snap.data()?.uids;
    return Array.isArray(uids) && uids.includes(uid);
  } catch (err) {
    console.error('[admin] allowlist check failed:', err);
    return false;
  }
}
