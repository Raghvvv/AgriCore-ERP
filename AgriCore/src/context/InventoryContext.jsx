// Import necessary hooks from React.
import React, { useState, useEffect, createContext, useContext } from "react";

// 1. Create the context which will be shared across components.
export const InventoryContext = createContext();

// 2. Create a custom hook for easy consumption of the context.
export const useInventory = () => {
  return useContext(InventoryContext);
};

// 3. Create the Provider component responsible for state management.
export const InventoryProvider = ({ children }) => {
  // State for inventory items and categories.
  const [inventory, setInventory] = useState([]);
  const [categories, setCategories] = useState([]);

  // State to handle loading and error status during API calls.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // On component mount, fetch all necessary data from the backend.
  useEffect(() => {
    fetchData();
  }, []);

  // --- API Functions ---

  /**
   * Fetches both inventory and categories data from the backend concurrently.
   */
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch inventory and categories in parallel.
      const [inventoryResponse, categoriesResponse] = await Promise.all([
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/v1/item/getItems", {
          credentials: "include",
        }),
        fetch(
          import.meta.env.VITE_BACKEND_URL + "/api/v1/category/getCategory",
          {
            credentials: "include",
          },
        ),
      ]);

      if (!inventoryResponse.ok) {
        const errorData = await inventoryResponse.json();
        throw new Error(errorData.message || "Failed to fetch inventory");
      }
      if (!categoriesResponse.ok) {
        const errorData = await categoriesResponse.json();
        throw new Error(errorData.message || "Failed to fetch categories");
      }

      const inventoryResult = await inventoryResponse.json();
      const categoriesResult = await categoriesResponse.json();

      // The server response for inventory is { success: true, data: [...] }
      if (inventoryResult.success && Array.isArray(inventoryResult.data)) {
        setInventory(inventoryResult.data);
      } else {
        throw new Error("Unexpected response structure for inventory data");
      }

      // Assuming the server response for categories is { success: true, data: [...] }
      if (categoriesResult.success && Array.isArray(categoriesResult.data)) {
        setCategories(categoriesResult.data);
      } else {
        console.warn("Could not fetch or parse categories.");
        setCategories([]); // Set to empty array to prevent crashes
      }
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetches only the inventory list. Used after mutations.
   */
  const fetchInventory = async () => {
    // This function can be simplified if mutations return the updated item,
    // allowing for local state updates instead of a full refetch.
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/v1/inventory");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch inventory");
      }
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setInventory(result.data);
      } else {
        throw new Error("Unexpected response structure for inventory data");
      }
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch inventory", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Saves an item to the backend (either adding a new one or updating an existing one).
   * After a successful save, it optimistically updates the local state for new items,
   * or re-fetches the entire inventory for updates (until specific update responses are known).
   */
  const handleSaveItem = async (itemData) => {
    setLoading(true);
    setError(null);
    try {
      const isUpdating = itemData._id;
      const endpoint = isUpdating
        ? `${import.meta.env.VITE_BACKEND_URL}/api/v1/item/updateItem/${itemData._id}`
        : import.meta.env.VITE_BACKEND_URL + "/api/v1/item/createItem";
      const method = isUpdating ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Failed to ${isUpdating ? "update" : "add"} item`,
        );
      }

      const result = await response.json();

      if (!isUpdating) {
        // Optimistic update for new items
        if (
          result.success &&
          result.data &&
          result.data.item &&
          result.data.itemStock
        ) {
          const { item, itemStock } = result.data;
          const newItemForState = {
            ...item,
            quantity: itemStock.quantity, // Combine item and itemStock data
            itemId: item._id, // Ensure itemId is present, matching _id
            stockId: itemStock._id, // Ensure stockId is present
          };
          setInventory((prevInventory) => [...prevInventory, newItemForState]);
        } else {
          // Fallback to full fetch if response structure is unexpected
          await fetchData();
        }
      } else {
        // For updates, assuming the backend returns the updated item,
        // find and replace it in the local state.
        if (result.success && result.data) {
          setInventory((prevInventory) =>
            prevInventory.map((item) =>
              item._id === result.data._id ? result.data : item,
            ),
          );
        } else {
          // Fallback to full fetch if specific updated item is not returned
          await fetchData();
        }
      }
    } catch (err) {
      setError(err.message);
      console.error("Failed to save item", err);
      await fetchData(); // Ensure state is consistent after an error
    } finally {
      setLoading(false);
    }
  };

  /**
   * Deletes an item from the backend.
   * Re-fetches the inventory on successful deletion.
   */
  const handleDeleteItem = async (itemId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/item/deleteItem/${itemId}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete item");
      }
      // After successful delete, filter the item from the local state
      setInventory((prevInventory) =>
        prevInventory.filter((item) => item._id !== itemId),
      );
    } catch (err) {
      setError(err.message);
      console.error("Failed to delete item", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (categoryData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/api/v1/category/addCategory",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryData),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add category");
      }

      const result = await response.json();

      if (result.success && result.data && result.data.newCategory) {
        setCategories((prevCategories) => [
          ...prevCategories,
          result.data.newCategory,
        ]);
      } else {
        throw new Error("Unexpected response structure for adding category");
      }
    } catch (err) {
      setError(err.message);
      console.error("Failed to add category", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Updates the quantity of a specific item in the backend.
   * Re-fetches the inventory on successful update.
   */
  const updateInventoryQuantity = async (itemId, quantityChange) => {
    setLoading(true);
    setError(null);
    try {
      // This endpoint might need to be adjusted based on your actual API design.
      const response = await fetch(`/api/v1/inventory/${itemId}/quantity`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantityChange }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to update inventory quantity",
        );
      }
      // After successful update, re-fetch inventory.
      await fetchInventory();
    } catch (err) {
      setError(err.message);
      console.error("Failed to update inventory quantity", err);
    } finally {
      setLoading(false);
    }
  };

  // The value object contains all the state and functions to be shared.
  const value = {
    inventory,
    categories,
    loading,
    error,
    fetchInventory: fetchData, // Exposing fetchData for manual refresh.
    handleSaveItem,
    handleDeleteItem,
    handleAddCategory,
    updateInventoryQuantity,
  };

  // The provider component wraps its children, making the context available to them.
  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};
