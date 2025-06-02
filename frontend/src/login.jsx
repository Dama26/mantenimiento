import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Fondo from "./assets/fondo.jpeg";
import Ilustracion from "./assets/ilustracion.jpeg";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Iniciando sesión...");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    toast.dismiss(loadingToast);

    if (error) {
      toast.error("Correo o contraseña incorrectos.", { position: "top-right" });
    } else {
      toast.success(`¡Bienvenido ${email.split("@")[0]}!`, { position: "top-right" });
      navigate("/");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: `url(${Fondo})` }}
    >
      <Toaster position="top-right" />
      <div className="bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden w-full max-w-4xl">
        <div className="hidden md:flex md:w-1/2">
          <img
            src={Ilustracion}
            alt="Ilustración agrícola"
            className="object-cover w-full"
          />
        </div>
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-green-600 mb-2 flex items-center gap-2">
            <span className="text-3xl"></span> Cruz roja
          </h1>
          <h2 className="text-xl text-green-700 mb-1 font-semibold">Iniciar Sesión</h2>
          <p className="text-sm text-gray-500 mb-4">Bienvenido de nuevo</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition"
            >
              Iniciar Sesión
            </button>
            <div className="text-sm text-center mt-2">
              <a href="/register" className="text-green-700 hover:underline mr-3">
                Crear cuenta
              </a>
              <a href="/recuperar" className="text-green-700 hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

