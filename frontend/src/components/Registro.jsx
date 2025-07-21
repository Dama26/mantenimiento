import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Cruz from "../assets/cruz.jpg";
import Imagen from "../assets/imagen.jpg";

const Registro = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Creando cuenta...");

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      toast.dismiss(loadingToast);

      if (!response.ok) {
        toast.error(result.message || "Error al crear la cuenta", {
          position: "top-right",
        });
      } else {
        toast.success("¡Cuenta creada exitosamente!", {
          position: "top-right",
        });
        navigate("/login");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Error de conexión con el servidor", {
        position: "top-right",
      });
      console.error("Error:", error);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: `url(${Cruz})` }}
    >
      <Toaster position="top-right" />
      <div className="bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden w-full max-w-4xl">
        <div className="hidden md:flex md:w-1/2">
          <img src={Imagen} alt="Ilustración" className="object-cover w-full" />
        </div>
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-red-600 mb-2">Cruz Roja</h1>
          <h2 className="text-xl text-black-700 mb-1 font-semibold">Crear Cuenta</h2>
          <p className="text-sm text-black-500 mb-4">Registra tus datos de acceso</p>
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
              required
            />
            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition"
            >
              Crear Cuenta
            </button>
            <div className="text-sm text-center mt-2">
              <Link to="/login" className="text-black-700 hover:underline">
                ¿Ya tienes una cuenta? Inicia sesión
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registro;
