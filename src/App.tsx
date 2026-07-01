import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Flights from "./components/Flights";

function App() {
  return (
    <BrowserRouter>
      <div className="bg-zinc-900 flex h-screen items-center justify-center">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/flights" element={<Flights />} />

          <Route path="/" element={<Navigate to="/register" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
