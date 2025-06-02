import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";         // 
import Login from "./pages/Login"; 

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
