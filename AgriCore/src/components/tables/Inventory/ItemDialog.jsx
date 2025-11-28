import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import {
    Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
    Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { InventoryContext } from '../../../context/InventoryContext';

export default function ItemDialog({ open, onClose, onSave, item }) {
    const { categories } = useContext(InventoryContext);
    const [newItem, setNewItem] = useState({ itemName: '', quantity: '', price: '', category: '' });

    useEffect(() => {
        if (item) {
            // Ensure we are using the correct property 'itemName'
            setNewItem({
                itemName: item.itemName || '',
                quantity: item.quantity || '',
                price: item.price || '',
                category: item.category || ''
            });
        } else {
            setNewItem({ itemName: '', quantity: '', price: '', category: '' });
        }
    }, [item, open]);

    const handleNewItemChange = (e) => {
        setNewItem({ ...newItem, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        onSave(newItem);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{item ? 'Edit Item' : 'Add New Item'}</DialogTitle>
            <DialogContent>
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
                />
                <FormControl fullWidth margin="dense">
                    <InputLabel>Category</InputLabel>
                    <Select
                        name="category"
                        value={newItem.category}
                        onChange={handleNewItemChange}
                    >
                        {categories.map(cat => (
                            <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave}>{item ? 'Save' : 'Add'}</Button>
            </DialogActions>
        </Dialog>
    );
}
