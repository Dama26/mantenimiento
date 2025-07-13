import { useState } from "react";

const Mantenimientos = () => {
  const [tipo, setTipo] = useState("preventivo");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [ambulancia, setAmbulancia] = useState("");
  const [numeroEconomico, setNumeroEconomico] = useState("");
  const [tallerTipo, setTallerTipo] = useState("interno");
  const [nombreTaller, setNombreTaller] = useState("");
  const [costo, setCosto] = useState("");
  const [factura, setFactura] = useState("");
  const [historial, setHistorial] = useState([]);

  const handleAgregar = (e) => {
    e.preventDefault();

    if (!descripcion || !fecha || !ambulancia || !numeroEconomico || !nombreTaller || !costo || !factura) return;

    const nuevo = {
      id: Date.now(),
      tipo,
      descripcion,
      fecha,
      ambulancia,
      numeroEconomico,
      tallerTipo,
      nombreTaller,
      costo: parseFloat(costo),
      factura,
    };

    setHistorial([...historial, nuevo]);

  
    setTipo("preventivo");
    setDescripcion("");
    setFecha("");
    setAmbulancia("");
    setNumeroEconomico("");
    setTallerTipo("interno");
    setNombreTaller("");
    setCosto("");
    setFactura("");
  };

  const handleEliminar = (id) => {
    if (window.confirm("¿Deseas eliminar este mantenimiento?")) {
      setHistorial(historial.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-red-700 mb-4">Mantenimientos</h1>

      
      <form onSubmit={handleAgregar} className="bg-white p-6 rounded shadow space-y-4 grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Ambulancia</label>
          <input
            type="text"
            value={ambulancia}
            onChange={(e) => setAmbulancia(e.target.value)}
            placeholder="Ej. CR-01"
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Número económico</label>
          <input
            type="text"
            value={numeroEconomico}
            onChange={(e) => setNumeroEconomico(e.target.value)}
            placeholder="Ej. 123"
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Tipo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          >
            <option value="preventivo">Preventivo</option>
            <option value="correctivo">Correctivo</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ej. Cambio de frenos delanteros"
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Tipo de taller</label>
          <select
            value={tallerTipo}
            onChange={(e) => setTallerTipo(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          >
            <option value="interno">Interno</option>
            <option value="externo">Externo</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Nombre del taller</label>
          <input
            type="text"
            value={nombreTaller}
            onChange={(e) => setNombreTaller(e.target.value)}
            placeholder="Ej. Taller Rodríguez"
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Costo</label>
          <input
            type="number"
            step="0.01"
            value={costo}
            onChange={(e) => setCosto(e.target.value)}
            placeholder="Ej. 2500.00"
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Factura</label>
          <input
            type="text"
            value={factura}
            onChange={(e) => setFactura(e.target.value)}
            placeholder="Ej. F-00123"
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div className="md:col-span-2 text-right">
          <button className="bg-red-700 text-white px-6 py-2 rounded hover:bg-red-800">
            Agregar
          </button>
        </div>
      </form>

      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Historial de Mantenimientos</h2>
        {historial.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm text-center">
              <thead className="bg-red-100 text-red-700">
                <tr>
                  <th className="border px-3 py-2">Ambulancia</th>
                  <th className="border px-3 py-2">No. Económico</th>
                  <th className="border px-3 py-2">Tipo</th>
                  <th className="border px-3 py-2">Fecha</th>
                  <th className="border px-3 py-2">Taller</th>
                  <th className="border px-3 py-2">Nombre del taller</th>
                  <th className="border px-3 py-2">Costo</th>
                  <th className="border px-3 py-2">Factura</th>
                  <th className="border px-3 py-2">Descripción</th>
                  <th className="border px-3 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {historial.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="border px-2 py-1">{m.ambulancia}</td>
                    <td className="border px-2 py-1">{m.numeroEconomico}</td>
                    <td className="border px-2 py-1 capitalize">{m.tipo}</td>
                    <td className="border px-2 py-1">{m.fecha}</td>
                    <td className="border px-2 py-1 capitalize">{m.tallerTipo}</td>
                    <td className="border px-2 py-1">{m.nombreTaller}</td>
                    <td className="border px-2 py-1">${m.costo.toFixed(2)}</td>
                    <td className="border px-2 py-1">{m.factura}</td>
                    <td className="border px-2 py-1">{m.descripcion}</td>
                    <td className="border px-2 py-1">
                      <button
                        onClick={() => handleEliminar(m.id)}
                        className="text-red-600 hover:underline"
                      >
                        Eliminar
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

