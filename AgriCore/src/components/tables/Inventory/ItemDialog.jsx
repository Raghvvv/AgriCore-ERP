import * as React from 'react';
import { useState, useEffect } from 'react';
import {
    Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
    Select, MenuItem, FormControl, InputLabel
} from '@mui/material';

export default function ItemDialog({ open, onClose, onSave, item, categories, categorySpecificFields }) {
    const [newItem, setNewItem] = useState({ name: '', quantity: '', price: '', category: '' });

    useEffect(() => {
        if (item) {
            setNewItem(item);
        } else {
            setNewItem({ name: '', quantity: '', price: '', category: '' });
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
                    name="name"
                    label="Item Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={newItem.name}
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
                            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {newItem.category && categorySpecificFields[newItem.category] && categorySpecificFields[newItem.category].map(field => (
                    <TextField
                        key={field.name}
                        margin="dense"
                        name={field.name}
                        label={field.label}
                        type={field.type}
                        fullWidth
                        variant="standard"
                        value={newItem[field.name] || ''}
                        onChange={handleNewItemChange}
                    />
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave}>{item ? 'Save' : 'Add'}</Button>
            </DialogActions>
        </Dialog>
    );
}
