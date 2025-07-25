import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const Reportes = () => {
  const [ambulancias, setAmbulancias] = useState([]);
  const [mantenimientos, setMantenimientos] = useState([]);
  const [costos, setCostos] = useState([]);

  useEffect(() => {
    setAmbulancias([
      { id: 1, numero_economico: "CR-001" },
      { id: 2, numero_economico: "CR-002" },
      { id: 3, numero_economico: "CR-003" },
    ]);

    setMantenimientos([
      { id: 1, tipo: "preventivo", fecha: "2025-07-01" },
      { id: 2, tipo: "correctivo", fecha: "2025-07-05" },
      { id: 3, tipo: "preventivo", fecha: "2025-07-10" },
    ]);

    setCostos([
      { id: 1, pieza: "Batería", total: 1500 },
      { id: 2, pieza: "Aceite", total: 300 },
    ]);
  }, []);

  const totalCostos = costos.reduce((sum, item) => sum + item.total, 0);

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Reporte General de Ambulancias", 14, 22);

    doc.setFontSize(12);
    doc.text(`Total Ambulancias: ${ambulancias.length}`, 14, 32);
    doc.text(`Total Mantenimientos: ${mantenimientos.length}`, 14, 38);
    doc.text(`Costo total: $${totalCostos.toFixed(2)}`, 14, 44);

    doc.text("Ambulancias", 14, 54);
    const ambulanciasTable = doc.autoTable({
      startY: 56,
      head: [["ID", "Número Económico"]],
      body: ambulancias.map(a => [a.id, a.numero_economico]),
    });

    // Verificar si finalY está disponible
    const yAfterAmbulancias = ambulanciasTable.finalY || 56;

    doc.text("Mantenimientos", 14, yAfterAmbulancias + 10);
    const mantenimientosTable = doc.autoTable({
      startY: yAfterAmbulancias + 12,
      head: [["ID", "Tipo", "Fecha"]],
      body: mantenimientos.map(m => [m.id, m.tipo.toUpperCase(), m.fecha]),
    });

    // Verificar si finalY está disponible
    const yAfterMantenimientos = mantenimientosTable.finalY || yAfterAmbulancias + 12;

    doc.text("Costos", 14, yAfterMantenimientos + 10);
    doc.autoTable({
      startY: yAfterMantenimientos + 12,
      head: [["ID", "Pieza", "Total"]],
      body: costos.map(c => [c.id, c.pieza, `$${c.total.toFixed(2)}`]),
    });

    doc.save("reporte_ambulancias.pdf");
  };

  const exportExcel = () => {
    const wb = XLSX.utils.book_new();

    const wsAmbulancias = XLSX.utils.json_to_sheet(ambulancias);
    XLSX.utils.book_append_sheet(wb, wsAmbulancias, "Ambulancias");

    const wsMantenimientos = XLSX.utils.json_to_sheet(mantenimientos);
    XLSX.utils.book_append_sheet(wb, wsMantenimientos, "Mantenimientos");

    const wsCostos = XLSX.utils.json_to_sheet(costos);
    XLSX.utils.book_append_sheet(wb, wsCostos, "Costos");

    XLSX.writeFile(wb, "reporte_ambulancias.xlsx");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-red-700 mb-6">Reportes Generales</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded p-4 text-center">
          <h2 className="text-xl font-semibold text-gray-700">Ambulancias</h2>
          <p className="text-3xl text-red-700 font-bold">{ambulancias.length}</p>
        </div>

        <div className="bg-white shadow rounded p-4 text-center">
          <h2 className="text-xl font-semibold text-gray-700">Mantenimientos</h2>
          <p className="text-3xl text-red-700 font-bold">{mantenimientos.length}</p>
        </div>

        <div className="bg-white shadow rounded p-4 text-center">
          <h2 className="text-xl font-semibold text-gray-700">Costo total</h2>
          <p className="text-3xl text-red-700 font-bold">${totalCostos.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Últimos mantenimientos</h2>
        <ul className="space-y-2">
          {mantenimientos.map((m) => (
            <li key={m.id} className="bg-gray-100 p-3 rounded shadow-sm">
              {m.tipo.toUpperCase()} - {m.fecha}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={exportPDF}
          className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition"
        >
          Exportar a PDF
        </button>

        <button
          type="button"
          onClick={exportExcel}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Exportar a Excel
        </button>
      </div>
    </div>
  );
};

export default Reportes;
