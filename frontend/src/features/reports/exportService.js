import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const cellValue = (row, col) => {
  const raw = row[col.key];
  if (raw === null || raw === undefined) return '';
  if (typeof raw === 'object') return '';
  return String(raw);
};

/** Exports tabular data to a downloadable PDF using jsPDF + autotable. */
export function exportToPdf(rows, columns, title) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(title, 14, 16);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 23);
  autoTable(doc, {
    startY: 28,
    head: [columns.map((c) => c.label)],
    body: rows.map((row) => columns.map((c) => cellValue(row, c))),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [26, 35, 126] },
  });
  doc.save(`${title.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
}

/** Exports tabular data to an Excel workbook using SheetJS. */
export function exportToExcel(rows, columns, title) {
  const data = rows.map((row) =>
    Object.fromEntries(columns.map((c) => [c.label, cellValue(row, c)]))
  );
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, title.slice(0, 31));
  XLSX.writeFile(wb, `${title.replace(/\s+/g, '_')}_${Date.now()}.xlsx`);
}
