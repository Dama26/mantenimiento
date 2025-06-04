import { useState } from "react";

const Usuarios = () => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [rol, setRol] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  
    console.log("Usuario añadido:", { nombre, correo, rol });

    
    setNombre("");
    setCorreo("");
    setRol("");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-red-700 mb-4">Usuarios</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4 max-w-md">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Correo electrónico</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Rol</label>
          <input
            type="text"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition"
        >
          Añadir Usuario
        </button>
      </form>
    </div>
  );
};

export default Usuarios;
