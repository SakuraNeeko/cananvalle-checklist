import { useState, useEffect, useCallback } from "react";
import Home        from "./components/Home.jsx";
import ReportForm  from "./components/ReportForm.jsx";
import ReportList  from "./components/ReportList.jsx";
import ReportView  from "./components/ReportView.jsx";
import CosechaView from "./components/CosechaView.jsx";
import * as sync   from "./lib/syncManager.js";
import { downloadReport        } from "./lib/reportGen.js";
import { downloadCosechaReport } from "./lib/cosechaReportGen.js";

export default function App() {
  const [screen,       setScreen]       = useState("home");
  const [reports,      setReports]      = useState([]);
  const [report,       setReport]       = useState(null);
  const [readOnly,     setReadOnly]     = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [toast,        setToast]        = useState({ msg: "", type: "ok" });
  const [online,       setOnline]       = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);

  // ─── Online / offline tracking ──────────────────────────────────────────
  useEffect(() => {
    const go  = () => { setOnline(true);  refreshPending(); };
    const go2 = () => setOnline(false);
    window.addEventListener("online",  go);
    window.addEventListener("offline", go2);
    return () => { window.removeEventListener("online", go); window.removeEventListener("offline", go2); };
  }, []);

  // Track pending ops count
  const refreshPending = useCallback(async () => {
    const n = await sync.getPendingCount();
    setPendingCount(n);
  }, []);

  useEffect(() => {
    refreshPending();
    const unsub = sync.onSyncChange(refreshPending);
    return unsub;
  }, []);

  // ─── Toast ──────────────────────────────────────────────────────────────
  const tip = (msg, type = "ok", ms = 2800) => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "ok" }), ms);
  };

  // ─── Load reports ────────────────────────────────────────────────────────
  const loadReports = useCallback(async () => {
    try { setReports(await sync.loadReports()); } catch { tip("Error al cargar reportes", "err"); }
  }, []);

  useEffect(() => { loadReports(); }, []);

  // ─── Helpers ─────────────────────────────────────────────────────────────
  const dlReport = (r) =>
    r.tipo === "cosecha" ? downloadCosechaReport(r) : downloadReport(r);

  // ─── Actions ─────────────────────────────────────────────────────────────
  const handleCreate = async (newReport) => {
    setLoading(true);
    try {
      const saved = await sync.createReport(newReport);
      await loadReports();
      setReport(saved);
      setReadOnly(false);
      setScreen("report");
      tip(online ? "Reporte creado ✓" : "Creado sin conexión — se sincronizará al conectarse", online ? "ok" : "warn");
    } catch { tip("Error al crear el reporte", "err"); }
    setLoading(false);
  };

  const handleOpen = async (id) => {
    setLoading(true);
    try {
      const r = await sync.loadReport(id);
      setReport(r);
      setReadOnly(r.closed);
      setScreen("report");
    } catch { tip("Error al abrir el reporte", "err"); }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!report) return;
    setSaving(true);
    try {
      const updated = await sync.saveReport(report.id, report.areas);
      setReport(updated);
      await loadReports();
      tip(online ? "Guardado ✓" : "Guardado localmente — se sincronizará al conectarse 📶", online ? "ok" : "warn");
    } catch { tip("Error al guardar", "err"); }
    setSaving(false);
  };

  const handleClose = async () => {
    if (!report) return;
    const ok = window.confirm(
      "¿Cerrar el reporte?\nUna vez cerrado no se podrá editar.\nSe descargará el reporte en formato HTML para imprimir como PDF."
    );
    if (!ok) return;
    setSaving(true);
    try {
      const updated = await sync.closeReport(report.id, report.areas);
      setReport(updated);
      setReadOnly(true);
      await loadReports();
      dlReport(updated);
      tip("Reporte cerrado y descargado ✓");
    } catch { tip("Error al cerrar el reporte", "err"); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    try {
      await sync.deleteReport(id);
      await loadReports();
      tip("Reporte eliminado");
    } catch { tip("Error al eliminar", "err"); }
  };

  const handleDownload = () => { if (report) dlReport(report); };

  const backScreen = () => {
    setScreen(reports.some((r) => r.id === report?.id) ? "list" : "home");
    loadReports();
  };

  const commonViewProps = {
    report, readOnly, saving,
    onBack: backScreen,
    onChange: setReport,
    onSave: handleSave,
    onClose: handleClose,
    onDownload: handleDownload,
  };

  // ─── Toast colors ────────────────────────────────────────────────────────
  const toastBg = toast.type === "err" ? "#b71c1c" : toast.type === "warn" ? "#e65100" : "#2e7d32";

  return (
    <div style={{ maxWidth: 540, margin: "0 auto", minHeight: "100vh", position: "relative" }}>

      {/* Loading overlay */}
      {loading && (
        <div style={{
          position:"fixed", inset:0, background:"rgba(255,255,255,.8)",
          display:"flex", alignItems:"center", justifyContent:"center",
          zIndex:2000, fontSize:15, color:"#1a5c2e", fontWeight:600,
        }}>
          Cargando…
        </div>
      )}

      {/* Online / offline pill */}
      <div style={{
        position:"fixed", top:10, right:12, zIndex:1500,
        display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4,
      }}>
        {!online && (
          <div style={{
            background:"#e65100", color:"#fff",
            fontSize:11, fontWeight:600, padding:"3px 10px",
            borderRadius:20, boxShadow:"0 2px 8px rgba(0,0,0,.2)",
          }}>
            📵 Sin conexión
          </div>
        )}
        {pendingCount > 0 && online && (
          <div style={{
            background:"#1565c0", color:"#fff",
            fontSize:11, fontWeight:600, padding:"3px 10px",
            borderRadius:20, boxShadow:"0 2px 8px rgba(0,0,0,.2)",
            cursor:"pointer",
          }}
          onClick={() => sync.syncPending().then(loadReports)}>
            🔄 {pendingCount} pendiente{pendingCount > 1 ? "s" : ""} — Sincronizar
          </div>
        )}
      </div>

      {/* Toast */}
      {toast.msg && (
        <div style={{
          position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)",
          background: toastBg, color:"#fff", padding:"10px 22px",
          borderRadius:40, fontSize:13, fontWeight:500, zIndex:3000,
          boxShadow:"0 4px 20px rgba(0,0,0,.25)", whiteSpace:"nowrap",
          pointerEvents:"none", maxWidth:"90vw", textAlign:"center",
        }}>
          {toast.msg}
        </div>
      )}

      {screen === "home" && (
        <Home
          recents={reports}
          online={online}
          onNew={()  => setScreen("form")}
          onList={()  => { loadReports(); setScreen("list"); }}
          onOpen={handleOpen}
        />
      )}

      {screen === "form" && (
        <ReportForm
          loading={loading}
          onBack={()  => setScreen("home")}
          onCreate={handleCreate}
        />
      )}

      {screen === "list" && (
        <ReportList
          reports={reports}
          onBack={()  => setScreen("home")}
          onOpen={handleOpen}
          onDelete={handleDelete}
        />
      )}

      {screen === "report" && report && (
        report.tipo === "cosecha"
          ? <CosechaView {...commonViewProps} />
          : <ReportView  {...commonViewProps} />
      )}
    </div>
  );
}
