import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import {
    Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
    Select, MenuItem, FormControl, InputLabel, Alert, FormHelperText
} from '@mui/material';
import { InventoryContext } from '../../../context/InventoryContext';

export default function ItemDialog({ open, onClose, onSave, item, itemError }) {
    const { categories } = useContext(InventoryContext);
    const [newItem, setNewItem] = useState({ itemName: '', quantity: '', price: '', categoryName: '' });
    const [localError, setLocalError] = useState(null);

    useEffect(() => {
        if (open) {
            if (item) {
                // When editing, find the categoryName from the categories list using item.category (the ID)
                const categoryObj = categories.find(cat => cat._id === item.category);
                setNewItem({
                    _id: item._id || '',
                    itemName: item.itemName || '',
                    quantity: item.quantity || '',
                    price: item.price || '',
                    categoryName: categoryObj ? categoryObj.categoryName : '' // Set the categoryName string
                });
            } else {
                setNewItem({ itemName: '', quantity: '', price: '', categoryName: '' });
            }
            setLocalError(null); // Clear local error when dialog opens
        }
    }, [item, open, categories]); // Add categories to dependency array

    const handleNewItemChange = (e) => {
        setNewItem({ ...newItem, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setLocalError(null); // Clear previous errors before attempting save

        // Basic client-side validation
        if (!newItem.itemName || !newItem.quantity || !newItem.price || !newItem.categoryName) {
            setLocalError("All fields are required!");
            return;
        }
        if (newItem.quantity <= 0) {
            setLocalError("Quantity must be a positive number.");
            return;
        }
        if (newItem.price <= 0) {
            setLocalError("Price must be a positive number.");
            return;
        }

        // Find the category ID based on the selected categoryName
        const selectedCategory = categories.find(cat => cat.categoryName === newItem.categoryName);
        if (!selectedCategory) {
            setLocalError("Selected category is invalid.");
            return;
        }

        const itemDataToSend = {
            _id: newItem._id, // Include _id if updating
            itemName: newItem.itemName,
            quantity: parseInt(newItem.quantity, 10), // Ensure quantity is a number
            price: parseFloat(newItem.price), // Ensure price is a number
            category: selectedCategory._id, // Use the category ID
            // categoryName is not sent to the backend as it expects the ID
        };

        const success = await onSave(itemDataToSend);
        if (success) {
            onClose(); // Close the dialog only if saving was successful
        } else {
            // Error message will be set by the context and passed down via itemError
            // or if there is a local validation error
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{item ? 'Edit Item' : 'Add New Item'}</DialogTitle>
            <DialogContent>
                {localError && <Alert severity="error" sx={{ mb: 2 }}>{localError}</Alert>}
                {itemError && <Alert severity="error" sx={{ mb: 2 }}>{itemError}</Alert>}
                <TextField
                    autoFocus
                    margin="dense"
                    name="itemName"
                    label="Item Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={newItem.itemName}
                    onChange={handleNewItemChange}
                    error={!!localError && !newItem.itemName}
                    helperText={!!localError && !newItem.itemName ? "Item Name is required" : ""}
                />
                <TextField
                    margin="dense"
                    name="quantity"
                    label="Quantity"
                    type="number"
                    fullWidth
                    variant="standard"
                    value={newItem.quantity}
                    onChange={handleNewItemChange}
                    error={!!localError && (newItem.quantity <= 0 || !newItem.quantity)}
                    helperText={!!localError && (newItem.quantity <= 0 || !newItem.quantity) ? "Quantity must be a positive number" : ""}
                />
                <TextField
                    margin="dense"
                    name="price"
                    label="Price"
                    type="number"
                    fullWidth
                    variant="standard"
                    value={newItem.price}
                    onChange={handleNewItemChange}
                    error={!!localError && (newItem.price <= 0 || !newItem.price)}
                    helperText={!!localError && (newItem.price <= 0 || !newItem.price) ? "Price must be a positive number" : ""}
                />
                <FormControl fullWidth margin="dense" error={!!localError && !newItem.categoryName}>
                    <InputLabel>Category</InputLabel>
                    <Select
                        name="categoryName" // <-- Name is correct for backend
                        value={newItem.categoryName} // <-- Now holds the categoryName string
                        onChange={handleNewItemChange}
                    >
                        {categories.map(cat => (
                            <MenuItem key={cat._id} value={cat.categoryName}>{cat.categoryName}</MenuItem> //* <-- MenuItem value is categoryName string */}
                        ))}
                    </Select>
                    {!!localError && !newItem.categoryName && <FormHelperText>Category is required</FormHelperText>}
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave}>{item ? 'Save' : 'Add'}</Button>
            </DialogActions>
        </Dialog>
    );
}
