import type { DailyPreview } from "@/types/api";

// Turns a DailyPreview into a file the browser saves. Everything runs in the browser from the report data,
// so the same code serves the Vercel demo and the full app. The heavy libraries load only when clicked.

export type ExportFormat = "pdf" | "xlsx" | "csv" | "html";

export const FORMATS: { id: ExportFormat; label: string; hint: string }[] = [
  { id: "pdf", label: "PDF", hint: "Print-ready, links stay clickable" },
  { id: "xlsx", label: "Excel", hint: "One sheet per section" },
  { id: "csv", label: "CSV", hint: "All rows in one flat table" },
  { id: "html", label: "HTML", hint: "The report exactly as previewed" },
];

const GREEN: [number, number, number] = [6, 199, 85];
const COLUMNS = ["Region", "Category", "Media", "Headline"] as const;

function fileName(report: DailyPreview, ext: string): string {
  return `line-watch-daily-report-${report.date}.${ext}`;
}

function save(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/** A spreadsheet would run a cell that starts with = + - @ as a formula; headlines come from the open web. */
function safeCell(value: string): string {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

function csvField(value: string): string {
  return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export function toCsv(report: DailyPreview): string {
  const lines = [["Section", "Date", "Region", "Category", "Media", "Headline", "Summary", "URL"]];
  for (const s of report.sections) {
    for (const r of s.rows) {
      lines.push([s.title, report.date, r.region, safeCell(r.category), safeCell(r.media), safeCell(r.headline), safeCell(r.summary ?? ""), r.url]);
    }
  }
  return lines.map((l) => l.map(csvField).join(",")).join("\r\n") + "\r\n";
}

async function toXlsx(report: DailyPreview): Promise<Blob> {
  const ExcelJS = (await import("exceljs")).default;
  const wb = new ExcelJS.Workbook();
  wb.creator = "LINE WATCH";
  for (const s of report.sections) {
    const ws = wb.addWorksheet(s.title.slice(0, 31), { views: [{ state: "frozen", ySplit: 1 }] });
    const withSummary = s.rows.some((r) => r.summary);
    ws.columns = [
      { header: "Region", key: "region", width: 8 },
      { header: "Category", key: "category", width: 18 },
      { header: "Media", key: "media", width: 24 },
      { header: "Headline", key: "headline", width: 70 },
      ...(withSummary ? [{ header: "Summary", key: "summary", width: 80 }] : []),
    ];
    const head = ws.getRow(1);
    head.font = { bold: true, color: { argb: "FFFFFFFF" } };
    head.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF06C755" } };
    for (const r of s.rows) {
      const row = ws.addRow({ region: r.region, category: r.category, media: r.media, headline: "", summary: r.summary ?? "" });
      row.getCell("headline").value = { text: r.headline, hyperlink: r.url }; // plain text link: never evaluated as a formula
      row.getCell("headline").font = { color: { argb: "FF0B57D0" }, underline: true };
      row.alignment = { vertical: "top", wrapText: true };
    }
    if (!s.rows.length) ws.addRow({ region: "", category: "", media: "", headline: "No relevant coverage in the last 24 hours." });
  }
  const buffer = await wb.xlsx.writeBuffer();
  return new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}

/** The PDF's built-in fonts only know Latin-1: straighten typographic characters and replace the rest. */
function pdfText(value: string): string {
  return value
    .replace(/[‘’‛]/g, "'")
    .replace(/[“”‟]/g, '"')
    .replace(/[–—−]/g, "-")
    .replace(/…/g, "...")
    .replace(/[   ]/g, " ")
    .replace(/[^\n\x20-\x7E¡-ÿ]/g, "?");
}

async function toPdf(report: DailyPreview): Promise<Blob> {
  const [{ jsPDF }, autoTableModule] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
  const autoTable = autoTableModule.default;
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const margin = 36;
  const width = doc.internal.pageSize.getWidth() - margin * 2;

  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(34);
  doc.text("Dear all,", margin, margin + 8);
  doc.text(pdfText(`Please find below the Global Daily Monitoring report for ${report.label}.`), margin, margin + 24);
  let y = margin + 40;

  for (const s of report.sections) {
    const urls: (string | null)[] = [];
    const body: unknown[][] = [];
    for (const r of s.rows) {
      body.push([r.region, pdfText(r.category), pdfText(r.media), pdfText(r.headline)]);
      urls.push(r.url);
      if (r.summary) {
        body.push([
          { content: "", styles: { fillColor: [250, 250, 250] } },
          { content: "", styles: { fillColor: [250, 250, 250] } },
          { content: "", styles: { fillColor: [250, 250, 250] } },
          { content: pdfText(r.summary), styles: { textColor: [68, 68, 68], fillColor: [250, 250, 250] } },
        ]);
        urls.push(null);
      }
    }
    if (!s.rows.length) body.push([{ content: "No relevant coverage in the last 24 hours.", colSpan: 4, styles: { textColor: [102, 102, 102] } }]);

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      tableWidth: width,
      head: [
        [{ content: pdfText(s.title), colSpan: 4, styles: { fillColor: GREEN, textColor: 255, fontSize: 10 } }],
        [...COLUMNS],
      ],
      body: body as never,
      theme: "grid",
      styles: { font: "helvetica", fontSize: 8.5, cellPadding: 4, overflow: "linebreak", lineColor: [217, 221, 225], lineWidth: 0.5, valign: "top" },
      headStyles: { fillColor: [241, 243, 244], textColor: 34, fontStyle: "bold" },
      columnStyles: { 0: { cellWidth: 40 }, 1: { cellWidth: 100 }, 2: { cellWidth: 130 } },
      // the headline cell is the link to the original article
      didParseCell: (d) => {
        if (d.section === "body" && d.column.index === 3 && urls[d.row.index]) d.cell.styles.textColor = [11, 87, 208];
      },
      didDrawCell: (d) => {
        const url = d.section === "body" && d.column.index === 3 ? urls[d.row.index] : null;
        if (url) doc.link(d.cell.x, d.cell.y, d.cell.width, d.cell.height, { url });
      },
    });
    y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 20;
  }

  doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(85);
  const ending = doc.splitTextToSize(pdfText(report.ending), width) as string[];
  const lineHeight = 11;
  const pageHeight = doc.internal.pageSize.getHeight();
  if (y + ending.length * lineHeight > pageHeight - margin) {
    doc.addPage();
    y = margin;
  }
  doc.text(ending, margin, y + 4);

  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p).setFontSize(8).setTextColor(130);
    doc.text(`LINE WATCH - ${pdfText(report.label)} - page ${p} of ${pages}`, margin, pageHeight - 16);
  }
  return doc.output("blob");
}

export async function downloadReport(report: DailyPreview, format: ExportFormat): Promise<void> {
  if (format === "html") return save(new Blob([report.html], { type: "text/html;charset=utf-8" }), fileName(report, "html"));
  if (format === "csv") return save(new Blob(["﻿", toCsv(report)], { type: "text/csv;charset=utf-8" }), fileName(report, "csv")); // BOM: Excel reads UTF-8
  if (format === "xlsx") return save(await toXlsx(report), fileName(report, "xlsx"));
  return save(await toPdf(report), fileName(report, "pdf"));
}
