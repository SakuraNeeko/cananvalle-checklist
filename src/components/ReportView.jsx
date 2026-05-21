import { useState } from "react";
import { CRITERIA, AREAS, calcScore } from "../data/checklist.js";
import SignaturePad from "./SignaturePad.jsx";
import styles from "./ReportView.module.css";

const cycleValue = (v) => (v === null ? 1 : v === 1 ? 0 : null);

export default function ReportView({
  report,
  readOnly,
  saving,
  onBack,
  onSave,
  onClose,
  onDownload,
  onChange,
}) {
  const [activeArea, setActiveArea] = useState("1");
  const [sigTarget,  setSigTarget]  = useState(null); // {areaKey, rowIdx}

  const area = report.areas[activeArea];

  // Mutators
  const updRow = (areaKey, ri, field, value) => {
    const rows = area.rows.map((r, i) =>
      i === ri ? { ...r, [field]: value } : r
    );
    onChange({ ...report, areas: { ...report.areas, [areaKey]: { ...area, rows } } });
  };

  const updCrit = (ri, ci) => {
    const rows = area.rows.map((r, i) => {
      if (i !== ri) return r;
      const criteria = r.criteria.map((v, j) => (j === ci ? cycleValue(v) : v));
      return { ...r, criteria };
    });
    onChange({ ...report, areas: { ...report.areas, [activeArea]: { ...area, rows } } });
  };

  const updArea = (field, value) => {
    onChange({
      ...report,
      areas: { ...report.areas, [activeArea]: { ...area, [field]: value } },
    });
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.back} onClick={onBack}>← Atrás</button>
        <div className={styles.headerInfo}>
          <span className={styles.headerTitle}>Finca {report.finca} · Sem. {report.semana}/{report.year}</span>
          <span className={report.closed ? styles.badgeClosed : styles.badgeOpen}>
            {report.closed ? "✓ Cerrado" : "En progreso"}
          </span>
        </div>
        <div className={styles.headerActions}>
          {!readOnly && (
            <button className={styles.btnSave} onClick={onSave} disabled={saving}>
              {saving ? "…" : "💾"}
            </button>
          )}
          {report.closed && (
            <button className={styles.btnDl} onClick={onDownload} title="Descargar PDF">⬇️</button>
          )}
        </div>
      </header>

      {/* Area tabs */}
      <div className={styles.tabs}>
        {Object.entries(AREAS).map(([key, label]) => (
          <button
            key={key}
            className={activeArea === key ? styles.tabActive : styles.tab}
            onClick={() => setActiveArea(key)}
          >
            {label.replace("ÁREA ", "A")}
          </button>
        ))}
      </div>

      {/* Criteria legend */}
      <details className={styles.legend}>
        <summary>Ver criterios 1–15 ▾</summary>
        <div className={styles.legendGrid}>
          {CRITERIA.map((c, i) => (
            <span key={i}><b>{i + 1}.</b> {c}</span>
          ))}
        </div>
      </details>

      {/* Worker cards */}
      <div className={styles.body}>
        {area.rows.map((row, ri) => {
          const s = calcScore(row);
          const pctCls = s.pct >= 80 ? styles.pctGood : s.pct >= 60 ? styles.pctWarn : styles.pctBad;
          return (
            <div key={ri} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.workerName}>{row.nombre}</span>
                <span className={`${styles.pct} ${pctCls}`}>{s.cumple}/15 · {s.pct}%</span>
              </div>

              {!readOnly ? (
                <div className={styles.bloqueRow}>
                  <span className={styles.fieldLabel}>Bloque</span>
                  <input
                    className={styles.input}
                    value={row.bloque}
                    placeholder="—"
                    onChange={e => updRow(activeArea, ri, "bloque", e.target.value)}
                  />
                </div>
              ) : row.bloque ? (
                <div className={styles.bloqueStatic}>Bloque: {row.bloque}</div>
              ) : null}

              {/* Criteria grid */}
              <div className={styles.critGrid}>
                {row.criteria.map((v, ci) =>
                  readOnly ? (
                    <div
                      key={ci}
                      className={
                        v === 1 ? styles.critOk : v === 0 ? styles.critNo : styles.critNd
                      }
                    >
                      {ci + 1} {v === 1 ? "✓" : v === 0 ? "✗" : "·"}
                    </div>
                  ) : (
                    <button
                      key={ci}
                      className={
                        v === 1 ? styles.critOk : v === 0 ? styles.critNo : styles.critNd
                      }
                      onClick={() => updCrit(ri, ci)}
                      title={CRITERIA[ci]}
                    >
                      {ci + 1} {v === 1 ? "✓" : v === 0 ? "✗" : "·"}
                    </button>
                  )
                )}
              </div>

              {/* Observations */}
              {!readOnly ? (
                <textarea
                  className={styles.obs}
                  rows={2}
                  placeholder="Observaciones…"
                  value={row.obs}
                  onChange={e => updRow(activeArea, ri, "obs", e.target.value)}
                />
              ) : row.obs ? (
                <div className={styles.obsStatic}>"{row.obs}"</div>
              ) : null}

              {/* Signature */}
              <div className={styles.sigRow}>
                {row.firma ? (
                  <>
                    <img src={row.firma} alt="firma" className={styles.sigImg} />
                    {!readOnly && (
                      <button
                        className={styles.btnSig}
                        onClick={() => setSigTarget({ areaKey: activeArea, rowIdx: ri })}
                      >
                        Cambiar firma
                      </button>
                    )}
                  </>
                ) : !readOnly ? (
                  <button
                    className={styles.btnSig}
                    onClick={() => setSigTarget({ areaKey: activeArea, rowIdx: ri })}
                  >
                    ✏️ Capturar firma
                  </button>
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
            {!readOnly ? (
              <input className={styles.input} value={area.supervisor}
                onChange={e => updArea("supervisor", e.target.value)} />
            ) : <span className={styles.footVal}>{area.supervisor || "—"}</span>}
          </div>
          <div className={styles.footField}>
            <span className={styles.fieldLabel}>Jefe de finca</span>
            {!readOnly ? (
              <input className={styles.input} value={area.jefe}
                onChange={e => updArea("jefe", e.target.value)} />
            ) : <span className={styles.footVal}>{area.jefe || "—"}</span>}
          </div>
        </div>

        {/* Actions */}
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
            <button className={styles.btnDlMain} onClick={onDownload}>
              ⬇️ Descargar reporte (PDF)
            </button>
          </div>
        )}
        <div style={{ height: 32 }} />
      </div>

      {/* Signature modal */}
      {sigTarget && (
        <SignaturePad
          existing={report.areas[sigTarget.areaKey].rows[sigTarget.rowIdx].firma}
          name={report.areas[sigTarget.areaKey].rows[sigTarget.rowIdx].nombre}
          area={AREAS[sigTarget.areaKey]}
          onCancel={() => setSigTarget(null)}
          onSave={(dataUrl) => {
            const { areaKey, rowIdx } = sigTarget;
            const aData = report.areas[areaKey];
            const rows  = aData.rows.map((r, i) =>
              i === rowIdx ? { ...r, firma: dataUrl } : r
            );
            onChange({
              ...report,
              areas: { ...report.areas, [areaKey]: { ...aData, rows } },
            });
            setSigTarget(null);
          }}
        />
      )}
    </div>
  );
}
