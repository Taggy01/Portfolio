import { useState, useCallback } from "react";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import Loader from "./components/loader";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminApp from "./admin/AdminApp";

export default function App() {
  const [loading, setLoading] = useState(true);

  const handleComplete = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <>
            <Navbar />
            <Home />

            {loading && <Loader onComplete={handleComplete} />}
          </>
        } />
        <Route path="/admin" element={<AdminApp />} />
      </Routes>
    </BrowserRouter>
  )
}
