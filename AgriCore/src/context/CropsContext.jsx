import React, { useState, useEffect, createContext, useContext } from "react";

export const CropsContext = createContext();

export const useCrops = () => {
  return useContext(CropsContext);
};

export const CropsProvider = ({ children }) => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/api/v1/crop/getCrops",
        { credentials: "include" },
      );

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch crops");
        } else {
          // Instead of throwing the full HTML, throw a more user-friendly message.
          throw new Error(
            `Failed to fetch crops. Status: ${response.status}. Please check if the backend is running and the endpoint is correct.`,
          );
        }
      }
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setCrops(result.data);
      } else {
        throw new Error("Unexpected response structure for crop data");
      }
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch crops", err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    crops,
    loading,
    error,
    fetchCrops,
  };

  return (
    <CropsContext.Provider value={value}>{children}</CropsContext.Provider>
  );
};
