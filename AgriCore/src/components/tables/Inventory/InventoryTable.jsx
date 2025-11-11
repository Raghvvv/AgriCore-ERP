import * as React from 'react';
import { useState, useContext } from 'react';
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
        categoryUnits,
        handleSaveItem,
        handleDeleteItem,
        handleAddCategory,
        categorySpecificFields
    } = useContext(InventoryContext);

    const [open, setOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [newCategory, setNewCategory] = useState('');
    const [newCategoryUnit, setNewCategoryUnit] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [showSearchField, setShowSearchField] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const openFilter = Boolean(anchorEl);

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
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategories.length === 0 || selectedCategories.includes(item.category))
    );

    const groupedInventory = filteredInventory.reduce((acc, item) => {
        const category = item.category || 'Uncategorized';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {});

    return (
        <TableContainer component={Paper}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                <Button variant="contained" color="primary" onClick={() => handleClickOpen()}>
                    Add New Item
                </Button>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                        label="New Category"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        size="small"
                    />
                    <TextField
                        label="Unit"
                        value={newCategoryUnit}
                        onChange={(e) => setNewCategoryUnit(e.target.value)}
                        size="small"
                    />
                    <Button variant="contained" onClick={() => handleAddCategory(newCategory, newCategoryUnit)}>Add Category</Button>
                </Box>
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
                                        <Chip key={value} label={value} />
                                    ))}
                                </Box>
                            )}
                        >
                            {categories.map(cat => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
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
                categories={categories}
                categorySpecificFields={categorySpecificFields}
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
                    {Object.keys(groupedInventory).map(category => (
                        <React.Fragment key={category}>
                            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                                <TableCell colSpan={4} sx={{ fontWeight: 'bold' }}>
                                    <Typography variant="h6">{category}</Typography>
                                </TableCell>
                            </TableRow>
                            {groupedInventory[category].map((item) => (
                                <React.Fragment key={item.id}>
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            {item.name}
                                        </TableCell>
                                        <TableCell align="right">{item.quantity} {categoryUnits[item.category]}</TableCell>
                                        <TableCell align="right">{item.price}</TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={() => handleClickOpen(item)} aria-label="edit">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteItem(item.id)} aria-label="delete">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow key={`${item.id}-details`}>
                                        <TableCell colSpan={4}>
                                            {categorySpecificFields[item.category]?.map(field => (
                                                <Typography key={field.name} variant="body2" sx={{ pl: 2 }}>
                                                    <strong>{field.label}:</strong> {item[field.name]}
                                                </Typography>
                                            ))}
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            ))}
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
