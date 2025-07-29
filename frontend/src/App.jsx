import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import Ambulancias from "./pages/Ambulancias.jsx";
import Costos from "./pages/Costos";
import Usuarios from "./pages/Usuarios";
import Piezas from "./pages/Piezas";
import Mantenimientos from "./pages/Mantenimientos";
import ReportesMantenimientos from "./pages/ReportesMantenimientos.jsx";
// import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import MainLayout from "./components/MainLayout.jsx";

const App = () => {

  return (
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            {/* <div className="flex">
              <div className="flex-1 h-screen p-8 bg-gray-50 overflow-y-auto"> */}
            {/* <Sidebar /> */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Ambulancias />} />
              <Route path="/costos" element={<Costos />} />
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/piezas" element={<Piezas />} />
              <Route path="/reportes" element={<ReportesMantenimientos />} />
              <Route path="/mantenimientos" element={<Mantenimientos />} />
            </Route>
            {/* </div>
            </div> */}
          </Route>
        </Routes>
  );
};

export default App;
