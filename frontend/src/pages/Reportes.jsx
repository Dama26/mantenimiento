import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const formatosPeriodo = {
  anual: "Año",
  semestral: "Semestre",
  bimestral: "Bimestre",
  mensual: "Mes",
};

const getPeriodoClave = (fecha, tipo) => {
  const d = new Date(fecha);
  const year = d.getFullYear();

  switch (tipo) {
    case "anual":
      return `${year}`;
    case "semestral":
      return `${year}-S${Math.floor(d.getMonth() / 6) + 1}`;
    case "bimestral":
      return `${year}-B${Math.floor(d.getMonth() / 2) + 1}`;
    case "mensual":
      return `${year}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
    default:
      return "";
  }
};

const Reportes = () => {
  const [ambulancias, setAmbulancias] = useState([]);
  const [mantenimientos, setMantenimientos] = useState([]);
  const [costos, setCostos] = useState([]);
  const [piezas, setPiezas] = useState([]);
  const [periodoFiltro, setPeriodoFiltro] = useState("anual");

  useEffect(() => {
    setAmbulancias([
      { id: 1, numero_economico: "CR-001" },
      { id: 2, numero_economico: "CR-002" },
      { id: 3, numero_economico: "CR-003" },
    ]);

    setMantenimientos([
      { id: 1, ambulanciaId: 1, tipo: "preventivo", fecha: "2025-07-01" },
      { id: 2, ambulanciaId: 2, tipo: "correctivo", fecha: "2025-07-05" },
      { id: 3, ambulanciaId: 1, tipo: "preventivo", fecha: "2025-07-10" },
    ]);

    setPiezas([
      { id: 1, nombre: "Batería", marca: "Marca A" },
      { id: 2, nombre: "Aceite", marca: "Marca B" },
      { id: 3, nombre: "Freno", marca: "Marca C" },
    ]);

    setCostos([
      { id: 1, ambulanciaId: 1, total: 1500, fecha: "2025-01-15", kilometraje: 12000 },
      { id: 2, ambulanciaId: 2, total: 300, fecha: "2025-03-20", kilometraje: 25000 },
      { id: 3, ambulanciaId: 3, total: 800, fecha: "2025-06-10", kilometraje: 18000 },
    ]);
  }, []);

  const totalCostos = costos.reduce((sum, item) => sum + item.total, 0);

  const calcularGastosPorPeriodo = (periodo) =>
    costos.reduce((acc, gasto) => {
      const clave = getPeriodoClave(gasto.fecha, periodo);
      if (!acc[clave]) acc[clave] = 0;
      acc[clave] += gasto.total;
      return acc;
    }, {});

  const exportPDF = (periodoSeleccionado) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Reporte General de Ambulancias", 14, 22);

    doc.setFontSize(12);
    doc.text(`Total Ambulancias: ${ambulancias.length}`, 14, 32);
    doc.text(`Total Mantenimientos: ${mantenimientos.length}`, 14, 38);
    doc.text(`Costo total: $${totalCostos.toFixed(2)}`, 14, 44);

    
    doc.text(`Gastos agrupados por: ${formatosPeriodo[periodoSeleccionado]}`, 14, 50);

    const gastosAgrupados = calcularGastosPorPeriodo(periodoSeleccionado);
    const gastosData = Object.entries(gastosAgrupados).map(([periodo, monto]) => [
      periodo,
      `$${monto.toFixed(2)}`,
    ]);

    const totalGastosAgrupados = Object.values(gastosAgrupados).reduce((a, b) => a + b, 0);

    autoTable(doc, {
      startY: 54,
      head: [["Periodo", "Monto Total"]],
      body: [...gastosData, ["Total General", `$${totalGastosAgrupados.toFixed(2)}`]],
    });

    const yAmbulancias = doc.lastAutoTable.finalY + 10;
    doc.text("Ambulancias", 14, yAmbulancias);
    autoTable(doc, {
      startY: yAmbulancias + 2,
      head: [["ID", "Unidad"]],
      body: ambulancias.map((a) => [a.id, a.numero_economico]),
    });

    const yMantenimientos = doc.lastAutoTable.finalY + 10;
    doc.text("Mantenimientos", 14, yMantenimientos);
    autoTable(doc, {
      startY: yMantenimientos + 2,
      head: [["ID", "Unidad", "Tipo", "Fecha"]],
      body: mantenimientos.map((m) => {
        const amb = ambulancias.find((a) => a.id === m.ambulanciaId);
        return [
          m.id,
          amb ? amb.numero_economico : "Desconocida",
          m.tipo.toUpperCase(),
          m.fecha,
        ];
      }),
    });

    const yPiezas = doc.lastAutoTable.finalY + 10;
    doc.text("Piezas", 14, yPiezas);
    autoTable(doc, {
      startY: yPiezas + 2,
      head: [["ID", "Nombre", "Marca"]],
      body: piezas.map((p) => [p.id, p.nombre, p.marca]),
    });

    const yCostos = doc.lastAutoTable.finalY + 10;
    doc.text("Costos por Unidad", 14, yCostos);
    autoTable(doc, {
      startY: yCostos + 2,
      head: [["ID", "Unidad", "Kilometraje", "Total"]],
      body: costos.map((c) => {
        const amb = ambulancias.find((a) => a.id === c.ambulanciaId);
        return [
          c.id,
          amb ? amb.numero_economico : "Desconocida",
          c.kilometraje ? c.kilometraje.toLocaleString() + " km" : "N/A",
          `$${c.total.toFixed(2)}`,
        ];
      }),
    });

    doc.save("reporte_ambulancias.pdf");
  };

  const exportExcel = () => {
    const wb = XLSX.utils.book_new();

    const wsAmbulancias = XLSX.utils.json_to_sheet(ambulancias);
    XLSX.utils.book_append_sheet(wb, wsAmbulancias, "Ambulancias");

    const mantenimientosExcel = mantenimientos.map((m) => {
      const amb = ambulancias.find((a) => a.id === m.ambulanciaId);
      return {
        id: m.id,
        unidad: amb ? amb.numero_economico : "Desconocida",
        tipo: m.tipo,
        fecha: m.fecha,
      };
    });
    const wsMantenimientos = XLSX.utils.json_to_sheet(mantenimientosExcel);
    XLSX.utils.book_append_sheet(wb, wsMantenimientos, "Mantenimientos");

    const wsPiezas = XLSX.utils.json_to_sheet(piezas);
    XLSX.utils.book_append_sheet(wb, wsPiezas, "Piezas");

    const costosExcel = costos.map((c) => {
      const amb = ambulancias.find((a) => a.id === c.ambulanciaId);
      return {
        id: c.id,
        unidad: amb ? amb.numero_economico : "Desconocida",
        kilometraje: c.kilometraje ? c.kilometraje + " km" : "N/A",
        total: c.total,
      };
    });
    const wsCostos = XLSX.utils.json_to_sheet(costosExcel);
    XLSX.utils.book_append_sheet(wb, wsCostos, "Costos");

    XLSX.writeFile(wb, "reporte_ambulancias.xlsx");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-red-700 mb-6">Reportes Generales</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded p-4 text-center">
          <h2 className="text-xl font-semibold text-gray-700">Unidad</h2>
          <p className="text-3xl text-red-700 font-bold">{ambulancias.length}</p>
        </div>

        <div className="bg-white shadow rounded p-4 text-center">
          <h2 className="text-xl font-semibold text-gray-700">Mantenimientos</h2>
          <p className="text-3xl text-red-700 font-bold">{mantenimientos.length}</p>
        </div>

        <div className="bg-white shadow rounded p-4 text-center">
          <h2 className="text-xl font-semibold text-gray-700">Piezas</h2>
          <p className="text-3xl text-red-700 font-bold">{piezas.length}</p>
        </div>

        <div className="bg-white shadow rounded p-4 text-center">
          <h2 className="text-xl font-semibold text-gray-700">Costo total</h2>
          <p className="text-3xl text-red-700 font-bold">${totalCostos.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-8">
        <label className="font-semibold mr-4">Gastos agrupados por:</label>
        <select
          value={periodoFiltro}
          onChange={(e) => setPeriodoFiltro(e.target.value)}
          className="border rounded px-3 py-1 mb-4"
        >
          <option value="anual">Anual</option>
          <option value="semestral">Semestral</option>
          <option value="bimestral">Bimestre</option>
          <option value="mensual">Mensual</option>
        </select>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-red-100 text-red-700">
              <th className="border px-2 py-1">Periodo</th>
              <th className="border px-2 py-1 text-right">Monto Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(calcularGastosPorPeriodo(periodoFiltro)).map(([periodo, monto]) => (
              <tr key={periodo} className="hover:bg-gray-100">
                <td className="border px-2 py-1">{periodo}</td>
                <td className="border px-2 py-1 text-right">${monto.toFixed(2)}</td>
              </tr>
            ))}
            <tr className="font-semibold bg-red-200">
              <td className="border px-2 py-1">Total General</td>
              <td className="border px-2 py-1 text-right">
                ${Object.values(calcularGastosPorPeriodo(periodoFiltro)).reduce((a, b) => a + b, 0).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={() => exportPDF(periodoFiltro)}
          className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition"
        >
          Exportar a PDF
        </button>
        <button
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
