// Import necessary hooks from React.
import React, { useState, useEffect, createContext, useContext } from 'react';

// 1. Create the context which will be shared across components.
export const InventoryContext = createContext();

// 2. Create a custom hook for easy consumption of the context.
export const useInventory = () => {
    return useContext(InventoryContext);
};

// 3. Create the Provider component responsible for state management.
export const InventoryProvider = ({ children }) => {
    // State for inventory items, categories, and their units.
    const [inventory, setInventory] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categoryUnits, setCategoryUnits] = useState({});
    
    // State to handle loading and error status during API calls.
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // On component mount, fetch the initial inventory data.
    useEffect(() => {
        fetchInventory();
    }, []);

    // --- API Functions ---

    /**
     * Fetches the entire inventory list from the backend.
     * After fetching, it derives the categories and category units from the inventory data.
     */
    const fetchInventory = async () => {
        setLoading(true);
        setError(null);
        try {
            // Make an actual API call to the backend.
            const response = await fetch('/api/v1/inventory'); // Assuming this is your API endpoint
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch inventory');
            }
            const result = await response.json();
            
            // The server response structure is { success: true, data: { items: [...] } }
            if (result.success && result.data && Array.isArray(result.data.items)) {
                const inventoryItems = result.data.items;
                setInventory(inventoryItems);

                // --- Derive Categories and Units from the fetched data ---
                // This is more efficient as it avoids multiple network requests.

                // Create a set of unique category names.
                const uniqueCategories = new Set(inventoryItems.map(item => item.category));
                setCategories([...uniqueCategories]);

                // Create a mapping of categories to their units.
                // Note: This assumes each item has a 'unit' property.
                // If multiple items in the same category have different units, the last one processed will win.
                const units = inventoryItems.reduce((acc, item) => {
                    if (item.category && item.unit) {
                        acc[item.category] = item.unit;
                    }
                    return acc;
                }, {});
                setCategoryUnits(units);

            } else {
                throw new Error('Unexpected response structure for inventory data');
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
     * After a successful save, it re-fetches the entire inventory to ensure all state is up-to-date.
     */
    const handleSaveItem = async (itemToSave, editingItem) => {
        setLoading(true);
        setError(null);
        try {
            const endpoint = editingItem ? `/api/v1/inventory/${editingItem._id}` : '/api/v1/inventory';
            const method = editingItem ? 'PATCH' : 'POST';

            const response = await fetch(endpoint, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(itemToSave),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to ${editingItem ? 'update' : 'add'} item`);
            }
            
            // After successful save, re-fetch inventory to get the latest state.
            await fetchInventory();
        } catch (err) {
            setError(err.message);
            console.error("Failed to save item", err);
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
            const response = await fetch(`/api/v1/inventory/${itemId}`, { method: 'DELETE' });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete item');
            }
            // After successful delete, re-fetch inventory.
            await fetchInventory();
        } catch (err) {
            setError(err.message);
            console.error("Failed to delete item", err);
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
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantityChange }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update inventory quantity');
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
        categoryUnits,
        loading,
        error,
        fetchInventory, // Exposing fetchInventory in case a manual refresh is needed.
        handleSaveItem,
        handleDeleteItem,
        updateInventoryQuantity,
    };

    // The provider component wraps its children, making the context available to them.
    return (
        <InventoryContext.Provider value={value}>
            {children}
        </InventoryContext.Provider>
    );
};
