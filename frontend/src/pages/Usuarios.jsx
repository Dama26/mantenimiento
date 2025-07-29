import { useState, useEffect } from "react";
import * as UsuariosService from "../services/usuariosService";
import { set } from "date-fns";

const Usuarios = () => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("encargado");
  const [usuarios, setUsuarios] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioEnEdicionId, setUsuarioEnEdicionId] = useState(null);

  const cargarUsuarios = async () => {
    try {
      const response = await UsuariosService.get();
      setUsuarios(response);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      alert("No se pudieron cargar los usuarios.");
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleSubmit = async (e) => {
    const usuarioObject = {
      nombre,
      correo,
      rol,
      contrasena: password,
    };

    e.preventDefault();

    try {
      
      if (modoEdicion) {
        await UsuariosService.update(usuarioEnEdicionId, usuarioObject);
      } else {
        await UsuariosService.create(usuarioObject);
      }

      cargarUsuarios();

      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error("Error al agregar usuario:", error);
      alert("No se pudo agregar el usuario.");
    }

    console.log("Usuario añadido:", { nombre, correo, rol });
  };

  const handleEditar = (usuario) => {
    setNombre(usuario.nombre);
    setCorreo(usuario.correo);
    setRol(usuario.rol);
    setModoEdicion(true);
    setShowForm(true);

    setUsuarioEnEdicionId(usuario.id);
    console.log("Editando usuario:", usuario.id);
  };

  const resetForm = () => {
    setNombre("");
    setCorreo("");
    setPassword("");
    setRol("encargado");
    setModoEdicion(false);
    setShowForm(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-red-700 mb-4">Usuarios</h1>
      <section
        className="bg-white p-6 rounded-lg shadow-lg mx-auto"
        style={{ display: showForm ? "block" : "none" }}
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md space-y-4 max-w-md"
        >
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Rol</label>

            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="director">Director</option>
              <option value="encargado">Encargado</option>
              <option value="contador">Contador</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div style={{ display: modoEdicion ? "none" : "block" }}>
            <label className="block text-gray-700 font-medium mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition mr-2"
          >
            Guardar
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

      <div className="mt-8" style={{ display: showForm ? "none" : "block" }}>
        <div>
          <button
            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition"
            onClick={() => setShowForm(true)}
          >
            Añadir Usuario
          </button>
        </div>
        <h2 className="text-2xl font-semibold text-red-700 mb-4 text-center">
          Lista de Usuarios
        </h2>
        {usuarios.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm text-center">
              <thead className="bg-red-100 text-red-700">
                <tr>
                  <th className="border px-3 py-2">Nombre</th>
                  <th className="border px-3 py-2">Correo</th>
                  <th className="border px-3 py-2">Rol</th>
                  <th className="border px-3 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="border px-2 py-1">{user.nombre}</td>
                    <td className="border px-2 py-1">{user.correo}</td>

                    <td className="border px-2 py-1 capitalize">{user.rol}</td>
                    <td className="border px-2 py-1">
                      <button
                        onClick={() => handleEditar(user)}
                        className="text-red-900 hover:underline"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 mt-4">No hay Usuarios registrados.</p>
        )}
      </div>
    </div>
  );
};

export default Usuarios;
