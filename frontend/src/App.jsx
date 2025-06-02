import { useNavigate } from "react-router-dom"; // para redirigir
import React, { useState } from "react";
import {
  FaAmbulance,
  FaMoneyBillWave,
  FaUsers,
  FaCogs,
  FaTools,
  FaSignOutAlt,
} from "react-icons/fa";
import {
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarLeftExpand,
} from "react-icons/tb";

const App = () => {
  const [open, setOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const Menus = [
    { title: "Ambulancias", icon: <FaAmbulance /> },
    { title: "Costos", icon: <FaMoneyBillWave /> },
    { title: "Usuarios", icon: <FaUsers /> },
    { title: "Piezas", icon: <FaTools /> },
    { title: "Reportes", icon: <FaCogs /> },
  ];

  const handleLogout = () => {
    console.log("Sesión cerrada");
    setShowLogoutModal(false);
  };

  return (
    <div className="w-full flex">
      <div className={`${open ? "w-72" : "w-20"} bg-white h-screen p-5 pt-8 relative border-r border-red-600 duration-300 flex flex-col justify-between`}>
        <div>
          <div
            className="absolute cursor-pointer -right-4 top-9 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center border-2 border-white transition-transform"
            onClick={() => setOpen(!open)}
          >
            {open ? <TbLayoutSidebarLeftExpand /> : <TbLayoutSidebarLeftCollapse />}
          </div>

          <div className="flex flex-col items-center justify-center mb-10">
            {open && (
              <h1 className="text-2xl font-semibold text-red-700 text-center leading-tight">
                Mantenimiento<br />de Ambulancias
              </h1>
            )}
          </div>

          <ul className="space-y-2">
            {Menus.map((menu, index) => (
              <li
                key={index}
                className={`flex items-center gap-x-4 px-4 py-3 rounded-md cursor-pointer transition duration-200 ${
                  activeMenu === menu.title
                    ? "bg-red-100 text-red-700 font-semibold"
                    : "text-gray-700 hover:bg-red-50 hover:text-red-700"
                }`}
                onClick={() => setActiveMenu(menu.title)}
              >
                <span className="text-lg">{menu.icon}</span>
                {open && <span>{menu.title}</span>}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8">
          <button
            className="w-full flex items-center gap-x-4 px-4 py-3 rounded-md text-gray-700 hover:bg-red-50 hover:text-red-700 transition duration-200"
            onClick={() => setShowLogoutModal(true)}
          >
            <FaSignOutAlt className="text-lg" />
            {open && <span>Cerrar sesión</span>}
          </button>
        </div>
      </div>
      <div className="flex-1 h-screen p-8 bg-gray-50">
        <h1 className="text-2xl font-bold text-red-700">
          Panel de {activeMenu || "Mantenimiento"}
        </h1>
      </div>
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">¿Cerrar sesión?</h2>
            <p className="text-sm text-gray-600 mb-6">¿Estás seguro que deseas cerrar tu sesión?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
