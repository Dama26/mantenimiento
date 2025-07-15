import { useState } from "react";

const Ambulancias = () => {
  const [numeroEconomico, setNumeroEconomico] = useState("");
  const [modelo, setModelo] = useState("");
  const [kilometraje, setKilometraje] = useState("");
  const [ambulancias, setAmbulancias] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [ambulanciaEditandoId, setAmbulanciaEditandoId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (modoEdicion) {
      setAmbulancias((prev) =>
        prev.map((amb) =>
          amb.id === ambulanciaEditandoId
            ? { ...amb, numeroEconomico, modelo, kilometraje }
            : amb
        )
      );
      setModoEdicion(false);
      setAmbulanciaEditandoId(null);
    } else {
      const nuevaAmbulancia = {
        id: Date.now(),
        numeroEconomico,
        modelo,
        kilometraje,
      };
      setAmbulancias([...ambulancias, nuevaAmbulancia]);
    }

    setNumeroEconomico("");
    setModelo("");
    setKilometraje("");
  };

  const handleEditar = (amb) => {
    setNumeroEconomico(amb.numeroEconomico);
    setModelo(amb.modelo);
    setKilometraje(amb.kilometraje);
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
            <label className="block text-gray-700 font-medium mb-1">Número Económico</label>
            <input
              type="text"
              value={numeroEconomico}
              onChange={(e) => setNumeroEconomico(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Modelo</label>
            <input
              type="text"
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Kilometraje</label>
            <input
              type="text"
              value={kilometraje}
              onChange={(e) => setKilometraje(e.target.value)}
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
                  <th className="py-2 px-4 border-b">Número Económico</th>
                  <th className="py-2 px-4 border-b">Modelo</th>
                  <th className="py-2 px-4 border-b">Kilometraje</th>
                  <th className="py-2 px-4 border-b">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ambulancias.map((amb, index) => (
                  <tr key={amb.id} className="hover:bg-black/5">
                    <td className="py-2 px-4 border-b">{index + 1}</td>
                    <td className="py-2 px-4 border-b">{amb.numeroEconomico}</td>
                    <td className="py-2 px-4 border-b">{amb.modelo}</td>
                    <td className="py-2 px-4 border-b">{amb.kilometraje}</td>
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
