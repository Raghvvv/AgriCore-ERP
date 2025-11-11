import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const initialInventory = [
    { id: 1, name: 'Carrot Seeds', quantity: 100, price: 10, category: 'Seeds', seedVariety: 'Nantes', sowingSeason: 'Spring' },
    { id: 2, name: 'NPK Fertilizer', quantity: 50, price: 25, category: 'Fertilizers', composition: '10-10-10' },
    { id: 3, name: 'Neem Oil', quantity: 75, price: 15, category: 'Pesticides', toxicityLevel: 'Low' },
    { id: 4, name: 'Tomato Seeds', quantity: 120, price: 12, category: 'Seeds', seedVariety: 'Roma', sowingSeason: 'Spring' },
];

const categorySpecificFields = {
    'Seeds': [
        { name: 'seedVariety', label: 'Seed Variety', type: 'text' },
        { name: 'sowingSeason', label: 'Sowing Season', type: 'text' },
    ],
    'Fertilizers': [
        { name: 'composition', label: 'Composition', type: 'text' },
    ],
    'Pesticides': [
        { name: 'toxicityLevel', label: 'Toxicity Level', type: 'text' },
    ]
};

export default function InventoryTable() {
    const [inventory, setInventory] = useState(() => {
        const savedInventory = localStorage.getItem('inventory');
        return savedInventory ? JSON.parse(savedInventory) : initialInventory;
    });
    const [open, setOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [categories, setCategories] = useState(() => {
        const savedCategories = localStorage.getItem('categories');
        return savedCategories ? JSON.parse(savedCategories) : ['Seeds', 'Fertilizers', 'Pesticides'];
    });
    const [categoryUnits, setCategoryUnits] = useState(() => {
        const savedCategoryUnits = localStorage.getItem('categoryUnits');
        return savedCategoryUnits ? JSON.parse(savedCategoryUnits) : { Seeds: 'kg', Fertilizers: 'kg', Pesticides: 'l' };
    });
    const [newCategory, setNewCategory] = useState('');
    const [newCategoryUnit, setNewCategoryUnit] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [showSearchField, setShowSearchField] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const openFilter = Boolean(anchorEl);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('inventory', JSON.stringify(inventory));
    }, [inventory]);

    useEffect(() => {
        localStorage.setItem('categories', JSON.stringify(categories));
    }, [categories]);

    useEffect(() => {
        localStorage.setItem('categoryUnits', JSON.stringify(categoryUnits));
    }, [categoryUnits]);

    const handleClickOpen = (item = null) => {
        setEditingItem(item);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingItem(null);
    };

    const handleSaveItem = (itemToSave) => {
        if (editingItem) {
            setInventory(inventory.map(item => item.id === editingItem.id ? itemToSave : item));
        } else {
            const newId = inventory.length > 0 ? Math.max(...inventory.map(item => item.id)) + 1 : 1;
            const itemToAdd = { ...itemToSave, id: newId };
            setInventory([...inventory, itemToAdd]);
        }
        handleClose();
    };

    const handleDeleteItem = (id) => {
        setInventory(inventory.filter(item => item.id !== id));
    };

    const handleAddCategory = () => {
        if (newCategory && !categories.includes(newCategory)) {
            setCategories([...categories, newCategory]);
            setCategoryUnits({ ...categoryUnits, [newCategory]: newCategoryUnit });
            setNewCategory('');
            setNewCategoryUnit('');
        }
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
                    <Button variant="contained" onClick={handleAddCategory}>Add Category</Button>
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
                onSave={handleSaveItem}
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
