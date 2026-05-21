import { useState } from "react";
import { getWeekNumber, makeReport } from "../data/checklist.js";
import styles from "./ReportForm.module.css";

export default function ReportForm({ onBack, onCreate, loading }) {
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
    onCreate(makeReport(finca, s, y));
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.back} onClick={onBack}>← Atrás</button>
        <h2 className={styles.title}>Nuevo reporte</h2>
      </header>

      <div className={styles.body}>
        <label className={styles.field}>
          <span className={styles.label}>Finca</span>
          <select className={styles.input} value={finca} onChange={e => setFinca(e.target.value)}>
            <option value="1">Finca 1</option>
            <option value="2">Finca 2</option>
            <option value="3">Finca 3</option>
          </select>
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Semana (1–52)</span>
          <input
            className={styles.input}
            type="number" min={1} max={52}
            value={semana}
            onChange={e => setSemana(e.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Año</span>
          <input
            className={styles.input}
            type="number" min={2024} max={2099}
            value={year}
            onChange={e => setYear(e.target.value)}
          />
        </label>

        {error && <div className={styles.error}>{error}</div>}

        <button className={styles.btnCreate} onClick={submit} disabled={loading}>
          {loading ? "Creando…" : "Crear reporte →"}
        </button>

        <p className={styles.note}>
          El reporte quedará guardado en la base de datos y podrá llenarse en
          cualquier momento durante la semana.
        </p>
      </div>
    </div>
  );
}
