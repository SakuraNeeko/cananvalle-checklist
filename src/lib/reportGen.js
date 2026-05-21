import { CRITERIA, AREAS, calcScore } from "../data/checklist.js";

const css = `
@page { size: A4 landscape; margin: 8mm }
* { box-sizing: border-box }
body { font-family: Arial, Helvetica, sans-serif; font-size: 9px; color: #111; margin: 0; padding: 0 }
.noprint { background: #1a5c2e; color: #fff; padding: 10px 18px; display: flex;
  justify-content: space-between; align-items: center; gap: 12px }
.noprint h2 { margin: 0; font-size: 14px; font-weight: 600 }
.noprint button { background: #fff; color: #1a5c2e; border: none; padding: 7px 18px;
  border-radius: 4px; font-size: 13px; font-weight: 600; cursor: pointer }
.legend { padding: 4px 8px; font-size: 7.5px; color: #444; border-bottom: 1px solid #ddd;
  display: flex; flex-wrap: wrap; gap: 4px }
table { width: 100%; border-collapse: collapse }
.hdr td { border: .5px solid #999; padding: 2px 5px; font-size: 9px }
.hdr .title { font-size: 11px; font-weight: 700; color: #1a5c2e }
thead th { background: #1a5c2e; color: #fff; padding: 3px 3px; font-size: 7.5px;
  text-align: center; border: .5px solid #14502a }
td { border: .5px solid #ccc; padding: 2px 3px; vertical-align: middle }
.name { font-size: 8px; min-width: 115px }
.ct { text-align: center }
.obs { font-size: 7.5px; max-width: 55px; word-break: break-word }
.ok { background: #d4edda; color: #155724; text-align: center }
.no { background: #f8d7da; color: #721c24; text-align: center }
.nd { color: #bbb; text-align: center }
.sigimg { height: 28px; max-width: 80px }
.sigline { border-bottom: 1px solid #bbb; height: 28px; width: 80px }
.footer-row td { padding: 4px 6px; font-size: 9px }
.area-block { margin-bottom: 14px }
@media print { .noprint, .legend { display: none !important } }
`;

export function generateReportHTML(report) {
  const legend = CRITERIA.map((c, i) => `<b>${i + 1}.</b>&nbsp;${c}`).join("&ensp;·&ensp;");

  const areaBlocks = Object.entries(AREAS)
    .map(([key, label], idx) => {
      const ad = report.areas[key];
      if (!ad) return "";

      const headerRow = CRITERIA.map((_, i) => `<th title="${CRITERIA[i]}">${i + 1}</th>`).join("");
      const dataRows = ad.rows
        .map((row) => {
          const s = calcScore(row);
          const cells = row.criteria
            .map((v) =>
              v === 1
                ? `<td class="ok">✓</td>`
                : v === 0
                ? `<td class="no">✗</td>`
                : `<td class="nd">·</td>`
            )
            .join("");
          const sig = row.firma
            ? `<img class="sigimg" src="${row.firma}" alt="firma">`
            : `<div class="sigline"></div>`;
          const pctClass = s.pct >= 80 ? "ok" : "no";
          return `
            <tr>
              <td class="name">${row.nombre}</td>
              <td class="ct">${row.bloque || ""}</td>
              ${cells}
              <td class="obs">${row.obs || ""}</td>
              <td class="ct">${s.cumple}</td>
              <td class="ct">15</td>
              <td class="${pctClass} ct">${s.pct}%</td>
              <td>${sig}</td>
            </tr>`;
        })
        .join("");

      const pb = idx > 0 ? "page-break-before:always" : "";
      return `
        <div class="area-block" style="${pb}">
          <table class="hdr" style="margin-bottom:3px">
            <tr>
              <td colspan="3" class="title">CHECK LIST CULTIVO &mdash; CANANVALLE S.A.</td>
              <td colspan="4" style="text-align:right;font-size:7.5px;color:#555">
                Código: CU-CN-001 &nbsp;|&nbsp; Rev: 002 &nbsp;|&nbsp; CUMPLE = 1 &nbsp;|&nbsp; NO CUMPLE = 0
              </td>
            </tr>
            <tr>
              <td><b>FINCA:</b> ${report.finca}</td>
              <td><b>SEMANA:</b> ${report.semana}/${report.year}</td>
              <td><b>${label}</b></td>
              <td colspan="4" style="text-align:right;font-size:7.5px">
                Fecha: ${new Date(report.created_at || report.createdAt || Date.now()).toLocaleDateString("es-EC")}
              </td>
            </tr>
          </table>
          <table>
            <thead>
              <tr>
                <th class="name">COLABORADOR</th>
                <th>BLQ</th>
                ${headerRow}
                <th>OBS</th>
                <th>B</th>
                <th>A</th>
                <th>%</th>
                <th style="min-width:88px">FIRMA</th>
              </tr>
            </thead>
            <tbody>${dataRows}</tbody>
          </table>
          <table style="margin-top:10px">
            <tr class="footer-row">
              <td width="50%">SUPERVISOR:&nbsp; <b>${ad.supervisor || "_________________________"}</b></td>
              <td width="50%">JEFE DE FINCA:&nbsp; <b>${ad.jefe || "_________________________"}</b></td>
            </tr>
          </table>
        </div>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>CL Finca ${report.finca} Sem ${report.semana}/${report.year}</title>
  <style>${css}</style>
</head>
<body>
  <div class="noprint">
    <h2>&#128462; Check List Cultivo &mdash; Finca ${report.finca} &mdash; Semana ${report.semana}/${report.year}</h2>
    <button onclick="window.print()">&#128424; Imprimir / Guardar PDF</button>
  </div>
  <div class="legend">${legend}</div>
  ${areaBlocks}
</body>
</html>`;
}

export function downloadReport(report) {
  const html = generateReportHTML(report);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `CL-Finca${report.finca}-Sem${report.semana}-${report.year}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
