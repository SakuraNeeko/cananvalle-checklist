import styles from "./ReportList.module.css";

export default function ReportList({ reports, onBack, onOpen }) {
  const open  = reports.filter(r => !r.closed);
  const closed = reports.filter(r =>  r.closed);

  const fmt = (r) =>
    new Date(r.created_at).toLocaleDateString("es-EC", {
      day: "2-digit", month: "short", year: "numeric"
    });

  const Card = ({ r }) => (
    <div className={styles.card} onClick={() => onOpen(r.id)}>
      <div className={styles.row}>
        <span className={styles.name}>Finca {r.finca} &middot; Semana {r.semana}/{r.year}</span>
        <span className={r.closed ? styles.badgeClosed : styles.badgeOpen}>
          {r.closed ? "✓ Cerrado" : "En progreso"}
        </span>
      </div>
      <span className={styles.date}>{fmt(r)}</span>
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
            {open.map(r => <Card key={r.id} r={r} />)}
          </section>
        )}

        {closed.length > 0 && (
          <section style={{ marginTop: 20 }}>
            <div className={styles.sectionLabel}>CERRADOS</div>
            {closed.map(r => <Card key={r.id} r={r} />)}
          </section>
        )}
      </div>
    </div>
  );
}
