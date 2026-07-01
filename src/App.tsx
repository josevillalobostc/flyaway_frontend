import { BrowserRouter, Navigate, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Flights from "./components/Flights";
import Reservations from "./components/Reservations";

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("jwt_token");

  useEffect(() => {
    if (!token && location.pathname !== "/login" && location.pathname !== "/register") {
      navigate("/login");
    }
  }, [navigate, location, token]);

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    navigate("/login");
  };

  return (
    <>
      {token && (
        <nav className="absolute top-0 left-0 w-full bg-zinc-800 p-4 shadow-lg flex justify-between items-center z-50 font-mono text-white">
          <div className="flex gap-6 font-bold text-lg px-4">
            <span 
              onClick={() => navigate("/flights")} 
              className="cursor-pointer hover:text-emerald-400 transition-colors"
            >
              Vuelos
            </span>
            <span 
              onClick={() => navigate("/reservations")} 
              className="cursor-pointer hover:text-emerald-400 transition-colors"
            >
              Mis Reservas
            </span>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-500 text-white font-mono p-2 px-4 rounded-xl shadow transition-colors"
          >
            Cerrar Sesión
          </button>
        </nav>
      )}
      <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/flights" element={<Flights />} />
      <Route path="/reservations" element={<Reservations />} />


      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="bg-zinc-900 flex h-screen items-center pt-10 justify-center">
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
