import React, { useState, useEffect, useContext, useMemo } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Button, Box, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import { useCrops } from '../../../context/CropsContext';
import { InventoryContext } from '../../../context/InventoryContext';

const HarvestDialog = ({ open, onClose, harvestingCrop }) => {
  const { harvestCrop } = useCrops();
  const { categories } = useContext(InventoryContext);

  const [harvestData, setHarvestData] = useState({
    actualYield: '',
    price: '',
    harvestedAt: '',
    category: '',
  });

  useEffect(() => {
    if (harvestingCrop) {
      setHarvestData({
        actualYield: '',
        price: '',
        harvestedAt: new Date().toISOString().split('T')[0], // Default to today
        category: '',
      });
    }
  }, [harvestingCrop, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHarvestData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!harvestingCrop) return;

    try {
      console.log("harvestData.harvestedAt before payload:", harvestData.harvestedAt);
      const payload = {
        ...harvestData,
        harvestedAt: harvestData.harvestedAt ? new Date(harvestData.harvestedAt).toISOString() : null,
      };
      console.log("Payload being sent:", payload);
      await harvestCrop(harvestingCrop._id, payload);
      onClose(); // Close dialog on success
    } catch (error) {
      // The error is already logged in the context, but you could add a snackbar here for the user
      console.error("Harvest submission failed", error);
    }
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Harvest Crop: {harvestingCrop?.cropName}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            name="actualYield"
            label="Actual Yield (Quantity)"
            type="number"
            value={harvestData.actualYield}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="price"
            label="Price (per unit)"
            type="number"
            value={harvestData.price}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="harvestedAt"
            label="Harvested At"
            type="date"
            value={harvestData.harvestedAt}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="harvest-category-label">Category for Inventory</InputLabel>
            <Select
              labelId="harvest-category-label"
              name="category"
              value={harvestData.category}
              onChange={handleChange}
              label="Category for Inventory"
            >
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" onClick={handleSubmit} variant="contained">
          Save Harvest
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HarvestDialog;
