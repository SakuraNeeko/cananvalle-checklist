import { QUALITY_COLS, PROCESS_CRITERIA, COSECHA_AREAS, calcPctFN, calcCosechaProc } from "../data/cosecha.js";

const css = `
@page { size: A4 landscape; margin: 6mm }
* { box-sizing: border-box }
body { font-family: Arial, Helvetica, sans-serif; font-size: 7.5px; color: #111; margin: 0; padding: 0 }
.noprint { background: #8b1a1a; color: #fff; padding: 10px 18px; display: flex;
  justify-content: space-between; align-items: center; gap: 12px }
.noprint h2 { margin: 0; font-size: 14px; font-weight: 600 }
.noprint button { background: #fff; color: #8b1a1a; border: none; padding: 7px 18px;
  border-radius: 4px; font-size: 13px; font-weight: 600; cursor: pointer }
table { width: 100%; border-collapse: collapse }
.hdr td { border: .5px solid #aaa; padding: 2px 5px; font-size: 8.5px }
.hdr .title { font-size: 10px; font-weight: 700; color: #8b1a1a }
thead th { background: #8b1a1a; color: #fff; padding: 2px 2px; font-size: 6.5px;
  text-align: center; border: .5px solid #6b1010; line-height: 1.1 }
thead th.sec2 { background: #1a5c2e }
td { border: .5px solid #ccc; padding: 1px 2px; vertical-align: middle }
.name { font-size: 7px; min-width: 100px }
.ct { text-align: center; font-size: 7px }
.num { text-align: center; font-size: 7px; min-width: 18px }
.obs { font-size: 6.5px; max-width: 50px; word-break: break-word }
.ok  { background: #d4edda; color: #155724; text-align: center }
.no  { background: #f8d7da; color: #721c24; text-align: center }
.nd  { color: #bbb; text-align: center }
.fn-ok  { background: #d4edda; color: #155724; text-align: center; font-weight: 600 }
.fn-bad { background: #f8d7da; color: #721c24; text-align: center; font-weight: 600 }
.sigimg  { height: 22px; max-width: 60px }
.sigline { border-bottom: 1px solid #bbb; height: 22px; width: 60px }
.section-title { background: #f5f5f5; font-weight: 700; font-size: 8px; color: #333;
  padding: 3px 6px; border: .5px solid #ccc; margin: 6px 0 2px }
.footer-row td { padding: 3px 6px; font-size: 8px }
@media print { .noprint { display: none !important } }
`;

export function generateCosechaHTML(report) {
  const areaBlocks = Object.entries(COSECHA_AREAS).map(([key, label], idx) => {
    const ad = report.areas[key];
    if (!ad) return "";

    const pb = idx > 0 ? "page-break-before:always" : "";
    const fecha = new Date(report.created_at || report.createdAt || Date.now()).toLocaleDateString("es-EC");

    // ── Tabla 1: Calidad ─────────────────────────────────────────────────────
    const qualHeads = QUALITY_COLS.map((c) => `<th>${c.label}<br>(tallos)</th>`).join("");
    const qualRows = ad.rows.map((row) => {
      const pct   = calcPctFN(row);
      const fnCls = pct > 8 ? "fn-bad" : "fn-ok";
      const cells = QUALITY_COLS.map((c) =>
        `<td class="num">${row.calidad[c.key] || ""}</td>`
      ).join("");
      return `<tr>
        <td class="name">${row.nombre}</td>
        <td class="ct">${row.variedad || ""}</td>
        ${cells}
        <td class="${fnCls}">${row.calidad.tallos_malla ? pct + "%" : ""}</td>
      </tr>`;
    }).join("");

    // ── Tabla 2: Proceso ─────────────────────────────────────────────────────
    const procHeads = PROCESS_CRITERIA.map((c) => `<th class="sec2">${c}</th>`).join("");
    const procRows = ad.rows.map((row) => {
      const s    = calcCosechaProc(row);
      const cells = row.proceso.criteria.map((v) =>
        v === 1 ? `<td class="ok">✓</td>`
        : v === 0 ? `<td class="no">✗</td>`
        : `<td class="nd">·</td>`
      ).join("");
      const sig = row.proceso.firma
        ? `<img class="sigimg" src="${row.proceso.firma}" alt="firma">`
        : `<div class="sigline"></div>`;
      const pctCls = s.pct >= 80 ? "ok" : "no";
      return `<tr>
        <td class="name">${row.nombre}</td>
        <td class="ct">${row.variedad || ""}</td>
        ${cells}
        <td class="ct ${pctCls}">${s.cumple}</td>
        <td class="ct">${s.total}</td>
        <td class="ct ${pctCls}">${s.pct}%</td>
        <td class="obs">${row.proceso.obs || ""}</td>
        <td>${sig}</td>
      </tr>`;
    }).join("");

    return `
      <div style="${pb}; margin-bottom:10px">
        <table class="hdr" style="margin-bottom:3px">
          <tr>
            <td colspan="3" class="title">CHECK LIST COSECHA &mdash; CANANVALLE S.A.</td>
            <td colspan="4" style="text-align:right;font-size:7px;color:#555">
              Código: CU-CN-002 &nbsp;|&nbsp; Rev: 002
            </td>
          </tr>
          <tr>
            <td><b>FINCA:</b> ${report.finca}</td>
            <td><b>SEMANA:</b> ${report.semana}/${report.year}</td>
            <td><b>${label}</b></td>
            <td colspan="3" style="text-align:right;font-size:7px">Fecha: ${fecha}</td>
            <td style="font-size:7px;color:#8b1a1a;font-weight:700">% FN MÁX: 8%</td>
          </tr>
        </table>

        <div class="section-title">SECCIÓN 1 — CALIDAD (tallos)</div>
        <table>
          <thead>
            <tr>
              <th class="name">COLABORADOR</th>
              <th>VARIEDAD</th>
              ${qualHeads}
              <th>% FN</th>
            </tr>
          </thead>
          <tbody>${qualRows}</tbody>
        </table>

        <div class="section-title" style="margin-top:8px">
          SECCIÓN 2 — PROCESO &nbsp;|&nbsp; CUMPLE = 1 &nbsp; NO CUMPLE = 0
        </div>
        <table>
          <thead>
            <tr>
              <th class="name">COLABORADOR</th>
              <th>VARIEDAD</th>
              ${procHeads}
              <th class="sec2">CUMPLE</th>
              <th class="sec2">TOTAL</th>
              <th class="sec2">%</th>
              <th class="sec2">OBS</th>
              <th class="sec2" style="min-width:65px">FIRMA</th>
            </tr>
          </thead>
          <tbody>${procRows}</tbody>
        </table>

        <table style="margin-top:8px">
          <tr class="footer-row">
            <td width="50%">SUPERVISOR:&nbsp; <b>${ad.supervisor || "___________________________"}</b></td>
            <td width="50%">JEFE DE FINCA:&nbsp; <b>${ad.jefe || "___________________________"}</b></td>
          </tr>
        </table>
      </div>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>CL Cosecha Finca ${report.finca} Sem ${report.semana}/${report.year}</title>
  <style>${css}</style>
</head>
<body>
  <div class="noprint">
    <h2>🌹 Check List Cosecha &mdash; Finca ${report.finca} &mdash; Semana ${report.semana}/${report.year}</h2>
    <button onclick="window.print()">🖨 Imprimir / Guardar PDF</button>
  </div>
  ${areaBlocks}
</body>
</html>`;
}

export function downloadCosechaReport(report) {
  const html = generateCosechaHTML(report);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `CL-Cosecha-Finca${report.finca}-Sem${report.semana}-${report.year}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
