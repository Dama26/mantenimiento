import React from "react";
import { useState, useEffect } from "react";
import { getAmbulancias } from "../services/ambulanciasService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
// import "jspdf-autotable";
import autoTable from 'jspdf-autotable';
import { format } from "date-fns";

const ReportesMantenimientos = () => {
  const [reportData, setReportData] = useState([]);
  const [ambulancias, setAmbulancias] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filtros
  const [filters, setFilters] = useState({
    unidad: "",
    razonSocial: "",
    periodo: "",
    // fechaInicio: null,
    // fechaFin: null,
  });

  // Cargar ambulancias
  useEffect(() => {
    const cargarAmbulancias = async () => {
      try {
        const data = await getAmbulancias();
        setAmbulancias(data);
      } catch (error) {
        console.error("Error al cargar ambulancias:", error);
      }
    };

    cargarAmbulancias();
  }, []);

  // Generar reporte
  const generarReporte = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/reportes-mantenimientos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          unidad: filters.unidad,
          razonSocial: filters.razonSocial,
          periodo: filters.periodo
        }),
      });

      if (!response.ok) {
        throw new Error("Error al generar reporte");
      }

      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al generar reporte");
    } finally {
      setLoading(false);
    }
  };

  // Generar Excel
  const generateExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      reportData.map((item) => ({
        Unidad: item.unidad,
        Fecha: item.fecha,
        "Tipo Mantenimiento": item.tipo_mantenimiento,
        Kilometraje: item.kilometraje,
        Factura: item.factura,
        "Tipo Taller": item.tipo_taller,
        Taller: item.taller,
        "Razón Social": item.razon_social_taller,
        Total: item.total,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Mantenimientos");

    let fileName = "Reporte_Mantenimientos";
    if (filters.unidad) {
      const unidad = ambulancias.find((a) => a.id === parseInt(filters.unidad));
      fileName += `_${unidad?.unidad || "Unidad"}`;
    }
    if (filters.periodo) {
      fileName += `_${filters.periodo}`;
    } else if (filters.fechaInicio && filters.fechaFin) {
      fileName += `_${format(filters.fechaInicio, "yyyy-MM-dd")}_a_${format(
        filters.fechaFin,
        "yyyy-MM-dd"
      )}`;
    }

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  // Generar PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(18);
    doc.text("Reporte de Mantenimientos", 105, 15, { align: "center" });

    // Filtros aplicados
    doc.setFontSize(10);
    let filtersText = "Filtros aplicados: ";
    if (filters.unidad) {
      const unidad = ambulancias.find((a) => a.id === parseInt(filters.unidad));
      filtersText += `Unidad: ${unidad?.unidad || filters.unidad}, `;
    }
    if (filters.razonSocial) {
      filtersText += `Razón Social: ${filters.razonSocial}, `;
    }
    if (filters.periodo) {
      filtersText += `Período: ${filters.periodo}, `;
    } else if (filters.fechaInicio && filters.fechaFin) {
      filtersText += `Desde: ${format(
        filters.fechaInicio,
        "dd/MM/yyyy"
      )} - Hasta: ${format(filters.fechaFin, "dd/MM/yyyy")}, `;
    }

    if (filtersText.endsWith(", ")) {
      filtersText = filtersText.slice(0, -2);
    }

    doc.text(filtersText, 14, 25);

    // Tabla de datos
    const headers = [
      "Unidad",
      "Fecha",
      "Tipo Mant.",
      "Kilometraje",
      "Factura",
      "Taller",
      "Razón Social",
      "Total",
    ];

    const data = reportData.map((item) => [
      item.unidad,
      item.fecha,
      item.tipo_mantenimiento,
      item.kilometraje,
      item.factura,
      item.taller,
      item.razon_social_taller,
      `$${item.total.toLocaleString()}`,
    ]);

    autoTable(doc, {
      startY: 30,
      head: [headers],
      body: data,
      theme: "grid",
      headStyles: {
        fillColor: [220, 53, 69],
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 20 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
        5: { cellWidth: 30 },
        6: { cellWidth: 40 },
        7: { cellWidth: 20 },
      },
    });

    // doc.autoTable({
    //   startY: 30,
    //   head: [headers],
    //   body: data,
    //   theme: "grid",
    //   headStyles: {
    //     fillColor: [220, 53, 69],
    //     textColor: 255,
    //     fontStyle: "bold",
    //   },
    //   columnStyles: {
    //     0: { cellWidth: 20 },
    //     1: { cellWidth: 20 },
    //     2: { cellWidth: 20 },
    //     3: { cellWidth: 20 },
    //     4: { cellWidth: 20 },
    //     5: { cellWidth: 30 },
    //     6: { cellWidth: 40 },
    //     7: { cellWidth: 20 },
    //   },
    // });

    // Pie de página
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Página ${i} de ${pageCount}`,
        105,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
      doc.text(
        `Generado el: ${format(new Date(), "dd/MM/yyyy HH:mm")}`,
        195,
        doc.internal.pageSize.height - 10,
        { align: "right" }
      );
    }

    // Guardar PDF
    let fileName = "Reporte_Mantenimientos";
    if (filters.unidad) {
      const unidad = ambulancias.find((a) => a.id === parseInt(filters.unidad));
      fileName += `_${unidad?.unidad || "Unidad"}`;
    }
    if (filters.periodo) {
      fileName += `_${filters.periodo}`;
    } else if (filters.fechaInicio && filters.fechaFin) {
      fileName += `_${format(filters.fechaInicio, "yyyy-MM-dd")}_a_${format(
        filters.fechaFin,
        "yyyy-MM-dd"
      )}`;
    }

    doc.save(`${fileName}.pdf`);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date, field) => {
    setFilters((prev) => ({
      ...prev,
      [field]: date,
      periodo: "", // Reset periodo si se seleccionan fechas manuales
    }));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-red-700 mb-6">
        Reportes de Mantenimientos
      </h1>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold text-red-700 mb-4">Filtros</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Filtro por unidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unidad
            </label>
            <select
              name="unidad"
              value={filters.unidad}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="">Todas las unidades</option>
              {ambulancias.map((ambulancia) => (
                <option key={ambulancia.id} value={ambulancia.id}>
                  {ambulancia.unidad}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por razón social */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Razón Social del Taller
            </label>
            <input
              type="text"
              name="razonSocial"
              value={filters.razonSocial}
              onChange={handleFilterChange}
              placeholder="Buscar por razón social"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>

          {/* Filtro por periodo predefinido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Período
            </label>
            <select
              name="periodo"
              value={filters.periodo}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="">Seleccione un período</option>
              <option value="mes">Último mes</option>
              <option value="bimestre">Último bimestre</option>
              <option value="semestre">Último semestre</option>
              <option value="anio">Último año</option>
            </select>
          </div>

          {/* Filtro por rango de fechas personalizado */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rango de fechas personalizado
            </label>
            <div className="flex space-x-2">
              <DatePicker
                selected={filters.fechaInicio}
                onChange={(date) => handleDateChange(date, "fechaInicio")}
                selectsStart
                startDate={filters.fechaInicio}
                endDate={filters.fechaFin}
                placeholderText="Fecha inicio"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              <DatePicker
                selected={filters.fechaFin}
                onChange={(date) => handleDateChange(date, "fechaFin")}
                selectsEnd
                startDate={filters.fechaInicio}
                endDate={filters.fechaFin}
                minDate={filters.fechaInicio}
                placeholderText="Fecha fin"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
          </div> */}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={() => {
              setFilters({
                unidad: "",
                razonSocial: "",
                periodo: "",
                fechaInicio: null,
                fechaFin: null,
              });
              setReportData([]);
            }}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            Limpiar filtros
          </button>
          <button
            onClick={generarReporte}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Generando..." : "Generar Reporte"}
          </button>
          <button
            onClick={generateExcel}
            disabled={reportData.length === 0}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-green-300"
          >
            Exportar a Excel
          </button>
          <button
            onClick={generatePDF}
            disabled={reportData.length === 0}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:bg-red-300"
          >
            Exportar a PDF
          </button>
        </div>
      </div>

      {/* Resultados */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-gray-800">
            Resultados del reporte
          </h2>
          <span className="text-sm text-gray-600">
            {reportData.length} registros encontrados
          </span>
        </div>

        {loading && (
          <div className="text-center py-8">
            <p>Cargando datos...</p>
          </div>
        )}

        {!loading && reportData.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-2">Unidad</th>
                  <th className="border px-3 py-2">Fecha</th>
                  <th className="border px-3 py-2">Tipo Mantenimiento</th>
                  <th className="border px-3 py-2">Kilometraje</th>
                  <th className="border px-3 py-2">Factura</th>
                  <th className="border px-3 py-2">Taller</th>
                  <th className="border px-3 py-2">Razón Social</th>
                  <th className="border px-3 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="border px-2 py-1">{item.unidad}</td>
                    <td className="border px-2 py-1">{item.fecha}</td>
                    <td className="border px-2 py-1 capitalize">
                      {item.tipo_mantenimiento}
                    </td>
                    <td className="border px-2 py-1">
                      {item.kilometraje.toLocaleString()} km
                    </td>
                    <td className="border px-2 py-1">{item.factura}</td>
                    <td className="border px-2 py-1">{item.taller}</td>
                    <td className="border px-2 py-1">
                      {item.razon_social_taller}
                    </td>
                    <td className="border px-2 py-1 font-medium">
                      ${item.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && reportData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {Object.values(filters).some(Boolean)
              ? "No se encontraron resultados con los filtros aplicados"
              : "Utilice los filtros para generar un reporte"}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportesMantenimientos;
