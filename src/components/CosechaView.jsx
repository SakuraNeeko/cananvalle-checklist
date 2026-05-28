import { useState } from "react";
import {
  QUALITY_COLS, PROCESS_CRITERIA, COSECHA_AREAS,
  calcPctFN, calcCosechaProc, calcAutoFN,
} from "../data/cosecha.js";
import SignaturePad from "./SignaturePad.jsx";
import styles from "./CosechaView.module.css";

const cycle = (v) => (v === null ? 1 : v === 1 ? 0 : null);

// Campos calculados automáticamente (solo lectura)
const AUTO_KEYS = ["tallos_fn_malla"];

export default function CosechaView({
  report, readOnly, saving,
  onBack, onSave, onClose, onDownload, onChange,
}) {
  const [activeArea,  setActiveArea]  = useState("1");
  const [sigTarget,   setSigTarget]   = useState(null);
  const [section,     setSection]     = useState("calidad");
  const [editingName, setEditingName] = useState(null);

  const area = report.areas[activeArea];

  // ─── Mutators ─────────────────────────────────────────────────────────────
  const updNombre = (ri, value) => {
    const rows = area.rows.map((r, i) => i !== ri ? r : { ...r, nombre: value });
    onChange({ ...report, areas: { ...report.areas, [activeArea]: { ...area, rows } } });
  };

  const updCalidad = (ri, field, value) => {
    const rows = area.rows.map((r, i) => {
      if (i !== ri) return r;
      const newCal = { ...r.calidad, [field]: value };
      // Auto-recalculate tallos_fn_malla
      newCal.tallos_fn_malla = String(calcAutoFN(newCal));
      return { ...r, calidad: newCal };
    });
    onChange({ ...report, areas: { ...report.areas, [activeArea]: { ...area, rows } } });
  };

  const updVariedad = (ri, value) => {
    const rows = area.rows.map((r, i) => i !== ri ? r : { ...r, variedad: value });
    onChange({ ...report, areas: { ...report.areas, [activeArea]: { ...area, rows } } });
  };

  const updProcCrit = (ri, ci) => {
    const rows = area.rows.map((r, i) => {
      if (i !== ri) return r;
      const criteria = r.proceso.criteria.map((v, j) => j === ci ? cycle(v) : v);
      return { ...r, proceso: { ...r.proceso, criteria } };
    });
    onChange({ ...report, areas: { ...report.areas, [activeArea]: { ...area, rows } } });
  };

  const updProcField = (ri, field, value) => {
    const rows = area.rows.map((r, i) =>
      i !== ri ? r : { ...r, proceso: { ...r.proceso, [field]: value } }
    );
    onChange({ ...report, areas: { ...report.areas, [activeArea]: { ...area, rows } } });
  };

  const updArea = (field, value) =>
    onChange({ ...report, areas: { ...report.areas, [activeArea]: { ...area, [field]: value } } });

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.back} onClick={onBack}>← Atrás</button>
        <div className={styles.headerInfo}>
          <span className={styles.headerTitle}>
            🌹 Cosecha · Finca {report.finca} · Sem. {report.semana}/{report.year}
          </span>
          <span className={report.closed ? styles.badgeClosed : styles.badgeOpen}>
            {report.closed ? "✓ Cerrado" : "En progreso"}
          </span>
        </div>
        <div className={styles.headerActions}>
          {!readOnly && <button className={styles.btnSaveHdr} onClick={onSave} disabled={saving}>{saving ? "…" : "💾"}</button>}
          {report.closed && <button className={styles.btnSaveHdr} onClick={onDownload}>⬇️</button>}
        </div>
      </header>

      {/* Area tabs */}
      <div className={styles.tabs}>
        {Object.entries(COSECHA_AREAS).map(([key, label]) => (
          <button key={key}
            className={activeArea === key ? styles.tabActive : styles.tab}
            onClick={() => { setActiveArea(key); setEditingName(null); }}>
            {label.replace("ÁREA ", "A")}
          </button>
        ))}
      </div>

      {/* Section toggle */}
      <div className={styles.sectionToggle}>
        <button className={section === "calidad" ? styles.secActive : styles.secBtn} onClick={() => setSection("calidad")}>
          📊 Calidad
        </button>
        <button className={section === "proceso" ? styles.secActive : styles.secBtn} onClick={() => setSection("proceso")}>
          ✅ Proceso
        </button>
      </div>

      <div className={styles.body}>

        {/* ── CALIDAD ── */}
        {section === "calidad" && area.rows.map((row, ri) => {
          const pct   = calcPctFN(row);
          const fnBad = Number(row.calidad.tallos_malla) > 0 && pct > 8;
          const isEditing = editingName === ri;

          return (
            <div key={ri} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.nameRow}>
                  {isEditing ? (
                    <input
                      autoFocus
                      className={styles.nameInput}
                      value={row.nombre}
                      onChange={e => updNombre(ri, e.target.value)}
                      onBlur={() => setEditingName(null)}
                      onKeyDown={e => { if (e.key === "Enter") setEditingName(null); }}
                    />
                  ) : (
                    <span className={styles.workerName}>{row.nombre}</span>
                  )}
                  {!readOnly && !isEditing && (
                    <button className={styles.btnEditName} title="Editar nombre"
                      onClick={() => setEditingName(ri)}>✏️</button>
                  )}
                </div>
                {Number(row.calidad.tallos_malla) > 0 && (
                  <span className={fnBad ? styles.fnBad : styles.fnOk}>
                    FN: {pct}% {fnBad ? "⚠️" : "✓"}
                  </span>
                )}
              </div>

              {/* Variedad */}
              <div className={styles.fieldRow}>
                <span className={styles.fieldLabel}>Variedad</span>
                {readOnly
                  ? <span className={styles.fieldVal}>{row.variedad || "—"}</span>
                  : <input className={styles.input} value={row.variedad} placeholder="—"
                      onChange={e => updVariedad(ri, e.target.value)} />
                }
              </div>

              {/* Quality fields */}
              <div className={styles.qualGrid}>
                {QUALITY_COLS.map((col) => {
                  const isAuto = AUTO_KEYS.includes(col.key);
                  return (
                    <label key={col.key} className={styles.qualField}>
                      <span className={styles.qualLabel}>
                        {col.label} {isAuto ? "🔢" : ""}
                      </span>
                      {readOnly || isAuto ? (
                        <span className={`${styles.qualVal} ${isAuto ? styles.autoCalc : ""}`}>
                          {row.calidad[col.key] || "0"}
                        </span>
                      ) : (
                        <input type="number" min="0" className={styles.qualInput}
                          value={row.calidad[col.key]}
                          onChange={e => updCalidad(ri, col.key, e.target.value)}
                          placeholder="0" />
                      )}
                    </label>
                  );
                })}
                {/* % FN calculado */}
                <label className={styles.qualField}>
                  <span className={styles.qualLabel}>% FLOR NAC.</span>
                  <span className={`${styles.qualVal} ${Number(row.calidad.tallos_malla) > 0 ? (fnBad ? styles.fnBadText : styles.fnOkText) : ""}`}>
                    {Number(row.calidad.tallos_malla) > 0 ? pct + "%" : "—"}
                  </span>
                </label>
              </div>
            </div>
          );
        })}

        {/* ── PROCESO ── */}
        {section === "proceso" && area.rows.map((row, ri) => {
          const s = calcCosechaProc(row);
          const pctCls = s.pct >= 80 ? styles.pctGood : s.pct >= 60 ? styles.pctWarn : styles.pctBad;
          const isEditing = editingName === ri;

          return (
            <div key={ri} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.nameRow}>
                  {isEditing ? (
                    <input
                      autoFocus
                      className={styles.nameInput}
                      value={row.nombre}
                      onChange={e => updNombre(ri, e.target.value)}
                      onBlur={() => setEditingName(null)}
                      onKeyDown={e => { if (e.key === "Enter") setEditingName(null); }}
                    />
                  ) : (
                    <span className={styles.workerName}>{row.nombre}</span>
                  )}
                  {!readOnly && !isEditing && (
                    <button className={styles.btnEditName} title="Editar nombre"
                      onClick={() => setEditingName(ri)}>✏️</button>
                  )}
                </div>
                <span className={`${styles.pct} ${pctCls}`}>{s.cumple}/{s.total} · {s.pct}%</span>
              </div>

              <div className={styles.critGrid}>
                {PROCESS_CRITERIA.map((crit, ci) => {
                  const v   = row.proceso.criteria[ci];
                  const cls = v === 1 ? styles.critOk : v === 0 ? styles.critNo : styles.critNd;
                  return readOnly ? (
                    <div key={ci} className={cls}>
                      <span className={styles.critNum}>{ci + 1}</span>
                      <span className={styles.critName}>{crit}</span>
                      <span>{v === 1 ? "✓" : v === 0 ? "✗" : "·"}</span>
                    </div>
                  ) : (
                    <button key={ci} className={cls} onClick={() => updProcCrit(ri, ci)}>
                      <span className={styles.critNum}>{ci + 1}</span>
                      <span className={styles.critName}>{crit}</span>
                      <span>{v === 1 ? "✓" : v === 0 ? "✗" : "·"}</span>
                    </button>
                  );
                })}
              </div>

              {readOnly
                ? row.proceso.obs ? <div className={styles.obsStatic}>"{row.proceso.obs}"</div> : null
                : <textarea className={styles.obs} rows={2} placeholder="Observaciones…"
                    value={row.proceso.obs}
                    onChange={e => updProcField(ri, "obs", e.target.value)} />
              }

              <div className={styles.sigRow}>
                {row.proceso.firma ? (
                  <>
                    <img src={row.proceso.firma} alt="firma" className={styles.sigImg} />
                    {!readOnly && (
                      <button className={styles.btnSig}
                        onClick={() => setSigTarget({ areaKey: activeArea, rowIdx: ri })}>Cambiar</button>
                    )}
                  </>
                ) : !readOnly ? (
                  <button className={styles.btnSig}
                    onClick={() => setSigTarget({ areaKey: activeArea, rowIdx: ri })}>✏️ Capturar firma</button>
                ) : (
                  <span className={styles.noSig}>Sin firma</span>
                )}
              </div>
            </div>
          );
        })}

        {/* Supervisor / Jefe */}
        <div className={styles.footCard}>
          <div className={styles.footField}>
            <span className={styles.fieldLabel}>Supervisor</span>
            {readOnly
              ? <span className={styles.footVal}>{area.supervisor || "—"}</span>
              : <input className={styles.input} value={area.supervisor}
                  onChange={e => updArea("supervisor", e.target.value)} />
            }
          </div>
          <div className={styles.footField}>
            <span className={styles.fieldLabel}>Jefe de finca</span>
            {readOnly
              ? <span className={styles.footVal}>{area.jefe || "—"}</span>
              : <input className={styles.input} value={area.jefe}
                  onChange={e => updArea("jefe", e.target.value)} />
            }
          </div>
        </div>

        {!readOnly && (
          <div className={styles.bottomActions}>
            <button className={styles.btnSaveMain} onClick={onSave} disabled={saving}>
              {saving ? "Guardando…" : "💾 Guardar progreso"}
            </button>
            <button className={styles.btnClose} onClick={onClose} disabled={saving}>
              ✅ Cerrar reporte y descargar PDF
            </button>
          </div>
        )}
        {readOnly && (
          <div className={styles.bottomActions}>
            <button className={styles.btnDlMain} onClick={onDownload}>⬇️ Descargar reporte (PDF)</button>
          </div>
        )}
        <div style={{ height: 32 }} />
      </div>

      {sigTarget && (
        <SignaturePad
          existing={report.areas[sigTarget.areaKey].rows[sigTarget.rowIdx].proceso.firma}
          name={report.areas[sigTarget.areaKey].rows[sigTarget.rowIdx].nombre}
          area={COSECHA_AREAS[sigTarget.areaKey]}
          onCancel={() => setSigTarget(null)}
          onSave={(dataUrl) => {
            const { areaKey, rowIdx } = sigTarget;
            const aData = report.areas[areaKey];
            const rows  = aData.rows.map((r, i) =>
              i !== rowIdx ? r : { ...r, proceso: { ...r.proceso, firma: dataUrl } }
            );
            onChange({ ...report, areas: { ...report.areas, [areaKey]: { ...aData, rows } } });
            setSigTarget(null);
          }}
        />
      )}
    </div>
  );
}
