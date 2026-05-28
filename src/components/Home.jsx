import styles from "./Home.module.css";

export default function Home({ recents, online, onNew, onList, onOpen }) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.logo}>CANANVALLE S.A.</div>
        <h1 className={styles.title}>Check List<br />Cultivo & Cosecha</h1>
        <div className={styles.code}>CU-CN-001 / CU-CN-002 · Revisión 002</div>
        {!online && (
          <div className={styles.offlineBadge}>📵 Modo sin conexión — los cambios se sincronizarán al reconectarse</div>
        )}
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
          {recents.slice(0, 5).map((r) => (
            <div key={r.id} className={styles.card} onClick={() => onOpen(r.id)}>
              <div className={styles.cardMain}>
                <div className={styles.cardLeft}>
                  <span className={r.tipo === "cosecha" ? styles.tipoCosecha : styles.tipoCultivo}>
                    {r.tipo === "cosecha" ? "🌹 Cosecha" : "🌿 Cultivo"}
                  </span>
                  <span className={styles.cardTitle}>
                    Finca {r.finca} · Semana {r.semana}/{r.year}
                  </span>
                </div>
                <span className={r.closed ? styles.badgeClosed : styles.badgeOpen}>
                  {r.closed ? "✓" : "…"}
                </span>
              </div>
              <span className={styles.cardDate}>
                {new Date(r.created_at).toLocaleDateString("es-EC", {
                  day: "2-digit", month: "short", year: "numeric",
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
