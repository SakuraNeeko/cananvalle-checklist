import styles from "./Home.module.css";

export default function Home({ recents, onNew, onList, onOpen }) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.logo}>CANANVALLE S.A.</div>
        <h1 className={styles.title}>Check List<br />Cultivo</h1>
        <div className={styles.code}>CU-CN-001 · Revisión 002</div>
      </header>

      <div className={styles.actions}>
        <button className={styles.btnPrimary} onClick={onNew}>
          <span className={styles.icon}>＋</span>
          Nuevo reporte
        </button>
        <button className={styles.btnSecondary} onClick={onList}>
          <span className={styles.icon}>☰</span>
          Ver todos los reportes
        </button>
      </div>

      {recents.length > 0 && (
        <section className={styles.recents}>
          <div className={styles.sectionLabel}>RECIENTES</div>
          {recents.slice(0, 3).map((r) => (
            <div key={r.id} className={styles.card} onClick={() => onOpen(r.id)}>
              <div className={styles.cardMain}>
                <span className={styles.cardTitle}>
                  Finca {r.finca} &middot; Semana {r.semana}/{r.year}
                </span>
                <span className={r.closed ? styles.badgeClosed : styles.badgeOpen}>
                  {r.closed ? "✓ Cerrado" : "En progreso"}
                </span>
              </div>
              <span className={styles.cardDate}>
                {new Date(r.created_at).toLocaleDateString("es-EC", {
                  day: "2-digit", month: "short", year: "numeric"
                })}
              </span>
            </div>
          ))}
        </section>
      )}

      <footer className={styles.footer}>
        Sistema de Gestión · Sistemas CANANVALLE
      </footer>
    </div>
  );
}
