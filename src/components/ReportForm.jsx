import { useState } from "react";
import { getWeekNumber, makeReport } from "../data/checklist.js";
import { makeCosechaReport } from "../data/cosecha.js";
import styles from "./ReportForm.module.css";

export default function ReportForm({ onBack, onCreate, loading }) {
  const [tipo,   setTipo]   = useState("cultivo");
  const [finca,  setFinca]  = useState("1");
  const [semana, setSemana] = useState(String(getWeekNumber()));
  const [year,   setYear]   = useState(String(new Date().getFullYear()));
  const [error,  setError]  = useState("");

  const submit = () => {
    const s = Number(semana);
    const y = Number(year);
    if (!s || s < 1 || s > 52) { setError("La semana debe ser entre 1 y 52"); return; }
    if (!y || y < 2024)        { setError("Año inválido"); return; }
    setError("");
    const r = tipo === "cosecha"
      ? makeCosechaReport(finca, s, y)
      : { ...makeReport(finca, s, y), tipo: "cultivo" };
    onCreate(r);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.back} onClick={onBack}>← Atrás</button>
        <h2 className={styles.title}>Nuevo reporte</h2>
      </header>

      <div className={styles.body}>

        {/* Tipo de reporte */}
        <div className={styles.section}>
          <span className={styles.sectionLabel}>TIPO DE REPORTE</span>
          <div className={styles.tipoGrid}>
            <button
              className={tipo === "cultivo" ? styles.tipoActive : styles.tipoBtn}
              onClick={() => setTipo("cultivo")}
            >
              <span className={styles.tipoIcon}>🌿</span>
              <span className={styles.tipoName}>Cultivo</span>
              <span className={styles.tipoCod}>CU-CN-001</span>
            </button>
            <button
              className={tipo === "cosecha" ? `${styles.tipoActive} ${styles.tipoActiveCosecha}` : styles.tipoBtn}
              onClick={() => setTipo("cosecha")}
            >
              <span className={styles.tipoIcon}>🌹</span>
              <span className={styles.tipoName}>Cosecha</span>
              <span className={styles.tipoCod}>CU-CN-002</span>
            </button>
          </div>
        </div>

        {/* Finca */}
        <div className={styles.section}>
          <span className={styles.sectionLabel}>FINCA</span>
          <div className={styles.fincaGrid}>
            {["1","2","3"].map((f) => (
              <button
                key={f}
                className={finca === f
                  ? `${styles.fincaActive} ${tipo === "cosecha" ? styles.fincaActiveCosecha : ""}`
                  : styles.fincaBtn}
                onClick={() => setFinca(f)}
              >
                Finca {f}
              </button>
            ))}
          </div>
        </div>

        {/* Semana y Año */}
        <div className={styles.row2}>
          <label className={styles.field}>
            <span className={styles.label}>SEMANA (1–52)</span>
            <input
              className={styles.input}
              type="number" min={1} max={52}
              value={semana}
              onChange={e => setSemana(e.target.value)}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>AÑO</span>
            <input
              className={styles.input}
              type="number" min={2024} max={2099}
              value={year}
              onChange={e => setYear(e.target.value)}
            />
          </label>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {/* Preview card */}
        <div className={`${styles.preview} ${tipo === "cosecha" ? styles.previewCosecha : ""}`}>
          <span className={styles.previewIcon}>{tipo === "cosecha" ? "🌹" : "🌿"}</span>
          <div className={styles.previewText}>
            <strong>{tipo === "cosecha" ? "Check List Cosecha" : "Check List Cultivo"}</strong>
            <span>Finca {finca} · Semana {semana}/{year}</span>
          </div>
        </div>

        <button
          className={`${styles.btnCreate} ${tipo === "cosecha" ? styles.btnCreateCosecha : ""}`}
          onClick={submit}
          disabled={loading}
        >
          {loading ? "Creando…" : "Crear reporte →"}
        </button>

        <p className={styles.note}>
          El reporte se guardará en la base de datos y podrá completarse durante toda la semana.
        </p>
      </div>
    </div>
  );
}
