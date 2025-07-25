import { useState, useEffect } from "react";
import { getAmbulancias, deleteAmbulancia, createAmbulancia } from "../services/ambulanciasService"; // Importa el servicio
import { getToken } from '../services/token';

const Ambulancias = () => {
  const [numeroSerie, setNumerSerie] = useState("");
  const [unidad, setUnidad] = useState("");
  const [modelo, setModelo] = useState("");
  const [nombreConductor, setNombreConductor] = useState("");
  
  const [ambulancias, setAmbulancias] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [ambulanciaEditandoId, setAmbulanciaEditandoId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Cargar ambulancias usando el servicio y el token
  const cargarAmbulancias = async () => {
    try {
      const data = await getAmbulancias();
      setAmbulancias(data);
    } catch (error) {
      console.error("Error al cargar ambulancias:", error);
      alert("No se pudieron cargar las ambulancias.");
    }
  };

  useEffect(() => {
    cargarAmbulancias();
  }, []);

  const resetForm = () => {
    setNumerSerie("");
    setUnidad("");
    setModelo("");
    setNombreConductor("");
    setModoEdicion(false);
    setAmbulanciaEditandoId(null);
    setShowForm(false);
  };

  const isUnidadUnico = (num) => {
    return !ambulancias.some(
      (amb) =>
        amb.unidad.trim() === num.trim() &&
        amb.id !== ambulanciaEditandoId
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!unidad.trim() || !modelo.trim() || !nombreConductor.trim() || !numeroSerie.trim()) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    if (!modoEdicion && !isUnidadUnico(unidad)) {
      alert("El número económico ya está registrado.");
      return;
    }

    const nuevaAmbulancia = {
      id: modoEdicion ? ambulanciaEditandoId : Date.now(),
      numero_serie: numeroSerie.trim(),
      unidad: unidad.trim(),
      modelo: modelo.trim(),
      nombre_conductor: nombreConductor.trim(),
    };

    if (modoEdicion) {
      setAmbulancias((prev) =>
        prev.map((amb) => (amb.id === ambulanciaEditandoId ? nuevaAmbulancia : amb))
      );
    } else {

      const data = await createAmbulancia(nuevaAmbulancia);
      setAmbulancias([...ambulancias, data]);
    }

    resetForm();
  };

  const handleEditar = (amb) => {
    setNumerSerie(amb.numero_serie);
    setUnidad(amb.unidad);
    setModelo(amb.modelo);
    setNombreConductor(amb.nombre_conductor);
    setModoEdicion(true);
    setAmbulanciaEditandoId(amb.id);
    setShowForm(true);
  };

  const handleEliminar = async (id) => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar esta ambulancia?");
    if (confirmacion) {
      const data = await deleteAmbulancia(id);
      console.log("Ambulancia eliminada:", data);
      setAmbulancias((prev) => prev.filter((amb) => amb.id !== id));
    }
  };



  return (
    <div className="p-6 space-y-12">
      <h1 className="text-3xl font-bold text-red-700">Gestión de Ambulancias</h1>

      <section
        className="bg-white p-6 rounded-lg shadow-lg max-w-xl mx-auto"
        style={{ display: showForm ? "block" : "none" }}
      >
        <h2 className="text-2xl font-semibold text-red-700 mb-4">
          {modoEdicion ? "Editar Ambulancia" : "Registrar Nueva Ambulancia"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Unidad
            </label>
            <input
              type="text"
              value={unidad}
              onChange={(e) => setUnidad(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Numero de Serie
            </label>
            <input
              type="text"
              value={numeroSerie}
              onChange={(e) => setNumerSerie(e.target.value)}
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
            <label className="block text-gray-700 font-medium mb-1">Nombre de Conductor</label>
            <input
              type="text"
              value={nombreConductor}
              onChange={(e) => setNombreConductor(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition mr-2"
          >
            {modoEdicion ? "Guardar Cambios" : "Guardar"}
          </button>

          <button
            type="button"
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
            onClick={resetForm}
          >
            Cancelar
          </button>
        </form>
      </section>

      <hr className="border-gray-300" />

      <section style={{ display: showForm ? "none" : "block" }} className="mt-6">
        <div>
          <button
            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition"
            onClick={() => setShowForm(true)}
          >
            Añadir Ambulancia
          </button>
        </div>
        <h2 className="text-2xl font-semibold text-red-700 mb-4 text-center">
          Lista de Ambulancias
        </h2>

        {ambulancias.length === 0 ? (
          <p className="text-gray-600 text-center">
            Aún no se han añadido ambulancias.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded shadow">
              <thead>
                <tr className="bg-red-100 text-red-800 text-left">
                  <th className="py-2 px-4 border-b">Unidad</th>
                  <th className="py-2 px-4 border-b">Modelo</th>
                  <th className="py-2 px-4 border-b">Conductor</th>
                  <th className="py-2 px-4 border-b">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ambulancias.map((amb, index) => (
                  <tr key={amb.id} className="hover:bg-black/5">
                    <td className="py-2 px-4 border-b">{amb.unidad}</td>
                    <td className="py-2 px-4 border-b">{amb.modelo}</td>
                    <td className="py-2 px-4 border-b">{amb.nombre_conductor}</td>
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