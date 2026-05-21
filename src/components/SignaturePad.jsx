import { useRef, useEffect, useState } from "react";
import styles from "./SignaturePad.module.css";

export default function SignaturePad({ existing, name, area, onSave, onCancel }) {
  const canvasRef = useRef(null);
  const drawing   = useRef(false);
  const lastPos   = useRef(null);
  const [hasDrawn, setHasDrawn] = useState(!!existing);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#111";
    ctx.lineWidth   = 2.5;
    ctx.lineCap     = "round";
    ctx.lineJoin    = "round";
    if (existing) {
      const img   = new Image();
      img.onload  = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      img.src     = existing;
    }
  }, []);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const c    = canvasRef.current;
    const sx   = c.width / rect.width;
    const sy   = c.height / rect.height;
    const src  = e.touches ? e.touches[0] : e;
    return { x: (src.clientX - rect.left) * sx, y: (src.clientY - rect.top) * sy };
  };

  const onDown = (e) => {
    e.preventDefault();
    drawing.current = true;
    lastPos.current = getPos(e);
    setHasDrawn(true);
  };

  const onMove = (e) => {
    e.preventDefault();
    if (!drawing.current) return;
    const pos = getPos(e);
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
  };

  const onUp = (e) => {
    e.preventDefault();
    drawing.current = false;
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>Firma del colaborador</h2>
          <p className={styles.sub}>{name} &middot; {area}</p>
        </div>
        <p className={styles.hint}>Firma con el dedo o el mouse en el recuadro blanco</p>
        <canvas
          ref={canvasRef}
          width={400}
          height={180}
          className={styles.canvas}
          onMouseDown={onDown}
          onMouseMove={onMove}
          onMouseUp={onUp}
          onMouseLeave={onUp}
          onTouchStart={onDown}
          onTouchMove={onMove}
          onTouchEnd={onUp}
        />
        <div className={styles.actions}>
          <button className={styles.btnClear} onClick={clear}>Limpiar</button>
          <div style={{ flex: 1 }} />
          <button className={styles.btnCancel} onClick={onCancel}>Cancelar</button>
          <button
            className={styles.btnSave}
            disabled={!hasDrawn}
            onClick={() => onSave(canvasRef.current.toDataURL())}
          >
            Guardar firma
          </button>
        </div>
      </div>
    </div>
  );
}
