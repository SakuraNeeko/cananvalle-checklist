// ─── IndexedDB wrapper ────────────────────────────────────────────────────────
// Stores: 'reports' (full data) + 'pending_ops' (sync queue)

const DB_NAME    = "cananvalle_v1";
const DB_VERSION = 1;

let _db = null;

function openDB() {
  if (_db) return Promise.resolve(_db);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("reports")) {
        db.createObjectStore("reports", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("pending_ops")) {
        db.createObjectStore("pending_ops", { keyPath: "opId", autoIncrement: true });
      }
    };

    req.onsuccess = (e) => { _db = e.target.result; resolve(_db); };
    req.onerror   = (e) => reject(e.target.error);
  });
}

// Generic helpers
function run(storeName, mode, fn) {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx    = db.transaction(storeName, mode);
        const store = tx.objectStore(storeName);
        const req   = fn(store);
        if (req && typeof req.onsuccess !== "undefined") {
          req.onsuccess = () => resolve(req.result);
          req.onerror   = () => reject(req.error);
        } else {
          tx.oncomplete = () => resolve();
          tx.onerror    = () => reject(tx.error);
        }
      })
  );
}

// ── Reports ───────────────────────────────────────────────────────────────────

export const localSaveReport = (report) =>
  run("reports", "readwrite", (s) => s.put(report));

export const localGetReport = (id) =>
  run("reports", "readonly", (s) => s.get(id));

export const localDeleteReport = (id) =>
  run("reports", "readwrite", (s) => s.delete(id));

export function localGetAllReports() {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx      = db.transaction("reports", "readonly");
        const store   = tx.objectStore("reports");
        const req     = store.getAll();
        req.onsuccess = () => {
          // Return only metadata (like fetchReports does), sorted newest first
          const all = (req.result || []).map((r) => ({
            id:         r.id,
            tipo:       r.tipo,
            finca:      r.finca,
            semana:     r.semana,
            year:       r.year,
            closed:     r.closed,
            created_at: r.created_at,
            closed_at:  r.closed_at,
          }));
          all.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          resolve(all);
        };
        req.onerror = () => reject(req.error);
      })
  );
}

// ── Pending ops queue ─────────────────────────────────────────────────────────

export function localAddPendingOp(op) {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx    = db.transaction("pending_ops", "readwrite");
        const store = tx.objectStore("pending_ops");
        const req   = store.add({ ...op, timestamp: Date.now() });
        req.onsuccess = () => resolve(req.result); // returns opId
        req.onerror   = () => reject(req.error);
      })
  );
}

export function localGetPendingOps() {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx      = db.transaction("pending_ops", "readonly");
        const store   = tx.objectStore("pending_ops");
        const req     = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror   = () => reject(req.error);
      })
  );
}

export const localRemovePendingOp = (opId) =>
  run("pending_ops", "readwrite", (s) => s.delete(opId));

export function localCountPendingOps() {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx      = db.transaction("pending_ops", "readonly");
        const req     = tx.objectStore("pending_ops").count();
        req.onsuccess = () => resolve(req.result);
        req.onerror   = () => reject(req.error);
      })
  );
}
