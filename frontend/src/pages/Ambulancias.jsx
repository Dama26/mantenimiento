import { useState } from "react";

const Ambulancias = () => {
  const [unidad, setUnidad] = useState("");
  const [kilometraje, setKilometraje] = useState("");
  const [marca, setMarca] = useState("");
  const [ambulancias, setAmbulancias] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [ambulanciaEditandoId, setAmbulanciaEditandoId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (modoEdicion) {
      setAmbulancias((prev) =>
        prev.map((amb) =>
          amb.id === ambulanciaEditandoId
            ? { ...amb, unidad, kilometraje, marca }
            : amb
        )
      );
      setModoEdicion(false);
      setAmbulanciaEditandoId(null);
    } else {
      const nuevaAmbulancia = {
        id: Date.now(),
        unidad,
        kilometraje,
        marca,
      };
      setAmbulancias([...ambulancias, nuevaAmbulancia]);
    }

    setUnidad("");
    setKilometraje("");
    setMarca("");
  };

  const handleEditar = (amb) => {
    setUnidad(amb.unidad);
    setKilometraje(amb.kilometraje);
    setMarca(amb.marca);
    setModoEdicion(true);
    setAmbulanciaEditandoId(amb.id);
  };

  const handleEliminar = (id) => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar esta ambulancia?");
    if (confirmacion) {
      setAmbulancias((prev) => prev.filter((amb) => amb.id !== id));
    }
  };

  return (
    <div className="p-6 space-y-12">
      <h1 className="text-3xl font-bold text-red-700">Gestión de Ambulancias</h1>

      <section className="bg-white p-6 rounded-lg shadow-lg max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold text-red-700 mb-4">
          {modoEdicion ? "Editar Ambulancia" : "Registrar Nueva Ambulancia"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Unidad</label>
            <input
              type="text"
              value={unidad}
              onChange={(e) => setUnidad(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Kilometraje</label>
            <input
              type="number"
              value={kilometraje}
              onChange={(e) => setKilometraje(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Marca</label>
            <input
              type="text"
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition"
          >
            {modoEdicion ? "Guardar Cambios" : "Añadir Ambulancia"}
          </button>
        </form>
      </section>

      <hr className="border-gray-300" />

      <section>
        <h2 className="text-2xl font-semibold text-red-700 mb-4 text-center">Lista de Ambulancias</h2>

        {ambulancias.length === 0 ? (
          <p className="text-gray-600 text-center">Aún no se han añadido ambulancias.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded shadow">
              <thead>
                <tr className="bg-red-100 text-red-800 text-left">
                  <th className="py-2 px-4 border-b">#</th>
                  <th className="py-2 px-4 border-b">Unidad</th>
                  <th className="py-2 px-4 border-b">Kilometraje</th>
                  <th className="py-2 px-4 border-b">Marca</th>
                  <th className="py-2 px-4 border-b">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ambulancias.map((amb, index) => (
                  <tr key={amb.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{index + 1}</td>
                    <td className="py-2 px-4 border-b">{amb.unidad}</td>
                    <td className="py-2 px-4 border-b">{amb.kilometraje}</td>
                    <td className="py-2 px-4 border-b">{amb.marca}</td>
                    <td className="py-2 px-4 border-b space-x-2">
                      <button
                        onClick={() => handleEditar(amb)}
                        className="text-blue-600 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminar(amb.id)}
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
        )}
      </section>
    </div>
  );
};

export default Ambulancias;
