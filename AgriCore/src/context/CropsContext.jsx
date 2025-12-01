import React, { useState, useEffect, createContext, useContext } from "react";
import { InventoryContext } from "./InventoryContext"; // Import InventoryContext

export const CropsContext = createContext();

export const useCrops = () => {
  return useContext(CropsContext);
};

export const CropsProvider = ({ children }) => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Get inventory and the function to update it from the InventoryContext
  const { inventory, updateInventoryQuantity } = useContext(InventoryContext);

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/api/v1/item/getCrops",
        { credentials: "include" },
      );

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch crops");
        } else {
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

  const addCrop = async (cropData) => {
    setLoading(true);
    setError(null);
    try {
      const itemUsed = (cropData.consumedResources || [])
        .map(resource => {
          if (!resource.itemId || !resource.quantity) return null;
          const inventoryItem = inventory.find(item => item._id === resource.itemId);
          return {
            itemId: resource.itemId,
            quantity: parseInt(resource.quantity, 10),
            itemName: inventoryItem ? inventoryItem.itemName : 'Unknown Item',
          };
        })
        .filter(r => r && r.quantity > 0);

      const backendPayload = {
        cropName: cropData.cropName,
        plantingDate: cropData.plantingDate,
        harvestingDate: cropData.expectedHarvestDate,
        cropVariety:cropData.variety,
        usedItems: itemUsed,
      };

      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/api/v1/item/addCrop",
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(backendPayload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add crop");
      }

      // After success, update inventory quantities
      const inventoryUpdatePromises = itemUsed.map(item =>
        updateInventoryQuantity(item.itemId, -item.quantity) // Subtract quantity
      );
      await Promise.all(inventoryUpdatePromises);

      await fetchCrops(); // Refresh crop list
    } catch (err) {
      setError(err.message);
      console.error("Failed to add crop", err);
			throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCrop = async (cropId, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const newItemUsed = (updateData.consumedResources || [])
        .map(resource => {
          if (!resource.itemId || !resource.quantity) return null;
          const inventoryItem = inventory.find(item => item._id === resource.itemId);
          return {
            itemId: resource.itemId,
            quantity: parseInt(resource.quantity, 10),
            itemName: inventoryItem ? inventoryItem.itemName : 'Unknown Item',
          };
        })
        .filter(r => r && r.quantity > 0);

      const backendPayload = {
        cropName: updateData.cropName,
        plantingDate: updateData.plantingDate,
        harvestingDate: updateData.expectedHarvestDate,
        itemUsed: newItemUsed,
      };

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/crops/updateCrop/${cropId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(backendPayload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update crop");
      }
      
      await fetchCrops();
    } catch (err) {
      setError(err.message);
      console.error("Failed to update crop", err);
			throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    crops,
    loading,
    error,
    fetchCrops,
    addCrop,
    updateCrop,
  };

  return (
    <CropsContext.Provider value={value}>{children}</CropsContext.Provider>
  );
};
