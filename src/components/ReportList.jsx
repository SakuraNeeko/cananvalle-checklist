import { useState } from "react";
import styles from "./ReportList.module.css";

export default function ReportList({ reports, onBack, onOpen, onDelete }) {
  const [confirmId, setConfirmId] = useState(null);
  const [deleting,  setDeleting]  = useState(false);

  const open   = reports.filter((r) => !r.closed);
  const closed = reports.filter((r) =>  r.closed);

  const fmt = (r) =>
    new Date(r.created_at).toLocaleDateString("es-EC", {
      day: "2-digit", month: "short", year: "numeric",
    });

  const handleDelete = async (id) => {
    setDeleting(true);
    await onDelete(id);
    setConfirmId(null);
    setDeleting(false);
  };

  const Card = ({ r }) => (
    <div className={styles.card}>
      <div className={styles.cardBody} onClick={() => onOpen(r.id)}>
        <div className={styles.row}>
          <div className={styles.nameCol}>
            <span className={r.tipo === "cosecha" ? styles.tipoCosecha : styles.tipoCultivo}>
              {r.tipo === "cosecha" ? "🌹 Cosecha" : "🌿 Cultivo"}
            </span>
            <span className={styles.name}>
              Finca {r.finca} &middot; Semana {r.semana}/{r.year}
            </span>
          </div>
          <span className={r.closed ? styles.badgeClosed : styles.badgeOpen}>
            {r.closed ? "✓ Cerrado" : "En progreso"}
          </span>
        </div>
        <span className={styles.date}>{fmt(r)}</span>
      </div>

      {/* Botón eliminar solo para reportes cerrados */}
      {r.closed && (
        <button
          className={styles.btnDelete}
          title="Eliminar reporte"
          onClick={(e) => { e.stopPropagation(); setConfirmId(r.id); }}
        >
          🗑
        </button>
      )}
    </div>
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.back} onClick={onBack}>← Atrás</button>
        <h2 className={styles.title}>Reportes guardados</h2>
      </header>

      <div className={styles.body}>
        {reports.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📋</div>
            <p>No hay reportes aún.<br />Crea el primero con "Nuevo reporte".</p>
          </div>
        )}

        {open.length > 0 && (
          <section>
            <div className={styles.sectionLabel}>EN PROGRESO</div>
            {open.map((r) => <Card key={r.id} r={r} />)}
          </section>
        )}

        {closed.length > 0 && (
          <section style={{ marginTop: 20 }}>
            <div className={styles.sectionLabel}>CERRADOS</div>
            {closed.map((r) => <Card key={r.id} r={r} />)}
          </section>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      {confirmId && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalIcon}>🗑️</div>
            <h3 className={styles.modalTitle}>¿Eliminar reporte?</h3>
            <p className={styles.modalText}>
              Esta acción es <strong>permanente</strong> y no se puede deshacer.
              El reporte y todas sus firmas serán eliminados.
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.btnCancel}
                onClick={() => setConfirmId(null)}
                disabled={deleting}
              >
                Cancelar
              </button>
              <button
                className={styles.btnConfirm}
                onClick={() => handleDelete(confirmId)}
                disabled={deleting}
              >
                {deleting ? "Eliminando…" : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
