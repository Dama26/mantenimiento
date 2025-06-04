import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import Ambulancias from "./pages/Ambulancias.jsx";
import Costos from "./pages/Costos";
import Usuarios from "./pages/Usuarios";
import Piezas from "./pages/Piezas";
import Reportes from "./pages/Reportes";

const App = () => {
  return (
    
    <div className="flex">
      <Sidebar />
      <div className="flex-1 h-screen p-8 bg-gray-50 overflow-y-auto">
        <Routes>
           <Route path="/login" element={<Login />} />
          <Route path="/" element={<Ambulancias />} />
          <Route path="/costos" element={<Costos />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/piezas" element={<Piezas />} />
          <Route path="/reportes" element={<Reportes />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
