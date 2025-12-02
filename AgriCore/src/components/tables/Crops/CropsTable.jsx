import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, Box, Button, IconButton, CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCrops } from '../../../context/CropsContext';
import CropDialog from './CropDialog';
import HarvestDialog from './HarvestDialog'; // Import HarvestDialog

const CropsTable = () => {
    const { crops, deleteCrop, loading, error } = useCrops();
    
    // State for the crop add/edit dialog
    const [cropDialogOpen, setCropDialogOpen] = useState(false);
    const [editingCrop, setEditingCrop] = useState(null);

    // State for the harvest dialog
    const [harvestDialogOpen, setHarvestDialogOpen] = useState(false);
    const [harvestingCrop, setHarvestingCrop] = useState(null);

    const handleOpenCropDialog = (crop = null) => {
        setEditingCrop(crop);
        setCropDialogOpen(true);
    };

    const handleCloseCropDialog = () => {
        setEditingCrop(null);
        setCropDialogOpen(false);
    };

    const handleOpenHarvestDialog = (crop) => {
        setHarvestingCrop(crop);
        setHarvestDialogOpen(true);
    };

    const handleCloseHarvestDialog = () => {
        setHarvestingCrop(null);
        setHarvestDialogOpen(false);
    };

    const handleDelete = (cropId) => {
        if (window.confirm('Are you sure you want to delete this crop? This action cannot be undone.')) {
            deleteCrop(cropId);
        }
    };

    return (
        <TableContainer component={Paper}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                <Typography variant="h6">Crops Management</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenCropDialog()}
                >
                    Add New Crop
                </Button>
            </Box>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Typography color="error" sx={{ p: 2 }}>
                    Error: {error}
                </Typography>
            )}

            {!loading && !error && (
                <Table sx={{ minWidth: 650 }} aria-label="crops table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Crop Name</TableCell>
                            <TableCell>Variety</TableCell>
                            <TableCell>Planting Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Harvested At</TableCell>
                            <TableCell>Actual Yield</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {crops.map((crop) => (
                            <TableRow key={crop._id}>
                                <TableCell component="th" scope="row">{crop.cropName}</TableCell>
                                <TableCell>{crop.variety}</TableCell>
                                <TableCell>{new Date(crop.plantingDate).toLocaleDateString()}</TableCell>
                                <TableCell>{crop.status}</TableCell>
                                <TableCell>{crop.harvestedAt ? new Date(crop.harvestedAt).toLocaleDateString() : '---'}</TableCell>
                                <TableCell>{crop.actualYield ?? '---'}</TableCell>
                                <TableCell align="right">
                                    {crop.status !== 'Harvested' && (
                                        <Button onClick={() => handleOpenHarvestDialog(crop)} size="small" variant="outlined">
                                            Harvest
                                        </Button>
                                    )}
                                    <IconButton onClick={() => handleDelete(crop._id)} size="small">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <CropDialog
                open={cropDialogOpen}
                onClose={handleCloseCropDialog}
                editingCrop={editingCrop}
            />

            <HarvestDialog
                open={harvestDialogOpen}
                onClose={handleCloseHarvestDialog}
                harvestingCrop={harvestingCrop}
            />
        </TableContainer>
    );
};

export default CropsTable;
