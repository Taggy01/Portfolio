import { useState, useCallback } from "react";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import Loader from "./components/loader";

export default function App() {
  const [loading, setLoading] = useState(true);

  const handleComplete = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <>
      <Navbar />
      <Home />

      {loading && <Loader onComplete={handleComplete} />}
    </>
  );
}