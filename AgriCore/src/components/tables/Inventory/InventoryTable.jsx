import * as React from 'react';
import { useState, useContext, useMemo } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, TextField, IconButton, Box, Typography, Select, MenuItem, InputLabel, FormControl,
    Menu, Chip, OutlinedInput
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ItemDialog from './ItemDialog';
import { InventoryContext } from '../../../context/InventoryContext';

export default function InventoryTable() {
    const {
        inventory,
        categories,
        handleSaveItem,
        handleDeleteItem,
    } = useContext(InventoryContext);

    const [open, setOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [showSearchField, setShowSearchField] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const openFilter = Boolean(anchorEl);

    // Create a memoized map for efficient category lookups
    const categoryMap = useMemo(() => {
        if (!categories) return new Map();
        return new Map(categories.map(cat => [cat._id, cat]));
    }, [categories]);

    const handleClickOpen = (item = null) => {
        setEditingItem(item);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingItem(null);
    };

    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setAnchorEl(null);
    };

    const handleCategoryFilterChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedCategories(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const filteredInventory = inventory.filter(item =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategories.length === 0 || selectedCategories.includes(item.category))
    );

    const groupedInventory = filteredInventory.reduce((acc, item) => {
        const categoryId = item.category || 'Uncategorized';
        if (!acc[categoryId]) {
            acc[categoryId] = [];
        }
        acc[categoryId].push(item);
        return acc;
    }, {});

    return (
        <TableContainer component={Paper}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                <Button variant="contained" color="primary" onClick={() => handleClickOpen()}>
                    Add New Item
                </Button>
            </Box>
            <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                <IconButton onClick={() => setShowSearchField(!showSearchField)} color="primary">
                    <SearchIcon />
                </IconButton>
                {showSearchField && (
                    <TextField
                        label="Search Items"
                        variant="outlined"
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                )}
                <IconButton onClick={handleFilterClick} color="primary">
                    <FilterListIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={openFilter}
                    onClose={handleFilterClose}
                    MenuListProps={{
                        'aria-labelledby': 'filter-button',
                    }}
                >
                    <FormControl sx={{ m: 1, width: 300 }}>
                        <InputLabel id="category-filter-label">Filter by Category</InputLabel>
                        <Select
                            labelId="category-filter-label"
                            multiple
                            value={selectedCategories}
                            onChange={handleCategoryFilterChange}
                            input={<OutlinedInput id="select-multiple-chip" label="Filter by Category" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={categoryMap.get(value)?.name || value} />
                                    ))}
                                </Box>
                            )}
                        >
                            {categories.map(cat => (
                                <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Menu>
            </Box>
            <ItemDialog
                open={open}
                onClose={handleClose}
                onSave={(itemToSave) => handleSaveItem(itemToSave, editingItem)}
                item={editingItem}
            />
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Price ($)</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.keys(groupedInventory).map(categoryId => (
                        <React.Fragment key={categoryId}>
                            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                                <TableCell colSpan={4} sx={{ fontWeight: 'bold' }}>
                                    <Typography variant="h6">{categoryMap.get(categoryId)?.name || 'Uncategorized'}</Typography>
                                </TableCell>
                            </TableRow>
                            {groupedInventory[categoryId].map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell component="th" scope="row">
                                        {item.itemName}
                                    </TableCell>
                                    <TableCell align="right">{item.quantity} {categoryMap.get(item.category)?.unit}</TableCell>
                                    <TableCell align="right">{item.price}</TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={() => handleClickOpen(item)} aria-label="edit">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteItem(item._id)} aria-label="delete">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

