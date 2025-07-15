import { useState } from "react";

const Piezas = () => {
  const [nombrePieza, setNombrePieza] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [marca, setMarca] = useState("");
  const [costo, setCosto] = useState("");
  const [piezas, setPiezas] = useState([]);

  const agregarPieza = (e) => {
    e.preventDefault();
    if (!nombrePieza || !descripcion || !marca || !costo) return;

    const nuevaPieza = {
      id: Date.now(),
      nombrePieza,
      descripcion,
      marca,
      costo: parseFloat(costo),
    };

    setPiezas([...piezas, nuevaPieza]);

    
    setNombrePieza("");
    setDescripcion("");
    setMarca("");
    setCosto("");
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-red-700 mb-6">Gestión de Piezas</h1>

      
      <div className="bg-white p-4 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Registrar nueva pieza</h2>
        <form onSubmit={agregarPieza} className="grid gap-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium">Nombre de la pieza</label>
            <input
              type="text"
              value={nombrePieza}
              onChange={(e) => setNombrePieza(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              placeholder=""
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Descripción</label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              placeholder=""
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Marca</label>
            <input
              type="text"
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              placeholder=""
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Costo</label>
            <input
              type="number"
              step="0.01"
              value={costo}
              onChange={(e) => setCosto(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              placeholder=""
            />
          </div>

          <button className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800" type="submit">
            Agregar pieza
          </button>
        </form>
      </div>

      
      <div>
        <h2 className="text-xl font-semibold mb-2">Lista de piezas registradas</h2>
        {piezas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg">
              <thead className="bg-red-100">
                <tr>
                  <th className="px-4 py-2 border">Nombre</th>
                  <th className="px-4 py-2 border">Descripción</th>
                  <th className="px-4 py-2 border">Marca</th>
                  <th className="px-4 py-2 border">Costo</th>
                </tr>
              </thead>
              <tbody>
                {piezas.map((pieza) => (
                  <tr key={pieza.id} className="text-center">
                    <td className="px-4 py-2 border">{pieza.nombrePieza}</td>
                    <td className="px-4 py-2 border">{pieza.descripcion}</td>
                    <td className="px-4 py-2 border">{pieza.marca}</td>
                    <td className="px-4 py-2 border font-bold">
                      ${pieza.costo.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No hay piezas registradas.</p>
        )}
      </div>
    </div>
  );
};

export default Piezas;

