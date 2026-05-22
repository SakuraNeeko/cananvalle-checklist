import { useState, useEffect, useCallback } from "react";
import Home       from "./components/Home.jsx";
import ReportForm from "./components/ReportForm.jsx";
import ReportList from "./components/ReportList.jsx";
import ReportView from "./components/ReportView.jsx";
import {
  fetchReports,
  fetchReport,
  createReport,
  saveReport,
  closeReport as closeReportDB,
  deleteReport,
} from "./lib/supabase.js";
import { downloadReport } from "./lib/reportGen.js";

export default function App() {
  const [screen,   setScreen]   = useState("home");
  const [reports,  setReports]  = useState([]);
  const [report,   setReport]   = useState(null);
  const [readOnly, setReadOnly] = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [toast,    setToast]    = useState("");

  const tip = (msg, ms = 2800) => {
    setToast(msg);
    setTimeout(() => setToast(""), ms);
  };

  const loadReports = useCallback(async () => {
    try { setReports(await fetchReports()); } catch { tip("Error al cargar reportes"); }
  }, []);

  useEffect(() => { loadReports(); }, []);

  // ─── Actions ─────────────────────────────────────────────────────────────

  const handleCreate = async (newReport) => {
    setLoading(true);
    try {
      const saved = await createReport(newReport);
      await loadReports();
      setReport(saved);
      setReadOnly(false);
      setScreen("report");
    } catch { tip("Error al crear el reporte"); }
    setLoading(false);
  };

  const handleOpen = async (id) => {
    setLoading(true);
    try {
      const r = await fetchReport(id);
      setReport(r);
      setReadOnly(r.closed);
      setScreen("report");
    } catch { tip("Error al abrir el reporte"); }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!report) return;
    setSaving(true);
    try {
      const updated = await saveReport(report.id, report.areas);
      setReport(updated);
      await loadReports();
      tip("Guardado correctamente ✓");
    } catch { tip("Error al guardar"); }
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
      const updated = await closeReportDB(report.id, report.areas);
      setReport(updated);
      setReadOnly(true);
      await loadReports();
      downloadReport(updated);
      tip("Reporte cerrado y descargado ✓");
    } catch { tip("Error al cerrar el reporte"); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    try {
      await deleteReport(id);
      await loadReports();
      tip("Reporte eliminado");
    } catch { tip("Error al eliminar el reporte"); }
  };

  const handleDownload = () => {
    if (report) downloadReport(report);
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div style={{ maxWidth: 540, margin: "0 auto", minHeight: "100vh", position: "relative" }}>

      {/* Loading overlay */}
      {loading && (
        <div style={{
          position:"fixed", inset:0, background:"rgba(255,255,255,.75)",
          display:"flex", alignItems:"center", justifyContent:"center",
          zIndex:2000, fontSize:15, color:"#1a5c2e", fontWeight:600,
        }}>
          Cargando…
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)",
          background:"#1a5c2e", color:"#fff", padding:"10px 22px",
          borderRadius:40, fontSize:13, fontWeight:500, zIndex:3000,
          boxShadow:"0 4px 20px rgba(0,0,0,.2)", whiteSpace:"nowrap",
          pointerEvents:"none",
        }}>
          {toast}
        </div>
      )}

      {screen === "home" && (
        <Home
          recents={reports}
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
        <ReportView
          report={report}
          readOnly={readOnly}
          saving={saving}
          onBack={()  => { setScreen(reports.some((r) => r.id === report.id) ? "list" : "home"); loadReports(); }}
          onChange={setReport}
          onSave={handleSave}
          onClose={handleClose}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
}
