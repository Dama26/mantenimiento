// src/layouts/MainLayout.js
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import { Outlet } from 'react-router-dom';

const MainLayout = ({ children }) => {
  const { user } = useAuth();

  console.log("MainLayout user:", user);
   console.log(children);

  return (
    <div className="flex">
      {user && <Sidebar />}
        <div className="flex-1 h-screen p-8 bg-gray-50 overflow-y-auto">
          <Outlet />
        </div>
    </div>
  );
};

export default MainLayout;
