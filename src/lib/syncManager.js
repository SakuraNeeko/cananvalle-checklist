// ─── Sync Manager ─────────────────────────────────────────────────────────────
// Local-first strategy:
//   • Every write saves to IndexedDB immediately (works offline)
//   • Then tries Supabase in background
//   • If Supabase fails → op goes into pending queue
//   • When coming back online → queue is drained automatically

import {
  localSaveReport, localGetReport, localGetAllReports,
  localDeleteReport, localAddPendingOp, localGetPendingOps,
  localRemovePendingOp, localCountPendingOps,
} from "./localDB.js";
import * as remote from "./supabase.js";

// ── Online helpers ────────────────────────────────────────────────────────────

export const isOnline = () => navigator.onLine;

// Listeners registered by App.jsx
const _onSyncListeners = new Set();
export const onSyncChange = (fn) => { _onSyncListeners.add(fn); return () => _onSyncListeners.delete(fn); };
const notifySync = () => _onSyncListeners.forEach((fn) => fn());

// ── Pending count (reactive) ──────────────────────────────────────────────────

export const getPendingCount = () => localCountPendingOps();

// ── LOAD ─────────────────────────────────────────────────────────────────────

export async function loadReports() {
  // Always return local first (instant)
  const local = await localGetAllReports();

  // If online, refresh from server in background
  if (isOnline()) {
    try {
      const fresh = await remote.fetchReports();
      // Save each to local (upsert)
      await Promise.all(
        fresh.map(async (meta) => {
          const existing = await localGetReport(meta.id);
          if (existing) {
            await localSaveReport({ ...existing, ...meta });
          } else {
            // Only metadata here; full data loaded on open
            await localSaveReport({ ...meta, areas: {} });
          }
        })
      );
      return fresh;
    } catch {
      // offline or error — return local cache
    }
  }
  return local;
}

export async function loadReport(id) {
  if (isOnline()) {
    try {
      const fresh = await remote.fetchReport(id);
      await localSaveReport(fresh);
      return fresh;
    } catch {}
  }
  const local = await localGetReport(id);
  if (!local) throw new Error("Reporte no encontrado localmente");
  return local;
}

// ── CREATE ────────────────────────────────────────────────────────────────────

export async function createReport(report) {
  const id  = crypto.randomUUID();
  const now = new Date().toISOString();
  const full = { ...report, id, created_at: now, closed: false };

  // 1. Save locally immediately
  await localSaveReport(full);

  if (isOnline()) {
    try {
      const saved = await remote.createReport({ ...report, id });
      await localSaveReport(saved);
      notifySync();
      return saved;
    } catch {}
  }

  // Queue for later
  await localAddPendingOp({ type: "create", payload: { ...report, id } });
  notifySync();
  return full;
}

// ── SAVE (update areas) ───────────────────────────────────────────────────────

export async function saveReport(id, areas) {
  // 1. Update local
  const existing = await localGetReport(id);
  const updated  = { ...existing, areas };
  await localSaveReport(updated);

  if (isOnline()) {
    try {
      const saved = await remote.saveReport(id, areas);
      await localSaveReport({ ...updated, ...saved });
      notifySync();
      return saved;
    } catch {}
  }

  // Queue
  await localAddPendingOp({ type: "save", payload: { id, areas } });
  notifySync();
  return updated;
}

// ── CLOSE ─────────────────────────────────────────────────────────────────────

export async function closeReport(id, areas) {
  const existing  = await localGetReport(id);
  const closedAt  = new Date().toISOString();
  const updated   = { ...existing, areas, closed: true, closed_at: closedAt };
  await localSaveReport(updated);

  if (isOnline()) {
    try {
      const saved = await remote.closeReport(id, areas);
      await localSaveReport({ ...updated, ...saved });
      notifySync();
      return saved;
    } catch {}
  }

  await localAddPendingOp({ type: "close", payload: { id, areas } });
  notifySync();
  return updated;
}

// ── DELETE ────────────────────────────────────────────────────────────────────

export async function deleteReport(id) {
  await localDeleteReport(id);

  if (isOnline()) {
    try {
      await remote.deleteReport(id);
      notifySync();
      return;
    } catch {}
  }

  await localAddPendingOp({ type: "delete", payload: { id } });
  notifySync();
}

// ── SYNC QUEUE ────────────────────────────────────────────────────────────────

export async function syncPending() {
  if (!isOnline()) return 0;

  const ops = await localGetPendingOps();
  if (ops.length === 0) return 0;

  let synced = 0;
  for (const op of ops) {
    try {
      switch (op.type) {
        case "create": {
          const saved = await remote.createReport(op.payload);
          await localSaveReport(saved);
          break;
        }
        case "save": {
          const saved = await remote.saveReport(op.payload.id, op.payload.areas);
          const local = await localGetReport(op.payload.id);
          await localSaveReport({ ...local, ...saved });
          break;
        }
        case "close": {
          const saved = await remote.closeReport(op.payload.id, op.payload.areas);
          const local = await localGetReport(op.payload.id);
          await localSaveReport({ ...local, ...saved });
          break;
        }
        case "delete": {
          await remote.deleteReport(op.payload.id);
          break;
        }
      }
      await localRemovePendingOp(op.opId);
      synced++;
    } catch {
      // Keep in queue, try next time
    }
  }

  if (synced > 0) notifySync();
  return synced;
}

// ── Auto-sync when coming back online ─────────────────────────────────────────

if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    syncPending().catch(() => {});
  });
}
