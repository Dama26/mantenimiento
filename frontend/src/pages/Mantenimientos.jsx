import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Mantenimientos = () => {
  const [tipo, setTipo] = useState("preventivo");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [unidad, setUnidad] = useState("");
  const [kilometraje, setKilometraje] = useState("");
  const [tallerTipo, setTallerTipo] = useState("interno");
  const [nombreTaller, setNombreTaller] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [factura, setFactura] = useState("");

  const [pieza, setPieza] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [precioUnitario, setPrecioUnitario] = useState("");
  const [listaPiezas, setListaPiezas] = useState([]);
  const [historial, setHistorial] = useState([]);

  const calcularCostoTotal = () => {
    return listaPiezas.reduce((acc, item) => acc + item.cantidad * item.precioUnitario, 0);
  };

  const handleAgregar = (e) => {
    e.preventDefault();

    if (
      !descripcion ||
      !fecha ||
      !unidad ||
      !kilometraje ||
      !nombreTaller ||
      !factura ||
      !proveedor ||
      !pieza || cantidad <= 0 || precioUnitario <= 0
    ) return;

    const nuevasPiezas = [
      ...listaPiezas,
      {
        pieza,
        cantidad,
        precioUnitario: parseFloat(precioUnitario),
      },
    ];

    const costoTotal = nuevasPiezas.reduce((acc, item) => acc + item.cantidad * item.precioUnitario, 0);

    const nuevo = {
      id: Date.now(),
      tipo,
      descripcion,
      fecha,
      unidad,
      kilometraje,
      tallerTipo,
      nombreTaller,
      proveedor,
      costo: costoTotal,
      factura,
      piezas: nuevasPiezas,
    };

    setHistorial([...historial, nuevo]);
    setTipo("preventivo");
    setDescripcion("");
    setFecha("");
    setUnidad("");
    setKilometraje("");
    setTallerTipo("interno");
    setNombreTaller("");
    setProveedor("");
    setFactura("");
    setListaPiezas([]);
    setPieza("");
    setCantidad(1);
    setPrecioUnitario("");
  };

  const handleTerminar = (id) => {
    if (window.confirm("¿Deseas terminar este mantenimiento?")) {
      setHistorial(historial.filter((item) => item.id !== id));
    }
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Historial de Mantenimientos", 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [[
        "Unidad", "Km", "Tipo", "Fecha", "Taller", "Nombre",
        "Proveedor", "Costo", "Factura", "Descripción", "Piezas"
      ]],
      body: historial.map((m) => [
        m.unidad,
        m.kilometraje,
        m.tipo,
        m.fecha,
        m.tallerTipo,
        m.nombreTaller,
        m.proveedor,
        `$${m.costo.toFixed(2)}`,
        m.factura,
        m.descripcion,
        m.piezas.map((p) => `${p.pieza} (${p.cantidad})`).join(", "),
      ]),
      styles: { fontSize: 8 },
    });

    doc.save("mantenimientos.pdf");
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-red-700">Mantenimientos</h1>
        <button
          onClick={exportarPDF}
          className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-300"
        >
          Exportar PDF
        </button>
      </div>

      <form onSubmit={handleAgregar} className="bg-white p-6 rounded shadow space-y-4 grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Unidad</label>
          <input type="text" value={unidad} onChange={(e) => setUnidad(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Kilometraje</label>
          <input type="text" value={kilometraje} onChange={(e) => setKilometraje(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Tipo</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full border p-2 rounded">
            <option value="preventivo">Preventivo</option>
            <option value="correctivo">Correctivo</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Fecha</label>
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Descripción</label>
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Tipo de taller</label>
          <select value={tallerTipo} onChange={(e) => setTallerTipo(e.target.value)} className="w-full border p-2 rounded">
            <option value="interno">Interno</option>
            <option value="externo">Externo</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Nombre del taller</label>
          <input type="text" value={nombreTaller} onChange={(e) => setNombreTaller(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Proveedor</label>
          <input type="text" value={proveedor} onChange={(e) => setProveedor(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Factura</label>
          <input type="text" value={factura} onChange={(e) => setFactura(e.target.value)} className="w-full border p-2 rounded" />
        </div>

        <div className="md:col-span-2">
          <h3 className="font-semibold text-gray-700 mb-2">Pieza</h3>
          <div className="flex flex-wrap gap-4">
            <input type="text" placeholder="Nombre pieza" value={pieza} onChange={(e) => setPieza(e.target.value)} className="border p-2 rounded w-48" />
            <input type="number" min={1} value={cantidad} onChange={(e) => setCantidad(parseInt(e.target.value))} className="border p-2 rounded w-24" />
            <input type="number" step="0.01" placeholder="Precio unitario" value={precioUnitario} onChange={(e) => setPrecioUnitario(e.target.value)} className="border p-2 rounded w-32" />
          </div>
        </div>

        <div className="md:col-span-2 text-right">
          <button className="bg-red-700 text-white px-6 py-2 rounded hover:bg-red-800">Agregar Mantenimiento</button>
        </div>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Historial de Mantenimientos</h2>
        {historial.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm text-center">
              <thead className="bg-red-100 text-red-700">
                <tr>
                  <th className="border px-2 py-1">Unidad</th>
                  <th className="border px-2 py-1">Km</th>
                  <th className="border px-2 py-1">Tipo</th>
                  <th className="border px-2 py-1">Fecha</th>
                  <th className="border px-2 py-1">Taller</th>
                  <th className="border px-2 py-1">Nombre</th>
                  <th className="border px-2 py-1">Proveedor</th>
                  <th className="border px-2 py-1">Costo</th>
                  <th className="border px-2 py-1">Factura</th>
                  <th className="border px-2 py-1">Piezas</th>
                  <th className="border px-2 py-1">Descripción</th>
                  <th className="border px-2 py-1">Acciones</th>
                </tr>
              </thead>
              <tbody>
  {historial.map((m) => (
    <tr key={m.id} className="hover:bg-gray-50">
      <td className="border px-2 py-1">{m.unidad}</td>
      <td className="border px-2 py-1">{m.kilometraje}</td>
      <td className="border px-2 py-1">{m.tipo}</td>
      <td className="border px-2 py-1">{m.fecha}</td>
      <td className="border px-2 py-1">{m.tallerTipo}</td>
      <td className="border px-2 py-1">{m.nombreTaller}</td>
      <td className="border px-2 py-1">{m.proveedor}</td>
      <td className="border px-2 py-1">${m.costo.toFixed(2)}</td>
      <td className="border px-2 py-1">{m.factura}</td>
      <td className="border px-2 py-1">
        {m.piezas.map((p, i) => (
          <div key={i}>{p.pieza} ({p.cantidad})</div>
        ))}
      </td>
      <td className="border px-2 py-1">{m.descripcion}</td>
      <td className="border px-2 py-1">
        <button
          onClick={() => handleTerminar(m.id)}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          Terminar
        </button>
      </td>
    </tr>
  ))}
</tbody>

            </table>
          </div>
        ) : (
          <p className="text-gray-500 mt-4">No hay mantenimientos registrados.</p>
        )}
      </div>
    </div>
  );
};

export default Mantenimientos;
