import React, { useState } from "react";
import Logo from "../assets/Cruz_Roja_Mexicana.jpg"; // Asegúrate de que esté en src/assets/
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaAmbulance,
  FaMoneyBillWave,
  FaUsers,
  FaTools,
  FaCogs,
  FaSignOutAlt,
  FaWrench,
} from "react-icons/fa";
import {
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarLeftExpand,
} from "react-icons/tb";

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const Menus = [
    { title: "Ambulancias", path: "/", icon: <FaAmbulance /> },
    { title: "Mantenimientos", path: "/mantenimientos", icon: <FaWrench /> },
    { title: "Costos", path: "/costos", icon: <FaMoneyBillWave /> },
    { title: "Usuarios", path: "/usuarios", icon: <FaUsers /> },
    { title: "Piezas", path: "/piezas", icon: <FaTools /> },
    { title: "Reportes", path: "/reportes", icon: <FaCogs /> },
  ];

  const handleLogout = () => {
    setShowLogoutModal(false);
    navigate("/login");
  };

  return (
    <div className={`${open ? "w-72" : "w-20"} bg-white h-screen p-5 pt-8 relative border-r border-red-600 duration-300 flex flex-col justify-between`}>
      <div>
        <div
          className="absolute cursor-pointer -right-4 top-9 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center border-2 border-white"
          onClick={() => setOpen(!open)}
        >
          {open ? <TbLayoutSidebarLeftExpand /> : <TbLayoutSidebarLeftCollapse />}
        </div>

        <div className="flex flex-col items-center justify-center mt-2 mb-4">
          <img
            src={Logo}
            alt="Logo Cruz Roja Mexicana"
            className="object-contain w-50 h-auto"
          />
        </div>

        <ul className="space-y-2">
          {Menus.map((menu, index) => (
            <li key={index}>
              <Link
                to={menu.path}
                className={`flex items-center gap-x-4 px-4 py-3 rounded-md transition duration-200 ${
                  location.pathname === menu.path
                    ? "bg-red-100 text-red-700 font-semibold"
                    : "text-black hover:bg-red-50 hover:text-red-700"
                }`}
              >
                <span className="text-lg">{menu.icon}</span>
                {open && <span>{menu.title}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center gap-x-4 px-4 py-3 rounded-md text-black hover:bg-red-50 hover:text-red-700 transition duration-200"
        >
          <FaSignOutAlt className="text-lg" />
          {open && <span>Cerrar sesión</span>}
        </button>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold text-black mb-4">¿Cerrar sesión?</h2>
            <p className="text-sm text-gray-600 mb-6">
              ¿Estás seguro que deseas cerrar tu sesión?
            </p>
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

export default Sidebar;

