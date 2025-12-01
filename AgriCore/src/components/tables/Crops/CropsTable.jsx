import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, Box, Button, IconButton, CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { useCrops } from '../../../context/CropsContext';
import CropDialog from './CropDialog';

const CropsTable = () => {
    const { crops, deleteCrop, loading, error } = useCrops();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingCrop, setEditingCrop] = useState(null);

    const handleOpenDialog = (crop = null) => {
        setEditingCrop(crop);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setEditingCrop(null);
        setDialogOpen(false);
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
                    onClick={() => handleOpenDialog()}
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
                                <TableCell align="right">
                                    <IconButton onClick={() => handleOpenDialog(crop)} size="small">
                                        <EditIcon />
                                    </IconButton>
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
                open={dialogOpen}
                onClose={handleCloseDialog}
                editingCrop={editingCrop}
            />
        </TableContainer>
    );
};

export default CropsTable;
