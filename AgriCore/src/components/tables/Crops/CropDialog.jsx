import React, { useState, useEffect, useContext, useMemo } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Button, Box
} from '@mui/material';
import { useCrops } from '../../../context/CropsContext';
import { InventoryContext } from '../../../context/InventoryContext';
import CONSUMABLE_CATEGORY_NAMES from '../../../Utils/constants'; // Import the constant

const CropDialog = ({ open, onClose, editingCrop }) => {
  const { addCrop, updateCrop } = useCrops();
  const { inventory, categories } = useContext(InventoryContext); // To select consumed resources

  const [crop, setCrop] = useState({
    cropName: '',
    variety: '',
    plantingDate: '',
    expectedHarvestDate: '',
    status: 'Planted', // Default status
  });

  // State for managing consumed resources
  const [consumedResources, setConsumedResources] = useState([{ itemId: '', quantity: '' }]);

  // Create a memoized map for efficient category lookups
  const categoryMap = useMemo(() => {
    if (!categories) return new Map();
    return new Map(categories.map(cat => [cat._id, cat]));
  }, [categories]);

  useEffect(() => {
    if (editingCrop) {
      setCrop({
        cropName: editingCrop.cropName,
        variety: editingCrop.variety,
        plantingDate: new Date(editingCrop.plantingDate).toISOString().split('T')[0],
        expectedHarvestDate: new Date(editingCrop.expectedHarvestDate).toISOString().split('T')[0],
        status: editingCrop.status,
      });
      setConsumedResources(editingCrop.itemUsed && editingCrop.itemUsed.length > 0
        ? editingCrop.itemUsed.map(item => ({
            itemId: item.itemId || '',
            quantity: item.quantity || ''
          }))
        : [{ itemId: '', quantity: '' }]);
    } else {
      // Reset to default for adding a new crop
      setCrop({
        cropName: '',
        variety: '',
        plantingDate: '',
        expectedHarvestDate: '',
        status: 'Planted',
      });
      setConsumedResources([{ itemId: '', quantity: '' }]);
    }
  }, [editingCrop, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCrop(prev => ({ ...prev, [name]: value }));
  };

  const handleResourceChange = (index, e) => {
    const { name, value } = e.target;
    const updatedResources = [...consumedResources];
    updatedResources[index][name] = value;
    setConsumedResources(updatedResources);
  };

  const handleAddResource = () => {
    setConsumedResources([...consumedResources, { itemId: '', quantity: '' }]);
  };

  const handleRemoveResource = (index) => {
    const updatedResources = consumedResources.filter((_, i) => i !== index);
    setConsumedResources(updatedResources);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...crop, consumedResources };
    if (editingCrop) {
      updateCrop(editingCrop._id, payload);
    } else {
      addCrop(payload);
    }
    onClose();
  };

  // Filter inventory for items that can be consumed
  const consumableInventory = useMemo(() => {
    // Use the imported constant here
    const consumableCategoryIds = categories
      .filter(cat => CONSUMABLE_CATEGORY_NAMES.includes(cat.categoryName))
      .map(cat => cat._id);
    
    return inventory.filter(item => consumableCategoryIds.includes(item.category));
  }, [inventory, categories]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editingCrop ? 'Edit Crop' : 'Add New Crop'}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            name="cropName"
            label="Crop Name"
            value={crop.cropName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="variety"
            label="Variety"
            value={crop.variety}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="plantingDate"
            label="Planting Date"
            type="date"
            value={crop.plantingDate}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            name="expectedHarvestDate"
            label="Expected Harvest Date"
            type="date"
            value={crop.expectedHarvestDate}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          
          <Box sx={{ mt: 2, mb: 1 }}>
            <DialogTitle sx={{ p: 0, mb: 1 }}>Consumed Resources</DialogTitle>
            {consumedResources.map((resource, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                <TextField
                  select
                  name="itemId"
                  label="Inventory Item"
                  value={resource.itemId}
                  onChange={(e) => handleResourceChange(index, e)}
                  fullWidth
                  SelectProps={{ native: true }}
                >
                  <option value=""></option>
                  {consumableInventory.map(item => (
                    <option key={item._id} value={item._id}>
                      {item.itemName} ({item.quantity} {categoryMap.get(item.category)?.unit || ''})
                    </option>
                  ))}
                </TextField>
                <TextField
                  name="quantity"
                  label="Quantity Used"
                  type="number"
                  value={resource.quantity}
                  onChange={(e) => handleResourceChange(index, e)}
                  sx={{ width: '150px' }}
                />
                <Button onClick={() => handleRemoveResource(index)} color="secondary" size="small">
                  Remove
                </Button>
              </Box>
            ))}
            <Button onClick={handleAddResource} size="small">
              Add Resource
            </Button>
          </Box>

        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" onClick={handleSubmit} variant="contained">
          {editingCrop ? 'Save Changes' : 'Save Crop'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CropDialog;
