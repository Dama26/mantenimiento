import { useState } from "react";

const Costos = () => {
  const [nombrePieza, setNombrePieza] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [precioUnitario, setPrecioUnitario] = useState("");
  const [costos, setCostos] = useState([]);

  const handleAgregarCosto = (e) => {
    e.preventDefault();

    if (!nombrePieza || !precioUnitario) return;

    const nuevoCosto = {
      id: Date.now(),
      nombrePieza,
      cantidad,
      precioUnitario: parseFloat(precioUnitario),
      total: cantidad * parseFloat(precioUnitario),
    };

    setCostos([...costos, nuevoCosto]);
    setNombrePieza("");
    setCantidad(1);
    setPrecioUnitario("");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-red-700 mb-4">Costos</h1>

      <form onSubmit={handleAgregarCosto} className="space-y-4 bg-white p-4 rounded-lg shadow-md max-w-md">
        <div>
          <label className="block text-sm font-medium">Nombre de la pieza</label>
          <input
            type="text"
            value={nombrePieza}
            onChange={(e) => setNombrePieza(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Ej. Bujía"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Cantidad</label>
          <input
            type="number"
            min="1"
            value={cantidad}
            onChange={(e) => setCantidad(parseInt(e.target.value))}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Precio unitario</label>
          <input
            type="number"
            step="0.01"
            value={precioUnitario}
            onChange={(e) => setPrecioUnitario(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Ej. 150.00"
          />
        </div>

        <button
          type="submit"
          className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
        >
          Agregar costo
        </button>
      </form>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Historial de costos</h2>

        {costos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg">
              <thead className="bg-red-100">
                <tr>
                  <th className="px-4 py-2 border">Nombre de la pieza</th>
                  <th className="px-4 py-2 border">Cantidad</th>
                  <th className="px-4 py-2 border">Precio unitario</th>
                  <th className="px-4 py-2 border">Total</th>
                </tr>
              </thead>
              <tbody>
                {costos.map((costo) => (
                  <tr key={costo.id} className="text-center">
                    <td className="px-4 py-2 border">{costo.nombrePieza}</td>
                    <td className="px-4 py-2 border">{costo.cantidad}</td>
                    <td className="px-4 py-2 border">${costo.precioUnitario.toFixed(2)}</td>
                    <td className="px-4 py-2 border font-bold">${costo.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No hay costos registrados.</p>
        )}
      </div>
    </div>
  );
};

export default Costos;
